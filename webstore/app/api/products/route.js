// app/api/products/route.js
import pool from "@/lib/db";
import { requireProductAccess } from "@/lib/auth";


// -------------------------------------------------------------
// GET /api/products
// Public endpoint (clients & admins)
// Returns product data + discount data (if active)
// -------------------------------------------------------------
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.quantity,
        p.image_url,

        c.name AS category,
        b.name AS brand,
        s.size,
        col.color,
        g.type AS gender,

        -- ⭐ ONLY ONE (LATEST) ACTIVE DISCOUNT
        (
          SELECT d.discount_percent
          FROM discounts d
          WHERE d.product_id = p.id
          AND d.active = TRUE
          AND NOW() BETWEEN d.start_date AND d.end_date
          ORDER BY d.start_date DESC
          LIMIT 1
        ) AS discount_percent,

        (
          SELECT d.active
          FROM discounts d
          WHERE d.product_id = p.id
          AND d.active = TRUE
          AND NOW() BETWEEN d.start_date AND d.end_date
          ORDER BY d.start_date DESC
          LIMIT 1
        ) AS discount_active,

        (
          SELECT d.start_date
          FROM discounts d
          WHERE d.product_id = p.id
          AND d.active = TRUE
          AND NOW() BETWEEN d.start_date AND d.end_date
          ORDER BY d.start_date DESC
          LIMIT 1
        ) AS discount_start,

        (
          SELECT d.end_date
          FROM discounts d
          WHERE d.product_id = p.id
          AND d.active = TRUE
          AND NOW() BETWEEN d.start_date AND d.end_date
          ORDER BY d.start_date DESC
          LIMIT 1
        ) AS discount_end

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



// -------------------------------------------------------------
// POST /api/products
// Only Admin + Advanced user can create products
// -------------------------------------------------------------
export async function POST(request) {

  const permission = requireProductAccess(request);
  if (permission.error) return permission.response;

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
      image_url
    } = await request.json();

    if (!name || !price) {
      return Response.json(
        { error: "Name and price are required." },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO products
        (name, description, price, quantity, category_id, brand_id, size_id, color_id, gender_id, image_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [
        name,
        description || "",
        price,
        quantity || 0,
        category_id || null,
        brand_id || null,
        size_id || null,
        color_id || null,
        gender_id || null,
        image_url || null
      ]
    );

    return Response.json(result.rows[0], { status: 201 });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
