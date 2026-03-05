import { findDeck } from "../lib/findDeck";
import { getTheme } from "../lib/theme";
import CardImage from "../components/CardImage";

export default function PreviewScreen({ categoryId, dark, onBack, onStart }) {
  const cat = findDeck(categoryId);
  const t = getTheme(dark);

  return (
    <div style={{ minHeight: "100vh", background: t.pageBg, fontFamily: "'Segoe UI', sans-serif", padding: "24px 16px 100px" }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button
            onClick={onBack}
            style={{ background: t.cardBg, border: "none", borderRadius: 12, width: 40, height: 40, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: t.btnShadow, color: t.textPrimary, flexShrink: 0 }}
          >←</button>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 22 }}>{cat.emoji}</span>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: t.textPrimary }}>{cat.label}</h2>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: t.textMuted }}>{cat.vocab.length} phrases · Vietnamese</p>
          </div>
        </div>

        {/* Card list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {cat.vocab.map((item, i) => (
            <div
              key={i}
              style={{
                background: t.cardBg,
                borderRadius: 16,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                boxShadow: t.listShadow,
                border: `1.5px solid ${t.catBg(cat)}`,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: cat.color, width: 20, textAlign: "center", flexShrink: 0, opacity: 0.7 }}>
                {i + 1}
              </div>
              <CardImage native={item.native} color={cat.color} size={48} fontSize={18} borderRadius={12} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: t.textPrimary, marginBottom: 2 }}>{item.target}</div>
                <div style={{ fontSize: 13, color: t.textSecondary }}>{item.native}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky start button */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "16px 24px 28px", background: `linear-gradient(to top, ${dark ? "#0f0e17" : "#f0f4ff"} 60%, transparent)`, display: "flex", justifyContent: "center" }}>
        <button
          onClick={onStart}
          style={{ background: cat.color, color: "#fff", border: "none", borderRadius: 20, padding: "16px 48px", fontSize: 17, fontWeight: 800, cursor: "pointer", boxShadow: `0 8px 24px ${cat.color}55`, width: "100%", maxWidth: 480, transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; }}
        >
          Start Exercise →
        </button>
      </div>
    </div>
  );
}
