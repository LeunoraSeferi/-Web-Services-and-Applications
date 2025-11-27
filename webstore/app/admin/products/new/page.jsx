"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/apiClient";

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category_id: "",
    brand_id: "",
    size_id: "",
    color_id: "",
    gender_id: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity, 10),
        category_id: parseInt(form.category_id, 10),
        brand_id: parseInt(form.brand_id, 10),
        size_id: parseInt(form.size_id, 10),
        color_id: parseInt(form.color_id, 10),
        gender_id: parseInt(form.gender_id, 10),
      };

      await apiPost("/api/products", payload);
      router.push("/admin/products");
    } catch (err) {
      setError(err.message || "Failed to create product.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Add New Product</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ maxWidth: "500px" }}>
        <div>
          <label>Name</label>
          <br />
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginTop: "0.75rem" }}>
          <label>Description</label>
          <br />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div style={{ marginTop: "0.75rem" }}>
          <label>Price</label>
          <br />
          <input
            type="number"
            step="0.01"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginTop: "0.75rem" }}>
          <label>Initial Quantity</label>
          <br />
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginTop: "0.75rem" }}>
          <label>Category ID</label>
          <br />
          <input
            type="number"
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginTop: "0.75rem" }}>
          <label>Brand ID</label>
          <br />
          <input
            type="number"
            name="brand_id"
            value={form.brand_id}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginTop: "0.75rem" }}>
          <label>Size ID</label>
          <br />
          <input
            type="number"
            name="size_id"
            value={form.size_id}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginTop: "0.75rem" }}>
          <label>Color ID</label>
          <br />
          <input
            type="number"
            name="color_id"
            value={form.color_id}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginTop: "0.75rem" }}>
          <label>Gender ID</label>
          <br />
          <input
            type="number"
            name="gender_id"
            value={form.gender_id}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          style={{ marginTop: "1rem" }}
          disabled={saving}
        >
          {saving ? "Saving..." : "Create Product"}
        </button>

        <button
          type="button"
          style={{ marginLeft: "1rem", marginTop: "1rem" }}
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
