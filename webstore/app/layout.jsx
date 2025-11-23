// app/layout.jsx
import HeaderClient from "./HeaderClient";

export const metadata = {
  title: "WebStore",
  description: "Web Services & Applications – E-commerce project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, Arial, sans-serif",
          background: "#f5f5f5",
        }}
      >
        {/* Header now lives in a client component */}
        <HeaderClient />

        <main
          style={{
            padding: "24px",
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
