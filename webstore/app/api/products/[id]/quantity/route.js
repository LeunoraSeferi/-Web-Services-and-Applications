import pool from "@/lib/db";

// GET /api/products/:id/quantity
export async function GET(request, context) {
  const { id } = await context.params;

  try {
    const sql = `
      SELECT 
        p.id, 
        p.name,
        p.quantity AS initial_quantity,
        COALESCE(SUM(oi.quantity), 0) AS sold_quantity,
        p.quantity - COALESCE(SUM(oi.quantity), 0) AS current_quantity
      FROM products p
      LEFT JOIN order_items oi ON oi.product_id = p.id
      WHERE p.id = $1
      GROUP BY p.id, p.name, p.quantity
    `;

    const result = await pool.query(sql, [id]);

    if (result.rows.length === 0) {
      return Response.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return Response.json(result.rows[0]);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
