// app/HeaderClient.jsx
"use client";

import { useEffect, useState } from "react";

export default function HeaderClient() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check token ONLY on client side
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  return (
    <header
      style={{
        background: "#111827",
        color: "white",
        padding: "12px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <a
        href="/"
        style={{
          margin: 0,
          fontSize: "20px",
          color: "white",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        WebStore
      </a>

      <nav
        style={{
          display: "flex",
          gap: "12px",
          fontSize: "14px",
          alignItems: "center",
        }}
      >
        <a
          href="/products"
          style={{ color: "white", textDecoration: "none" }}
        >
          Products
        </a>

        {/* Only show My Orders when logged in as a client */}
        {loggedIn && (
          <a
            href="/client/orders"
            style={{ color: "white", textDecoration: "none" }}
          >
            My Orders
          </a>
        )}

        <a
          href="/admin"
          style={{ color: "white", textDecoration: "none" }}
        >
          Admin
        </a>

        {/* Show Login OR Logout */}
        {loggedIn ? (
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        ) : (
          <a
            href="/login"
            style={{ color: "white", textDecoration: "none" }}
          >
            Login
          </a>
        )}
      </nav>
    </header>
  );
}
