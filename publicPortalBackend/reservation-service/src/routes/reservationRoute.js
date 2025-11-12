const express = require("express");
const { createReservation } = require("../contorllers/reservationController");

const router = express.Router();

router.post("/new-reserve", createReservation);

module.exports = router;