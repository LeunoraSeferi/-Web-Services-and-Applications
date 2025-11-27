"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiGet } from "@/lib/apiClient";

export default function ProductQuantityPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setError("");
        const result = await apiGet(`/api/products/${productId}/quantity`);
        setData(result);
      } catch (err) {
        setError(err.message || "Failed to load quantity.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [productId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!data) return <p>No data found.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Product Real-Time Quantity</h1>
      <p><b>{data.name}</b></p>

      <table border="1" cellPadding="8" cellSpacing="0">
        <tbody>
          <tr>
            <td>Initial Quantity</td>
            <td>{data.initial_quantity}</td>
          </tr>
          <tr>
            <td>Sold Quantity</td>
            <td>{data.sold_quantity}</td>
          </tr>
          <tr>
            <td>Current Quantity</td>
            <td><b>{data.current_quantity}</b></td>
          </tr>
        </tbody>
      </table>

      <button
        style={{ marginTop: "1rem" }}
        onClick={() => router.push("/admin/products")}
      >
        Back
      </button>
    </div>
  );
}
