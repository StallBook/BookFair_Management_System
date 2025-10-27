import User from '../models/user.js';


export const getAllUsers = async () => {
    try {
        const users = await User.find().select('-password');
        return users;
    } catch (error) {
        throw new Error(error);
    }
}


export const getUserByID = async (userID) => {
    try {
        const user = await User.findById(userID).select('-password');
        if (!user) throw new Error('User not found');
        return user;
    } catch (error) {
        throw new Error(error);
    }
}