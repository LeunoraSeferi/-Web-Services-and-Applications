import pool from "@/lib/db";
import { verifyToken, requireAdvancedOrAdmin } from "@/lib/auth";

// ================================
// GET - View all orders 
// Allowed: admin, advanced
// ================================
export async function GET(request) {
  try {
    const user = verifyToken(request);
    requireAdvancedOrAdmin(user); // Simple user forbidden

    const orders = await pool.query(`
      SELECT 
        o.id, 
        o.client_id, 
        c.full_name, 
        o.order_date, 
        o.status
      FROM orders o
      JOIN clients c ON o.client_id = c.id
      ORDER BY o.id DESC;
    `);

    return Response.json(orders.rows);

  } catch (err) {
    return Response.json({ error: err.message }, { status: 403 });
  }
}

// ================================
// POST - Create new order
// Allowed: ALL users (admin, advanced, simple)
// ================================
export async function POST(request) {
  try {
    const user = verifyToken(request); // All roles allowed

    const { client_id, items } = await request.json();

    if (!client_id || !items || items.length === 0) {
      return Response.json(
        { message: "client_id and items[] are required" },
        { status: 400 }
      );
    }

    await pool.query("BEGIN");

    // Insert the order
    const orderRes = await pool.query(
      `INSERT INTO orders (client_id, status)
       VALUES ($1, 'Pending')
       RETURNING *`,
      [client_id]
    );

    const order = orderRes.rows[0];

    // Insert order items
    for (const item of items) {
      const { product_id, quantity } = item;

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

      await pool.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [order.id, product_id, quantity, price]
      );
    }

    await pool.query("COMMIT");

    return Response.json(
      { message: "Order created successfully", order_id: order.id },
      { status: 201 }
    );

  } catch (err) {
    await pool.query("ROLLBACK");
    return Response.json({ error: err.message }, { status: 500 });
  }
}
