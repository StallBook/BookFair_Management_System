import amqp from "amqplib";
import dotenv from "dotenv";
import QRCode from "qrcode";
import nodemailer from "nodemailer";
import fs from "fs-extra";
import path from "path";
import axios from "axios";

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5673";
const QUEUE_NAME = process.env.RABBITMQ_QUEUE || "email_jobs";
const PREFETCH = parseInt(process.env.WORKER_PREFETCH || "5", 10);


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const RESERVATION_SERVICE_URL = process.env.RESERVATION_SERVICE_URL || "http://localhost:5004";

// Ensure qrcodes directory
const QR_DIR = path.join(process.cwd(), "qrcodes");
await fs.ensureDir(QR_DIR);

let channel;

async function start() {
    const conn = await amqp.connect(RABBITMQ_URL);
    conn.on("error", (err) => console.error("RabbitMQ conn error:", err));
    conn.on("close", () => {
        console.error("RabbitMQ connection closed. Exiting process.");
        process.exit(1);
    });

    channel = await conn.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    channel.prefetch(PREFETCH);
    console.log(`Worker waiting for messages in ${QUEUE_NAME}, prefetch=${PREFETCH}`);

    channel.consume(QUEUE_NAME, async (msg) => {
        if (!msg) return;

        let job;
        try {
            job = JSON.parse(msg.content.toString());
        } catch (err) {
            console.error("Invalid job JSON. Acking and discarding.", err);
            channel.ack(msg);
            return;
        }

        console.log("Received job:", job.reservationId || job.userEmail);

        try {
            // fetch fresh reservation data
            let reservationData = job;
            if (job.reservationId && !job.stalls) {

                try {
                    const resp = await axios.get(`${RESERVATION_SERVICE_URL}/${job.reservationId}`);
                    reservationData = resp.data?.reservation || reservationData;
                } catch (err) {
                    console.warn("Could not fetch reservation from service, continuing with job payload:", err.message);
                }
            }

            // Determine QR payload 
            const qrPayload = job.qrContent || reservationData.qrToken || job.reservationId || job.reservationId?.toString();
            if (!qrPayload) throw new Error("No QR payload available");

            // Generate QR PNG buffer
            const qrFilename = `qr_${job.reservationId || Date.now()}.png`;
            const qrFilePath = path.join(QR_DIR, qrFilename);
            const pngBuffer = await QRCode.toBuffer(qrPayload, { type: "png", margin: 2, width: 300 });

            // Save locally 
            await fs.writeFile(qrFilePath, pngBuffer);
            console.log("Saved QR to", qrFilePath);

            // Build email
            const to = job.userEmail || reservationData.userEmail;
            if (!to) throw new Error("No recipient email");

            const subject = job.subject || `Your reservation confirmation (${job.reservationId || ""})`;
            const text = job.message || `Dear user,\n\nYour reservation is confirmed. Please find the QR pass attached.\n\nRegards`;
            const html = job.html || `<p>${job.message || "Your reservation is confirmed."}</p>
        <p>QR attached. You can also <a href="#">download</a> the QR.</p>`;

            // Send email with attachment
            const mailOptions = {
                from: process.env.EMAIL_FROM || process.env.SMTP_USER,
                to,
                subject,
                text,
                html,
                attachments: [
                    {
                        filename: qrFilename,
                        content: pngBuffer,
                        contentType: "image/png",
                    },
                ],
            };

            const result = await transporter.sendMail(mailOptions);
            console.log("Email sent:", result.messageId);

            // update reservation record marking emailSent: true by calling reservation service
            try {
                if (job.reservationId) {
                    await axios.post(`${RESERVATION_SERVICE_URL}/${job.reservationId}/email-sent`, {
                        providerMessageId: result.messageId,
                    }).catch(() => { });
                }
            } catch (err) {
                console.warn("Failed to update reservation after email send:", err.message);
            }

            // Ack message
            channel.ack(msg);
        } catch (err) {
            console.error("Job processing failed:", err.message || err);

            const headers = msg.properties?.headers || {};
            const retries = (headers['x-retries'] || 0) + 1;
            const maxRetries = parseInt(process.env.MAX_JOB_RETRIES || "3", 10);

            if (retries <= maxRetries) {

                console.log(`Retrying job (${retries}/${maxRetries})`);
                // requeue with new header
                channel.ack(msg);
                channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(job)), {
                    persistent: true,
                    headers: { ...headers, 'x-retries': retries }
                });
            } else {
                console.error("Max retries exceeded. Moving to DLQ (or drop).");
                channel.ack(msg);
                // optionally publish to a DLQ queue for manual inspection:
                const DLQ = process.env.DLQ_QUEUE || `${QUEUE_NAME}_dlq`;
                await channel.assertQueue(DLQ, { durable: true });
                channel.sendToQueue(DLQ, Buffer.from(JSON.stringify({ job, error: err.message })), { persistent: true });
            }
        }
    }, { noAck: false });
}

start().catch((err) => {
    console.error("Worker start failed:", err);
    process.exit(1);
});
