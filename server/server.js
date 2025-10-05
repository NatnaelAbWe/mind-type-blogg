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
const PORT = process.env.PORT || 3000;

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

    // Compare password
    const isMatch = await bcrypt.compare(password, user.personal_info.password);
    if (!isMatch) {
      return res.status(403).json({ error: "Incorrect password" });
    }

    return res.status(200).json(formDatatoSend(user));
  } catch (err) {
    next(err);
  }
});

server.post("/google-auth", async (req, res) => {
  let { accessToken } = req.body;

  getAuth()
    .verifyIdToken(accessToken)
    .then(async (decodeUser) => {
      let { email, name, picture } = decodeUser;

      picture = picture.replace("s96-c", "s384-c");
      let user = await User.findOne({ "personal_info.email": email })
        .select(
          "persomal_info.fullname personal_info.username personal_info.profile_img google_auth"
        )
        .then((u) => {
          return u || null;
        })
        .catch((err) => {
          return res.status(500).json({ error: err.message });
        });
      if (user) {
        if (!user.google_auth) {
          // login
          return res.status(403).json({
            error:
              "This email was signed up without google. please log in with password to acess the account",
          });
        }
      } else {
        // sign up
        let username = await generateUsername(email);

        user = new User({
          personal_info: {
            fullname: name,
            email,
            profile_img: picture,
            username,
          },
          google_auth: true,
        });

        await user
          .save()
          .then((u) => {
            user = u;
          })
          .catch((err) => {
            return res.status(500).json({ error: err.message });
          });
      }
      return res.status(200).json(formDatatoSend(user));
    })
    .catch((err) => {
      return res.status(500).json({
        error:
          "failed to authenticate you with google account try with other account",
      });
    });
});

// ==================== ERROR HANDLER ==================== //
server.use((err, req, res, next) => {
  console.error("🔥 Unhandled error:", err.stack || err);
  res.status(500).json({ error: "Something broke on the server." });
});

// ==================== START SERVER ==================== //
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
