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
  return `/audio/${lang}/${djb2(text)}.mp3`;
}

/**
 * Plays a pre-generated MP3, returning a Promise that resolves when done.
 * Falls back to Web Speech API if the file is missing (404) or errors.
 */
export function playAudio(text, lang, rate = 1.0) {
  return new Promise((resolve) => {
    const url   = audioURL(text, lang);
    const audio = new Audio(url);
    audio.playbackRate = rate;

    const fallback = () => {
      // Web Speech fallback
      const langCode = lang === "vi" ? "vi-VN" : "en-GB";
      const u = new SpeechSynthesisUtterance(text);
      u.lang  = langCode;
      u.rate  = rate;
      u.onend   = resolve;
      u.onerror = resolve;
      window.speechSynthesis.speak(u);
    };

    audio.onended = resolve;
    audio.onerror = fallback; // file missing or network error → TTS

    audio.play().catch(fallback);
  });
}

/**
 * Preload a batch of audio files in the background (optional, improves latency).
 */
export function preloadAudio(vocab) {
  vocab.forEach(({ target, native }) => {
    new Audio(audioURL(target, "vi"));
    new Audio(audioURL(native, "en"));
  });
}
