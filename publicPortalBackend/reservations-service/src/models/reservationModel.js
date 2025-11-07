import mongoose from "mongoose";


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
        let retryCount = 0;
        while (retryCount < 5) {
            try {
                const count = await mongoose.model("Reservation").countDocuments();
                this.reservationId = `RES${String(count + 1).padStart(6, "0")}`;
                return next();
            } catch (err) {
                if (err.code === 11000) {
                    retryCount++;
                    continue;
                }
                return next(err);
            }
        }
        return next(new Error("Failed to generate unique reservationId"));
    }
    next();
});

export default mongoose.model("Reservation", reservationSchema);

