// app/api/products/[id]/discount/route.js

import pool from "@/lib/db";
import { requireRole } from "@/lib/auth";

/* ============================================================
   PATCH → Apply a new discount to a product
   Roles allowed: admin, advanced_user
   ============================================================ */

export async function PATCH(request, context) {
  try {
    // ⭐ Correct: unwrap params PROMISE
    const { id: rawId } = await context.params;
    const id = Number(rawId);

    // Validate ID
    if (!id || Number.isNaN(id)) {
      return Response.json(
        { error: "Invalid product id" },
        { status: 400 }
      );
    }

    // Role check
    const roleCheck = requireRole(request, ["admin", "advanced_user"]);
    if (roleCheck.error) return roleCheck.response;

    // Parse body
    const { discount_percent, start_date, end_date, active } =
      await request.json();

    // Validate fields
    if (
      discount_percent === undefined ||
      start_date === undefined ||
      end_date === undefined
    ) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ⭐ Insert the new discount
    const result = await pool.query(
      `
      INSERT INTO discounts 
      (product_id, discount_percent, start_date, end_date, active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
      `,
      [
        id,
        Number(discount_percent),
        start_date,
        end_date,
        active ?? true,
      ]
    );

    return Response.json(
      {
        message: "Discount applied successfully",
        discount: result.rows[0],
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("DISCOUNT ERROR:", err);
    return Response.json(
      { error: "Server error: " + err.message },
      { status: 500 }
    );
  }
}


/* ============================================================
   DELETE → Remove the ACTIVE discount from a product
   Roles allowed: admin, advanced_user
   ============================================================ */

export async function DELETE(request, context) {
  try {
    // unwrap params
    const { id: rawId } = await context.params;
    const id = Number(rawId);

    if (!id || Number.isNaN(id)) {
      return Response.json(
        { error: "Invalid product id" },
        { status: 400 }
      );
    }

    // Role check
    const roleCheck = requireRole(request, ["admin", "advanced_user"]);
    if (roleCheck.error) return roleCheck.response;

    // Delete only active discount for this product
    const result = await pool.query(
      `
      DELETE FROM discounts
      WHERE product_id = $1
      AND active = TRUE
      RETURNING *;
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return Response.json(
        { message: "No active discount found to delete" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        message: "Discount deleted successfully",
        deleted: result.rows[0],
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE DISCOUNT ERROR:", err);
    return Response.json(
      { error: "Server error: " + err.message },
      { status: 500 }
    );
  }
}
