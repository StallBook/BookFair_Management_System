import { getAllUsers, getUserByID } from "../services/userService.js";


export const handleGetAllUsers = async (req, res) => {

    try {
        const users = await getAllUsers();
        console.log(users);
        return res.status(200).json({ message: "success", users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const handleGetUserByID = async (req, res) => {
    const { userID } = req.params;
    try {
        const user = await getUserByID(userID);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}