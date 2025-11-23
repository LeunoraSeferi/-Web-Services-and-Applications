/**
 * PATCH /api/orders/:id/status
 * ------------------------------------------------
 * Updates the status of an order.
 *
 * Permissions:
 *   - Allowed roles: admin, advanced_user
 *
 * Request Body:
 * {
 *   "status": "Shipped"
 * }
 *
 * Possible Status Values (Example):
 *   - Pending
 *   - Shipped
 *   - Canceled
 *   - Delivered
 *
 * Responses:
 * 200 - Status updated successfully
 * 400 - Missing status value
 * 404 - Order not found
 * 500 - Server/database errors
 */

import pool from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function PATCH(request, context) {
  const { id } = await context.params;

  //  Validate role (admin OR advanced_user only)
  const roleCheck = requireRole(request, ["admin", "advanced_user"]);
  if (roleCheck.error) return roleCheck.response;

  try {
    //  Extract new status from request body
    const { status } = await request.json();

    if (!status) {
      return Response.json(
        { error: "status is required" },
        { status: 400 }
      );
    }

    /**
     *  Update order status in the database
     * Returns:
     *  - id
     *  - client_id
     *  - updated status
     */
    const result = await pool.query(
      `
      UPDATE orders
      SET status = $1
      WHERE id = $2
      RETURNING id, client_id, status
      `,
      [status, id]
    );

    // No order with this ID exists
    if (result.rows.length === 0) {
      return Response.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    //  Success response
    return Response.json({
      message: "Order status updated successfully",
      order: result.rows[0],
    });

  } catch (err) {
    console.error("Order status update error:", err);
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
