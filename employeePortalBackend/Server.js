require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./Config/db');            // your db.js
const { connectStallDB } = require('./Config/stallDb');
const { connectReservationDB } = require('./Config/reservationDb');
const stallsRoutes = require('./routes/stallsRoutes');
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();

// CORS — set this to your frontend origin
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Vite/CRA dev
  credentials: true
}));

app.use(express.json());

// DB
connectDB();
// connect optional service DBs (async, but non-blocking)
connectStallDB().catch(err => console.error('Stall DB connect error', err));
connectReservationDB().catch(err => console.error('Reservation DB connect error', err));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/stalls', stallsRoutes);

app.get('/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5007;
app.listen(PORT, () => console.log(`API listening on ${PORT}`));
