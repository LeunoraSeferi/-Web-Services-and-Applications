import pool from "@/lib/db";
import { requireRole } from "@/lib/auth";

// ================================
// PATCH /api/products/:id/discount
// Allowed roles: admin, advanced_user
// Applies a discount to a specific product
// ================================
export async function PATCH(request, context) {
  const { id } = await context.params; // Extract product ID from route

  // Check if user has required role
  const roleCheck = requireRole(request, ["admin", "advanced_user"]);
  if (roleCheck.error) return roleCheck.response;

  try {
    // Extract discount fields from request body
    const { discount_percent, start_date, end_date, active } =
      await request.json();

    // Insert new discount record for this product
    const result = await pool.query(
      `INSERT INTO discounts 
       (product_id, discount_percent, start_date, end_date, active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id, discount_percent, start_date, end_date, active]
    );

    // Return success message with created discount
    return Response.json({
      message: "Discount applied successfully",
      discount: result.rows[0],
    });

  } catch (err) {
    // Log and return server error
    console.error("Discount error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
