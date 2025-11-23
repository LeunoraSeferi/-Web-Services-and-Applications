// components/ProductFilters.jsx
export default function ProductFilters({ filters, onChangeFilters, onSearch }) {
  return (
    <div
      style={{
        background: "white",
        padding: "12px",
        borderRadius: "8px",
        marginTop: "10px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "10px",
      }}
    >
      <input
        placeholder="Category"
        value={filters.category}
        onChange={(e) => onChangeFilters({ ...filters, category: e.target.value })}
      />
      <input
        placeholder="Gender"
        value={filters.gender}
        onChange={(e) => onChangeFilters({ ...filters, gender: e.target.value })}
      />
      <input
        placeholder="Brand"
        value={filters.brand}
        onChange={(e) => onChangeFilters({ ...filters, brand: e.target.value })}
      />
      <input
        placeholder="Size"
        value={filters.size}
        onChange={(e) => onChangeFilters({ ...filters, size: e.target.value })}
      />
      <input
        placeholder="Color"
        value={filters.color}
        onChange={(e) => onChangeFilters({ ...filters, color: e.target.value })}
      />
      <input
        type="number"
        placeholder="Price min"
        value={filters.priceMin}
        onChange={(e) => onChangeFilters({ ...filters, priceMin: e.target.value })}
      />
      <input
        type="number"
        placeholder="Price max"
        value={filters.priceMax}
        onChange={(e) => onChangeFilters({ ...filters, priceMax: e.target.value })}
      />
      <button
        onClick={onSearch}
        style={{
          padding: "6px 10px",
          background: "#111827",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Search
      </button>
    </div>
  );
}
