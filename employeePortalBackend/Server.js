require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./Config/db');            // your db.js
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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

// Healthcheck (optional)
app.get('/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API listening on ${PORT}`));
