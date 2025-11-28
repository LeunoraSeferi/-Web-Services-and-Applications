// app/products/page.jsx
"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import Cart from "@/components/Cart";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    gender: "",
    category: "",
    brand: "",
    size: "",
    color: "",
    priceMin: "",
    priceMax: "",
  });
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  // ================================
  // LOAD PRODUCTS + NORMALIZE
  // ================================
  async function loadProducts(query = "") {
    try {
      const url = query ? `/api/products/search${query}` : "/api/products";
      const res = await fetch(url);
      const data = await res.json();

      // ⭐ Normalize discount
      const normalized = data.map((p) => ({
        ...p,
        discount_percent:
          p.discount_percent !== null ? Number(p.discount_percent) : 0,
        discount_active: p.discount_active === true,
        price: Number(p.price),
      }));

      setProducts(normalized);
    } catch (err) {
      console.error("Error loading products:", err);
    }
  }

  function buildQuery() {
    const params = new URLSearchParams();

    if (filters.gender) params.append("gender", filters.gender);
    if (filters.category) params.append("category", filters.category);
    if (filters.brand) params.append("brand", filters.brand);
    if (filters.size) params.append("size", filters.size);
    if (filters.color) params.append("color", filters.color);
    if (filters.priceMin) params.append("price_min", filters.priceMin);
    if (filters.priceMax) params.append("price_max", filters.priceMax);

    const qs = params.toString();
    return qs ? `?${qs}` : "";
  }

  async function handleSearch() {
    const query = buildQuery();
    await loadProducts(query);
  }

  // ================================
  // ADD TO CART
  // ================================
  function addToCart(productId) {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product_id === productId);

      if (existing) {
        return prev.map((item) =>
          item.product_id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { product_id: productId, quantity: 1 }];
    });
  }

  // ================================
  // CREATE ORDER
  // ================================
  async function handleCreateOrder() {
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("You must log in to place an order.");
      return;
    }

    if (cartItems.length === 0) {
      setMessage("Cart is empty.");
      return;
    }

    const client_id = Number(localStorage.getItem("client_id"));
    if (!client_id) {
      setMessage("Your account is not registered as a client.");
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ client_id, items: cartItems }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || data.error || "Order failed");
        return;
      }

      setMessage(`Order created successfully! Order ID: ${data.order_id}`);
      setCartItems([]);
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  }

  return (
    <div>
      <h2>Products</h2>

      <ProductFilters
        filters={filters}
        onChangeFilters={setFilters}
        onSearch={handleSearch}
      />

      {message && (
        <p style={{ marginTop: 12, background: "#fee2e2", padding: 8 }}>
          {message}
        </p>
      )}

      {/* PRODUCT GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "16px",
          marginTop: "16px",
        }}
      >
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
        ))}
      </div>

      <Cart
        cartItems={cartItems}
        products={products}
        onPlaceOrder={handleCreateOrder}
      />
    </div>
  );
}
