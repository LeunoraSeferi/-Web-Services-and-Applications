// app/checkout/success/page.jsx
"use client";

export default function CheckoutSuccessPage() {
  const orderId =
    typeof window !== "undefined"
      ? localStorage.getItem("last_order_id")
      : null;

  return (
    <div
      style={{
        background: "white",
        padding: "24px",
        borderRadius: "8px",
        boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
        maxWidth: "600px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <h1>Order Successful 🎉</h1>

      {orderId ? (
        <p style={{ marginTop: 10 }}>
          Your order has been placed successfully.  
          <br />
          <strong>Order ID: {orderId}</strong>
        </p>
      ) : (
        <p>No order ID found.</p>
      )}

      <div style={{ marginTop: 30, display: "flex", gap: "16px", justifyContent: "center" }}>
        <a
          href="/products"
          style={{
            padding: "10px 16px",
            background: "#111827",
            color: "white",
            textDecoration: "none",
            borderRadius: "6px",
          }}
        >
          Continue Shopping
        </a>

        <a
          href="/client/orders"
          style={{
            padding: "10px 16px",
            background: "#047857",
            color: "white",
            textDecoration: "none",
            borderRadius: "6px",
          }}
        >
          View My Orders
        </a>
      </div>
    </div>
  );
}
