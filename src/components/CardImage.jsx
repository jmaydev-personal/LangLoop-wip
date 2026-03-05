import { useState } from "react";

function extractKeyword(native) {
  // Take the first meaningful word(s) before any comma, semicolon, or bracket
  return native
    .split(/[,;(]/)[0]
    .replace(/^(to|the|a|an)\s+/i, "")  // strip leading articles / "to"
    .trim()
    .split(/\s+/)
    .slice(0, 2)                          // 2 words is plenty for photo search
    .join(" ");
}

// loremflickr.com returns CC-licensed Flickr photos by keyword — no API key needed.
// Using a lock= seed keeps the same photo for the same keyword within a session.
function photoUrl(keyword, size) {
  const seed = keyword.split("").reduce((h, c) => (Math.imul(31, h) + c.charCodeAt(0)) | 0, 0);
  const lock = Math.abs(seed) % 10000;
  return `https://loremflickr.com/${size}/${size}/${encodeURIComponent(keyword)}?lock=${lock}`;
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function CardImage({ native, color, size = 110, fontSize = 42, borderRadius = 28 }) {
  const keyword = extractKeyword(native);
  const letter  = native.trim()[0]?.toUpperCase() ?? "?";
  const src     = photoUrl(keyword, size);

  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  if (errored) {
    // Fallback: letter placeholder
    return (
      <div style={{
        width: size, height: size, borderRadius, flexShrink: 0,
        background: `linear-gradient(135deg, ${color}cc 0%, ${color}66 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize, fontWeight: 800, color: "#fff", lineHeight: 1, userSelect: "none", textShadow: "0 2px 8px rgba(0,0,0,0.18)" }}>
          {letter}
        </span>
      </div>
    );
  }

  return (
    <div style={{ width: size, height: size, borderRadius, flexShrink: 0, overflow: "hidden", position: "relative", background: `linear-gradient(135deg, ${color}cc 0%, ${color}66 100%)` }}>
      <img
        src={src}
        alt={keyword}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.35s ease",
        }}
      />
      {/* Letter shows beneath until photo fades in */}
      {!loaded && (
        <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize, fontWeight: 800, color: "#fff", userSelect: "none", textShadow: "0 2px 8px rgba(0,0,0,0.18)" }}>
          {letter}
        </span>
      )}
    </div>
  );
}
