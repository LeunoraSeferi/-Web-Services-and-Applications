import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM products");
    return Response.json(result.rows[0]);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
