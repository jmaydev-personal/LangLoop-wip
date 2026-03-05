#!/usr/bin/env node
/**
 * generate-audio.js
 * Pre-generates MP3 audio files for all LangLoop vocabulary using
 * Google Cloud Text-to-Speech (Chirp3-HD).
 *
 * Usage:
 *   node scripts/generate-audio.js <YOUR_API_KEY>
 *
 * Options (env vars):
 *   VI_VOICE  - Vietnamese voice name (default: auto-detected best available)
 *   EN_VOICE  - English voice name    (default: auto-detected best available)
 *   CONCURRENCY - parallel requests   (default: 5)
 *
 * Output:
 *   public/audio/vi/<hash>.mp3   (Vietnamese)
 *   public/audio/en/<hash>.mp3   (English)
 *
 * Resume-safe: skips files that already exist.
 */

const fs   = require("fs");
const path = require("path");
const https = require("https");

const API_KEY     = process.argv[2] || process.env.GOOGLE_TTS_API_KEY;
const CONCURRENCY = parseInt(process.env.CONCURRENCY || "5", 10);

if (!API_KEY) {
  console.error("Error: API key required.\nUsage: node scripts/generate-audio.js YOUR_API_KEY");
  process.exit(1);
}

// ─── Paths ────────────────────────────────────────────────────────────────────
const ROOT    = path.join(__dirname, "..");
const VI_DIR  = path.join(ROOT, "public", "audio", "vi");
const EN_DIR  = path.join(ROOT, "public", "audio", "en");
fs.mkdirSync(VI_DIR, { recursive: true });
fs.mkdirSync(EN_DIR, { recursive: true });

// ─── Hash (djb2) — must match src/lib/audioHelper.js ─────────────────────────
function djb2(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(hash, 33) ^ str.charCodeAt(i);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function audioPath(text, lang) {
  const dir = lang === "vi" ? VI_DIR : EN_DIR;
  return path.join(dir, djb2(text) + ".mp3");
}

// ─── HTTP helper ──────────────────────────────────────────────────────────────
function request(url, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const u    = new URL(url);
    const opts = {
      hostname: u.hostname,
      path:     u.pathname + u.search,
      method:   "POST",
      headers:  { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(data) },
    };
    const req = https.request(opts, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        const text = Buffer.concat(chunks).toString();
        try { resolve({ status: res.statusCode, body: JSON.parse(text) }); }
        catch (e) { resolve({ status: res.statusCode, body: text }); }
      });
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        try { resolve(JSON.parse(Buffer.concat(chunks).toString())); }
        catch (e) { reject(e); }
      });
    }).on("error", reject);
  });
}

// ─── Voice selection ─────────────────────────────────────────────────────────
// Priority order: Chirp3-HD > Chirp HD > Neural2 > WaveNet > Standard
const VOICE_PRIORITY = ["Chirp3-HD", "Chirp-HD", "Neural2", "Journey", "WaveNet", "Standard"];

async function getBestVoice(langCode) {
  const data = await get(
    `https://texttospeech.googleapis.com/v1/voices?languageCode=${langCode}&key=${API_KEY}`
  );
  if (!data.voices) throw new Error(`Could not list voices: ${JSON.stringify(data)}`);

  const voices = data.voices.filter((v) =>
    v.languageCodes.some((c) => c.toLowerCase().startsWith(langCode.toLowerCase()))
  );

  for (const tier of VOICE_PRIORITY) {
    const match = voices.find((v) => v.name.includes(tier));
    if (match) return match.name;
  }
  // Last resort — just use first available
  return voices[0]?.name;
}

// ─── Synthesize one phrase ────────────────────────────────────────────────────
async function synthesize(text, langCode, voiceName, outPath, retries = 3) {
  // Skip if already exists
  if (fs.existsSync(outPath)) return "skip";

  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;
  const body = {
    input: { text },
    voice: { languageCode: langCode, name: voiceName },
    audioConfig: { audioEncoding: "MP3", speakingRate: 0.9 },
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await request(url, body);
    if (res.status === 200 && res.body.audioContent) {
      const buf = Buffer.from(res.body.audioContent, "base64");
      fs.writeFileSync(outPath, buf);
      return "ok";
    }
    // Rate limited — wait and retry
    if (res.status === 429) {
      await sleep(2000 * attempt);
      continue;
    }
    // Other error
    console.error(`\nAPI error ${res.status} for "${text.slice(0, 40)}": ${JSON.stringify(res.body).slice(0, 120)}`);
    return "error";
  }
  return "error";
}

