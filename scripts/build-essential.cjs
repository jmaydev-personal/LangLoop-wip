// build-essential.cjs
// Builds an "Essential Vietnamese" category (~1000 words) by pulling
// proportional slices from existing categories, weighted by importance.
// Within each category, words are ranked by English translation length
// (shorter = more likely to be a high-frequency, common word).

const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '../src/data/categorizedSets.js');
const src = fs.readFileSync(srcPath, 'utf8');
const replaced = src
  .replace('export const CATEGORIZED_SETS =', 'const CATEGORIZED_SETS =')
  .replace(/;?\s*$/, '; module.exports = CATEGORIZED_SETS;');
const tmpFile = '/tmp/_cats_essential.cjs';
fs.writeFileSync(tmpFile, replaced);
delete require.cache[require.resolve(tmpFile)];
const data = require(tmpFile);

// ─── Category targets ──────────────────────────────────────────────────────
// How many words to take from each category. 0 = skip.
const TARGETS = {
  'Greetings & Basics':      120,
  'Essential Verbs':          40,  // take all
  'Numbers & Quantities':     80,
  'Time & Calendar':          80,
  'Family & People':          80,
  'Food & Drink':             60,
  'Body & Health':            55,
  'Descriptions & Qualities': 55,
  'Home & Living':            50,
  'Emotions & Character':     45,
  'Everyday Phrases':         45,
  'Travel & Transport':       45,
  'Animals & Nature':         40,
  'Shopping & Money':         40,
  'Places & Geography':       35,
  'Clothing & Fashion':       30,
  'Work & Business':          30,
  'Grammar & Language':       25,
  'Education & Knowledge':    20,
  'Technology & Science':     15,
  'Sports & Hobbies':         15,
  'Society & Culture':        15,
  'Useful Phrases':           10,
  // skip: Military, Law & Government, Astronomy & Space, Finance, etc.
};

// Score a word entry: lower = more essential
// Criteria: shorter English = more common, penalise parenthetical notes,
//           penalise entries where Vietnamese is notably longer than expected
//           (e.g. dialect/intensifier forms like "phừng phừng" for "hot")
function score(v) {
  const eng = v.native
    .replace(/["""]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/[,;].*/g, '')
    .trim();
  const wordCount = eng.split(/\s+/).length;
  const charLen = eng.length;

  // Penalise entries that look like notes / classifiers
  const notesPenalty = /classifier|note:|^\d|^\(/.test(v.native) ? 50 : 0;

  // Penalise Vietnamese entries that are much longer than their English equivalent
  // (often intensifiers, slang or dialectal forms)
  const viClean = v.target.replace(/[;,].*/,'').trim();
  const viWords = viClean.split(/\s+/);
  const viLen = viWords.length;
  const viLengthPenalty = viLen > wordCount ? (viLen - wordCount) * 4 : 0;

  // Penalise Vietnamese reduplication ("phừng phừng", "cũ rích" etc.)
  // — these are intensifier forms, not standard vocabulary
  const redupPenalty = (viWords.length === 2 && viWords[0] === viWords[1]) ? 20 : 0;

  // Penalise compound / very specific phrases (semicolons = multiple meanings = nuanced)
  const semicolonPenalty = (v.target.match(/;/g) || []).length * 3;

  return charLen + wordCount * 3 + notesPenalty + viLengthPenalty + redupPenalty + semicolonPenalty;
}

// ─── Build selection ───────────────────────────────────────────────────────
const selected = [];
const seenTargets = new Set();  // deduplicate Vietnamese words

for (const [label, target] of Object.entries(TARGETS)) {
  const cat = data.find(c => c.label === label);
  if (!cat) { console.warn(`⚠  Category not found: ${label}`); continue; }

  const allWords = cat.packs.flatMap(p => p.vocab);

  // Sort by score (ascending = simpler first)
  const sorted = [...allWords].sort((a, b) => score(a) - score(b));

  // Take up to `target` unique words
  const taken = [];
  for (const w of sorted) {
    if (taken.length >= target) break;
    if (seenTargets.has(w.target)) continue;
    seenTargets.add(w.target);
    taken.push(w);
  }

  selected.push({ label, words: taken });
  console.log(`  ✓ ${label.padEnd(28)} ${taken.length} / ${allWords.length}`);
}

const totalWords = selected.reduce((s, c) => s + c.words.length, 0);
console.log(`\nTotal selected: ${totalWords}`);

// ─── Build new category entry ──────────────────────────────────────────────
// Group into themed packs matching the source categories
const packs = selected.map(({ label, words }) => ({
  id: 'essential-' + label.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  label,
  vocab: words,
}));

const essentialCategory = {
  id: 'essential',
  label: 'Essential Vietnamese',
  emoji: '⭐',
  color: '#f59e0b',
  bg: '#fef3c7',
  packs,
};

// ─── Inject into dataset (remove old Essential if exists, prepend new) ─────
const filtered = data.filter(c => c.id !== 'essential');
const newData = [essentialCategory, ...filtered];

// ─── Write output ──────────────────────────────────────────────────────────
function serialize(obj, indent = 0) {
  const pad = '  '.repeat(indent);
  const pad1 = '  '.repeat(indent + 1);
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    const items = obj.map(v => pad1 + serialize(v, indent + 1));
    return `[\n${items.join(',\n')}\n${pad}]`;
  }
  if (obj && typeof obj === 'object') {
    const entries = Object.entries(obj).map(
      ([k, v]) => `${pad1}${k}: ${serialize(v, indent + 1)}`
    );
    return `{\n${entries.join(',\n')}\n${pad}}`;
  }
  return JSON.stringify(obj);
}

const out = `export const CATEGORIZED_SETS = ${serialize(newData, 0)};\n`;
fs.writeFileSync(srcPath, out);
console.log(`\nWrote ${newData.length} categories to categorizedSets.js`);
console.log(`Essential pack count: ${packs.length}`);
