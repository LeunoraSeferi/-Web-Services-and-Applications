/**
 * Orders API – View & Update Order by ID
 * ================================================
 * This file contains two handlers:
 *
 * GET /api/orders/:id
 *    - Allowed for: ALL logged-in users
 *    - Returns: order info + all items inside the order
 *
 * PATCH /api/orders/:id
 *    - Allowed for: admin + advanced_user
 *    - Updates the order status
 *
 * Order Status Options:
 *  - "Pending"
 *  - "Shipped"
 *  - "Canceled"
 *  - "Delivered"
 *
 * Error Responses:
 * 400 – Invalid request body or status
 * 403 – Unauthorized (invalid token or insufficient permissions)
 * 404 – Order not found
 * 500 – Server error
 */

import pool from "@/lib/db";
import { verifyToken, requireAdvancedOrAdmin } from "@/lib/auth";

// =====================================================
// GET /api/orders/:id
// Allowed for: ALL authenticated users
// =====================================================
export async function GET(request, context) {
  const { id } = await context.params;

  try {
    /**
     *  Fetch main order information
     * Includes:
     *   - order ID
     *   - client info
     *   - order date & status
     */
    const orderRes = await pool.query(
      `
      SELECT 
        o.id AS order_id, 
        o.client_id, 
        c.full_name, 
        o.status, 
        o.order_date
      FROM orders o
      JOIN clients c ON o.client_id = c.id
      WHERE o.id = $1
      `,
      [id]
    );

    if (orderRes.rows.length === 0) {
      return Response.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    /**
     *  Fetch items inside this order
     * Includes:
     *   - product details
     *   - quantity
     *   - price
     *   - total per item
     */
    const itemsRes = await pool.query(
      `
      SELECT 
        oi.product_id,
        p.name AS product_name,
        oi.quantity,
        oi.price,
        (oi.quantity * oi.price) AS total
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      WHERE oi.order_id = $1
      `,
      [id]
    );

    //  Return full order overview
    return Response.json({
      order: orderRes.rows[0],
      items: itemsRes.rows,
    });

  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

// =====================================================
// PATCH /api/orders/:id
// Allowed for: admin + advanced_user
// =====================================================
export async function PATCH(request, context) {
  const { id } = await context.params;

  try {
    //  Verify JWT + permissions
    const user = verifyToken(request);
    requireAdvancedOrAdmin(user);

    //  Extract new order status
    const { status } = await request.json();

    const validStatuses = ["Pending", "Shipped", "Canceled", "Delivered"];

    if (!validStatuses.includes(status)) {
      return Response.json(
        { message: "Invalid status" },
        { status: 400 }
      );
    }

    /**
     *  Update order status
     * Returns updated order data
     */
    const result = await pool.query(
      `
      UPDATE orders
      SET status = $1
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return Response.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    return Response.json(result.rows[0]);

  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 403 }
    );
  }
}
