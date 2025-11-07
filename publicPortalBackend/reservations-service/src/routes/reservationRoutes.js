import express from "express";
import {
    createReservationHandler,
    cancelReservationHandler,
    listReservationsHandler,
    getReservationByIdHandler
} from "../controllers/reservationController.js";

const router = express.Router();

router.post("/", createReservationHandler);
router.post("/:id/cancel", cancelReservationHandler);
router.get("/", listReservationsHandler);
router.get("/:id", getReservationByIdHandler);

export default router;
