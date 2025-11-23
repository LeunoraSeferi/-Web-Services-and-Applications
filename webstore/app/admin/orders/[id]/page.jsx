"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // ⬅ IMPORTANT
import { authGuard } from "@/app/(utils)/authGuard";

export default function AdminOrderDetailsPage() {
  const params = useParams();       // ⬅ FIX
  const id = params.id;             // ⬅ FIXED orderId from URL

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  // Run auth guard once
  useEffect(() => {
    authGuard(["admin", "advanced_user"]);
  }, []);

  // Load order when id is available
  useEffect(() => {
    if (id) loadOrder();
  }, [id]);

  async function loadOrder() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to load order.");
        return;
      }

      setOrder(data.order);
      setItems(data.items);

    } catch (err) {
      setMessage("Error loading order: " + err.message);
    }
  }

  function getTotal() {
    return items.reduce((sum, it) => {
      return sum + Number(it.price) * it.quantity;
    }, 0);
  }

  return (
    <div>
      <h2>Order Details – #{id}</h2>

      {message && (
        <p style={{ marginTop: 10, color: "red" }}>{message}</p>
      )}

      {!order ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* ORDER INFO */}
          <section
            style={{
              marginTop: 16,
              background: "white",
              padding: 16,
              borderRadius: 8,
            }}
          >
            <h3>Order Info</h3>
            <p><b>Order ID:</b> {order.id || order.order_id}</p>
            <p><b>Status:</b> {order.status}</p>
            <p><b>Date:</b> {order.order_date}</p>
          </section>

          {/* CLIENT INFO */}
          <section
            style={{
              marginTop: 16,
              background: "white",
              padding: 16,
              borderRadius: 8,
            }}
          >
            <h3>Client Info</h3>
            <p><b>Client ID:</b> {order.client_id}</p>
            <p><b>Client Name:</b> {order.full_name}</p>
          </section>

          {/* ITEMS */}
          <section
            style={{
              marginTop: 16,
              background: "white",
              padding: 16,
              borderRadius: 8,
            }}
          >
            <h3>Items</h3>

            {items.length === 0 ? (
              <p>No items.</p>
            ) : (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr style={{ background: "#f3f4f6" }}>
                    <th style={{ padding: 8, textAlign: "left" }}>Product</th>
                    <th style={{ padding: 8 }}>Qty</th>
                    <th style={{ padding: 8 }}>Price (€)</th>
                    <th style={{ padding: 8 }}>Total (€)</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: 8 }}>
                        {it.product_name} (ID: {it.product_id})
                      </td>
                      <td style={{ padding: 8, textAlign: "center" }}>
                        {it.quantity}
                      </td>
                      <td style={{ padding: 8, textAlign: "right" }}>
                        {it.price}
                      </td>
                      <td style={{ padding: 8, textAlign: "right" }}>
                        {Number(it.price) * it.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <p style={{ marginTop: 12, fontWeight: "bold" }}>
              Order Total: {getTotal()} €
            </p>
          </section>
        </>
      )}
    </div>
  );
}
