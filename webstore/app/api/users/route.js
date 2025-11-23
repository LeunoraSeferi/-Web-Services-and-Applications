// app/api/users/route.js
import pool from "@/lib/db";
import { requireRole } from "@/lib/auth";

// POST /api/users
export async function POST(request) {
  const roleCheck = requireRole(request, ["admin"]);
  if (roleCheck.error) return roleCheck.response;

  try {
    const { username, password, role_id } = await request.json();

    const result = await pool.query(
      `INSERT INTO users (username, password, role_id)
       VALUES ($1, crypt($2, gen_salt('bf')), $3)
       RETURNING id, username, role_id`,
      [username, password, role_id]
    );

    return Response.json(result.rows[0], { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// GET /api/users
export async function GET() {
  try {
    const users = await pool.query(`
      SELECT u.id, u.username, r.role_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      ORDER BY u.id;
    `);

    return Response.json(users.rows);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
