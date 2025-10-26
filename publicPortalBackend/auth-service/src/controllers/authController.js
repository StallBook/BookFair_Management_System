import { signUp, signIn } from '../services/authService.js';

export const handleSignUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await signUp(name, email, password);
        res.status(201).json(user);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export const handleSignIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { token, user } = await signIn(email, password);
        res.json({ token, user });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
};