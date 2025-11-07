import express from 'express';
import mongoose from 'mongoose';
import dotenv from "dotenv";
import cors from 'cors'
import reservationRoutes from './src/routes/reservationRoutes.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(` ${req.method} ${req.url}`);
    next();
});


app.use("/reservations", reservationRoutes);


mongoose.connect(process.env.RESERVATION_MONGODB_URI)
    .then(() => console.log('Connected to Reservation MongoDB'))
    .catch(err => console.error(err));


const PORT = process.env.RESERVATION_PORT || 5004;
app.listen(PORT, () => console.log(`Reservation Service running on port ${PORT}`))