import Reservation from "../models/reservationModel.js";
import axios from "axios";
import { acquireLock, releaseLock } from "../utils/redisLock.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendEmailJob } from "../queue/producerService.js";

dotenv.config();

const STALL_SERVICE = process.env.STALL_SERVICE_URL || "http://localhost:5003";
const AUTH_SERVICE = process.env.AUTH_SERVICE_URL || "http://localhost:5001";
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

// verify token
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch {
        return null;
    }
};

// feltch user details
export const fetchUserProfile = async (authHeader) => {
    const token = authHeader.startsWith("Bearer ")
        ? authHeader
        : `Bearer ${authHeader}`;

    try {
        const resp = await axios.get(`${AUTH_SERVICE}/profile`, {
            headers: { Authorization: token },
        });

        return resp.data?.user || null;
    } catch (err) {
        console.error("Failed to fetch user profile:", err.response?.data || err.message);
        return null;
    }
};

// Count confirmed reservations by user
export const countConfirmedReservationsByUser = async (userId) => {
    const reservations = await Reservation.find({
        userId,
        status: "confirmed",
    }).lean();

    return reservations.reduce((sum, r) => sum + (r.stalls?.length || 0), 0);
};


export const createReservation = async ({ authHeader, stallIds }) => {
    if (!authHeader) throw new Error("Unauthorized");

    const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;

    const payload = verifyToken(token);
    console.log("[DEBUG] Incoming Authorization header:", authHeader);
    console.log(" [DEBUG] Decoded JWT payload:", payload);

    // Fetch user profile
    const user = await fetchUserProfile(authHeader);
    if (!user) throw new Error("Unauthorized");

    const userId = user.userID || user._id;
    const userEmail = user.email;

    if (!userId) throw new Error("Invalid user profile: missing userId");

    // Validate input
    if (!stallIds || !Array.isArray(stallIds) || stallIds.length === 0)
        throw new Error("No stallIds provided");

    if (stallIds.length > 3)
        throw new Error("You can reserve a maximum of 3 stalls per request");

    // Check user’s total confirmed stalls
    const userConfirmedCount = await countConfirmedReservationsByUser(userId);
    if (userConfirmedCount + stallIds.length > 3)
        throw new Error(
            `Reservation limit exceeded. You already have ${userConfirmedCount} stalls reserved.`
        );

    const locks = [];

    try {
        const stalls = [];

        for (const stallId of stallIds) {
            // Check with Stall Service
            const stallResp = await axios.get(`${STALL_SERVICE}/stalls/${stallId}`);
            const stall = stallResp.data?.data;
            if (!stall) throw new Error(`Stall ${stallId} not found`);

            //Double-check with Reservation DB
            const existingReservation = await Reservation.findOne({
                "stalls.stallId": stallId,
                status: { $in: ["pending", "confirmed"] },
            });

            if (existingReservation)
                throw new Error(`Stall ${stall.name || stallId} is already reserved`);

            if (stall.status === "reserved")
                throw new Error(`Stall ${stall.name || stallId} is already reserved`);

            // Acquire Redis lock
            const lockKey = `lock:stall:${stallId}`;
            const lockToken = await acquireLock(lockKey);
            if (!lockToken)
                throw new Error(`Failed to acquire lock for stall ${stallId}`);

            locks.push({ lockKey, lockToken });
            stalls.push({
                stallId,
                name: stall.name || `Stall-${stallId}`,
                size: stall.size || "small",
            });
        }

        //Create pending reservation
        const reservation = new Reservation({
            userId,
            userEmail,
            stalls,
            status: "pending",
        });
        await reservation.save();

        // Update Stall Service status
        await axios.put(`${STALL_SERVICE}/stalls/update-status`, {
            names: stalls.map((s) => s.name),
            status: "reserved",
            userId,
        });

        // Confirm reservation
        reservation.status = "confirmed";
        reservation.qrToken = reservation._id.toString();
        await reservation.save();

        // Send RabbitMQ email job
        await sendEmailJob({
            reservationId: reservation._id,
            userEmail,
            stallIds,
            qrContent: reservation.qrToken,
            message: `Your reservation for stalls ${stalls
                .map((s) => s.name)
                .join(", ")} is confirmed.`,
        });


        console.log(`Reservation confirmed for ${userEmail} (${userId})`);
        return reservation;

    } catch (err) {
        console.error("Reservation creation failed:", err.message);

        // Rollback stall status if failure
        try {
            await axios.put(`${STALL_SERVICE}/stalls/update-status`, {
                names: stallIds,
                status: "available",
            });
        } catch (rollbackErr) {
            console.error("Rollback failed:", rollbackErr.message);
        }

        throw err;
    } finally {
        for (const { lockKey, lockToken } of locks) {
            await releaseLock(lockKey, lockToken);
        }
    }
};


export const cancelReservation = async (reservationId, authHeader) => {
    if (!authHeader) throw new Error("Unauthorized");

    // Find reservation
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) throw new Error("Reservation not found");

    const locks = [];

    try {
        // Acquire locks for all stalls before cancelling
        for (const s of reservation.stalls) {
            const lockKey = `lock:stall:${s.stallId}`;
            const lockToken = await acquireLock(lockKey);

            if (!lockToken) {
                throw new Error(`Failed to acquire lock for stall ${s.stallId}`);
            }

            locks.push({ lockKey, lockToken });
        }

        // Update stall statuses in Stall Service
        await axios.put(`${STALL_SERVICE}/stalls/update-status`, {
            names: reservation.stalls.map((s) => s.name),
            status: "available",
            userId: null,
        });

        // Update reservation status
        reservation.status = "cancelled";
        reservation.cancelledAt = new Date();
        await reservation.save();

        console.log(` Reservation ${reservationId} cancelled successfully.`);
        return reservation;

    } catch (err) {
        console.error(`Error cancelling reservation ${reservationId}:`, err.message);
        throw err;
    } finally {
        // Always release locks
        for (const { lockKey, lockToken } of locks) {
            await releaseLock(lockKey, lockToken);
        }
    }
};


export const getUserReservations = async (authHeader) => {
    if (!authHeader) throw new Error("Unauthorized");

    const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;

    const payload = verifyToken(token);
    const userId = payload?.userId || payload?.sub;
    if (!userId) throw new Error("Unauthorized");

    return Reservation.find({ userId }).sort({ createdAt: -1 }).lean();
};

export const getAllReservations = async () => {
    return Reservation.find().sort({ createdAt: -1 }).lean();
};

export const getReservationById = async (id) => {
    const reservation = await Reservation.findById(id).lean();
    if (!reservation) throw new Error("Reservation not found");
    return reservation;
};
