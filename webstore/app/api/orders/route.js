/**
 * Orders API – List All Orders / Create New Order
 * =========================================================
 *
 *  GET /api/orders
 *    - Permissions: admin, advanced_user
 *    - Description: Returns all orders with client info.
 *
 *  POST /api/orders
 *    - Permissions: ALL authenticated users
 *    - Description:
 *        Creates a new order, inserts all order items,
 *        and runs inside a SQL transaction.
 *
 * Request Body for POST:
 * {
 *   "client_id": 3,
 *   "items": [
 *       { "product_id": 1, "quantity": 2 },
 *       { "product_id": 4, "quantity": 1 }
 *   ]
 * }
 *
 * Responses:
 * 200/201 - Success
 * 400     - Missing fields
 * 403     - No permission
 * 404     - Product not found
 * 500     - Server error
 */

import pool from "@/lib/db";
import { verifyToken, requireAdvancedOrAdmin } from "@/lib/auth";

// =====================================================
// GET – View all orders
// Allowed: admin + advanced_user
// =====================================================
export async function GET(request) {
  try {
    //  Check user authentication + role
    const user = verifyToken(request);
    requireAdvancedOrAdmin(user);

    /**
     * Query returns orders with client name,
     * sorted newest → oldest.
     */
    const orders = await pool.query(`
      SELECT 
        o.id, 
        o.client_id, 
        c.full_name, 
        o.order_date, 
        o.status
      FROM orders o
      JOIN clients c ON o.client_id = c.id
      ORDER BY o.id DESC
    `);

    return Response.json(orders.rows);

  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 403 }
    );
  }
}

// =====================================================
// POST – Create a new order
// Allowed: ALL authenticated users
// =====================================================
export async function POST(request) {
  try {
    //  All roles allowed → verify token only
    const user = verifyToken(request);

    //  Extract order input values
    const { client_id, items } = await request.json();

    if (!client_id || !items || items.length === 0) {
      return Response.json(
        { message: "client_id and items[] are required" },
        { status: 400 }
      );
    }

    //  Start SQL transaction (important for multi-step operations)
    await pool.query("BEGIN");

    /**
     *  Insert order (default status = 'Pending')
     */
    const orderRes = await pool.query(
      `
      INSERT INTO orders (client_id, status)
      VALUES ($1, 'Pending')
      RETURNING *
      `,
      [client_id]
    );

    const order = orderRes.rows[0];

    /**
     *  Loop through each item and insert into order_items
     */
    for (const item of items) {
      const { product_id, quantity } = item;

      // Check product exists + get price
      const priceRes = await pool.query(
        "SELECT price FROM products WHERE id=$1",
        [product_id]
      );

      if (priceRes.rows.length === 0) {
        await pool.query("ROLLBACK");
        return Response.json(
          { message: `Product ${product_id} not found` },
          { status: 404 }
        );
      }

      const price = priceRes.rows[0].price;

      // Insert into order_items
      await pool.query(
        `
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES ($1, $2, $3, $4)
        `,
        [order.id, product_id, quantity, price]
      );
    }

    //  Commit transaction (success)
    await pool.query("COMMIT");

    return Response.json(
      {
        message: "Order created successfully",
        order_id: order.id,
      },
      { status: 201 }
    );

  } catch (err) {
    // Any error → rollback transaction
    await pool.query("ROLLBACK");

    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
