const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const stallRoutes = require("./src/routes/StallRoutes");

const PORT = process.env.PORT || 5002;
const app = express();
app.use(cors());
app.use(express.json());

app.use("/stalls", stallRoutes);

mongoose
  .connect(process.env.MONGODB_URI_STALL_SERVICE)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Stall management service running on port ${PORT}`);
});
