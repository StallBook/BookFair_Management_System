import express from 'express';
import { handleSignIn, handleSignUp } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const authRouters = express.Router();

authRouters.post('/signup', handleSignUp);
authRouters.post('/signin', handleSignIn);


authRouters.get("/profile", verifyToken, (req, res) => {
    res.json({
        message: "Profile fetched successfully",
        user: {
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            userID: req.user.userID
        },
    });
});

export default authRouters;