import { CATEGORIES } from "../data/categories";
import { CATEGORIZED_SETS } from "../data/categorizedSets";

/**
 * Given any deck/pack id, returns a flat object:
 * { id, label, emoji, color, bg, vocab }
 */
export function findDeck(id) {
  // Check original curated categories
  const cat = CATEGORIES.find((c) => c.id === id);
  if (cat) return cat;

  // Check packs within vocabulary bank
  for (const set of CATEGORIZED_SETS) {
    const pack = set.packs.find((p) => p.id === id);
    if (pack) {
      return {
        id: pack.id,
        label: `${set.label} · ${pack.label}`,
        emoji: set.emoji,
        color: set.color,
        bg: set.bg,
        vocab: pack.vocab,
      };
    }
  }
  return null;
}
