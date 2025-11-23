import pool from "@/lib/db";
import { requireRole } from "@/lib/auth";

// PATCH /api/products/:id/discount
export async function PATCH(request, context) {
  const { id } = await context.params;

  const roleCheck = requireRole(request, ["admin", "advanced_user"]);
  if (roleCheck.error) return roleCheck.response;

  try {
    const { discount_percent, start_date, end_date, active } =
      await request.json();

    const result = await pool.query(
      `INSERT INTO discounts 
       (product_id, discount_percent, start_date, end_date, active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id, discount_percent, start_date, end_date, active]
    );

    return Response.json({
      message: "Discount applied successfully",
      discount: result.rows[0],
    });
  } catch (err) {
    console.error("Discount error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
