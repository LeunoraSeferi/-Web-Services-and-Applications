// app/api/users/route.js
import pool from "@/lib/db";
import { verifyToken, requireAdmin } from "@/lib/auth";

// --------------------------------------------------
// POST /api/users
// Description:
//   Creates a new user in the system.
// Permissions:
//   Only ADMIN users can create new users.
// --------------------------------------------------
export async function POST(request) {
  try {
    // Verify JWT token and extract user
    const user = verifyToken(request);

    // Only admin can create new users
    requireAdmin(user);

    // Extract new user data from request body
    const { username, password, role_id } = await request.json();

    // Insert new user with hashed password (bcrypt/Blowfish via crypt())
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

    // Return created user information
    return Response.json(result.rows[0], { status: 201 });

  } catch (err) {
    // Unauthorized or server error
    return Response.json({ error: err.message }, { status: 403 });
  }
}


// --------------------------------------------------
// GET /api/users
// Description:
//   Returns a list of all users and their roles.
// Permissions:
//   Only ADMIN can view the full user list.
// --------------------------------------------------
export async function GET(request) {
  try {
    // Verify JWT token
    const user = verifyToken(request);

    // Ensure the requester is admin
    requireAdmin(user);

    // Fetch users with role names
    const result = await pool.query(`
      SELECT u.id, u.username, r.role_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      ORDER BY u.id;
    `);

    // Return all users
    return Response.json(result.rows);

  } catch (err) {
    // Unauthorized or server error
    return Response.json({ error: err.message }, { status: 403 });
  }
}
