import pool from "@/lib/db";
import { verifyToken, requireAdvancedOrAdmin } from "@/lib/auth";

// ================================
// GET /api/orders/:id
// Allowed: ALL logged users
// ================================
export async function GET(request, context) {
  const { id } = await context.params; // FIXED

  try {
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
      return Response.json({ message: "Order not found" }, { status: 404 });
    }

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

    return Response.json({
      order: orderRes.rows[0],
      items: itemsRes.rows,
    });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// ================================
// PATCH /api/orders/:id
// Allowed: admin + advanced_user
// ================================
export async function PATCH(request, context) {
  const { id } = await context.params; // FIXED

  try {
    const user = verifyToken(request);
    requireAdvancedOrAdmin(user);

    const { status } = await request.json();

    const validStatuses = ["Pending", "Shipped", "Canceled", "Delivered"];

    if (!validStatuses.includes(status)) {
      return Response.json({ message: "Invalid status" }, { status: 400 });
    }

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
      return Response.json({ message: "Order not found" }, { status: 404 });
    }

    return Response.json(result.rows[0]);

  } catch (err) {
    return Response.json({ error: err.message }, { status: 403 });
  }
}