// ─── Concurrency limiter ──────────────────────────────────────────────────────
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function runWithConcurrency(tasks, concurrency) {
  const results = [];
  let i = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (i < tasks.length) {
      const idx = i++;
      results[idx] = await tasks[idx]();
    }
  });
  await Promise.all(workers);
  return results;
}

// ─── Load vocab ───────────────────────────────────────────────────────────────
function loadVocab() {
  const viSet = new Set();
  const enSet = new Set();

  const extractFromJS = (filePath) => {
    const code = fs.readFileSync(filePath, "utf8");
    const targetRe = /target:\s*"((?:[^"\\]|\\.)*)"/g;
    const nativeRe = /native:\s*"((?:[^"\\]|\\.)*)"/g;
    let m;
    while ((m = targetRe.exec(code)) !== null) viSet.add(m[1].replace(/\\"/g, '"'));
    while ((m = nativeRe.exec(code)) !== null) enSet.add(m[1].replace(/\\"/g, '"'));
  };

  extractFromJS(path.join(ROOT, "src", "data", "categories.js"));
  extractFromJS(path.join(ROOT, "src", "data", "categorizedSets.js"));

  return { viSet, enSet };
}

// ─── Progress bar ─────────────────────────────────────────────────────────────
function progressBar(done, total, label = "") {
  const pct  = Math.floor((done / total) * 100);
  const bar  = "█".repeat(Math.floor(pct / 2)) + "░".repeat(50 - Math.floor(pct / 2));
  process.stdout.write(`\r[${bar}] ${pct}% (${done}/${total}) ${label.padEnd(20)}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  console.log("LangLoop Audio Generator — Google Cloud TTS (Chirp3-HD)\n");

  // Discover voices
  console.log("Discovering best available voices...");
  let viVoice, enVoice;
  try {
    viVoice = process.env.VI_VOICE || await getBestVoice("vi-VN");
    enVoice = process.env.EN_VOICE || await getBestVoice("en-GB");
    console.log(`  Vietnamese : ${viVoice}`);
    console.log(`  English    : ${enVoice}\n`);
  } catch (e) {
    console.error("Failed to list voices. Check your API key and that Cloud TTS is enabled.\n", e.message);
    process.exit(1);
  }

  // Load vocab
  const { viSet, enSet } = loadVocab();
  const viList = [...viSet];
  const enList = [...enSet];
  console.log(`Unique Vietnamese : ${viList.length}`);
  console.log(`Unique English    : ${enList.length}`);

  // Count existing files
  const existingVI = fs.readdirSync(VI_DIR).length;
  const existingEN = fs.readdirSync(EN_DIR).length;
  if (existingVI + existingEN > 0) {
    console.log(`\nResuming — ${existingVI} VI and ${existingEN} EN files already exist, skipping them.`);
  }

  const total = viList.length + enList.length;
  let done = 0, skipped = 0, errors = 0;

  const allTasks = [
    ...viList.map((text) => async () => {
      const result = await synthesize(text, "vi-VN", viVoice, audioPath(text, "vi"));
      done++;
      if (result === "skip") skipped++;
      if (result === "error") errors++;
      progressBar(done, total, `VI: ${text.slice(0, 20)}`);
      return result;
    }),
    ...enList.map((text) => async () => {
      const result = await synthesize(text, "en-GB", enVoice, audioPath(text, "en"));
      done++;
      if (result === "skip") skipped++;
      if (result === "error") errors++;
      progressBar(done, total, `EN: ${text.slice(0, 20)}`);
      return result;
    }),
  ];

  console.log(`\nGenerating ${total} audio files with ${CONCURRENCY} concurrent requests...\n`);
  const start = Date.now();
  await runWithConcurrency(allTasks, CONCURRENCY);

  const elapsed = ((Date.now() - start) / 1000).toFixed(0);
  console.log(`\n\n✅ Done in ${elapsed}s`);
  console.log(`   Generated : ${done - skipped - errors}`);
  console.log(`   Skipped   : ${skipped} (already existed)`);
  console.log(`   Errors    : ${errors}`);

  // Write a small manifest of which voices were used
  fs.writeFileSync(
    path.join(ROOT, "public", "audio", "voices.json"),
    JSON.stringify({ vi: viVoice, en: enVoice, generated: new Date().toISOString() }, null, 2)
  );
  console.log(`\n   Voices saved to public/audio/voices.json`);
})();
