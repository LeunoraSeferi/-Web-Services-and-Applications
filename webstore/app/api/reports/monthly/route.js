import pool from "@/lib/db";
import { verifyToken, requireAdvancedOrAdmin } from "@/lib/auth";

export async function GET(request) {
  try {
    const user = verifyToken(request);
    requireAdvancedOrAdmin(user);

    const sql = `
      SELECT 
        TO_CHAR(o.order_date, 'YYYY-MM') AS month,
        COALESCE(SUM(oi.quantity * oi.price), 0) AS monthly_earnings
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      GROUP BY month
      ORDER BY month DESC
    `;

    const result = await pool.query(sql);

    return Response.json(result.rows);

  } catch (err) {
    return Response.json({ error: err.message }, { status: 403 });
  }
}
