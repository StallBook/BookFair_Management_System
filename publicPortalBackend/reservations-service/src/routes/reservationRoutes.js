import express from "express";
import {
    createReservationHandler,
    cancelReservationHandler,
    listReservationsHandler,
    getReservationByIdHandler
} from "../controllers/reservationController.js";

const router = express.Router();

router.post("/createReservation", createReservationHandler);
router.post("/:id/cancel", cancelReservationHandler);
router.get("/getAllReservations", listReservationsHandler);
router.get("/:id", getReservationByIdHandler);

export default router;
