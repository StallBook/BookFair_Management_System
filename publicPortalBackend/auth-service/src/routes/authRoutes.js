import express from 'express';
import { handleSignIn, handleSignUp } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const authRouters = express.Router();

authRouters.post('/signup', handleSignUp);
authRouters.post('/signin', handleSignIn);


authRouters.get("/profile", verifyToken, (req, res) => {
    res.json({ message: "Protected route accessed!", user: req.user });
});

export default authRouters;