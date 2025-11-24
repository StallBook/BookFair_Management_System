const mongoose = require("mongoose");
const Stall = require("../models/Stall");
require("dotenv").config({ path: "../../.env" });

const MONGO_URI = process.env.MONGODB_URI_STALL_SERVICE;

// Sample stalls data
export const stalls = [
  // 🔹 Small stalls (A–J)
  { name: "A", size: "small", dimensions: { width: 2, length: 2 }, map: { x: 0, y: 0, w: 2, h: 2 } },
  { name: "B", size: "small", dimensions: { width: 2, length: 2 }, map: { x: 3, y: 0, w: 2, h: 2 } },
  { name: "C", size: "small", dimensions: { width: 2, length: 2 }, map: { x: 6, y: 0, w: 2, h: 2 } },
  { name: "D", size: "small", dimensions: { width: 2, length: 2 }, map: { x: 9, y: 0, w: 2, h: 2 } },
  { name: "E", size: "small", dimensions: { width: 2, length: 2 }, map: { x: 12, y: 0, w: 2, h: 2 } },
  { name: "F", size: "small", dimensions: { width: 2, length: 2 }, map: { x: 0, y: 3, w: 2, h: 2 } },
  { name: "G", size: "small", dimensions: { width: 2, length: 2 }, map: { x: 3, y: 3, w: 2, h: 2 } },
  { name: "H", size: "small", dimensions: { width: 2, length: 2 }, map: { x: 6, y: 3, w: 2, h: 2 } },
  { name: "I", size: "small", dimensions: { width: 2, length: 2 }, map: { x: 9, y: 3, w: 2, h: 2 } },
  { name: "J", size: "small", dimensions: { width: 2, length: 2 }, map: { x: 12, y: 3, w: 2, h: 2 } },

  // 🔸 Medium stalls (K–T)
  { name: "K", size: "medium", dimensions: { width: 3, length: 3 }, map: { x: 0, y: 6, w: 3, h: 3 } },
  { name: "L", size: "medium", dimensions: { width: 3, length: 3 }, map: { x: 4, y: 6, w: 3, h: 3 } },
  { name: "M", size: "medium", dimensions: { width: 3, length: 3 }, map: { x: 8, y: 6, w: 3, h: 3 } },
  { name: "N", size: "medium", dimensions: { width: 3, length: 3 }, map: { x: 12, y: 6, w: 3, h: 3 } },
  { name: "O", size: "medium", dimensions: { width: 3, length: 3 }, map: { x: 0, y: 10, w: 3, h: 3 } },
  { name: "P", size: "medium", dimensions: { width: 3, length: 3 }, map: { x: 4, y: 10, w: 3, h: 3 } },
  { name: "Q", size: "medium", dimensions: { width: 3, length: 3 }, map: { x: 8, y: 10, w: 3, h: 3 } },
  { name: "R", size: "medium", dimensions: { width: 3, length: 3 }, map: { x: 12, y: 10, w: 3, h: 3 } },
  { name: "S", size: "medium", dimensions: { width: 3, length: 3 }, map: { x: 0, y: 14, w: 3, h: 3 } },
  { name: "T", size: "medium", dimensions: { width: 3, length: 3 }, map: { x: 4, y: 14, w: 3, h: 3 } },

  // 🟩 Large stalls (U–AD)
  { name: "U", size: "large", dimensions: { width: 4, length: 4 }, map: { x: 0, y: 18, w: 4, h: 4 } },
  { name: "V", size: "large", dimensions: { width: 4, length: 4 }, map: { x: 5, y: 18, w: 4, h: 4 } },
  { name: "W", size: "large", dimensions: { width: 4, length: 4 }, map: { x: 10, y: 18, w: 4, h: 4 } },
  { name: "X", size: "large", dimensions: { width: 4, length: 4 }, map: { x: 0, y: 23, w: 4, h: 4 } },
  { name: "Y", size: "large", dimensions: { width: 4, length: 4 }, map: { x: 5, y: 23, w: 4, h: 4 } },
  { name: "Z", size: "large", dimensions: { width: 4, length: 4 }, map: { x: 10, y: 23, w: 4, h: 4 } },
  { name: "AA", size: "large", dimensions: { width: 4, length: 4 }, map: { x: 0, y: 28, w: 4, h: 4 } },
  { name: "AB", size: "large", dimensions: { width: 4, length: 4 }, map: { x: 5, y: 28, w: 4, h: 4 } },
  { name: "AC", size: "large", dimensions: { width: 4, length: 4 }, map: { x: 10, y: 28, w: 4, h: 4 } },
  { name: "AD", size: "large", dimensions: { width: 4, length: 4 }, map: { x: 15, y: 28, w: 4, h: 4 } },
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
