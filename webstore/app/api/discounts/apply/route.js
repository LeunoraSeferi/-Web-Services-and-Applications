// app/api/discounts/apply/route.js
import pool from "@/lib/db";
import { verifyToken, requireAdmin } from "@/lib/auth";

export async function POST(request) {
  try {
    // 1️⃣ Verify JWT token
    const user = verifyToken(request);

    // 2️⃣ Only ADMIN can apply discounts
    requireAdmin(user);

    // 3️⃣ Extract request body
    const { productId, percentage } = await request.json();

    if (!productId || !percentage) {
      return Response.json(
        { message: "productId and percentage are required" },
        { status: 400 }
      );
    }

    // 4️⃣ Update product price
    const sql = `
      UPDATE products
      SET price = price - (price * $2 / 100)
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(sql, [productId, percentage]);

    if (result.rows.length === 0) {
      return Response.json({ message: "Product not found" }, { status: 404 });
    }

    // 5️⃣ Return updated product
    return Response.json({
      message: "Discount applied successfully",
      product: result.rows[0],
    });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 403 });
  }
}
