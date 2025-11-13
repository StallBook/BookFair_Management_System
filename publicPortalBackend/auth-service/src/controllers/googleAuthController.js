import jwt from "jsonwebtoken";

export const googleCallback = (req, res) => {
  try {
    const token = jwt.sign(
      { email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
  } catch (error) {
    console.error("Error generating JWT:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginFailed = (req, res) => {
  res.status(401).json({ message: "Google login failed" });
};
