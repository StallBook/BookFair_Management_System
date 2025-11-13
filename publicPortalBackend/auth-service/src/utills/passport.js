import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/auth/google/callback", // backend route
      scope: ["profile", "email"],
    },
    async (profile, done) => {
      try {
        const email = profile.emails[0].value;
        const googleId = profile.id;

        let existingUser = await User.findOne({ googleId });

        if (existingUser) return done(null, existingUser);

        const newUser = new User({
          googleId,  
          email,
        });

        await newUser.save();
        return done(null, newUser);
      } catch (err) {
        console.error("Google OAuth Error:", err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => done(null, user))
    .catch((err) => done(err));
});
