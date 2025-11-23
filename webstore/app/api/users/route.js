// app/api/users/route.js
import pool from "@/lib/db";
import { verifyToken, requireAdmin } from "@/lib/auth";

// --------------------------------------------------
// POST /api/users  → Only ADMIN can create users
// --------------------------------------------------
export async function POST(request) {
  try {
    const user = verifyToken(request);
    requireAdmin(user);

    const { username, password, role_id } = await request.json();

    const sql = `
      INSERT INTO users (username, password, role_id)
      VALUES ($1, crypt($2, gen_salt('bf')), $3)
      RETURNING id, username, role_id
    `;

    const result = await pool.query(sql, [
      username,
      password,
      role_id,
    ]);

    return Response.json(result.rows[0], { status: 201 });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 403 });
  }
}


// --------------------------------------------------
// GET /api/users  → Only ADMIN can view users
// --------------------------------------------------
export async function GET(request) {
  try {
    const user = verifyToken(request);
    requireAdmin(user);

    const result = await pool.query(`
      SELECT u.id, u.username, r.role_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      ORDER BY u.id;
    `);

    return Response.json(result.rows);

  } catch (err) {
    return Response.json({ error: err.message }, { status: 403 });
  }
}
