import pool from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function DELETE(request, { params }) {
  const roleCheck = requireRole(request, ["admin"]);
  if (roleCheck.error) return roleCheck.response;

  try {
    await pool.query("DELETE FROM users WHERE id=$1", [params.id]);
    return new Response(null, { status: 204 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
