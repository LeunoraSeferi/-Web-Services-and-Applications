// app/admin/discounts/page.jsx
"use client";

import { useEffect, useState } from "react";
import { authGuard } from "@/app/(utils)/authGuard";

export default function DiscountsPage() {
  useEffect(() => {
    authGuard(["admin", "advanced_user"]);
  }, []);

  const [products, setProducts] = useState([]);
  const [discount, setDiscount] = useState({
    percent: "",
    start: "",
    end: "",
  });
  const [selected, setSelected] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  }

  async function applyDiscount() {
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("You must be logged in.");
      return;
    }

    const res = await fetch(`/api/products/${selected}/discount`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        discount_percent: Number(discount.percent),
        start_date: discount.start,
        end_date: discount.end,
        active: true,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Failed to apply discount");
      return;
    }

    setMessage("Discount applied successfully!");
  }

  return (
    <div>
      <h2>Apply Product Discount</h2>

      {message && (
        <p
          style={{
            padding: "10px",
            background: "#D1FAE5",
            color: "#065F46",
            borderRadius: "6px",
            marginTop: "10px",
            maxWidth: "300px",
          }}
        >
          {message}
        </p>
      )}

      <div style={{ marginTop: 20 }}>
        <label style={{ marginRight: 10 }}>Select product:</label>
        <select
          style={{ padding: 6 }}
          onChange={(e) => setSelected(e.target.value)}
          value={selected}
        >
          <option value="">Choose…</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.price}€)
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: 20 }}>
        <input
          type="number"
          placeholder="Discount %"
          value={discount.percent}
          onChange={(e) =>
            setDiscount({ ...discount, percent: e.target.value })
          }
          style={{ padding: 6, width: "120px" }}
        />

        <input
          type="date"
          style={{ padding: 6, marginLeft: 10 }}
          value={discount.start}
          onChange={(e) =>
            setDiscount({ ...discount, start: e.target.value })
          }
        />

        <input
          type="date"
          style={{ padding: 6, marginLeft: 10 }}
          value={discount.end}
          onChange={(e) => setDiscount({ ...discount, end: e.target.value })}
        />
      </div>

      <button
        onClick={applyDiscount}
        disabled={!selected}
        style={{
          marginTop: 25,
          background: "#111827",
          color: "white",
          padding: "10px 16px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Apply Discount
      </button>
    </div>
  );
}
