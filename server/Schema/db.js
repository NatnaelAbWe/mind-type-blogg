import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// create a connection pool
export const dbPool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// test database connection on startup

(async () => {
  try {
    const connection = await dbPool.getConnection();
    console.log("MYSQL connected sucessfully");
    connection.release();
  } catch (err) {
    console.error("MYSQL connection failed:", err.message);
  }
})();
