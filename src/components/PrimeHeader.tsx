export default function PrimeHeader() {
  return (
    <header style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, borderBottom: "1px solid #38e0ff" }}>
      <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg,#38e0ff, #d4dde5)" }} />
      <h1 style={{ color: "#38e0ff", margin: 0 }}>Element of Life — Prime OS</h1>
    </header>
  );
}
