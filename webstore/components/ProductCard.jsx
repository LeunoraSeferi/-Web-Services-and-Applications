// components/ProductCard.jsx
export default function ProductCard({ product, onAddToCart }) {
  const price = Number(product.price);
  const discountPercent = Number(product.discount_percent);

  const hasDiscount = product.discount_active && discountPercent > 0;

  const finalPrice = hasDiscount
    ? (price - (price * discountPercent) / 100).toFixed(2)
    : price.toFixed(2);

  return (
    <div
      style={{
        position: "relative",
        background: "white",
        padding: 16,
        borderRadius: 8,
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
      }}
    >
      {hasDiscount && (
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            background: "black",
            color: "white",
            padding: "3px 8px",
            fontWeight: "bold",
            fontSize: "12px",
            borderRadius: 4,
            zIndex: 10,
          }}
        >
          -{discountPercent}%
        </div>
      )}

      <img
        src={product.image_url}
        alt={product.name}
        style={{
          width: "100%",
          height: 180,
          objectFit: "cover",
          borderRadius: 6,
        }}
      />

      <h3 style={{ marginTop: 10 }}>{product.name}</h3>
      <p style={{ marginTop: 4 }}>{product.description}</p>

      <div style={{ marginTop: 8 }}>
        {hasDiscount ? (
          <>
            <p
              style={{
                textDecoration: "line-through",
                color: "#9ca3af",
                margin: 0,
                fontSize: "14px",
              }}
            >
              {price.toFixed(2)} €
            </p>

            <p
              style={{
                margin: 0,
                fontSize: "18px",
                color: "#16a34a",
                fontWeight: "bold",
              }}
            >
              {finalPrice} €
            </p>
          </>
        ) : (
          <p style={{ margin: 0, fontWeight: "bold" }}>{finalPrice} €</p>
        )}
      </div>

      <button
        onClick={() => onAddToCart(product.id)}
        style={{
          marginTop: 12,
          padding: "8px 12px",
          background: "#111827",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: 4,
        }}
      >
        Add to cart
      </button>
    </div>
  );
}
