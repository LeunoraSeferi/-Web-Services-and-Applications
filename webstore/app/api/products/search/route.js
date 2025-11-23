import pool from "@/lib/db";

function clean(value) {
  if (!value) return null;
  return value.trim().toLowerCase();
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const filters = {
      gender: clean(searchParams.get("gender")),
      category: clean(searchParams.get("category")),
      brand: clean(searchParams.get("brand")),
      size: clean(searchParams.get("size")),
      color: clean(searchParams.get("color")),
      priceMin: clean(searchParams.get("price_min")),
      priceMax: clean(searchParams.get("price_max")),
      available: clean(searchParams.get("available")),
    };

    let sql = `
      SELECT 
        p.id, p.name, p.description, p.price, p.quantity,
        c.name AS category,
        b.name AS brand,
        s.size,
        col.color,
        g.type AS gender,
        (p.quantity - COALESCE(SUM(oi.quantity),0)) AS current_stock
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN sizes s ON p.size_id = s.id
      LEFT JOIN colors col ON p.color_id = col.id
      LEFT JOIN gender g ON p.gender_id = g.id
      LEFT JOIN order_items oi ON oi.product_id = p.id
      WHERE 1=1
    `;

    const params = [];
    let i = 1;

    if (filters.gender) {
      sql += ` AND LOWER(g.type)=LOWER($${i++})`;
      params.push(filters.gender);
    }
    if (filters.category) {
      sql += ` AND LOWER(c.name)=LOWER($${i++})`;
      params.push(filters.category);
    }
    if (filters.brand) {
      sql += ` AND LOWER(b.name)=LOWER($${i++})`;
      params.push(filters.brand);
    }
    if (filters.size) {
      sql += ` AND LOWER(s.size)=LOWER($${i++})`;
      params.push(filters.size);
    }
    if (filters.color) {
      sql += ` AND LOWER(col.color)=LOWER($${i++})`;
      params.push(filters.color);
    }
    if (filters.priceMin) {
      sql += ` AND p.price >= $${i++}`;
      params.push(filters.priceMin);
    }
    if (filters.priceMax) {
      sql += ` AND p.price <= $${i++}`;
      params.push(filters.priceMax);
    }

    sql += ` GROUP BY p.id, c.name, b.name, s.size, col.color, g.type`;

    if (filters.available === "true") {
      sql += ` HAVING (p.quantity - COALESCE(SUM(oi.quantity),0)) > 0`;
    }
    if (filters.available === "false") {
      sql += ` HAVING (p.quantity - COALESCE(SUM(oi.quantity),0)) = 0`;
    }

    sql += ` ORDER BY p.id`;

    console.log("Generated SQL:", sql);
    console.log("Params:", params);

    const result = await pool.query(sql, params);
    console.log("DB Result:", result.rows);

    return Response.json(result.rows);

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
