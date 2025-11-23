/**
 * POST /api/discounts/apply
 * ----------------------------------------
 * Applies a percentage-based discount to a product.
 *
 * Requirements:
 *  - Only ADMIN users can apply discounts
 *  - A valid JWT token must be provided
 *
 * Request body (JSON):
 * {
 *   "productId": 10,
 *   "percentage": 15
 * }
 *
 * Successful Response (200):
 * {
 *   "message": "Discount applied successfully",
 *   "product": { ...updatedProduct }
 * }
 *
 * Error Responses:
 * 400 - Missing productId or percentage
 * 403 - Unauthorized (missing/invalid token or not admin)
 * 404 - Product not found
 */

import pool from "@/lib/db";
import { verifyToken, requireAdmin } from "@/lib/auth";

export async function POST(request) {
  try {
    // 1️⃣ Verify and decode JWT token
    const user = verifyToken(request);

    // 2️⃣ Only ADMIN role is allowed to apply discounts
    requireAdmin(user);

    // 3️⃣ Extract input values (product ID and discount percentage)
    const { productId, percentage } = await request.json();

    if (!productId || !percentage) {
      return Response.json(
        { message: "productId and percentage are required" },
        { status: 400 }
      );
    }

    /**
     * 4️⃣ Apply discount:
     * price = price - (price * percentage / 100)
     */
    const sql = `
      UPDATE products
      SET price = price - (price * $2 / 100)
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(sql, [productId, percentage]);

    // If no product exists with given ID
    if (result.rows.length === 0) {
      return Response.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // 5️⃣ Return updated product details
    return Response.json({
      message: "Discount applied successfully",
      product: result.rows[0],
    });

  } catch (err) {
    // Token invalid, user not admin, or other errors
    return Response.json(
      { error: err.message },
      { status: 403 }
    );
  }
}
