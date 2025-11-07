import {
    createReservation,
} from "../services/reservationService.js";


export const createReservationHandler = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const { stallIds } = req.body;

        if (!stallIds || !Array.isArray(stallIds) || stallIds.length === 0) {
            return res.status(400).json({ error: "stallIds array is required" });
        }

        const reservation = await createReservation({ authHeader, stallIds });
        return res.status(201).json({ reservation });
    } catch (err) {
        console.error("Create reservation error:", err.message || err);
        return res
            .status(400)
            .json({ error: err.message || "Failed to create reservation" });
    }
};
