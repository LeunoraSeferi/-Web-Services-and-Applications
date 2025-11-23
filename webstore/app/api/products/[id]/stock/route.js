import pool from "@/lib/db";
import { requireRole } from "@/lib/auth";

// PATCH /api/products/:id/stock
export async function PATCH(request, context) {
  const { id } = await context.params;

  const roleCheck = requireRole(request, ["admin", "advanced_user"]);
  if (roleCheck.error) return roleCheck.response;

  try {
    const { quantity } = await request.json();

    if (quantity === undefined || quantity === null) {
      return Response.json(
        { error: "quantity is required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE products
       SET quantity = $1
       WHERE id = $2
       RETURNING id, name, quantity`,
      [quantity, id]
    );

    if (result.rows.length === 0) {
      return Response.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Stock updated successfully",
      product: result.rows[0],
    });
  } catch (err) {
    console.error("Stock update error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
