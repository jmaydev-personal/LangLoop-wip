export default function CardImage({ native, color, size = 110, fontSize = 42, borderRadius = 28 }) {
  const letter = native.trim()[0].toUpperCase();
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius,
      background: `linear-gradient(135deg, ${color}cc 0%, ${color}66 100%)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}>
      <span style={{
        fontSize,
        fontWeight: 800,
        color: "#fff",
        lineHeight: 1,
        userSelect: "none",
        textShadow: "0 2px 8px rgba(0,0,0,0.18)",
      }}>
        {letter}
      </span>
    </div>
  );
}
