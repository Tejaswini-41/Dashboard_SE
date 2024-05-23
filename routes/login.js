import express from "express";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import session from "express-session";
import dotenv from "dotenv";
import { verify_email_DB, ensureAuthenticated } from "./db_functions.js";

dotenv.config({ path: "./config/.env" });

const router = express.Router();

// Express session middleware
router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30,
    },
  })
);

// Passport middleware
router.use(passport.initialize());
router.use(passport.session());

// Google OAuth2 strategy
passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/main",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Access user information from profile
        const email = profile.email;
        const profile_pic = profile.picture;

        // Call verify_email_DB asynchronously
        const user_type = await verify_email_DB(email, profile_pic);

        // If type is verified, pass user information to Passport
        if (user_type) {
          // Pass user information to Passport via done callback
          done(null, { email, profile_pic, user_type });
        } else {
          // If type is not verified, pass false to indicate failure
          done(null, false);
        }
      } catch (error) {
        // Handle errors
        done(error);
      }
    }
  )
);

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Google authentication route
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google authentication callback
router.get(
  "/auth/google/main",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

router.get("/", (req, res) => {
  // Default route handler logic
  if (req.isAuthenticated()) {
    res.render("index.ejs", {
      user_type: req.user.user_type,
      profile_pic: req.user.profile_pic,
    });
  } else {
    res.render("profile/login.ejs");
  }
});

router.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("profile/profile.ejs");
  } else {
    res.render("profile/login.ejs", { error: "Not authenticated person" });
  }
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
      // Handle the error if needed
    }
    // Redirect the user to the login page after logout
    res.redirect("/login");
  });
});

export default router;
