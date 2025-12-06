import express, { response } from "express";
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
import { getAuth } from "firebase-admin/auth";

// Schemas
import User from "./Schema/User.js";
import Blog from "./Schema/Blog.js";

// Firebase Admin initialization
const serviceAccountKey = JSON.parse(
  Buffer.from(process.env.FIREBASE_ADMIN_KEY_BASE64, "base64").toString()
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

const server = express();
const PORT = process.env.PORT || 3000;

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
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Generate username from email
const generateUsername = async (email) => {
  let username = email.split("@")[0];
  const exists = await User.exists({ "personal_info.username": username });
  if (exists) username += nanoid(5);
  return username;
};

const verifyJWT = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ error: "No Access Token Provided" });
  }

  jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Access token is invalid" });
    }
    req.user = decoded.id;
    next();
  });
};

// Shape the data we send back to client
const formDatatoSend = (user) => {
  if (!process.env.SECRET_ACCESS_KEY) {
    throw new Error("SECRET_ACCESS_KEY is missing in .env");
  }

  const accessToken = jwt.sign(
    { id: user._id },
    process.env.SECRET_ACCESS_KEY,
    { expiresIn: "7d" }
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
    console.error("Google Auth Error:", err.message);
    return res.status(500).json({
      error:
        "Failed to authenticate with your Google account. Try again or use another method.",
    });
  }
});

// trending blogs
server.get("/trending-blogs", (req, res) => {
  Blog.find({ "activity.draft": false })
    .populate(
      "author",
      "personal_info.profile_img personal_info.username personal_info.fullname _id"
    )
    .sort({
      "activity.total_read": -1,
      "activity.total_likes": -1,
      publishedAt: -1,
    })
    .select("blog_id title publishedAt _id")
    .limit(5)
    .then((blogs) => {
      return res.status(200).json({ blogs });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

// leatest blogs

server.post("/latest-blogs", (req, res) => {
  let maxLimit = 5;
  let page = req.body;
  Blog.find({ "activity.draft": false })
    .populate(
      "author",
      "personal_info.profile_img personal_info.username personal_info.fullname -_id"
    )
    .sort({ publishedAt: -1 })
    .select("blog_id title des banner activity tags publishedAt -_id")
    .skip(page - 1 * maxLimit)
    .limit(maxLimit)
    .then((blogs) => {
      return res.status(200).json({ blogs });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});
// GET /blog/:id
server.get("/blog/:id", async (req, res) => {
  const { id } = req.params;
  console.log(req.params);

  try {
    const blog = await Blog.findOne({ blog_id: id }).populate(
      "author",
      "personal_info.profile_img personal_info.username personal_info.fullname -_id"
    );

    if (!blog) return res.status(404).json({ error: "Blog not found" });

    res.json({ blog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// all latest blogs count

server.post("/all-latest-blogs-count", (req, res) => {
  Blog.countDocuments({ "activity.draft": false })
    .then((count) => {
      return res.status(200).json({ totalDocs: count });
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
});

// search and filter blogs

server.post("/search-blogs", (req, res) => {
  let { tags } = req.body;

  let findQuery = { tags, "activity.draft": false };

  let maxLimit = 5;

  Blog.find(findQuery)
    .populate(
      "author",
      "personal_info.profile_img personal_info.username personal_info.fullname -_id"
    )
    .sort({ publishedAt: -1 })
    .select("blog_id title des banner activity tags publishedAt -_id")
    .limit(maxLimit)
    .then((blogs) => {
      return res.status(200).json({ blogs });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

// CREATE BLOG
server.post("/create-blog", verifyJWT, async (req, res) => {
  try {
    const authorId = req.user;

    // Validate authorId
    if (!mongoose.Types.ObjectId.isValid(authorId)) {
      return res.status(400).json({ error: "Invalid author ID" });
    }

    let { title, banner, des, tags, content, draft } = req.body;

    // Basic validations
    if (!title || !title.trim().length) {
      return res
        .status(403)
        .json({ error: "You must provide a title to publish the blog" });
    }

    if (!draft) {
      if (!des || !des.trim().length || des.length > 200) {
        return res.status(403).json({
          error: "You must provide a blog description under 200 characters",
        });
      }

      if (!banner || !banner.trim().length) {
        return res.status(403).json({
          error: "You must provide a banner image to publish the blog",
        });
      }

      if (
        !content ||
        !Array.isArray(content.blocks) ||
        !content.blocks.length
      ) {
        return res
          .status(403)
          .json({ error: "There must be some blog content to publish" });
      }

      if (!tags || !Array.isArray(tags) || !tags.length || tags.length > 10) {
        return res.status(403).json({
          error: "You must provide between 1 and 10 tags to publish the blog",
        });
      }
    }

    // Normalize tags
    tags = tags.map((tag) => tag.toLowerCase());

    // Generate unique blog slug
    const blog_id =
      title
        .replace(/[^a-zA-Z0-9]/g, " ")
        .replace(/\s+/g, "-")
        .trim() +
      "-" +
      nanoid();

    // Create Blog document
    const blog = new Blog({
      title,
      des,
      banner,
      content,
      tags,
      author: authorId,
      blog_id,
      activity: { draft: Boolean(draft) },
    });

    const savedBlog = await blog.save();

    // Update User's total_posts and blogs array
    const updatedUser = await User.findByIdAndUpdate(
      authorId,
      {
        $inc: { "account_info.total_posts": draft ? 0 : 1 },
        $push: { blogs: savedBlog._id },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ id: blog_id });
  } catch (err) {
    console.error("🔥 Create Blog Error:", err);
    return res.status(500).json({ error: "Failed to create blog" });
  }
});

// img Upload route
server.use("/uploads", express.static("uploads")); // serve uploaded files
server.use(uploadRoute);

// fetch blogg

// ==================== ERROR HANDLER ==================== //
server.use((err, req, res, next) => {
  console.error("🔥 Unhandled error:", err.stack || err);
  res.status(500).json({ error: "Something broke on the server." });
});

// ==================== START SERVER ==================== //
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
