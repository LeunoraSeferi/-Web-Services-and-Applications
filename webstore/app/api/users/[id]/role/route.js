import pool from "@/lib/db";
import { requireRole } from "@/lib/auth";

// PATCH /api/users/:id/role
export async function PATCH(request, context) {
  const { id } = await context.params;

  const roleCheck = requireRole(request, ["admin"]);
  if (roleCheck.error) return roleCheck.response;

  try {
    const { role_id } = await request.json();

    if (!role_id) {
      return Response.json(
        { error: "role_id is required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      UPDATE users
      SET role_id = $1
      WHERE id = $2
      RETURNING id, username, role_id
      `,
      [role_id, id]
    );

    if (result.rows.length === 0) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return Response.json({
      message: "User role updated successfully",
      user: result.rows[0],
    });

  } catch (err) {
    console.error("Role update error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
