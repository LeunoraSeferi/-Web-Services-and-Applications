import pool from "@/lib/db";
import { requireRole } from "@/lib/auth";

// PATCH /api/orders/:id/status
export async function PATCH(request, context) {
  const { id } = await context.params;

  const roleCheck = requireRole(request, ["admin", "advanced_user"]);
  if (roleCheck.error) return roleCheck.response;

  try {
    const { status } = await request.json();

    if (!status) {
      return Response.json({ error: "status is required" }, { status: 400 });
    }

    const result = await pool.query(
      `
      UPDATE orders
      SET status = $1
      WHERE id = $2
      RETURNING id, client_id, status
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return Response.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Order status updated successfully",
      order: result.rows[0],
    });

  } catch (err) {
    console.error("Order status update error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
