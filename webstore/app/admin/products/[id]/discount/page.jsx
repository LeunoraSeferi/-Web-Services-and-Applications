"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiGet, apiPatch } from "@/lib/apiClient";

export default function ApplyDiscountPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  const [product, setProduct] = useState(null);
  const [discount, setDiscount] = useState({
    discount_percent: "",
    start_date: "",
    end_date: "",
    active: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await apiGet(`/api/products/${productId}`);
        setProduct(data);
      } catch (err) {
        setError(err.message || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [productId]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setDiscount(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        discount_percent: parseInt(discount.discount_percent, 10),
        start_date: discount.start_date,
        end_date: discount.end_date,
        active: discount.active
      };

      const result = await apiPatch(
        `/api/products/${productId}/discount`,
        payload
      );

      setMessage("Discount applied successfully.");
    } catch (err) {
      setError(err.message || "Failed to apply discount.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Apply Discount — Product #{productId}</h1>
      <p><b>{product.name}</b></p>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <div>
          <label>Discount Percent (%)</label>
          <br />
          <input
            name="discount_percent"
            type="number"
            value={discount.discount_percent}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginTop: "0.75rem" }}>
          <label>Start Date</label>
          <br />
          <input
            name="start_date"
            type="date"
            value={discount.start_date}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginTop: "0.75rem" }}>
          <label>End Date</label>
          <br />
          <input
            name="end_date"
            type="date"
            value={discount.end_date}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginTop: "0.75rem" }}>
          <label>
            <input
              type="checkbox"
              name="active"
              checked={discount.active}
              onChange={handleChange}
            />
            Active
          </label>
        </div>

        <button type="submit" style={{ marginTop: "1rem" }} disabled={saving}>
          {saving ? "Applying..." : "Apply Discount"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          style={{ marginLeft: "1rem", marginTop: "1rem" }}
        >
          Back
        </button>
      </form>
    </div>
  );
}
