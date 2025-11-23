import pool from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const query = `
      SELECT u.id, u.username, r.role_name, u.password
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.username = $1
      LIMIT 1
    `;

    const result = await pool.query(query, [username]);

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ message: "Invalid username" }), { status: 401 });
    }

    const user = result.rows[0];

    // Check hashed password
    const pwCheck = await pool.query(
      "SELECT crypt($1, $2) = $2 AS match",
      [password, user.password]
    );

    if (!pwCheck.rows[0].match) {
      return new Response(JSON.stringify({ message: "Invalid password" }), { status: 401 });
    }

    // Create JWT token
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
    return new Response(
      JSON.stringify({ message: "Server error", error: err.message }),
      { status: 500 }
    );
  }
}
