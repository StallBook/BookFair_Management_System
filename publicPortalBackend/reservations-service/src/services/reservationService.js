import Reservation from "../models/Reservation.js";
import axios from "axios";
import { acquireLock, releaseLock } from "../utils/redisLock.js";
import { sendEmailJob } from "../queue/rabbitmq.js";
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


// Fetch user profile from Auth-Service

export const fetchUserProfile = async (token) => {
    try {
        const resp = await axios.get(`${AUTH_SERVICE}/api/auth/me`, {
            headers: { Authorization: token },
        });
        return resp.data.user;
    } catch {
        return null;
    }
};


// *Count user's confirmed stalls (sum of stalls in confirmed reservations)

export const countConfirmedReservationsByUser = async (userId) => {
    const reservations = await Reservation.find({
        userId,
        status: "confirmed",
    }).lean();

    return reservations.reduce((sum, r) => sum + (r.stalls?.length || 0), 0);
};


// Create Reservation                            
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

    // Acquire Redis locks for all requested stalls
    const locks = [];
    try {
        // Validate each stall
        const stalls = [];
        for (const stallId of stallIds) {
            const stallResp = await axios.get(`${STALL_SERVICE}/api/stalls/${stallId}`);
            const stall = stallResp.data;
            if (!stall) throw new Error(`Stall ${stallId} not found`);
            if (stall.isReserved)
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
        for (const s of stalls) {
            await axios.patch(`${STALL_SERVICE}/api/stalls/${s.stallId}/reserve`, {
                reservedBy: userId,
                status: true,
            });
        }

        // Confirm reservation
        reservation.status = "confirmed";
        reservation.qrToken = reservation._id.toString();
        await reservation.save();


        return reservation;
    } catch (err) {
        // Rollback all stalls on error
        for (const s of stallIds || []) {
            try {
                await axios.patch(`${STALL_SERVICE}/api/stalls/${s}/reserve`, {
                    status: false,
                });
            } catch (_) { }
        }
        throw err;
    } finally {
        // Release all Redis locks
        for (const { lockKey, lockToken } of locks) {
            await releaseLock(lockKey, lockToken);
        }
    }
};

// Cancel Reservation             

export const cancelReservation = async (reservationId, authHeader) => {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) throw new Error("Reservation not found");

    const locks = [];
    try {
        for (const s of reservation.stalls) {
            const lockKey = `lock:stall:${s.stallId}`;
            const lockToken = await acquireLock(lockKey);
            if (!lockToken)
                throw new Error(`Failed to acquire lock for stall ${s.stallId}`);
            locks.push({ lockKey, lockToken });
        }

        for (const s of reservation.stalls) {
            await axios.patch(`${STALL_SERVICE}/api/stalls/${s.stallId}/reserve`, {
                status: false,
            });
        }

        reservation.status = "cancelled";
        await reservation.save();


        return reservation;
    } finally {
        for (const { lockKey, lockToken } of locks) {
            await releaseLock(lockKey, lockToken);
        }
    }
};

// List Queries

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
