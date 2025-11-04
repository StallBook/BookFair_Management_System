const mongoose = require("mongoose");
const Stall = require("../models/Stall");
require("dotenv").config({ path: "../../.env" });

const MONGO_URI = process.env.MONGODB_URI_STALL_SERVICE;

// Sample stalls data
const stalls = [
  // Small stalls
  {
    name: "A",
    size: "small",
    dimensions: { width: 2, length: 2 },
    map: { x: 0, y: 0, w: 2, h: 2 },
  },
  {
    name: "B",
    size: "small",
    dimensions: { width: 2, length: 2 },
    map: { x: 3, y: 0, w: 2, h: 2 },
  },
  {
    name: "C",
    size: "small",
    dimensions: { width: 2, length: 2 },
    map: { x: 6, y: 0, w: 2, h: 2 },
  },

  // Medium stalls
  {
    name: "D",
    size: "medium",
    dimensions: { width: 3, length: 3 },
    map: { x: 0, y: 3, w: 3, h: 3 },
  },
  {
    name: "E",
    size: "medium",
    dimensions: { width: 3, length: 3 },
    map: { x: 4, y: 3, w: 3, h: 3 },
  },
  {
    name: "F",
    size: "medium",
    dimensions: { width: 3, length: 3 },
    map: { x: 8, y: 3, w: 3, h: 3 },
  },

  // Large stalls
  {
    name: "G",
    size: "large",
    dimensions: { width: 4, length: 4 },
    map: { x: 0, y: 7, w: 4, h: 4 },
  },
  {
    name: "H",
    size: "large",
    dimensions: { width: 4, length: 4 },
    map: { x: 5, y: 7, w: 4, h: 4 },
  },
];

const seedStalls = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
    await Stall.deleteMany();
    console.log("Existing stalls deleted");
    await Stall.insertMany(stalls);
    console.log("Sample stalls inserted");

    process.exit();
  } catch (err) {
    console.error("Error seeding stalls:", err);
    process.exit(1);
  }
};

seedStalls();
