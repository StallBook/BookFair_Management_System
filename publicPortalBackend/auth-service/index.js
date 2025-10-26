import express from 'express';
import mongoose from 'mongoose';
import dotenv from "dotenv";
import cors from 'cors'
import authRouters from './src/routes/authRoutes.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


app.use('/', authRouters)


mongoose.connect(process.env.AUTH_MONGODB_URI)
    .then(() => console.log('Connected to Auth MongoDB'))
    .catch(err => console.error(err));


const PORT = process.env.AUTH_PORT || 5001;
app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`))