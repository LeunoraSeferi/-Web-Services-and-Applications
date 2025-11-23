import pool from "@/lib/db";
import { requireRole } from "@/lib/auth";

// ================================
// GET /api/products/:id
// Public endpoint – returns a single product by ID
// ================================
export async function GET(request, context) {
  const { id } = await context.params; // Extract dynamic route parameter
  console.log("Dynamic route hit. ID =", id); // Debug log

  try {
    // Query product by ID
    const result = await pool.query(
      "SELECT * FROM products WHERE id=$1",
      [id]
    );

    // If no product found
    if (result.rows.length === 0)
      return Response.json({ message: "Not found" }, { status: 404 });

    // Return found product
    return Response.json(result.rows[0]);

  } catch (err) {
    // Database or server error
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// ================================
// PUT /api/products/:id
// Allowed roles: admin, advanced_user, simple_user
// Updates product fields
// ================================
export async function PUT(request, context) {
  const { id } = await context.params; // Extract product ID

  // Check if user role is allowed to update
  const roleCheck = requireRole(request, [
    "admin",
    "advanced_user",
    "simple_user",
  ]);
  if (roleCheck.error) return roleCheck.response;

  try {
    // Extract fields from request body
    const { name, description, price, quantity } = await request.json();

    // Update product in database
    const result = await pool.query(
      `UPDATE products
       SET name=$1, description=$2, price=$3, quantity=$4
       WHERE id=$5
       RETURNING *`,
      [name, description, price, quantity, id]
    );

    // If product does not exist
    if (result.rows.length === 0)
      return Response.json({ message: "Not found" }, { status: 404 });

    // Return updated product
    return Response.json(result.rows[0]);

  } catch (err) {
    // Server/database error
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// ================================
// DELETE /api/products/:id
// Allowed roles: admin ONLY
// Deletes a product by ID
// ================================
export async function DELETE(request, context) {
  const { id } = await context.params; // Extract product ID

  // Only admin can delete products
  const roleCheck = requireRole(request, ["admin"]);
  if (roleCheck.error) return roleCheck.response;

  try {
    // Delete product from database
    await pool.query("DELETE FROM products WHERE id=$1", [id]);

    // 204 = No content → successful deletion
    return new Response(null, { status: 204 });

  } catch (err) {
    // Database or server error
    return Response.json({ error: err.message }, { status: 500 });
  }
}
