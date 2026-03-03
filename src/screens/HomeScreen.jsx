import { CATEGORIES } from "../data/categories";
import { getTheme } from "../lib/theme";

export default function HomeScreen({ dark, onSelect }) {
  const t = getTheme(dark);
  return (
    <div style={{ minHeight: "100vh", background: t.pageBg, fontFamily: "'Segoe UI', sans-serif", padding: "28px 16px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 30 }}>🎧</span>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: t.textPrimary }}>LangLoop</h1>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: t.textSecondary }}>Vietnamese — choose a category to start listening</p>
        </div>

        {/* Category grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              style={{
                background: t.cardBg,
                border: `2px solid ${t.catBg(cat)}`,
                borderRadius: 18,
                padding: "20px 16px",
                cursor: "pointer",
                textAlign: "left",
                boxShadow: t.listShadow,
                transition: "all 0.15s",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 6px 20px ${cat.color}40`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = t.listShadow; }}
            >
              <div style={{ fontSize: 30 }}>{cat.emoji}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: t.textPrimary, marginBottom: 2 }}>{cat.label}</div>
                <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 500 }}>{cat.vocab.length} phrases</div>
              </div>
              <div style={{ marginTop: 4, height: 4, borderRadius: 4, background: t.catBg(cat), overflow: "hidden" }}>
                <div style={{ height: "100%", width: "100%", background: cat.color, borderRadius: 4, opacity: 0.5 }} />
              </div>
            </button>
          ))}
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: t.footerText, marginTop: 24 }}>
          {CATEGORIES.length} categories · {CATEGORIES.reduce((s, c) => s + c.vocab.length, 0)} phrases total
        </p>
      </div>
    </div>
  );
}
