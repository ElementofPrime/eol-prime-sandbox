export default function PrimeHeader() {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: 16,
        background: "transparent",   // 🔹 no background fill
        border: "none",               // 🔹 no border at all
        boxShadow: "none",            // 🔹 no drop shadow
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: "linear-gradient(135deg,rgba(56,224,255,0.6), rgba(212,221,229,0.3))", // softer translucent icon
        }}
      />
      <h1 style={{ color: "#38e0ff", margin: 0 }}>Element of Life — Prime OS</h1>
    </header>
  );
}
