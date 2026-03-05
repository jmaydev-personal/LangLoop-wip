import { useRef } from "react";
import { CATEGORIES } from "../data/categories";
import { CATEGORIZED_SETS } from "../data/categorizedSets";
import { getTheme } from "../lib/theme";

// Preferred category display order
const CAT_ORDER = [
  'phrases','greetings','food','family','travel','body',
  'emotions','home','work','shopping','clothing','time',
  'animals','sports','education','society','descriptions',
  'grammar','tech','numbers','geography','general',
];

function sortedCategories() {
  const map = Object.fromEntries(CATEGORIZED_SETS.map(c => [c.id, c]));
  const ordered = CAT_ORDER.map(id => map[id]).filter(Boolean);
  // append any not in the order list
  CATEGORIZED_SETS.forEach(c => { if (!CAT_ORDER.includes(c.id)) ordered.push(c); });
  return ordered;
}

function HorizontalPackRow({ cat, onSelect, t }) {
  const scrollRef = useRef(null);

  return (
    <div
      ref={scrollRef}
      style={{
        display: "flex",
        gap: 10,
        overflowX: "auto",
        paddingBottom: 8,
        paddingTop: 4,
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {cat.packs.map((pack) => (
        <button
          key={pack.id}
          onClick={() => onSelect(pack.id, "vocab")}
          style={{
            flexShrink: 0,
            width: 88,
            background: t.cardBg,
            border: `1.5px solid ${cat.color}25`,
            borderRadius: 14,
            padding: "12px 8px",
            cursor: "pointer",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 5,
            boxShadow: t.listShadow,
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = cat.color + "66"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = cat.color + "25"; }}
        >
          <div style={{ fontSize: 18 }}>{cat.emoji}</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: t.textPrimary, lineHeight: 1.2 }}>{pack.label}</div>
          <div style={{
            fontSize: 10, fontWeight: 600, color: cat.color,
            background: cat.color + "18", borderRadius: 5, padding: "2px 5px",
          }}>{pack.vocab.length} words</div>
        </button>
      ))}
      <style>{`.scrollhide::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}

export default function HomeScreen({ dark, onSelect, onGlossary, onSettings, onToggleDark }) {
  const t = getTheme(dark);
  const sorted = sortedCategories();
  const totalWords = CATEGORIZED_SETS.reduce((s, c) => s + c.packs.reduce((ss, p) => ss + p.vocab.length, 0), 0);

  return (
    <div style={{ minHeight: "100vh", background: t.pageBg, fontFamily: "'Segoe UI', sans-serif", padding: "28px 16px 80px" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>

        {/* App header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 30 }}>🎧</span>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: t.textPrimary }}>LangLoop</h1>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                onClick={onSettings}
                title="Settings"
                style={{ width: 38, height: 38, borderRadius: 10, border: "none", background: t.cardBg, boxShadow: t.btnShadow, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
                onMouseLeave={e => e.currentTarget.style.transform = ""}
              >⚙️</button>
              <button
                onClick={onToggleDark}
                title="Toggle theme"
                style={{ width: 38, height: 38, borderRadius: 10, border: "none", background: t.cardBg, boxShadow: t.btnShadow, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
                onMouseLeave={e => e.currentTarget.style.transform = ""}
              >{dark ? "☀️" : "🌙"}</button>
              <button
                onClick={onGlossary}
                title="Glossary"
                style={{ height: 38, borderRadius: 10, border: "none", background: t.cardBg, boxShadow: t.btnShadow, padding: "0 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, color: t.textPrimary, fontSize: 13, fontWeight: 700, transition: "all 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={e => e.currentTarget.style.transform = ""}
              >
                <span style={{ fontSize: 15 }}>📖</span> Glossary
              </button>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: t.textSecondary }}>
            Vietnamese · {totalWords.toLocaleString()} words across {CATEGORIZED_SETS.length} categories
          </p>
        </div>

        {/* Curated section */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
            <h2 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Curated
            </h2>
            <span style={{ fontSize: 11, color: t.textMuted }}>{CATEGORIES.length} categories</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelect(cat.id, "category")}
                style={{
                  background: `linear-gradient(145deg, ${cat.color}ee, ${cat.color}99)`,
                  border: "none",
                  borderRadius: 18,
                  padding: 0,
                  cursor: "pointer",
                  textAlign: "left",
                  boxShadow: `0 4px 16px ${cat.color}44`,
                  transition: "all 0.18s",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  position: "relative",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px) scale(1.02)"; e.currentTarget.style.boxShadow = `0 8px 24px ${cat.color}66`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = `0 4px 16px ${cat.color}44`; }}
              >
                {/* Big emoji art area */}
                <div style={{ padding: "18px 12px 8px", display: "flex", justifyContent: "center" }}>
                  <span style={{ fontSize: 40, filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.18))" }}>{cat.emoji}</span>
                </div>
                {/* Label strip */}
                <div style={{ padding: "6px 10px 12px", background: "rgba(0,0,0,0.18)", backdropFilter: "blur(4px)" }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 2 }}>{cat.label}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.75)" }}>{cat.vocab.length} phrases</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Vocabulary Bank — category sections */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Vocabulary Bank
          </h2>
          <span style={{ fontSize: 11, color: t.textMuted }}>scroll → to browse packs</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {sorted.map((cat) => (
            <div key={cat.id}>
              {/* Category heading */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 32, height: 32, borderRadius: 9,
                  background: `linear-gradient(135deg, ${cat.color}dd, ${cat.color}88)`,
                  fontSize: 17,
                  boxShadow: `0 2px 8px ${cat.color}44`,
                }}>{cat.emoji}</span>
                <div>
                  <span style={{ fontSize: 15, fontWeight: 800, color: t.textPrimary }}>{cat.label}</span>
                  <span style={{ fontSize: 12, color: t.textMuted, marginLeft: 8 }}>
                    {cat.packs.length} packs · {cat.packs.reduce((s, p) => s + p.vocab.length, 0)} words
                  </span>
                </div>
                <div style={{ flex: 1, height: 1, background: t.trackBg, marginLeft: 4 }} />
              </div>

              {/* Horizontal pack row */}
              <HorizontalPackRow cat={cat} onSelect={onSelect} t={t} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
