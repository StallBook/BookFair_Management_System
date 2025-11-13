import express from "express";
import passport from "passport";
import { googleCallback, loginFailed } from "../controllers/googleAuthController.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/auth/google/login/failed" }),
  googleCallback
);

router.get("/google/login/failed", loginFailed);

export default router;
