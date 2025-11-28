// app/api/products/route.js
import pool from "@/lib/db";

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

        -- ⭐ latest active discount
        (
          SELECT d.discount_percent
          FROM discounts d
          WHERE d.product_id = p.id
          AND d.active = TRUE
          AND NOW()::date BETWEEN d.start_date AND d.end_date
          ORDER BY d.start_date DESC
          LIMIT 1
        ) AS discount_percent,

        (
          SELECT d.active
          FROM discounts d
          WHERE d.product_id = p.id
          AND d.active = TRUE
          AND NOW()::date BETWEEN d.start_date AND d.end_date
          ORDER BY d.start_date DESC
          LIMIT 1
        ) AS discount_active,

        (
          SELECT d.start_date
          FROM discounts d
          WHERE d.product_id = p.id
          AND d.active = TRUE
          AND NOW()::date BETWEEN d.start_date AND d.end_date
          ORDER BY d.start_date DESC
          LIMIT 1
        ) AS discount_start,

        (
          SELECT d.end_date
          FROM discounts d
          WHERE d.product_id = p.id
          AND d.active = TRUE
          AND NOW()::date BETWEEN d.start_date AND d.end_date
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
