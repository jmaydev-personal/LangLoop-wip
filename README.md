# LangLoop 🎧

A Vietnamese vocabulary learning app built on spaced audio repetition. Pick a category or pack, listen to each phrase spoken in English then repeated in Vietnamese, and build listening fluency hands-free.

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Features

- **7,771 vocabulary words** across 21 themed categories, split into packs of 20
- **12 curated starter categories** — Greetings, Numbers, Food, Travel, Shopping, Time, Family, Weather, Colours, Animals, Directions, Health
- **Vocabulary Bank** — full categorised library with horizontal scrollable pack rows per category
- **Chirp3-HD** - every word and phrase uses Google TTS for slightly more natural sounding pronunciations
- **Glossary** — searchable A–Z of all terms, sortable by Vietnamese or English, with pack source labels
- **Audio repetition** — each card reads the English phrase once, then repeats the Vietnamese N times
- **Auto-advance** — flows through the whole deck hands-free; great for background listening
- **Shuffle mode** — randomise card order each session
- **Per-card navigation** — ‹ / › buttons to skip forward and back manually
- **Translation reveal** — tap the study card to show/hide the English translation
- **Dark / light mode** — toggle in the header
- **Preview screen** — browse all cards in a deck before starting

## Settings (⚙️)

| Setting | Range | Default |
|---|---|---|
| Repetitions | 1–10× | 5× |
| Speech speed | Slow → Very Fast | Normal (0.85) |
| Pause between reps | 0–3 s | 0.8 s |
| Pause between cards | 0–3 s | 0.5 s |
| Shuffle | On / Off | Off |

## Project structure

```
src/
  data/
    categories.js         — 12 curated category definitions + vocab
    categorizedSets.js    — Auto-generated: 21 categories × ~398 packs from CSV
  lib/
    findDeck.js           — Looks up any deck by ID across both data sources
    theme.js              — Light/dark design tokens
    audioHelper.js        — djb2 hash, MP3 URL builder, Web Speech fallback
  components/
    ProgressRing.jsx      — SVG rep progress ring
  screens/
    HomeScreen.jsx        — Curated categories + Vocabulary Bank
    PreviewScreen.jsx     — Deck card list + Start button
    StudyScreen.jsx       — Full study mode with TTS
    GlossaryScreen.jsx    — Searchable A–Z glossary with sort toggle
  App.jsx                 — Root: routing, settings state
  main.jsx                — React entry point

scripts/
  generate-audio.cjs      — Pre-generates all MP3s via Google Cloud TTS
```

## Building for production

```bash
npm run build
```

Output goes to `dist/`. Serve with any static host (Netlify, Vercel, GitHub Pages, etc.).
