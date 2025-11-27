"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiGet, apiPatch } from "@/lib/apiClient";

export default function UpdateStockPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  const [product, setProduct] = useState(null);
  const [newQuantity, setNewQuantity] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        setError("");
        setLoading(true);
        const data = await apiGet(`/api/products/${productId}`);
        setProduct(data);
        setNewQuantity(String(data.quantity));
      } catch (err) {
        setError(err.message || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    }

    if (productId) fetchProduct();
  }, [productId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    try {
      const payload = {
        quantity: parseInt(newQuantity, 10),
      };
      const res = await apiPatch(
        `/api/products/${productId}/stock`,
        payload
      );
      setMessage(res.message || "Stock updated successfully.");
      // Optionally refresh product data
      setProduct((prev) =>
        prev ? { ...prev, quantity: payload.quantity } : prev
      );
    } catch (err) {
      setError(err.message || "Failed to update stock.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div style={{ padding: "2rem" }}>Loading...</div>;
  if (!product) return <div style={{ padding: "2rem" }}>Product not found.</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Update Stock — Product #{productId}</h1>
      <p>
        <strong>{product.name}</strong> (Current quantity:{" "}
        {product.quantity})
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <form onSubmit={handleSubmit} style={{ maxWidth: "300px" }}>
        <div>
          <label>New Quantity</label>
          <br />
          <input
            type="number"
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          style={{ marginTop: "1rem" }}
          disabled={saving}
        >
          {saving ? "Updating..." : "Update Stock"}
        </button>

        <button
          type="button"
          style={{ marginLeft: "1rem", marginTop: "1rem" }}
          onClick={() => router.push("/admin/products")}
        >
          Back
        </button>
      </form>
    </div>
  );
}
