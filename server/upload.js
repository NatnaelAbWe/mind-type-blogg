import express from "express";
import multer from "multer";
import path from "path";
import { dbPool } from "./Schema/db.js";

const router = express.Router();

router.use("/upload", express.static("upload"));

// set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "no file uploaded" });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/upload/${
      file.filename
    }`;

    const query = `
        INSERT INTO uploads (filename, file_type, file_size, file_path, uploaded_by) VALUES(?,?,?,?,?);`;

    const values = [
      file.filename,
      file.mimetype,
      file.size,
      fileUrl,
      req.body.uploadedby || null,
    ];

    await dbPool.execute(query, values);

    res.json({
      message: "✅ File uploaded and metadata saved successfully!",
      url: fileUrl,
      file: {
        name: file.filename,
        type: file.mimetype,
        size: file.size,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
