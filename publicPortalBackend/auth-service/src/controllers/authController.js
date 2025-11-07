import { signUp, signIn } from "../services/authService.js";

export const handleSignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await signUp(name, email, password);

    console.log("User created successfully", user);
    res.status(201).json({ message: "success", user });
  } catch (err) {
    res.status(400).json({ message: "failure", error: err.message });
  }
};

export const handleSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await signIn(email, password);
    res.status(200).json({ message: "success", token, user });
  } catch (err) {
    res.status(400).json({ message: "failure", error: err.message });
  }
};
