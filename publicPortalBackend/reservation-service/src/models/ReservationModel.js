const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    reservationId: {
      type: String,
      unique: true,
    },
    userId: {
      type: Number,
      required: true,
    },
    stalls: [
      {
        type: String,
        required: true,
      },
    ],
    status: {
      type: String,
      enum: ["reserved"],
      default: "reserved",
    },
    reservationDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

reservationSchema.pre("save", async function (next) {
  if (this.isNew) {
    const count = await mongoose.model("Reservation").countDocuments();
    this.reservationId = `RES${String(count + 1).padStart(6, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Reservation", reservationSchema);
