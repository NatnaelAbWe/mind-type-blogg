import { dbPool } from "./db.js";

export async function metaDataTable() {
  try {
    // create image App table
    await dbPool.query(`
            -- create database if it doesn't exist and switch to it
CREATE DATABASE IF NOT EXISTS image_app;
USE image_app;

-- create uploads table only if not already present
CREATE TABLE IF NOT EXISTS uploads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename     VARCHAR(255) NOT NULL,
  file_type    VARCHAR(100),
  file_size    BIGINT,
  file_path    VARCHAR(500),
  uploaded_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  uploaded_by  VARCHAR(255)
);

            
            `);
    console.log("table created");
  } catch (err) {
    console.error("Error while creating a table", err.message);
  }
}
