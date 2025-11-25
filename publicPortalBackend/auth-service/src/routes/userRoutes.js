import express from 'express';
import { handleGetAllUsers, handleGetUserByID } from '../controllers/userController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const userRouter = express.Router();

userRouter.get('/allUsers',  handleGetAllUsers);
userRouter.get('/:userID', verifyToken, handleGetUserByID);

export default userRouter;