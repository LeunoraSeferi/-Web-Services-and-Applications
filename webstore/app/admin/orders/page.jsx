// app/admin/orders/page.jsx
"use client";

import { useEffect, useState } from "react";
import { authGuard } from "@/app/(utils)/authGuard";

export default function AdminOrdersPage() {
  useEffect(() => {
    authGuard(["admin", "advanced_user"]);
  }, []);

  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Not authorized");
        return;
      }
      setOrders(data);
    } catch (err) {
      setMessage("Error loading orders: " + err.message);
    }
  }

  async function updateStatus(id, status) {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/orders/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || data.message || "Failed to update status");
      return;
    }
    alert("Order updated");
    loadOrders();
  }

  return (
    <div>
      <h2>Admin – Orders</h2>

      {message && <p style={{ color: "red" }}>{message}</p>}

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <table
          style={{
            width: "100%",
            background: "white",
            marginTop: 16,
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ background: "#f3f4f6" }}>
              <th style={{ padding: 8 }}>ID</th>
              <th style={{ padding: 8 }}>Client</th>
              <th style={{ padding: 8 }}>Date</th>
              <th style={{ padding: 8 }}>Status</th>
              <th style={{ padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td style={{ padding: 8 }}>{o.id}</td>
                <td style={{ padding: 8 }}>
                  {o.client_id} – {o.full_name}
                </td>
                <td style={{ padding: 8 }}>{o.order_date}</td>
                <td style={{ padding: 8 }}>{o.status}</td>
                <td style={{ padding: 8 }}>
                  <select
                    defaultValue={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    style={{ marginRight: 8 }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Canceled">Canceled</option>
                  </select>

                  {/* NEW: View details link */}
                  <a
                    href={`/admin/orders/${o.id}`}
                    style={{
                      padding: "4px 8px",
                      background: "#111827",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: 4,
                    }}
                  >
                    View details
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
