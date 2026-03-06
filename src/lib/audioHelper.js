/**
 * audioHelper.js
 * Client-side audio path resolution — must use the same djb2 hash
 * as scripts/generate-audio.js.
 */

// djb2 hash — identical to the Node script
function djb2(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(hash, 33) ^ str.charCodeAt(i);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

/**
 * Returns the path to the pre-generated MP3 for a given phrase.
 * lang: "vi" | "en"
 */
export function audioURL(text, lang) {
  return `${import.meta.env.BASE_URL}audio/${lang}/${djb2(text)}.mp3`;
}

/**
 * Web Speech TTS with a keep-alive workaround for Chrome's ~15-second
 * speechSynthesis cutoff bug. Without this, TTS silently stops mid-session.
 */
function speakTTS(text, lang, rate, signal = null) {
  return new Promise((resolve) => {
    if (signal?.aborted) { resolve(); return; }

    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === "vi" ? "vi-VN" : "en-GB";
    u.rate = rate;

    let done = false;
    const finish = () => {
      if (!done) {
        done = true;
        clearInterval(keepAlive);
        resolve();
      }
    };
    u.onend   = finish;
    u.onerror = finish;

    window.speechSynthesis.speak(u);

    if (signal) {
      signal.addEventListener("abort", () => {
        window.speechSynthesis.cancel();
        finish();
      }, { once: true });
    }

    // Chrome silently stops speechSynthesis after ~15s — pause/resume keeps it alive
    const keepAlive = setInterval(() => {
      if (!window.speechSynthesis.speaking) { clearInterval(keepAlive); return; }
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }, 10_000);
  });
}

/**
 * Plays a pre-generated MP3, returning a Promise that resolves when done.
 * Falls back to Web Speech API if the file is missing (404) or errors.
 *
 * @param {string} text
 * @param {"vi"|"en"} lang
 * @param {number} rate - playback rate (default 1.0)
 * @param {AbortSignal} [signal] - optional AbortSignal to cancel mid-clip
 *
 * Fixes vs. previous version:
 *  - playbackRate is set in onloadedmetadata (not before load)
 *  - onpause handler resumes if tab focus is lost mid-clip
 *  - 30-second safety timeout prevents the loop from hanging forever
 *  - TTS fallback uses keep-alive to survive Chrome's 15s cutoff
 *  - AbortSignal support lets callers immediately stop a playing clip
 *  - fallback and settle are each guarded to fire at most once
 */
export function playAudio(text, lang, rate = 1.0, signal = null) {
  return new Promise((resolve) => {
    // Already cancelled before we even start
    if (signal?.aborted) { resolve(); return; }

    const url   = audioURL(text, lang);
    const audio = new Audio(url);
    audio.preload = "auto";

    let settled = false;
    const settle = () => {
      if (!settled) {
        settled = true;
        clearTimeout(safetyTimer);
        resolve();
      }
    };

    // Safety net: never hang longer than 30s regardless of what the browser does
    const safetyTimer = setTimeout(settle, 30_000);

    const fallback = () => speakTTS(text, lang, rate, signal).then(settle);

    // Honour an abort signal: stop the audio (or TTS) immediately
    if (signal) {
      signal.addEventListener("abort", () => {
        audio.pause();
        window.speechSynthesis.cancel();
        settle();
      }, { once: true });
    }

    // Set playbackRate only after metadata is loaded — avoids browser quirks
    audio.onloadedmetadata = () => { audio.playbackRate = rate; };

    audio.onended = settle;

    // File missing / network error → TTS
    audio.onerror = () => { if (!settled) fallback(); };

    // Tab losing focus / screen lock can pause audio without firing onended
    // (especially on Safari iOS). Try to resume; if the browser rejects the
    // play() call (autoplay policy, no longer in user-gesture chain), just
    // move on to the next card via settle().
    // The `resuming` flag prevents re-entrant onpause calls during the
    // brief window between play() being called and audio actually starting.
    let resuming = false;
    audio.onpause = () => {
      if (!audio.ended && !settled && !signal?.aborted && !resuming) {
        resuming = true;
        audio.play()
          .then(() => { resuming = false; })
          .catch(settle);
      }
    };

    audio.play().catch(() => { if (!settled) fallback(); });
  });
}

// Module-level cache keeps Audio elements alive so the browser retains
// the decoded audio in memory between cards (prevents re-fetch on replay).
const _preloadCache = new Map();

/**
 * Preload a batch of audio files in the background.
 * Stores references in a module cache to prevent garbage collection.
 */
export function preloadAudio(vocab) {
  vocab.forEach(({ target, native }) => {
    const viKey = `vi:${target}`;
    const enKey = `en:${native}`;
    if (!_preloadCache.has(viKey)) {
      const a = new Audio(audioURL(target, "vi"));
      a.preload = "auto";
      _preloadCache.set(viKey, a);
    }
    if (!_preloadCache.has(enKey)) {
      const b = new Audio(audioURL(native, "en"));
      b.preload = "auto";
      _preloadCache.set(enKey, b);
    }
  });
}
