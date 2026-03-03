import { useState } from "react";
import { getTheme } from "./lib/theme";
import HomeScreen from "./screens/HomeScreen";
import PreviewScreen from "./screens/PreviewScreen";
import StudyScreen from "./screens/StudyScreen";

export default function App() {
  // Global state
  const [dark, setDark] = useState(true);
  const [screen, setScreen] = useState("home"); // "home" | "preview" | "study"
  const [categoryId, setCategoryId] = useState(null);

  // Settings
  const [repeatCount, setRepeatCount] = useState(5);
  const [speed, setSpeed] = useState(0.85);
  const [pauseMs, setPauseMs] = useState(800);
  const [advancePauseMs, setAdvancePauseMs] = useState(500);
  const [shuffle, setShuffle] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const t = getTheme(dark);

  const handleSelect = (id) => {
    setCategoryId(id);
    setScreen("preview");
  };

  const handleStart = () => setScreen("study");

  const handleBackToHome = () => {
    setCategoryId(null);
    setScreen("home");
  };

  const handleBackToPreview = () => setScreen("preview");

  // Speed label helper
  const speedLabel = (v) => {
    if (v <= 0.6) return "Slow";
    if (v <= 0.9) return "Normal";
    if (v <= 1.1) return "Fast";
    return "Very Fast";
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Screens */}
      {screen === "home" && (
        <HomeScreen dark={dark} onSelect={handleSelect} />
      )}
      {screen === "preview" && (
        <PreviewScreen
          categoryId={categoryId}
          dark={dark}
          onBack={handleBackToHome}
          onStart={handleStart}
        />
      )}
      {screen === "study" && (
        <StudyScreen
          categoryId={categoryId}
          dark={dark}
          onBack={handleBackToPreview}
          repeatCount={repeatCount}
          speed={speed}
          pauseMs={pauseMs}
          advancePauseMs={advancePauseMs}
          shuffle={shuffle}
        />
      )}

      {/* Floating buttons — hidden on study screen */}
      {screen !== "study" && (
        <div style={{ position: "fixed", bottom: 24, right: 20, display: "flex", flexDirection: "column", gap: 10, zIndex: 100 }}>
          <button
            onClick={() => setShowSettings(true)}
            title="Settings"
            style={{ width: 44, height: 44, borderRadius: "50%", border: "none", background: t.cardBg, boxShadow: t.btnShadow, fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: t.textPrimary, transition: "all 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseLeave={e => e.currentTarget.style.transform = ""}
          >⚙️</button>
          <button
            onClick={() => setDark(d => !d)}
            title="Toggle theme"
            style={{ width: 44, height: 44, borderRadius: "50%", border: "none", background: t.cardBg, boxShadow: t.btnShadow, fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: t.textPrimary, transition: "all 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseLeave={e => e.currentTarget.style.transform = ""}
          >{dark ? "☀️" : "🌙"}</button>
        </div>
      )}

      {/* Settings sheet backdrop */}
      {showSettings && (
        <div
          onClick={() => setShowSettings(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, backdropFilter: "blur(2px)" }}
        />
      )}

      {/* Settings sheet */}
      <div style={{
        position: "fixed",
        bottom: 0, left: 0, right: 0,
        background: t.panelBg,
        borderRadius: "24px 24px 0 0",
        padding: "28px 24px 40px",
        zIndex: 201,
        boxShadow: "0 -8px 40px rgba(0,0,0,0.25)",
        transform: showSettings ? "translateY(0)" : "translateY(110%)",
        transition: "transform 0.35s cubic-bezier(0.34,1.2,0.64,1)",
        maxWidth: 560,
        margin: "0 auto",
      }}>
        {/* Drag handle */}
        <div style={{ width: 40, height: 4, borderRadius: 2, background: t.textMuted, margin: "0 auto 24px", opacity: 0.4 }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: t.textPrimary }}>Settings</h3>
          <button
            onClick={() => setShowSettings(false)}
            style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: t.textMuted, padding: 0, lineHeight: 1 }}
          >✕</button>
        </div>

        {/* Repeat count */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: t.settingsLabel }}>Repetitions</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: t.settingsValue }}>{repeatCount}×</span>
          </div>
          <input type="range" min={1} max={10} value={repeatCount} onChange={e => setRepeatCount(+e.target.value)}
            style={{ width: "100%", accentColor: "#6366f1" }} />
        </div>

        {/* Speed */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: t.settingsLabel }}>Speech speed</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: t.settingsValue }}>{speedLabel(speed)}</span>
          </div>
          <input type="range" min={0.5} max={1.3} step={0.05} value={speed} onChange={e => setSpeed(+e.target.value)}
            style={{ width: "100%", accentColor: "#6366f1" }} />
        </div>

        {/* Pause between reps */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: t.settingsLabel }}>Pause between reps</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: t.settingsValue }}>{(pauseMs / 1000).toFixed(1)}s</span>
          </div>
          <input type="range" min={0} max={3000} step={100} value={pauseMs} onChange={e => setPauseMs(+e.target.value)}
            style={{ width: "100%", accentColor: "#6366f1" }} />
        </div>

        {/* Pause between cards */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: t.settingsLabel }}>Pause between cards</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: t.settingsValue }}>{(advancePauseMs / 1000).toFixed(1)}s</span>
          </div>
          <input type="range" min={0} max={3000} step={100} value={advancePauseMs} onChange={e => setAdvancePauseMs(+e.target.value)}
            style={{ width: "100%", accentColor: "#6366f1" }} />
        </div>

        {/* Shuffle */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: t.settingsLabel }}>Shuffle cards</span>
          <button
            onClick={() => setShuffle(s => !s)}
            style={{
              width: 48, height: 26, borderRadius: 13, border: "none", cursor: "pointer",
              background: shuffle ? "#6366f1" : t.trackBg,
              position: "relative", transition: "background 0.2s",
            }}
          >
            <div style={{
              width: 20, height: 20, borderRadius: "50%", background: "#fff",
              position: "absolute", top: 3,
              left: shuffle ? 25 : 3,
              transition: "left 0.2s",
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            }} />
          </button>
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
        input[type=range] { height: 4px; }
      `}</style>
    </div>
  );
}
