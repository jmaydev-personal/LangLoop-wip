import { useState, useMemo, useRef } from "react";
import { CATEGORIES } from "../data/categories";
import { CATEGORIZED_SETS } from "../data/categorizedSets";
import { getTheme } from "../lib/theme";
import { playAudio } from "../lib/audioHelper";

// ─── Data ─────────────────────────────────────────────────────────────────────

function getAllVocab() {
  const seen = new Set();
  const all  = [];
  const add  = ({ target, native }, pack) => {
    if (!seen.has(target)) { seen.add(target); all.push({ target, native, pack }); }
  };
  CATEGORIES.forEach(c => c.vocab.forEach(v => add(v, c.label)));
  CATEGORIZED_SETS.forEach(c => c.packs.forEach(p => p.vocab.forEach(v => add(v, `${c.label} · ${p.label}`))));
  return all;
}

// Strip diacritics for fuzzy search — "anh" matches "ảnh", "ánh", etc.
// đ/Đ is mapped to d so searching "d" also surfaces đ words.
function stripDiacritics(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase();
}

// Normalize a Vietnamese character to its A-Z base for grouping.
// đ/Đ is kept as its own letter; everything else strips combining marks.
function groupLetter(str) {
  const ch = str.trim().charAt(0);
  if (!ch) return "#";
  if (ch === "đ" || ch === "Đ") return "Đ";
  const base = ch.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
  return /[A-Z]/.test(base) ? base : "#";
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function GlossaryScreen({ dark, onBack }) {
  const t = getTheme(dark);
  const [query, setQuery] = useState("");
  const [sortByEn, setSortByEn] = useState(false);
  const [playing, setPlaying] = useState(null); // "vi:text" | "en:text" | null
  const sectionRefs = useRef({});

  // Build sorted + grouped data
  const { grouped, letters } = useMemo(() => {
    const all = getAllVocab();
    const q     = query.trim().toLowerCase();
    const qNorm = stripDiacritics(q);

    const filtered = q
      ? all.filter(v =>
          stripDiacritics(v.target).includes(qNorm) ||
          stripDiacritics(v.native).includes(qNorm) ||
          v.target.toLowerCase().includes(q) ||
          v.native.toLowerCase().includes(q)
        )
      : all;

    if (sortByEn) {
      // Sort alphabetically by English
      filtered.sort((a, b) => a.native.localeCompare(b.native, "en"));
      // Group by first letter of English
      const groups = {};
      for (const item of filtered) {
        const letter = item.native.trim().charAt(0).toUpperCase().replace(/[^A-Z]/, "#") || "#";
        if (!groups[letter]) groups[letter] = [];
        groups[letter].push(item);
      }
      const letters = Object.keys(groups).sort((a, b) =>
        a === "#" ? 1 : b === "#" ? -1 : a.localeCompare(b)
      );
      return { grouped: groups, letters };
    } else {
      // Sort: locale-aware Vietnamese
      filtered.sort((a, b) => a.target.localeCompare(b.target, "vi"));
      // Group by first letter of Vietnamese
      const groups = {};
      for (const item of filtered) {
        const letter = groupLetter(item.target);
        if (!groups[letter]) groups[letter] = [];
        groups[letter].push(item);
      }
      // Sort letter keys in Vietnamese alphabet order
      const VI_ORDER = "ABCDĐEFGHIKLMNOPQRSTUVWXY#".split("");
      const letters  = Object.keys(groups).sort((a, b) => {
        const ia = VI_ORDER.indexOf(a);
        const ib = VI_ORDER.indexOf(b);
        if (ia !== -1 && ib !== -1) return ia - ib;
        if (ia !== -1) return -1;
        if (ib !== -1) return 1;
        return a.localeCompare(b);
      });
      return { grouped: groups, letters };
    }
  }, [query, sortByEn]);

  const totalCount = useMemo(() => {
    return letters.reduce((s, l) => s + grouped[l].length, 0);
  }, [grouped, letters]);

  const scrollToLetter = (letter) => {
    sectionRefs.current[letter]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePlay = async (text, lang, key) => {
    if (playing === key) return;
    setPlaying(key);
    await playAudio(text, lang, 0.9);
    setPlaying(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: t.pageBg,  }}>

      {/* Sticky header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: t.pageBg,
        borderBottom: `1px solid ${t.trackBg}`,
        padding: "12px 16px 10px",
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <button
              onClick={onBack}
              style={{ background: t.cardBg, border: "none", borderRadius: 12, width: 38, height: 38, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: t.btnShadow, color: t.textPrimary, flexShrink: 0 }}
            >←</button>
            <div style={{ flex: 1 }}>
              <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: t.textPrimary }}>Glossary</h1>
              <p style={{ margin: 0, fontSize: 12, color: t.textMuted }}>
                {totalCount.toLocaleString()} {query ? "results" : "terms"} · sorted by {sortByEn ? "English" : "Vietnamese"}
              </p>
            </div>
          </div>

          {/* Sort toggle + Search */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 0 }}>
          <button
            onClick={() => setSortByEn(v => !v)}
            style={{
              flexShrink: 0,
              padding: "9px 12px",
              borderRadius: 12,
              border: "none",
              background: t.cardBg,
              boxShadow: t.btnShadow,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 700,
              color: t.textPrimary,
              display: "flex",
              alignItems: "center",
              gap: 5,
              whiteSpace: "nowrap",
              transition: "all 0.15s",
            }}
          >
            <span style={{ opacity: sortByEn ? 0.4 : 1, transition: "opacity 0.15s" }}>VI</span>
            <span style={{ fontSize: 14, color: "#6366f1" }}>⇄</span>
            <span style={{ opacity: sortByEn ? 1 : 0.4, transition: "opacity 0.15s" }}>EN</span>
          </button>
          <div style={{ position: "relative", flex: 1 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 15, color: t.textMuted, pointerEvents: "none" }}>🔍</span>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search Vietnamese or English…"
              style={{
                width: "100%", padding: "9px 12px 9px 36px",
                background: t.cardBg, border: `1.5px solid ${t.trackBg}`,
                borderRadius: 12, fontSize: 14, color: t.textPrimary,
                outline: "none", boxSizing: "border-box",
              }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: t.textMuted, fontSize: 16, lineHeight: 1 }}
              >✕</button>
            )}
          </div>
          </div>
        </div>
      </div>

      {/* Main content + alphabet index */}
      <div style={{ display: "flex", maxWidth: 600, margin: "0 auto" }}>

        {/* Scrollable list */}
        <div style={{ flex: 1, padding: "8px 16px 80px", minWidth: 0 }}>
          {letters.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: t.textMuted, fontSize: 15 }}>
              No results for "{query}"
            </div>
          )}

          {letters.map(letter => (
            <div
              key={letter}
              ref={el => { sectionRefs.current[letter] = el; }}
            >
              {/* Letter heading */}
              <div style={{
                position: "sticky", top: 104, zIndex: 10,
                background: t.pageBg,
                padding: "14px 0 6px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 10,
                    background: "#6366f1", color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, fontWeight: 800, flexShrink: 0,
                  }}>{letter}</div>
                  <div style={{ flex: 1, height: 1, background: t.trackBg }} />
                  <span style={{ fontSize: 12, color: t.textMuted }}>{grouped[letter].length}</span>
                </div>
              </div>

              {/* Entries */}
              {grouped[letter].map((item, i) => (
                <div
                  key={item.target + i}
                  style={{
                    background: t.cardBg,
                    borderRadius: 12,
                    padding: "11px 14px",
                    marginBottom: 6,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    boxShadow: t.listShadow,
                  }}
                >
                  {/* Primary / secondary text flips with sort mode */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: t.textPrimary, marginBottom: 2 }}>
                      {sortByEn ? item.native : item.target}
                    </div>
                    <div style={{ fontSize: 13, color: t.textSecondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 4 }}>
                      {sortByEn ? item.target : item.native}
                    </div>
                    <div style={{ fontSize: 11, color: "#6366f1", background: "#6366f112", borderRadius: 5, padding: "2px 6px", display: "inline-block", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.pack}
                    </div>
                  </div>

                  {/* Play buttons */}
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button
                      onClick={() => handlePlay(item.native, "en", `en:${item.native}`)}
                      title="Play English"
                      style={{
                        width: 30, height: 30, borderRadius: "50%", border: "none",
                        background: playing === `en:${item.native}` ? "#6366f1" : t.trackBg,
                        color: playing === `en:${item.native}` ? "#fff" : t.textMuted,
                        cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.15s",
                      }}
                    >{playing === `en:${item.native}` ? "♪" : "EN"}</button>
                    <button
                      onClick={() => handlePlay(item.target, "vi", `vi:${item.target}`)}
                      title="Play Vietnamese"
                      style={{
                        width: 30, height: 30, borderRadius: "50%", border: "none",
                        background: playing === `vi:${item.target}` ? "#6366f1" : t.trackBg,
                        color: playing === `vi:${item.target}` ? "#fff" : t.textMuted,
                        cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.15s",
                      }}
                    >{playing === `vi:${item.target}` ? "♪" : "VI"}</button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Alphabet index — right side */}
        {!query && (
          <div style={{
            position: "sticky", top: 104, alignSelf: "flex-start",
            display: "flex", flexDirection: "column", gap: 1,
            padding: "8px 6px 8px 0",
            maxHeight: "calc(100vh - 110px)", overflowY: "auto",
          }}>
            {letters.map(letter => (
              <button
                key={letter}
                onClick={() => scrollToLetter(letter)}
                style={{
                  width: 24, height: 24, borderRadius: 6, border: "none",
                  background: "transparent", cursor: "pointer",
                  fontSize: 11, fontWeight: 700, color: "#6366f1",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.1s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#6366f122"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >{letter}</button>
            ))}
          </div>
        )}
      </div>

      <style>{`input::placeholder { color: ${t.textMuted}; opacity: 0.7; }`}</style>
    </div>
  );
}
