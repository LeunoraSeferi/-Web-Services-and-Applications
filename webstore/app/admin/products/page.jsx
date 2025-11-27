"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  apiGet,
  apiDelete,
} from "@/lib/apiClient";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // For advanced search filters:
  const [filters, setFilters] = useState({
    gender: "",
    category: "",
    brand: "",
    size: "",
    color: "",
    price_min: "",
    price_max: "",
    available: "",
  });

  // Load all products initially
  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");
      const data = await apiGet("/api/products");
      setProducts(data);
    } catch (err) {
      setError(err.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

  function handleAddProduct() {
    router.push("/admin/products/new");
  }

  function handleEditProduct(id) {
    router.push(`/admin/products/${id}/edit`);
  }

  async function handleDeleteProduct(id) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      setError("");
      await apiDelete(`/api/products/${id}`);
      // Refresh list
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete product.");
    }
  }

  function handleUpdateStock(id) {
    router.push(`/admin/products/${id}/stock`);
  }

  function handleApplyDiscount(id) {
    router.push(`/admin/products/${id}/discount`);
  }

  function handleViewQuantity(id) {
    router.push(`/admin/products/${id}/quantity`);
  }

  // Advanced Search
  async function handleSearch(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.trim() !== "") {
          params.append(key, value);
        }
      });

      const path =
        params.toString().length > 0
          ? `/api/products/search?${params.toString()}`
          : "/api/products";

      const data = await apiGet(path);
      setProducts(data);
    } catch (err) {
      setError(err.message || "Failed to search products.");
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin Product Management</h1>

      {/* Error & info */}
      {error && (
        <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>
      )}

      {/* ACTIONS */}
      <div style={{ margin: "1rem 0" }}>
        <button onClick={handleAddProduct}>+ Add New Product</button>
        <button onClick={loadProducts} style={{ marginLeft: "1rem" }}>
          Refresh List
        </button>
      </div>

      {/* ADVANCED SEARCH FORM */}
      <section
        style={{
          border: "1px solid #ccc",
          padding: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <h2>Advanced Search</h2>
        <form onSubmit={handleSearch}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <label>Gender</label>
              <br />
              <input
                name="gender"
                placeholder="Men, Women..."
                value={filters.gender}
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <label>Category</label>
              <br />
              <input
                name="category"
                placeholder="Shirts, Jackets..."
                value={filters.category}
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <label>Brand</label>
              <br />
              <input
                name="brand"
                placeholder="Nike, Zara..."
                value={filters.brand}
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <label>Size</label>
              <br />
              <input
                name="size"
                placeholder="S, M, L..."
                value={filters.size}
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <label>Color</label>
              <br />
              <input
                name="color"
                placeholder="Red, Blue..."
                value={filters.color}
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <label>Price Min</label>
              <br />
              <input
                type="number"
                step="0.01"
                name="price_min"
                value={filters.price_min}
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <label>Price Max</label>
              <br />
              <input
                type="number"
                step="0.01"
                name="price_max"
                value={filters.price_max}
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <label>Available</label>
              <br />
              <select
                name="available"
                value={filters.available}
                onChange={handleFilterChange}
              >
                <option value="">(All)</option>
                <option value="true">In Stock</option>
                <option value="false">Out of Stock</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <button type="submit">Search</button>
            <button
              type="button"
              style={{ marginLeft: "1rem" }}
              onClick={() => {
                setFilters({
                  gender: "",
                  category: "",
                  brand: "",
                  size: "",
                  color: "",
                  price_min: "",
                  price_max: "",
                  available: "",
                });
                loadProducts();
              }}
            >
              Reset Filters
            </button>
          </div>
        </form>
      </section>

      {/* PRODUCT TABLE */}
      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table
          border="1"
          cellPadding="8"
          cellSpacing="0"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Size</th>
              <th>Color</th>
              <th>Gender</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={`${p.id}-${p.name}`}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.category || p.category_id}</td>
                <td>{p.brand || p.brand_id}</td>
                <td>{p.size || p.size_id}</td>
                <td>{p.color || p.color_id}</td>
                <td>{p.gender || p.gender_id}</td>
                <td>{p.price}</td>
                <td>{p.quantity}</td>
                <td>
                  <button onClick={() => handleEditProduct(p.id)}>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    style={{ marginLeft: "0.5rem" }}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleUpdateStock(p.id)}
                    style={{ marginLeft: "0.5rem" }}
                  >
                    Stock
                  </button>
                  <button
                    onClick={() => handleApplyDiscount(p.id)}
                    style={{ marginLeft: "0.5rem" }}
                  >
                    Discount
                  </button>
                  <button
                    onClick={() => handleViewQuantity(p.id)}
                    style={{ marginLeft: "0.5rem" }}
                  >
                    Quantity
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
