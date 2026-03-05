import { useState, useEffect, useRef, useCallback } from "react";
import { findDeck } from "../lib/findDeck";
import { getTheme } from "../lib/theme";
import { playAudio } from "../lib/audioHelper";
import CardImage from "../components/CardImage";
import ProgressRing from "../components/ProgressRing";

export default function StudyScreen({
  categoryId, dark, onBack,
  repeatCount, speed, pauseMs, advancePauseMs, shuffle,
}) {
  const cat   = findDeck(categoryId);
  const vocab = cat.vocab;

  const [cardIndex, setCardIndex]         = useState(0);
  const [currentRep, setCurrentRep]       = useState(0);
  const [isPlaying, setIsPlaying]         = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  // Refs for async loop
  const stopRef            = useRef(false);
  const timeoutRef         = useRef(null);
  const activeAudioRef     = useRef(null); // current HTMLAudioElement
  const repeatCountRef     = useRef(repeatCount);
  const speedRef           = useRef(speed);
  const pauseMsRef         = useRef(pauseMs);
  const advancePauseMsRef  = useRef(advancePauseMs);
  const shuffleRef         = useRef(shuffle);

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
    // Stop any playing HTML5 audio
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    window.speechSynthesis.cancel();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsPlaying(false);
    setCurrentRep(0);
  }, []);

  // Wraps playAudio so we can cancel mid-playback via stopRef
  const speakOnce = useCallback((text, lang, rate) => {
    if (stopRef.current) return Promise.resolve();
    return playAudio(text, lang, rate);
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
      // Speak English once
      await speakOnce(vocab[idx].native, "en", speedRef.current);
      if (stopRef.current) break;
      await sleep(300);
      if (stopRef.current) break;
      setShowTranslation(true);
      // Repeat Vietnamese N times
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

  const deckProgress = (cardIndex / vocab.length) * 100;

  return (
    <div style={{ minHeight: "100vh", background: t.pageBg, fontFamily: "'Segoe UI', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 16px", position: "relative" }}>
      <div style={{ width: "100%", maxWidth: 520 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
          <button onClick={() => { stopPlayback(); onBack(); }} style={{ background: t.cardBg, border: "none", borderRadius: 12, width: 40, height: 40, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: t.btnShadow, color: t.textPrimary, flexShrink: 0 }}>←</button>
        </div>

        {/* Main card */}
        <div style={{ background: t.cardBg, borderRadius: 24, boxShadow: t.cardShadow, padding: "32px 28px 28px", marginBottom: 16, border: `2px solid ${isPlaying ? cat.color : "transparent"}`, transition: "border-color 0.3s" }}>
          {/* Image — click to reveal translation */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <div
              onClick={() => setShowTranslation(v => !v)}
              style={{ cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s", borderRadius: 28, boxShadow: showTranslation ? `0 0 0 3px ${cat.color}` : "none" }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={e => e.currentTarget.style.transform = ""}
            >
              <CardImage native={card.native} color={cat.color} size={110} fontSize={42} borderRadius={28} />
            </div>
          </div>

          {/* Vietnamese */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: t.textPrimary, lineHeight: 1.3 }}>{card.target}</div>
          </div>

          {/* Translation */}
          <div style={{ textAlign: "center", minHeight: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {showTranslation ? (
              <div style={{ fontSize: 19, color: t.settingsLabel, fontWeight: 600, animation: "fadeIn 0.3s ease" }}>"{card.native}"</div>
            ) : (
              <div style={{ fontSize: 13, color: t.textMuted, fontStyle: "italic" }}>tap image to reveal</div>
            )}
          </div>
        </div>

        {/* Progress bar + card counter */}
        <div style={{ marginBottom: 16, marginTop: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: t.textSecondary, fontWeight: 500 }}>Card {cardIndex + 1} of {vocab.length}</span>
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
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20, marginBottom: 16 }}>
          <button onClick={() => handleNav(-1)}
            style={{ width: 52, height: 52, borderRadius: "50%", border: "none", background: t.navBtnBg, color: t.navBtnColor, fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: t.btnShadow, transition: "all 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
            onMouseLeave={e => e.currentTarget.style.transform = ""}
          >‹</button>
          <button onClick={handlePlay}
            style={{ width: 80, height: 80, borderRadius: "50%", border: "none", background: isPlaying ? "#ef4444" : cat.color, color: "#fff", fontSize: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 24px ${isPlaying ? t.playShadowOn : cat.color + "66"}`, transition: "all 0.2s" }}
          >{isPlaying ? "■" : "▶"}</button>
          <button onClick={() => handleNav(1)}
            style={{ width: 52, height: 52, borderRadius: "50%", border: "none", background: t.navBtnBg, color: t.navBtnColor, fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: t.btnShadow, transition: "all 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
            onMouseLeave={e => e.currentTarget.style.transform = ""}
          >›</button>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
      `}</style>
    </div>
  );
}
