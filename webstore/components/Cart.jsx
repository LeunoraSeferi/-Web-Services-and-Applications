// components/Cart.jsx
export default function Cart({ cartItems, products }) {
  function goToCheckout() {
    // Save cart items so checkout page can read them
    localStorage.setItem("cart_items", JSON.stringify(cartItems));
    window.location.href = "/checkout";
  }

  return (
    <div
      style={{
        marginTop: 24,
        background: "white",
        padding: 16,
        borderRadius: 8,
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
      }}
    >
      <h3>Cart</h3>

      {cartItems.length === 0 && <p>No items in cart.</p>}

      {cartItems.length > 0 && (
        <>
          <ul>
            {cartItems.map((item) => {
              const prod = products.find((p) => p.id === item.product_id);
              return (
                <li key={item.product_id}>
                  {prod ? prod.name : "Product"} – qty: {item.quantity}
                </li>
              );
            })}
          </ul>

          <button
            onClick={goToCheckout}
            style={{
              marginTop: 12,
              padding: "10px 14px",
              background: "#047857",
              border: "none",
              color: "white",
              cursor: "pointer",
              borderRadius: 4,
            }}
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}
