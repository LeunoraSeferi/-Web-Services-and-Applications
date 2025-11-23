import pool from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const filters = {
    gender: searchParams.get("gender"),
    category: searchParams.get("category"),
    brand: searchParams.get("brand"),
    size: searchParams.get("size"),
    color: searchParams.get("color"),
    priceMin: searchParams.get("price_min"),
    priceMax: searchParams.get("price_max"),
    available: searchParams.get("available"),
  };

  let sql = `
    SELECT p.id, p.name, p.description, p.price, p.quantity,
           c.name AS category, b.name AS brand, s.size, col.color, g.type AS gender,
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
    sql += ` AND s.size=$${i++}`;
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

  sql += ` ORDER BY p.id`;

  const result = await pool.query(sql, params);
  return Response.json(result.rows);
}
