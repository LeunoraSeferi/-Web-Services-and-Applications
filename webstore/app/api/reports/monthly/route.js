import pool from "@/lib/db";
import { verifyToken, requireAdvancedOrAdmin } from "@/lib/auth";

// ================================
// GET /api/reports/monthly
// Returns monthly earnings:
//  - Groups revenue by month (YYYY-MM)
//  - Calculates SUM(quantity * price) per month
// Allowed roles: admin, advanced_user
// ================================
export async function GET(request) {
  try {
    // Verify JWT token and extract user
    const user = verifyToken(request);

    // Ensure the user has permission to view financial reports
    requireAdvancedOrAdmin(user);

    // SQL query:
    // - Format order_date to 'YYYY-MM'
    // - Calculate earnings per month
    // - Group results by month
    // - Sort from newest to oldest
    const sql = `
      SELECT 
        TO_CHAR(o.order_date, 'YYYY-MM') AS month,
        COALESCE(SUM(oi.quantity * oi.price), 0) AS monthly_earnings
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      GROUP BY month
      ORDER BY month DESC
    `;

    // Execute query
    const result = await pool.query(sql);

    // Return an array of months with earnings
    return Response.json(result.rows);

  } catch (err) {
    // Unauthorized OR internal server error
    return Response.json({ error: err.message }, { status: 403 });
  }
}
