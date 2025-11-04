const Stall = require("../models/Stall");

const getAllStalls = async (request, response) => {
  try {
    const stalls = await Stall.find().sort({ name: 1 });
    if (!stalls.length) {
      return response.status(404).json({ message: "No stalls found" });
    }
    response
      .status(200)
      .json({ message: "Stalls fetched successfully", data: stalls });
  } catch (error) {
    response.status(500).json({ message: "Internal server error" });
  }
};

const getAllStallsAvailable = async (request, response) => {
  try {
    const stalls = await Stall.find({ status: "available" }).sort({ name: 1 });
    if (!stalls.length) {
      return response
        .status(404)
        .json({ message: "No available stalls found" });
    }
    response
      .status(200)
      .json({ message: "Available stalls fetched successfully", data: stalls });
  } catch (error) {
    response.staus(500).json({ message: "Internal server error" });
  }
};

const getStallByName = async (request, response) => {
  try {
    const { name } = request.body;
    if (!name) {
      return response.status(400).json({ message: "Stall name is required" });
    }
    if (!/^[A-Z]$/.test(name)) {
      return res.status(400).json({ message: "Invalid stall name format" });
    }
    const stall = await Stall.findOne({ name });
    if (!stall) {
      return response.status(404).json({ message: "Stall not found" });
    }
    response
      .status(200)
      .json({ message: "Stall fetched successfully", data: stall });
  } catch (error) {
    console.error("Error fetching stall by name:", error);
    response.status(500).json({ message: "Internal server error" });
  }
};

const updateStallStatus = async (request, response) => {
  try {
    const { name, status, userId } = request.body;

    const stall = await Stall.findOne({ name: name });
    if (!stall) {
      return response.status(404).json({ message: "Stall not found" });
    }
    if (stall.status === "reserved" && status === "reserved") {
      return response.status(400).json({ message: "Stall already reserved" });
    }

    if (status === "reserved" && userId) {
      const reservedCount = await Stall.countDocuments({ userId, status });
      if (reservedCount >= 3) {
        return response
          .status(400)
          .json({
            message:
              "You have reached the limit. Each user can reserve a maximum of 3 stalls.",
          });
      }
    }

    stall.status = status;
    stall.userId = status === "reserved" ? userId : null;

    await stall.save();
    return response
      .status(200)
      .json({ message: "Stall status updated successfully", data: stall });
  } catch (error) {
    response.status(500).json("Internal server error");
  }
};

const getStallForUser = async (request, response) => {
  try {
    const { userId } = request.body;

    if (!userId) {
      return response.status(400).json({ message: "User ID is required" });
    }
    const stall = await Stall.find({ userId: userId, status: "reserved" });
    if (!stall.length) {
      return response
        .status(404)
        .json({ message: "No stall found for this userID" });
    }
    response
      .status(200)
      .json({ message: "Stall fetched successfully", data: stall });
  } catch (error) {
    response.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllStalls,
  getAllStallsAvailable,
  getStallByName,
  updateStallStatus,
  getStallForUser,
};
