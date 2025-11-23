import pool from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const query = `
      SELECT u.id, u.username, r.role_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.username = $1
        AND u.password = crypt($2, u.password)
      LIMIT 1
    `;

    const result = await pool.query(query, [username, password]);

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });
    }

    const user = result.rows[0];

    const token = jwt.sign(
      { id: user.id, role: user.role_name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return new Response(JSON.stringify({ token, user }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ message: "Server error", error: err.message }), { status: 500 });
  }
}
