import pool from "@/lib/db";

// ================================
// GET /api/products/:id/quantity
// Calculates a product’s real-time quantity:
//  - initial stock
//  - sold quantity (SUM of order_items)
//  - current stock (initial - sold)
// ================================
export async function GET(request, context) {
  try {
    // Extract ID from dynamic route parameter
    const { id } = await context.params;

    console.log("RAW ID:", id); // Debug log

    // Ensure ID is clean (remove accidental spaces)
    const cleanId = id?.trim();

    console.log("CLEAN ID:", cleanId); // Debug log

    // SQL query to compute live stock quantity
    const sql = `
      SELECT 
        p.id,
        p.name,
        p.quantity AS initial_quantity,                 -- stock when product was added
        COALESCE(SUM(oi.quantity), 0) AS sold_quantity,  -- total sold units
        p.quantity - COALESCE(SUM(oi.quantity), 0) AS current_quantity
      FROM products p
      LEFT JOIN order_items oi ON oi.product_id = p.id
      WHERE p.id = $1
      GROUP BY p.id, p.name, p.quantity
    `;

    // Run query with sanitized product ID
    const result = await pool.query(sql, [cleanId]);

    // If product does not exist
    if (result.rows.length === 0) {
      return Response.json({ message: "Product not found" }, { status: 404 });
    }

    // Return product stock information
    return Response.json(result.rows[0]);

  } catch (err) {
    // Log and return server/database error
    console.error("ERROR:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
