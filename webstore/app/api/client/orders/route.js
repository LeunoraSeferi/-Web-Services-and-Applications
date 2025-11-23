// app/api/client/orders/route.js
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(request) {
  try {
    // 1) Get logged-in user from token
    const user = verifyToken(request); // { id, role }

    // 2) Find client row for this user
    const clientRes = await pool.query(
      "SELECT id, full_name FROM clients WHERE user_id = $1",
      [user.id]
    );

    if (clientRes.rows.length === 0) {
      return Response.json(
        { error: "No client record found for this user." },
        { status: 404 }
      );
    }

    const client = clientRes.rows[0];

    // 3) Get orders for this client
    const ordersRes = await pool.query(
      `
      SELECT 
        o.id,
        o.order_date,
        o.status
      FROM orders o
      WHERE o.client_id = $1
      ORDER BY o.id DESC
      `,
      [client.id]
    );

    return Response.json({
      client,
      orders: ordersRes.rows,
    });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
