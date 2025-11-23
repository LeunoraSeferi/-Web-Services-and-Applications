import pool from "@/lib/db";

export async function GET(request, context) {
  try {
    // IMPORTANT FIX
    const { id } = await context.params;

    console.log("RAW ID:", id);

    const cleanId = id?.trim();
    console.log("CLEAN ID:", cleanId);

    const sql = `
      SELECT 
        p.id,
        p.name,
        p.quantity AS initial_quantity,
        COALESCE(SUM(oi.quantity), 0) AS sold_quantity,
        p.quantity - COALESCE(SUM(oi.quantity), 0) AS current_quantity
      FROM products p
      LEFT JOIN order_items oi ON oi.product_id = p.id
      WHERE p.id = $1
      GROUP BY p.id, p.name, p.quantity
    `;

    const result = await pool.query(sql, [cleanId]);

    if (result.rows.length === 0) {
      return Response.json({ message: "Product not found" }, { status: 404 });
    }

    return Response.json(result.rows[0]);

  } catch (err) {
    console.error("ERROR:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
