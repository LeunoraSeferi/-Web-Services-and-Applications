// app/page.jsx
export default function HomePage() {
  return (
    <div>
      <h1>Welcome to WebStore</h1>
      <p style={{ marginTop: 8 }}>
        Demo e-commerce application for the Web Services & Applications course.
      </p>

      <div style={{ marginTop: 20 }}>
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
          Browse Products
        </a>
      </div>

      <div style={{ marginTop: 30 }}>
        <h3>Demo scenario</h3>
        <ol>
          <li>Log in as <b>client</b> (e.g. simple_user) via <code>/login</code> and place an order in <code>/products</code>.</li>
          <li>Log in as <b>admin</b> and open <code>/admin/orders</code> to see & update that order.</li>
        </ol>
      </div>
    </div>
  );
}
