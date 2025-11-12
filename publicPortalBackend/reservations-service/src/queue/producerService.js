import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5673";
const QUEUE_NAME = process.env.RABBITMQ_QUEUE || "email_jobs";

let channel;


export const initRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();

        await channel.assertQueue(QUEUE_NAME, { durable: true });

        console.log(` RabbitMQ connected on ${RABBITMQ_URL}, queue: ${QUEUE_NAME}`);

        connection.on("close", () => {
            console.error(" RabbitMQ connection closed. Reconnecting...");
            setTimeout(initRabbitMQ, 5000);
        });

        connection.on("error", (err) => {
            console.error("RabbitMQ connection error:", err.message);
        });
    } catch (error) {
        console.error("RabbitMQ connection failed:", error.message);
        setTimeout(initRabbitMQ, 5000);
    }
};


export const sendEmailJob = async (jobData) => {
    try {
        if (!channel) {
            console.warn(" RabbitMQ channel not ready. Attempting reconnect...");
            await initRabbitMQ();
        }

        const messageBuffer = Buffer.from(JSON.stringify(jobData));

        channel.sendToQueue(QUEUE_NAME, messageBuffer, { persistent: true });
        console.log(` Email job queued: ${jobData.userEmail} (${jobData.reservationId})`);
    } catch (err) {
        console.error(" Failed to send RabbitMQ job:", err.message);
    }
};


await initRabbitMQ();
