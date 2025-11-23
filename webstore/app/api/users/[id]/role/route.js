import pool from "@/lib/db";
import { requireRole } from "@/lib/auth";

// ================================
// PATCH /api/users/:id/role
// Updates the role of a specific user
// Allowed roles: admin ONLY
// ================================
export async function PATCH(request, context) {
  const { id } = await context.params; // Extract user ID from route

  // Check if requester is admin
  const roleCheck = requireRole(request, ["admin"]);
  if (roleCheck.error) return roleCheck.response;

  try {
    // Extract new role_id from request body
    const { role_id } = await request.json();

    // Validate required field
    if (!role_id) {
      return Response.json(
        { error: "role_id is required" },
        { status: 400 }
      );
    }

    // Update user's role in the database
    const result = await pool.query(
      `
      UPDATE users
      SET role_id = $1
      WHERE id = $2
      RETURNING id, username, role_id
      `,
      [role_id, id]
    );

    // If user ID does not exist
    if (result.rows.length === 0) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Return updated user
    return Response.json({
      message: "User role updated successfully",
      user: result.rows[0],
    });

  } catch (err) {
    // Log and return error message
    console.error("Role update error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
