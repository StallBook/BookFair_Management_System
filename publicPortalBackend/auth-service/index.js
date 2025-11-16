import express from 'express';
import mongoose from 'mongoose';
import dotenv from "dotenv";
import cors from 'cors'
import authRouters from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import googleAuthRoutes from './src/routes/googleAuthRoute.js';
import genereRoutes from './src/routes/genresRoute.js';
import businessDetailsRoute from './src/routes/businessDetailsRoute.js';
import session from 'express-session';
import passport from 'passport';
import './src/utills/passport.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: "xzcbnxncdhvbfhncxbnvbcfhv",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, 
      maxAge: 24 * 60 * 60 * 1000, 
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    console.log(` ${req.method} ${req.url}`);
    next();
});

app.use('/', authRouters)
app.use('/user', userRoutes)
app.use("/auth", googleAuthRoutes);
app.use("/genres",genereRoutes);
app.use('/business', businessDetailsRoute);


mongoose.connect(process.env.AUTH_MONGODB_URI)
    .then(() => console.log('Connected to Auth MongoDB'))
    .catch(err => console.error(err));


const PORT = process.env.AUTH_PORT || 5001;
app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`))