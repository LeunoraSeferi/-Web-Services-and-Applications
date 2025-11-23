import pool from "@/lib/db";
import { requireRole } from "@/lib/auth";

// GET /api/products/:id
export async function GET(request, context) {
  const { id } = await context.params;
  console.log("Dynamic route hit. ID =", id);

  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE id=$1",
      [id]
    );

    if (result.rows.length === 0)
      return Response.json({ message: "Not found" }, { status: 404 });

    return Response.json(result.rows[0]);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// PUT /api/products/:id
export async function PUT(request, context) {
  const { id } = await context.params;

  const roleCheck = requireRole(request, [
    "admin",
    "advanced_user",
    "simple_user",
  ]);
  if (roleCheck.error) return roleCheck.response;

  try {
    const { name, description, price, quantity } = await request.json();

    const result = await pool.query(
      `UPDATE products
       SET name=$1, description=$2, price=$3, quantity=$4
       WHERE id=$5
       RETURNING *`,
      [name, description, price, quantity, id]
    );

    if (result.rows.length === 0)
      return Response.json({ message: "Not found" }, { status: 404 });

    return Response.json(result.rows[0]);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/products/:id
export async function DELETE(request, context) {
  const { id } = await context.params;

  const roleCheck = requireRole(request, ["admin"]);
  if (roleCheck.error) return roleCheck.response;

  try {
    await pool.query("DELETE FROM products WHERE id=$1", [id]);
    return new Response(null, { status: 204 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
