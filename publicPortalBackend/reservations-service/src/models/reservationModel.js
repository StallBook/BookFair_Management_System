import mongoose from "mongoose";
import Counter from "./counterModel.js";

const reservationSchema = new mongoose.Schema({
    reservationId: { type: String, unique: true },
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },

    stalls: [
        {
            stallId: { type: String, required: true },
            name: { type: String },
            size: { type: String, enum: ["small", "medium", "large"] },
        },
    ],

    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled", "failed"],
        default: "pending",
    },

    createdAt: { type: Date, default: Date.now },
    qrToken: { type: String, default: null },
    notes: { type: String, default: null },
});

reservationSchema.index({ userId: 1 });

reservationSchema.pre("save", async function (next) {
    if (this.isNew && !this.reservationId) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { name: "reservation" },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this.reservationId = `RES${String(counter.seq).padStart(6, "0")}`;
            next();
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
});

export default mongoose.model("Reservation", reservationSchema);

