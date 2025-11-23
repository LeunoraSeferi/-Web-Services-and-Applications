import pool from "@/lib/db";
import { verifyToken, requireAdvancedOrAdmin } from "@/lib/auth";

export async function GET(request) {
  try {
    const user = verifyToken(request);
    requireAdvancedOrAdmin(user);

    const sql = `
      SELECT 
        p.id,
        p.name,
        SUM(oi.quantity) AS total_sold
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      GROUP BY p.id, p.name
      ORDER BY total_sold DESC
      LIMIT 5
    `;

    const result = await pool.query(sql);

    return Response.json(result.rows);

  } catch (err) {
    return Response.json({ error: err.message }, { status: 403 });
  }
}
