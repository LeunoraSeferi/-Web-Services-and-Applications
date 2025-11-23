import pool from "@/lib/db";
import { requireRole } from "@/lib/auth";

// ==========================================
// DELETE /api/users/:id
// Deletes a user by ID
// Permissions:
//   - Only admin can delete users
// ==========================================
export async function DELETE(request, { params }) {
  // Check if the requester is an admin
  const roleCheck = requireRole(request, ["admin"]);
  if (roleCheck.error) return roleCheck.response;

  try {
    // Execute delete query for the specific user ID
    await pool.query("DELETE FROM users WHERE id=$1", [params.id]);

    // 204 → No Content (successful delete)
    return new Response(null, { status: 204 });

  } catch (err) {
    // Server or database error
    return Response.json({ error: err.message }, { status: 500 });
  }
}
