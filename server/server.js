import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcrypt";
import dns from "dns";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import cors from "cors";
import admin from "firebase-admin";
import fs from "fs";
import { metaDataTable } from "./Schema/initialDb.js";
import uploadRoute from "./upload.js";

const serviceAccountKey = JSON.parse(
  fs.readFileSync(
    new URL(
      "./mind-type-blogg-webapp-firebase-adminsdk-fbsvc-409a813759.json",
      import.meta.url
    )
  )
);

import { getAuth } from "firebase-admin/auth";

// Schemas
import User from "./Schema/User.js";
// import { use } from "react";

const server = express();
const PORT = process.env.BE_PORT || 3000;

// intialize firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

// Validation regex
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

// Middleware
server.use(express.json());
server.use(cors());
dns.setDefaultResultOrder("ipv4first");

// Connect to MongoDB
mongoose
  .connect(process.env.DB_LOCATION, { autoIndex: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Generate username from email
const generateUsername = async (email) => {
  let username = email.split("@")[0];
  const exists = await User.exists({ "personal_info.username": username });
  if (exists) username += nanoid(5);
  return username;
};

// Shape the data we send back to client
const formDatatoSend = (user) => {
  if (!process.env.SECRET_ACCESS_KEY) {
    throw new Error("SECRET_ACCESS_KEY is missing in .env");
  }

  const accessToken = jwt.sign(
    { id: user._id },
    process.env.SECRET_ACCESS_KEY,
    { expiresIn: "7d" } // optional: 7-day expiry
  );

  return {
    accessToken,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};

// run the setup once at the start
metaDataTable();

// ==================== ROUTES ==================== //

// SIGNUP
server.post("/signup", async (req, res, next) => {
  try {
    const { fullname, email, password } = req.body;

    // Validation
    if (!fullname || fullname.length < 3) {
      return res
        .status(403)
        .json({ error: "Full Name should be at least 3 letters long." });
    }
    if (!email || !emailRegex.test(email)) {
      return res.status(403).json({ error: "Invalid Email" });
    }
    if (!passwordRegex.test(password)) {
      return res.status(403).json({
        error: "Password must be 6-20 chars, include upper, lower, and number.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate username
    const userName = await generateUsername(email);

    // Create user
    const user = new User({
      personal_info: {
        fullname,
        email,
        password: hashedPassword,
        username: userName,
      },
    });

    const savedUser = await user.save();
    return res.status(200).json(formDatatoSend(savedUser));
  } catch (err) {
    if (err.code === 11000) {
      return res.status(500).json({ error: "Email already exists!" });
    }
    next(err); // Let global error handler log it
  }
});

// SIGNIN
server.post("/signin", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // console.log(req)

    // Find user
    const user = await User.findOne({ "personal_info.email": email });
    if (!user) {
      return res.status(403).json({ error: "Email not found" });
    }

    if (!user.google_auth) {
      // Compare password
      const isMatch = await bcrypt.compare(
        password,
        user.personal_info.password
      );
      if (!isMatch) {
        return res.status(403).json({ error: "Incorrect password" });
      }

      return res.status(200).json(formDatatoSend(user));
    } else {
      return res.status(403).json({
        error: "The Account Was Created with google pls sign in from Google",
      });
    }
  } catch (err) {
    next(err);
  }
});

server.post("/google-auth", async (req, res) => {
  try {
    const { accessToken } = req.body;

    // Verify the Google token
    const decodedUser = await getAuth().verifyIdToken(accessToken);

    let { email, name, picture } = decodedUser;
    picture = picture.replace("s96-c", "s384-c");

    // Check if the user already exists
    let user = await User.findOne({
      "personal_info.email": email,
    }).select(
      "personal_info.fullname personal_info.username personal_info.profile_img google_auth"
    );

    // If user exists but didn't sign up with Google
    if (user && !user.google_auth) {
      return res.status(403).json({
        error:
          "This email was signed up without Google. Please log in with your password instead.",
      });
    }

    // If user doesn’t exist → sign up new Google user
    if (!user) {
      const username = await generateUsername(email);

      user = new User({
        personal_info: {
          fullname: name,
          email,
          username,
        },
        google_auth: true,
      });

      await user.save();
    }

    // Respond once — success
    return res.status(200).json(formDatatoSend(user));
  } catch (err) {
    console.error("🔥 Google Auth Error:", err.message);
    return res.status(500).json({
      error:
        "Failed to authenticate with your Google account. Try again or use another method.",
    });
  }
});

// img Upload route
server.use("/uploads", express.static("uploads")); // serve uploaded files
server.use(uploadRoute);

// ==================== ERROR HANDLER ==================== //
server.use((err, req, res, next) => {
  console.error("🔥 Unhandled error:", err.stack || err);
  res.status(500).json({ error: "Something broke on the server." });
});

// ==================== START SERVER ==================== //
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
