import pool from "@/lib/db";
import { verifyToken, requireAdvancedOrAdmin } from "@/lib/auth";

// ================================
// GET /api/reports/top-products
// Returns the top 5 best-selling products
// Based on total quantity sold
// Allowed roles: admin, advanced_user
// ================================
export async function GET(request) {
  try {
    // Verify JWT token and extract user info
    const user = verifyToken(request);

    // Only admin or advanced user can access sales reports
    requireAdvancedOrAdmin(user);

    // SQL query:
    // - Joins products with order_items
    // - Sums quantity sold per product
    // - Sorts by total sold (DESC)
    // - Limits output to TOP 5
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

    // Execute query
    const result = await pool.query(sql);

    // Return top 5 best-selling products
    return Response.json(result.rows);

  } catch (err) {
    // Unauthorized or server error
    return Response.json({ error: err.message }, { status: 403 });
  }
}
