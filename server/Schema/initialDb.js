import { dbPool } from "./db.js";

export async function metaDataTable() {
  try {
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS uploads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        file_type VARCHAR(100),
        file_size BIGINT,
        file_path VARCHAR(500),
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        uploaded_by VARCHAR(255)
      );
    `);
    console.log("Table created");
  } catch (err) {
    console.error("Error while creating a table", err.message);
  }
}
