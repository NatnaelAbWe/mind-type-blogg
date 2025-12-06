import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const dbPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false, // Filess.io requires SSL
  },
});

(async () => {
  try {
    const connection = await dbPool.getConnection();
    console.log("MYSQL connected successfully");
    connection.release();
  } catch (err) {
    console.error("MYSQL connection failed:", err.message);
  }
})();
