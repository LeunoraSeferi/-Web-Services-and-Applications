// app/admin/page.jsx
"use client";

import { useEffect } from "react";
import { authGuard } from "@/app/(utils)/authGuard";

export default function AdminDashboard() {
  useEffect(() => {
    authGuard(["admin", "advanced_user"]);
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p style={{ marginTop: 8 }}>Welcome to the admin panel.</p>

      <div
        style={{
          marginTop: 20,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
       
        <a href="/admin/products" style={cardStyle}>
          Manage Products
        </a>

        <a href="/admin/orders" style={cardStyle}>
          Manage Orders
        </a>

        <a href="/admin/users" style={cardStyle}>
          Manage Users
        </a>

        <a href="/admin/reports" style={cardStyle}>
          View Reports
        </a>

        <a href="/admin/discounts" style={cardStyle}>
          Apply Discounts
        </a>
      </div>
    </div>
  );
}

const cardStyle = {
  padding: 20,
  background: "#f3f4f6",
  borderRadius: 8,
  textDecoration: "none",
  color: "#111827",
  fontWeight: "bold",
  textAlign: "center",
};
