export default function ProductCard({ product, onAddToCart }) {
  return (
    <div
      style={{
        background: "white",
        padding: 16,
        borderRadius: 8,
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
      }}
    >
      {/* Image */}
      <img
        src={product.image_url}   // ← DIRECTLY use DB value
        alt={product.name}
        style={{
          width: "100%",
          height: 180,
          objectFit: "cover",
          borderRadius: 6,
        }}
      />

      {/* Name */}
      <h3>{product.name}</h3>

      {/* Description */}
      <p>{product.description}</p>

      {/* Price */}
      <p>
        <strong>{product.price} €</strong>
      </p>

      {/* Add to cart */}
      <button
        onClick={() => onAddToCart(product.id)}
        style={{
          marginTop: 12,
          padding: "8px 12px",
          background: "#111827",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Add to cart
      </button>
    </div>
  );
}
