
import Reservation from "../models/reservationModel.js";
import axios from "axios";
import { acquireLock, releaseLock } from "../utils/redisLock.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const STALL_SERVICE = process.env.STALL_SERVICE_URL || "http://localhost:5003";
const AUTH_SERVICE = process.env.AUTH_SERVICE_URL || "http://localhost:5001";
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch {
        return null;
    }
};

export const fetchUserProfile = async (token) => {
    try {
        const resp = await axios.get(`${AUTH_SERVICE}/auth/me`, {
            headers: { Authorization: token },
        });
        return resp.data.user;
    } catch (err) {
        console.error("Failed to fetch user profile:", err.message);
        return null;
    }
};

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

    // Get user info from Auth-Service
    let user = payload?.userId
        ? await fetchUserProfile(authHeader).catch(() => null)
        : await fetchUserProfile(authHeader);

    if (!user && payload) {
        user = {
            id: payload.userId || payload.sub,
            email: payload.email || "unknown@example.com",
        };
    }

    if (!user) throw new Error("Unauthorized");

    const userId = user.id || user._id;
    const userEmail = user.email;

    if (!stallIds || !Array.isArray(stallIds) || stallIds.length === 0)
        throw new Error("No stallIds provided");

    if (stallIds.length > 3)
        throw new Error("You can reserve a maximum of 3 stalls per request");

    // Check total stall limit
    const userConfirmedCount = await countConfirmedReservationsByUser(userId);
    if (userConfirmedCount + stallIds.length > 3)
        throw new Error(
            `Reservation limit exceeded. You already have ${userConfirmedCount} stalls reserved.`
        );

    const locks = [];

    try {
        const stalls = [];

        // Validate and lock each stall
        for (const stallId of stallIds) {
            const stallResp = await axios.get(`${STALL_SERVICE}/stalls/${stallId}`);
            const stall = stallResp.data?.data;

            if (!stall) throw new Error(`Stall ${stallId} not found`);
            if (stall.status === "reserved")
                throw new Error(`Stall ${stall.name || stallId} is already reserved`);

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

        // Create pending reservation
        const reservation = new Reservation({
            userId,
            userEmail,
            stalls,
            status: "pending",
        });
        await reservation.save();

        // Reserve each stall in Stall-Service
        await axios.put(`${STALL_SERVICE}/stalls/update-status`, {
            names: stalls.map((s) => s.name),
            status: "reserved",
            userId,
        });

        // Confirm reservation
        reservation.status = "confirmed";
        reservation.qrToken = reservation._id.toString();
        await reservation.save();


        return reservation;
    } catch (err) {
        console.error("Reservation creation failed:", err.message);

        // Rollback stall status
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
        // Release all Redis locks
        for (const { lockKey, lockToken } of locks) {
            await releaseLock(lockKey, lockToken);
        }
    }
};

export const cancelReservation = async (reservationId, authHeader) => {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) throw new Error("Reservation not found");

    const locks = [];

    try {
        // Lock all stalls
        for (const s of reservation.stalls) {
            const lockKey = `lock:stall:${s.stallId}`;
            const lockToken = await acquireLock(lockKey);
            if (!lockToken)
                throw new Error(`Failed to acquire lock for stall ${s.stallId}`);
            locks.push({ lockKey, lockToken });
        }

        // Mark stalls as available
        await axios.put(`${STALL_SERVICE}/stalls/update-status`, {
            names: reservation.stalls.map((s) => s.name),
            status: "available",
        });

        reservation.status = "cancelled";
        await reservation.save();

        return reservation;
    } finally {
        for (const { lockKey, lockToken } of locks) {
            await releaseLock(lockKey, lockToken);
        }
    }
};

// ------------------------------------------------------
// List Queries
// ------------------------------------------------------
export const getUserReservations = async (authHeader) => {
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;
    const payload = verifyToken(token);
    const userId = payload?.userId;
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
