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
    const stall = await Stall.findOne({name});
    if (!stall) {
      return response.status(404).json({ message: "Stall not found" });
    }
    response.status(200).json({ message: "Stall fetched successfully", data: stall});
  } catch (error) {
    console.error("Error fetching stall by name:", error);
    response.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllStalls,
  getAllStallsAvailable,
  getStallByName
};
