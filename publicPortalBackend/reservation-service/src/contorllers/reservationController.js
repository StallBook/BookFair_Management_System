const Reservation = require("../models/reservationModel");
const axios = require("axios");

const axiosInstance = axios.create({ timeout: 3000 });
const STALL_SERVICE = process.env.STALL_SERVICE_URL;

const createReservation = async (req, res) => {
  try {
    const { userId, stalls } = req.body;

    if (!stalls?.length) {
      return res.status(400).json({ message: "At least one stall must be reserved" });
    }

    // Check reservation limit
    const existing = await Reservation.find({ userId });
    const count = existing.reduce((c, r) => c + r.stalls.length, 0);

    if (count + stalls.length > 3) {
      return res.status(400).json({
        message: "You have reached the limit. Each user can reserve a maximum of 3 stalls.",
      });
    }

    const stallRes = await axiosInstance.get(`${STALL_SERVICE}/stalls/available`, {
      params: { status: "available" },
    });

    const available = stallRes?.data?.data?.map(s => s.name) || [];

    const unavailable = stalls.filter(st => !available.includes(st));
    if (unavailable.length > 0) {
      return res.status(400).json({
        message: "Some stalls are already reserved",
        unavailableStalls: unavailable,
      });
    }

    const reservation = new Reservation({ userId, stalls });
    await reservation.save();

    try {
      await axiosInstance.put(`${STALL_SERVICE}/stalls/update-status`, {
        status: "reserved",
        names: stalls,
        userId
      });
    } catch (err) {
      await Reservation.deleteOne({ _id: reservation._id });
      return res.status(500).json({
        message: "Failed to update stall service",
      });
    }

    return res.status(201).json({
      message: "Reservation created successfully",
      data: reservation,
    });

  } catch (error) {
    console.error("Error creating reservation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createReservation };
