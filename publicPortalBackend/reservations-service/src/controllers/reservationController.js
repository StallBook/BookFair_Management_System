import {
    createReservation,
    cancelReservation,
    getUserReservations,
    getAllReservations,
    getReservationById
} from "../services/reservationService.js";

export const createReservationHandler = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const { stallIds } = req.body;

        if (!stallIds || !Array.isArray(stallIds) || stallIds.length === 0) {
            return res.status(400).json({ error: "stallIds array is required" });
        }

        const reservation = await createReservation({ authHeader, stallIds });
        return res.status(201).json({ message: "success", reservation });
    } catch (err) {
        console.error("createReservation failed:", err.message || err);
        const statusCode =
            err.message?.includes("Unauthorized") ? 401 :
                err.message?.includes("not found") ? 404 :
                    err.message?.includes("limit exceeded") ? 400 :
                        err.message?.includes("already reserved") ? 400 :
                            500;

        return res.status(statusCode).json({ error: err.message || "Failed to create reservation" });
    }
};


export const cancelReservationHandler = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const reservationId = req.params.id;

        if (!authHeader) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const reservation = await cancelReservation(reservationId, authHeader);
        return res.json({ reservation });
    } catch (err) {
        console.error("Cancel reservation error:", err.message || err);
        return res
            .status(400)
            .json({ error: err.message || "Failed to cancel reservation" });
    }
};

export const listReservationsHandler = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const userOnly = req.query.user === "true";

        const reservations = userOnly
            ? await getUserReservations(authHeader)
            : await getAllReservations();

        return res.json({ reservations });
    } catch (err) {
        console.error("List reservations error:", err.message || err);
        return res
            .status(500)
            .json({ error: err.message || "Failed to list reservations" });
    }
};

export const getReservationByIdHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await getReservationById(id);
        return res.json({ reservation });
    } catch (err) {
        console.error("Get reservation error:", err.message || err);
        return res
            .status(404)
            .json({ error: err.message || "Reservation not found" });
    }
};