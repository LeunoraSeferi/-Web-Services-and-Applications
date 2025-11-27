// app/admin/reports/page.jsx
"use client";

import { useEffect, useState } from "react";
import { authGuard } from "@/app/(utils)/authGuard";

export default function AdminReportsPage() {
  useEffect(() => {
    authGuard(["admin", "advanced_user"]);
  }, []);

  const [daily, setDaily] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [message, setMessage] = useState("");

  // NEW STATES FOR MONTH PICKER
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedMonthEarnings, setSelectedMonthEarnings] = useState(null);
  const [monthError, setMonthError] = useState("");

  useEffect(() => {
    async function loadReports() {
      setMessage("");

      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        setMessage("You must be logged in as admin/advanced to view reports.");
        return;
      }

      try {
        const dailyRes = await fetch("/api/reports/daily", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dailyData = await dailyRes.json();
        if (dailyRes.ok) setDaily(dailyData);

        const monthlyRes = await fetch("/api/reports/monthly", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const monthlyData = await monthlyRes.json();
        if (monthlyRes.ok) setMonthly(monthlyData);

        const topRes = await fetch("/api/reports/top-products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const topData = await topRes.json();
        if (topRes.ok) setTopProducts(topData);
      } catch (err) {
        setMessage("Error loading reports: " + err.message);
      }
    }

    loadReports();
  }, []);

  // --- NEW FUNCTION FOR MONTH SELECTION ---
  function handleMonthChange(e) {
    const value = e.target.value; // format: "YYYY-MM"
    setSelectedMonth(value);
    setMonthError("");

    if (!value) {
      setSelectedMonthEarnings(null);
      return;
    }

    const found = monthly.find((m) => m.month === value);

    if (found) {
      setSelectedMonthEarnings(found.monthly_earnings);
    } else {
      setSelectedMonthEarnings("0.00");
      setMonthError("No data for this month. Earnings assumed 0 €.");
    }
  }

  return (
    <div>
      <h2>Admin Reports</h2>

      {message && (
        <p
          style={{
            padding: "10px",
            background: "#fee2e2",
            color: "#b91c1c",
            borderRadius: "6px",
            maxWidth: "400px",
          }}
        >
          {message}
        </p>
      )}

      {/* DAILY EARNINGS */}
      <section style={{ marginTop: "20px" }}>
        <h3>Daily Earnings (Today)</h3>
        <p>
          {daily ? `${daily.daily_earnings} €` : "No data or not authorized."}
        </p>
      </section>

      {/* MONTH SELECTOR (NEW FEATURE) */}
      <section style={{ marginTop: "40px" }}>
        <h3>Monthly Earnings – Select Month</h3>

        <p style={{ marginBottom: "10px" }}>
          Use the month picker to view earnings for any month.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {/* Month picker input */}
          <div>
            <label style={{ fontWeight: "600" }}>Choose Month:</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={handleMonthChange}
              style={{
                padding: "8px 10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                marginTop: "6px",
              }}
            />
          </div>

          {/* Earnings box */}
          {selectedMonthEarnings !== null && (
            <div
              style={{
                padding: "12px 16px",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                background: "#fafafa",
                minWidth: "240px",
              }}
            >
              <div style={{ fontWeight: "600" }}>
                Month: {selectedMonth || "—"}
              </div>
              <div>
                <strong>Earnings (€):</strong> {selectedMonthEarnings}
              </div>
            </div>
          )}
        </div>

        {monthError && (
          <p style={{ color: "red", marginTop: "8px" }}>{monthError}</p>
        )}
      </section>

      {/* OLD MONTHLY TABLE (KEPT FOR HISTORY / ASSIGNMENT REQUIREMENTS) */}
      <section style={{ marginTop: "40px" }}>
        <h3>Monthly Earnings (Full Table)</h3>

        {monthly.length === 0 && <p>No data available.</p>}

        {monthly.length > 0 && (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "white",
              marginTop: "10px",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <thead style={{ background: "#f3f4f6" }}>
              <tr>
                <th
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #e5e7eb",
                    textAlign: "left",
                  }}
                >
                  Month
                </th>
                <th
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #e5e7eb",
                    textAlign: "right",
                  }}
                >
                  Earnings (€)
                </th>
              </tr>
            </thead>

            <tbody>
              {monthly.map((row) => (
                <tr key={row.month}>
                  <td style={{ padding: "10px" }}>{row.month}</td>
                  <td style={{ padding: "10px", textAlign: "right" }}>
                    {row.monthly_earnings}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* TOP PRODUCTS */}
      <section style={{ marginTop: "40px" }}>
        <h3>Top 5 Products</h3>

        {topProducts.length === 0 && <p>No data available.</p>}

        {topProducts.length > 0 && (
          <ul style={{ marginTop: "10px" }}>
            {topProducts.map((p) => (
              <li key={p.id} style={{ padding: "5px 0" }}>
                <strong>{p.name}</strong> – sold: {p.total_sold}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
