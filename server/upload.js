import express from "express";
import multer from "multer";
import { unlink } from "fs/promises";
import cloudinary from "./config/cloudinary.js";
import { dbPool } from "./Schema/db.js";

const router = express.Router();

// Multer temporary memory storage (no local files)
const upload = multer({ storage: multer.memoryStorage() });

// POST /upload — upload banner to Cloudinary
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Upload buffer to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { folder: "banners" },
      async (error, result) => {
        if (error) return res.status(500).json({ error: error.message });

        const imageUrl = result.secure_url;

        // Save metadata in MySQL (optional)
        const query = `
          INSERT INTO uploads (filename, file_type, file_size, file_path, uploaded_by)
          VALUES (?, ?, ?, ?, ?)
        `;
        const values = [
          result.public_id,
          req.file.mimetype,
          req.file.size,
          imageUrl,
          req.body.uploadedby || null,
        ];

        await dbPool.execute(query, values);

        res.json({
          message: "File uploaded successfully to Cloudinary!",
          url: imageUrl,
          file: {
            name: result.public_id,
            type: req.file.mimetype,
            size: req.file.size,
          },
        });
      }
    );

    // Pipe buffer to Cloudinary
    result.end(req.file.buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
