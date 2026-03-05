import { useState } from "react";
import { findEmoji, emojiToOpenMojiUrl } from "../lib/wordToEmoji";

// ─── Letter placeholder ───────────────────────────────────────────────────────
function LetterPlaceholder({ letter, color, size, fontSize, borderRadius }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius, flexShrink: 0,
        background: `linear-gradient(135deg, ${color}cc 0%, ${color}66 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <span
        style={{
          fontSize, fontWeight: 800, color: "#fff", lineHeight: 1,
          userSelect: "none", textShadow: "0 2px 8px rgba(0,0,0,0.22)",
        }}
      >
        {letter}
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
// Shows an OpenMoji SVG for the English translation if one is found,
// otherwise falls back to a coloured letter placeholder.
export default function CardImage({
  native,   // English translation used for emoji lookup
  color,
  size = 110,
  fontSize = 42,
  borderRadius = 28,
}) {
  const emoji = findEmoji(native);
  const letter = native.trim()[0]?.toUpperCase() ?? "?";

  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  // No matching emoji → letter placeholder immediately (no network request)
  if (!emoji || errored) {
    return (
      <LetterPlaceholder
        letter={letter} color={color}
        size={size} fontSize={fontSize} borderRadius={borderRadius}
      />
    );
  }

  const src = emojiToOpenMojiUrl(emoji);

  return (
    <div
      style={{
        width: size, height: size, borderRadius, flexShrink: 0,
        overflow: "hidden", position: "relative",
        background: `linear-gradient(135deg, ${color}22 0%, ${color}11 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      {/* Faint letter shows until SVG loads */}
      {!loaded && (
        <span
          style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize, fontWeight: 800, color, lineHeight: 1,
            userSelect: "none", opacity: 0.3,
          }}
        >
          {letter}
        </span>
      )}

      <img
        src={src}
        alt={emoji}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        style={{
          width: size * 0.72,   // slight inset so emoji doesn't touch edges
          height: size * 0.72,
          objectFit: "contain",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.25s ease",
          position: "relative",
          zIndex: 1,
        }}
      />
    </div>
  );
}
