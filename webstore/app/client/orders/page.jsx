// app/client/orders/page.jsx
"use client";

import { useEffect, useState } from "react";

export default function ClientOrdersPage() {
  const [client, setClient] = useState(null);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("You must be logged in to see your orders.");
        return;
      }

      const res = await fetch("/api/client/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to load orders.");
        return;
      }

      setClient(data.client);
      setOrders(data.orders);
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  }

  return (
    <div>
      <h2>My Orders</h2>

      {message && (
        <p style={{ marginTop: 10, color: "red" }}>{message}</p>
      )}

      {client && (
        <p style={{ marginTop: 8 }}>
          Logged in as client: <b>{client.full_name}</b> (ID: {client.id})
        </p>
      )}

      {orders.length === 0 ? (
        <p style={{ marginTop: 16 }}>You have no orders yet.</p>
      ) : (
        <table
          style={{
            marginTop: 16,
            width: "100%",
            background: "white",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ background: "#f3f4f6" }}>
              <th style={{ padding: 8 }}>Order ID</th>
              <th style={{ padding: 8 }}>Date</th>
              <th style={{ padding: 8 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td style={{ padding: 8 }}>{o.id}</td>
                <td style={{ padding: 8 }}>{o.order_date}</td>
                <td style={{ padding: 8 }}>{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
