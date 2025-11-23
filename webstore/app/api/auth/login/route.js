/**
 * POST /api/auth/login
 * ----------------------
 * Handles user login by:
 * 1. Checking if the username exists
 * 2. Validating the password using PostgreSQL `crypt()`
 * 3. Returning a signed JWT token (1-hour expiration)
 *
 * Expected Request Body:
 * {
 *   "username": "example",
 *   "password": "password123"
 * }
 *
 * Successful Response (200):
 * {
 *   "token": "jwt_token_here",
 *   "user": { ...userData }
 * }
 *
 * Error Responses:
 * 401 - Invalid username or password
 * 500 - Server error
 */

import pool from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    // Extract username and password from request body
    const { username, password } = await request.json();

    // Query: find user with matching username (also fetch role)
    const query = `
      SELECT u.id, u.username, r.role_name, u.password
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.username = $1
      LIMIT 1
    `;

    const result = await pool.query(query, [username]);

    // No user found → invalid username
    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ message: "Invalid username" }),
        { status: 401 }
      );
    }

    const user = result.rows[0];

    /**
     * Validate password using:
     * crypt(entered_password, stored_hashed_password) = stored_hashed_password
     */
    const pwCheck = await pool.query(
      "SELECT crypt($1, $2) = $2 AS match",
      [password, user.password]
    );

    // Invalid password
    if (!pwCheck.rows[0].match) {
      return new Response(
        JSON.stringify({ message: "Invalid password" }),
        { status: 401 }
      );
    }

    // Create signed JWT token containing user ID and role
    const token = jwt.sign(
      { id: user.id, role: user.role_name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Return token and user data
    return new Response(
      JSON.stringify({ token, user }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (err) {
    // Internal server error
    return new Response(
      JSON.stringify({ message: "Server error", error: err.message }),
      { status: 500 }
    );
  }
}
