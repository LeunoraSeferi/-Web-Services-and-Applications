import pool from "@/lib/db";
import { requireRole } from "@/lib/auth";

// ================================
// PATCH /api/products/:id/stock
// Updates product stock quantity
// Allowed roles: admin, advanced_user
// ================================
export async function PATCH(request, context) {
  const { id } = await context.params; // Extract product ID from route

  // Check if the user has permission to update stock
  const roleCheck = requireRole(request, ["admin", "advanced_user"]);
  if (roleCheck.error) return roleCheck.response;

  try {
    // Extract desired quantity from request body
    const { quantity } = await request.json();

    // Validate input quantity
    if (quantity === undefined || quantity === null) {
      return Response.json(
        { error: "quantity is required" },
        { status: 400 }
      );
    }

    // Update product quantity in the database
    const result = await pool.query(
      `
      UPDATE products
      SET quantity = $1
      WHERE id = $2
      RETURNING id, name, quantity
      `,
      [quantity, id]
    );

    // If product ID does not exist
    if (result.rows.length === 0) {
      return Response.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Return updated product info
    return Response.json({
      message: "Stock updated successfully",
      product: result.rows[0],
    });

  } catch (err) {
    // Handle unexpected database/server errors
    console.error("Stock update error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
