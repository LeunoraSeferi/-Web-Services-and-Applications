"use client";

import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  // Client form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart_items") || "[]");
    setCartItems(cart);
    loadProducts();
  }, []);

  async function loadProducts() {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  }

  function getTotal() {
    return cartItems.reduce((sum, item) => {
      const p = products.find((x) => x.id === item.product_id);
      return p ? sum + p.price * item.quantity : sum;
    }, 0);
  }

  async function placeOrder() {
    setMessage("");

    const token = localStorage.getItem("token");
    const client_id = Number(localStorage.getItem("client_id"));

    if (!token) {
      setMessage("You must log in.");
      return;
    }
    if (!client_id) {
      setMessage("Your account is not registered as a client.");
      return;
    }

    // Validate form
    if (!fullName || !email || !phone || !address) {
      setMessage("Please fill all fields.");
      return;
    }

    // Save client details (optional)
    localStorage.setItem("client_fullname", fullName);
    localStorage.setItem("client_email", email);
    localStorage.setItem("client_phone", phone);
    localStorage.setItem("client_address", address);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        client_id,
        items: cartItems,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Order failed");
      return;
    }

  
    localStorage.setItem("last_order_id", data.order_id);

    // Clear cart
    localStorage.removeItem("cart_items");


    window.location.href = "/checkout/success";
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 20 }}>
      <h2>Checkout</h2>

      {message && (
        <p style={{ background: "#fee2e2", padding: 10, marginTop: 10 }}>
          {message}
        </p>
      )}

      <h3 style={{ marginTop: 20 }}>Your Information</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
        <input
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={{ padding: 8 }}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 8 }}
        />
        <input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ padding: 8 }}
        />
        <textarea
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ padding: 8, height: 80 }}
        />
      </div>

      <h3 style={{ marginTop: 30 }}>Your Cart</h3>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((item) => {
            const p = products.find((x) => x.id === item.product_id);
            return (
              <li key={item.product_id}>
                {p?.name} — qty: {item.quantity} — {p?.price} €
              </li>
            );
          })}
        </ul>
      )}

      <h3 style={{ marginTop: 20 }}>Total: {getTotal()} €</h3>

      <button
        onClick={placeOrder}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          background: "#111827",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Confirm Order
      </button>
    </div>
  );
}
