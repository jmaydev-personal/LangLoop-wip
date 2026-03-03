# LangLoop 🎧

A Vietnamese vocabulary learning app built on spaced audio repetition. Pick a category, listen to each phrase spoken in English then repeated in Vietnamese, and build listening fluency hands-free.

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Features

- **12 categories** — Greetings, Numbers, Food, Travel, Shopping, Time, Family, Weather, Colours, Animals, Directions, Health
- **Audio repetition** — Each card reads the English phrase once, then repeats the Vietnamese translation N times
- **Auto-advance** — Flows through the whole deck automatically; great for background listening
- **Shuffle mode** — Randomise card order each session
- **Per-card navigation** — ‹ / › buttons to skip forward and back manually
- **Dark / light mode** — Defaults to dark
- **Preview screen** — Browse all cards in a deck before starting
- **Translation reveal** — Tap the card image to show/hide the English translation during study
- **Persistent settings** — ⚙️ button available on every non-study screen

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
    categories.js       — All 12 category definitions + vocab
  lib/
    theme.js            — Light/dark design tokens
  components/
    CardImage.jsx       — Letter-based card thumbnail
    ProgressRing.jsx    — SVG rep progress ring
  screens/
    HomeScreen.jsx      — Category grid
    PreviewScreen.jsx   — Deck card list + Start button
    StudyScreen.jsx     — Full study mode with TTS
  App.jsx               — Root: routing, settings state, floating buttons
  main.jsx              — React entry point
```

## Building for production

```bash
npm run build
```

Output goes to `dist/`. Serve with any static host (Netlify, Vercel, GitHub Pages, etc.).
