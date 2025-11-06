const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const reservationRoutes = require("./src/routes/reservationRoute");
const PORT = process.env.PORT || 5003;
const app = express();
app.use(cors());
app.use(express.json());

app.use("/reserve", reservationRoutes);

mongoose
  .connect(process.env.MONGODB_URI_RESERVATION_SERVICE)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Reservation service running on port ${PORT}`);
});
