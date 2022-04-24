export default function Grid({ children }) {
  return (
    <div
      className=""
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        gap: "1fr",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      }}
    >
      {children}
    </div>
  );
}
