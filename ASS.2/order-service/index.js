const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
app.use(express.json());

const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

app.get("/orders/health", (req, res) => {
  res.json({ service: "order-service", status: "ok" });
});

app.get("/orders/db-check", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ service: "order-service", db: "connected", result: rows[0] });
  } catch (err) {
    res.status(500).json({ service: "order-service", db: "error", detail: err.message });
  }
});

app.listen(3000, () => console.log("Order service running on port 3000"));
