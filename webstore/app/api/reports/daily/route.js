import pool from "@/lib/db";
import { verifyToken, requireAdvancedOrAdmin } from "@/lib/auth";

// ================================
// GET /api/reports/daily
// Returns today's total earnings
// Allowed roles: admin, advanced_user
// ================================
export async function GET(request) {
  try {
    // Verify JWT token and extract user info
    const user = verifyToken(request);

    // Allow only admin or advanced users to view daily earnings
    requireAdvancedOrAdmin(user);

    // SQL query: calculates total earnings from today's orders
    const sql = `
      SELECT 
        COALESCE(SUM(oi.quantity * oi.price), 0) AS daily_earnings
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      WHERE DATE(o.order_date) = CURRENT_DATE
    `;

    // Execute query
    const result = await pool.query(sql);

    // Return today's earnings
    return Response.json(result.rows[0]);

  } catch (err) {
    // Unauthorized or server error
    return Response.json({ error: err.message }, { status: 403 });
  }
}
