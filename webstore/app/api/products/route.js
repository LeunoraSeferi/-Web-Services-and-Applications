// app/api/products/route.js
import pool from "@/lib/db";
import { requireRole } from "@/lib/auth";

// GET /api/products
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT p.id, p.name, p.description, p.price, p.quantity,
             c.name AS category, b.name AS brand, s.size, col.color, g.type AS gender
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN sizes s ON p.size_id = s.id
      LEFT JOIN colors col ON p.color_id = col.id
      LEFT JOIN gender g ON p.gender_id = g.id
      ORDER BY p.id;
    `);

    return Response.json(result.rows);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/products
export async function POST(request) {
  const roleCheck = requireRole(request, [
    "admin",
    "advanced_user",
    "simple_user",
  ]);

  if (roleCheck.error) return roleCheck.response;

  try {
    const {
      name,
      description,
      price,
      quantity,
      category_id,
      brand_id,
      size_id,
      color_id,
      gender_id,
    } = await request.json();

    const result = await pool.query(
      `INSERT INTO products
      (name, description, price, quantity, category_id, brand_id, size_id, color_id, gender_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        name,
        description,
        price,
        quantity,
        category_id,
        brand_id,
        size_id,
        color_id,
        gender_id,
      ]
    );

    return Response.json(result.rows[0], { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
