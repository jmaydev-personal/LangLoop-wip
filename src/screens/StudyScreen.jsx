import { useState, useEffect, useRef, useCallback } from "react";
import { findDeck } from "../lib/findDeck";
import { getTheme } from "../lib/theme";
import { playAudio } from "../lib/audioHelper";
import ProgressRing from "../components/ProgressRing";

export default function StudyScreen({
  categoryId, dark, onBack,
  repeatCount, speed, pauseMs, advancePauseMs, shuffle,
}) {
  const cat   = findDeck(categoryId);
  const vocab = cat.vocab;

  const [cardIndex, setCardIndex]             = useState(0);
  const [currentRep, setCurrentRep]           = useState(0);
  const [isPlaying, setIsPlaying]             = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  const stopRef           = useRef(false);
  const timeoutRef        = useRef(null);
  const abortCtrlRef      = useRef(null);   // AbortController for current clip
  const repeatCountRef    = useRef(repeatCount);
  const speedRef          = useRef(speed);
  const pauseMsRef        = useRef(pauseMs);
  const advancePauseMsRef = useRef(advancePauseMs);
  const shuffleRef        = useRef(shuffle);

  useEffect(() => { repeatCountRef.current = repeatCount; }, [repeatCount]);
  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { pauseMsRef.current = pauseMs; }, [pauseMs]);
  useEffect(() => { advancePauseMsRef.current = advancePauseMs; }, [advancePauseMs]);
  useEffect(() => { shuffleRef.current = shuffle; }, [shuffle]);

  const card = vocab[cardIndex];
  const t    = getTheme(dark);

  const sleep = (ms) =>
    new Promise((res) => { timeoutRef.current = setTimeout(res, ms); });

  const stopPlayback = useCallback(() => {
    stopRef.current = true;
    // Abort the currently-playing clip immediately
    if (abortCtrlRef.current) {
      abortCtrlRef.current.abort();
      abortCtrlRef.current = null;
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsPlaying(false);
    setCurrentRep(0);
  }, []);

  const speakOnce = useCallback((text, lang, rate) => {
    if (stopRef.current) return Promise.resolve();
    // Create a fresh AbortController for this clip
    const ctrl = new AbortController();
    abortCtrlRef.current = ctrl;
    return playAudio(text, lang, rate, ctrl.signal).then(() => {
      if (abortCtrlRef.current === ctrl) abortCtrlRef.current = null;
    });
  }, []);

  const playCardReps = useCallback(async (text) => {
    const times = repeatCountRef.current;
    const rate  = speedRef.current;
    const pause = pauseMsRef.current;
    setCurrentRep(0);
    for (let i = 1; i <= times; i++) {
      if (stopRef.current) return false;
      setCurrentRep(i);
      await speakOnce(text, "vi", rate);
      if (stopRef.current) return false;
      if (i < times) await sleep(pause);
    }
    return !stopRef.current;
  }, [speakOnce]);

  const runSession = useCallback(async (startIndex) => {
    stopRef.current = false;
    setIsPlaying(true);

    let order;
    if (shuffleRef.current) {
      order = [...Array(vocab.length).keys()];
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
    } else {
      order = [...Array(vocab.length).keys()].map(i => (startIndex + i) % vocab.length);
    }

    for (const idx of order) {
      if (stopRef.current) break;
      setCardIndex(idx);
      setCurrentRep(0);
      setShowTranslation(false);
      await speakOnce(vocab[idx].native, "en", speedRef.current);
      if (stopRef.current) break;
      await sleep(300);
      if (stopRef.current) break;
      setShowTranslation(true);
      const completed = await playCardReps(vocab[idx].target);
      if (!completed) break;
      await sleep(advancePauseMsRef.current);
    }

    setIsPlaying(false);
    setCurrentRep(0);
  }, [vocab, speakOnce, playCardReps]);

  const handlePlay = () => {
    if (isPlaying) stopPlayback();
    else runSession(cardIndex);
  };

  const handleNav = (dir) => {
    stopPlayback();
    setShowTranslation(false);
    setCardIndex((p) => {
      const n = p + dir;
      if (n < 0) return vocab.length - 1;
      if (n >= vocab.length) return 0;
      return n;
    });
  };

  const deckProgress = ((cardIndex + 1) / vocab.length) * 100;

  return (
    <div style={{ minHeight: "100vh", background: t.pageBg, display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 16px", position: "relative" }}>
      <div style={{ width: "100%", maxWidth: 520 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
          <button
            onClick={() => { stopPlayback(); onBack(); }}
            style={{ background: t.cardBg, border: "none", borderRadius: 12, width: 40, height: 40, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: t.btnShadow, color: t.textPrimary, flexShrink: 0 }}
          >←</button>
          <div style={{ flex: 1, textAlign: "center" }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: t.textSecondary }}>
              {cat.emoji} {cat.label}
            </span>
          </div>
          <div style={{ width: 40 }} />
        </div>

        {/* Main card — tap to reveal */}
        <div
          onClick={() => setShowTranslation(v => !v)}
          style={{
            background: t.cardBg,
            borderRadius: 28,
            boxShadow: t.cardShadow,
            marginBottom: 20,
            overflow: "hidden",
            cursor: "pointer",
            border: `2px solid ${isPlaying ? cat.color + "88" : "transparent"}`,
            transition: "border-color 0.3s, box-shadow 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = `${t.cardShadow}, 0 0 0 3px ${cat.color}22`; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = t.cardShadow; }}
        >
          {/* Colour accent strip */}
          <div style={{ height: 6, background: `linear-gradient(90deg, ${cat.color}, ${cat.color}88)` }} />

          <div style={{ padding: "36px 32px 32px" }}>
            {/* Vietnamese word */}
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{
                fontSize: card.target.length > 20 ? 28 : card.target.length > 12 ? 34 : 40,
                fontWeight: 800,
                color: t.textPrimary,
                lineHeight: 1.25,
                letterSpacing: "-0.5px",
              }}>
                {card.target}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: t.textMuted + "22", marginBottom: 24 }} />

            {/* English translation — revealed on tap */}
            <div style={{ textAlign: "center", minHeight: 48, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
              {showTranslation ? (
                <div style={{ animation: "slideUp 0.22s ease" }}>
                  <div style={{ fontSize: 22, fontWeight: 600, color: cat.color }}>
                    {card.native}
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 32, height: 2, borderRadius: 1, background: t.textMuted + "44" }} />
                  <span style={{ fontSize: 13, color: t.textMuted, fontStyle: "italic", letterSpacing: "0.3px" }}>
                    tap to reveal
                  </span>
                  <div style={{ width: 32, height: 2, borderRadius: 1, background: t.textMuted + "44" }} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress bar + counter */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: t.textSecondary, fontWeight: 500 }}>
              {cardIndex + 1} / {vocab.length}
            </span>
            {isPlaying && currentRep > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: cat.color + "22", borderRadius: 20, padding: "4px 12px" }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: cat.color, animation: "pulse 1s infinite" }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: cat.color }}>{currentRep}/{repeatCount}</span>
              </div>
            )}
          </div>
          <div style={{ height: 4, background: t.trackBg, borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${deckProgress}%`, background: cat.color, borderRadius: 4, transition: "width 0.4s ease" }} />
          </div>
        </div>

        {/* Status */}
        <div style={{ minHeight: 64, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
          {isPlaying && currentRep > 0 ? (
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <ProgressRing current={currentRep} total={repeatCount} size={60} color={cat.color} trackColor={t.trackBg} />
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: t.textPrimary }}>Rep {currentRep} of {repeatCount}</div>
                <div style={{ fontSize: 13, color: t.textSecondary }}>Vietnamese</div>
              </div>
            </div>
          ) : isPlaying ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: cat.color, animation: "pulse 1s infinite" }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: t.textSecondary }}>English…</span>
            </div>
          ) : null}
        </div>

        {/* Play / nav buttons */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20 }}>
          <button
            onClick={() => handleNav(-1)}
            style={{ width: 52, height: 52, borderRadius: "50%", border: "none", background: t.navBtnBg, color: t.navBtnColor, fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: t.btnShadow, transition: "all 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
            onMouseLeave={e => e.currentTarget.style.transform = ""}
          >‹</button>
          <button
            onClick={handlePlay}
            style={{ width: 80, height: 80, borderRadius: "50%", border: "none", background: isPlaying ? "#ef4444" : cat.color, color: "#fff", fontSize: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 24px ${isPlaying ? t.playShadowOn : cat.color + "66"}`, transition: "all 0.2s" }}
          >{isPlaying ? "■" : "▶"}</button>
          <button
            onClick={() => handleNav(1)}
            style={{ width: 52, height: 52, borderRadius: "50%", border: "none", background: t.navBtnBg, color: t.navBtnColor, fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: t.btnShadow, transition: "all 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
            onMouseLeave={e => e.currentTarget.style.transform = ""}
          >›</button>
        </div>

      </div>

      <style>{`
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes slideUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}
