const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
app.use(express.json());

const DB_HOST = process.env.DB_HOST || "order-db";
const DB_NAME = process.env.DB_NAME || "order_db";
const DB_USER = process.env.DB_USER || "order_user";
const DB_PASS = process.env.DB_PASS || "order_pass";

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

async function initWithRetry(retries = 10) {
  while (retries > 0) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS orders (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          book_id INT NOT NULL,
          quantity INT NOT NULL DEFAULT 1,
          status VARCHAR(50) NOT NULL DEFAULT 'created'
        )
      `);
      console.log("Connected to MySQL, orders table ready");
      return;
    } catch (err) {
      console.log("Waiting for MySQL... retries left:", retries);
      retries--;
      await new Promise(res => setTimeout(res, 3000));
    }
  }
  throw new Error("Could not connect to MySQL");
}

initWithRetry();

// CREATE
app.post("/orders", async (req, res) => {
  const { user_id, book_id, quantity, status } = req.body || {};
  if (!user_id || !book_id) {
    return res.status(400).json({ error: "user_id and book_id are required" });
  }

  const qty = quantity ?? 1;
  const st = status ?? "created";

  const [result] = await pool.query(
    "INSERT INTO orders (user_id, book_id, quantity, status) VALUES (?, ?, ?, ?)",
    [user_id, book_id, qty, st]
  );

  const [rows] = await pool.query("SELECT * FROM orders WHERE id = ?", [result.insertId]);
  res.status(201).json(rows[0]);
});

// READ ALL 
app.get("/orders", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM orders ORDER BY id ASC");
  res.json(rows);
});

// READ ONE
app.get("/orders/:id", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM orders WHERE id = ?", [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ error: "Order not found" });
  res.json(rows[0]);
});

// UPDATE
app.put("/orders/:id", async (req, res) => {
  const [existing] = await pool.query("SELECT * FROM orders WHERE id = ?", [req.params.id]);
  if (existing.length === 0) return res.status(404).json({ error: "Order not found" });

  const current = existing[0];
  const { user_id, book_id, quantity, status } = req.body || {};

  await pool.query(
    "UPDATE orders SET user_id=?, book_id=?, quantity=?, status=? WHERE id=?",
    [
      user_id ?? current.user_id,
      book_id ?? current.book_id,
      quantity ?? current.quantity,
      status ?? current.status,
      req.params.id,
    ]
  );

  const [rows] = await pool.query("SELECT * FROM orders WHERE id = ?", [req.params.id]);
  res.json(rows[0]);
});

// DELETE
app.delete("/orders/:id", async (req, res) => {
  const [existing] = await pool.query("SELECT * FROM orders WHERE id = ?", [req.params.id]);
  if (existing.length === 0) return res.status(404).json({ error: "Order not found" });

  await pool.query("DELETE FROM orders WHERE id = ?", [req.params.id]);
  res.json({ message: "Order deleted" });
});

app.get("/orders/health", (req, res) => {
  res.json({ service: "order-service", status: "ok" });
});

app.listen(3000, () => console.log("Order service running on port 3000"));
