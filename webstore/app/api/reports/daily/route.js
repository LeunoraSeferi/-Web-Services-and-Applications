import pool from "@/lib/db";
import { verifyToken, requireAdvancedOrAdmin } from "@/lib/auth";

export async function GET(request) {
  try {
    const user = verifyToken(request);
    requireAdvancedOrAdmin(user);

    const sql = `
      SELECT 
        COALESCE(SUM(oi.quantity * oi.price), 0) AS daily_earnings
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      WHERE DATE(o.order_date) = CURRENT_DATE
    `;

    const result = await pool.query(sql);

    return Response.json(result.rows[0]);

  } catch (err) {
    return Response.json({ error: err.message }, { status: 403 });
  }
}
