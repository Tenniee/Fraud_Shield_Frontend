import { useState } from "react";
import { fetchDemo } from "../api.js";

const DEMOS = [
  { id: "demo1", label: "High Risk",   color: "var(--high)",   bg: "var(--high-bg)",   border: "var(--high-border)",   emoji: "🔴" },
  { id: "demo2", label: "Medium Risk", color: "var(--medium)", bg: "var(--medium-bg)", border: "var(--medium-border)", emoji: "🟡" },
  { id: "demo3", label: "Safe",        color: "var(--low)",    bg: "var(--low-bg)",    border: "var(--low-border)",    emoji: "🟢" },
];

export function MessageInput({ onScan, loading }) {
  const [text, setText]               = useState("");
  const [loadingDemo, setLoadingDemo] = useState(null);
  const [focused, setFocused]         = useState(false);

  async function handleDemo(id) {
    setLoadingDemo(id);
    try {
      const { message } = await fetchDemo(id);
      setText(message);
    } catch {
      alert("Could not load demo — is the backend running?");
    } finally {
      setLoadingDemo(null);
    }
  }

  const atLimit = text.length >= 5000;
  const canScan = text.trim() && !loading;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

      {/* Demo buttons */}
      {/*<div>
        <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
          Load demo message
        </p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {DEMOS.map(({ id, label, color, bg, border, emoji }) => (
            <button key={id} onClick={() => handleDemo(id)} disabled={!!loadingDemo || loading}
              style={{ padding: "7px 16px", background: bg, color, border: `1px solid ${border}`, fontWeight: 600, fontSize: "0.82rem" }}>
              {loadingDemo === id ? "Loading…" : `${emoji} ${label}`}
            </button>
          ))}
        </div>
      </div>*/}

      {/* Textarea */}
      <div style={{ position: "relative" }}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value.slice(0, 5000))}
          onKeyDown={e => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && canScan) { e.preventDefault(); onScan(text); } }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Paste a suspicious message, email, or WhatsApp text here…"
          rows={7}
          style={{
            width: "100%",
            background: "var(--surface)",
            border: `1.5px solid ${focused ? "var(--accent)" : atLimit ? "var(--high)" : "var(--border)"}`,
            borderRadius: "var(--radius)",
            padding: "16px 16px 36px",
            color: "var(--text)",
            fontSize: "0.92rem",
            fontFamily: "var(--font-ui)",
            resize: "vertical", outline: "none", lineHeight: 1.65,
            transition: "border-color 0.18s",
            boxShadow: focused ? "0 0 0 3px rgba(14,165,233,0.1)" : "none",
          }}
        />
        <span style={{
          position: "absolute", bottom: "12px", right: "14px",
          fontSize: "0.72rem", fontFamily: "var(--font-mono)",
          color: atLimit ? "var(--high)" : "var(--muted)",
        }}>
          {text.length}/5000
        </span>
      </div>

      {/* Scan button row */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
        <button onClick={() => onScan(text)} disabled={!canScan} style={{
          padding: "11px 28px",
          background: canScan ? "linear-gradient(135deg, #0ea5e9, #0284c7)" : "var(--surface2)",
          color: canScan ? "#fff" : "var(--muted)",
          fontWeight: 700, fontSize: "0.95rem",
          boxShadow: canScan ? "0 4px 16px rgba(14,165,233,0.3)" : "none",
          border: "none",
        }}>
          🔍 Scan Message
        </button>
        <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
          or press <kbd>Ctrl+Enter</kbd>
        </span>
        {text && (
          <button onClick={() => setText("")} style={{
            marginLeft: "auto", padding: "8px 14px",
            background: "var(--surface2)", color: "var(--muted)",
            border: "1px solid var(--border)", fontSize: "0.8rem",
          }}>Clear</button>
        )}
      </div>
    </div>
  );
}