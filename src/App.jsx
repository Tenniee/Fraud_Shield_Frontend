import { useState, useEffect } from "react";
import { scanMessage, checkHealth } from "./api.js";
import { MessageInput } from "./components/MessageInput.jsx";
import { ResultCard } from "./components/ResultCard.jsx";

export default function App() {
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [backendOk, setBackend] = useState(null); // null=checking, true=ok, false=offline

  useEffect(() => {
    checkHealth().then(setBackend).catch(() => setBackend(false));
  }, []);

  async function handleScan(message) {
    if (!message.trim()) return;
    setLoading(true); setError(null); setResult(null);
    try { setResult(await scanMessage(message)); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ minHeight: "100vh", padding: "48px 20px 80px" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>

        {/* Header */}
        <header style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "12px" }}>
            <div style={{
              width: "48px", height: "48px",
              background: "linear-gradient(135deg, #0ea5e9, #0369a1)",
              borderRadius: "14px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "22px",
              boxShadow: "0 4px 20px rgba(14,165,233,0.35)",
            }}>🛡️</div>
            <div>
              <h1 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                Fraud<span style={{ color: "var(--accent)" }}>Shield</span>
              </h1>
              <p style={{ fontSize: "0.78rem", color: "var(--muted)" }}>AI-powered scam detection</p>
            </div>
          </div>

          <p style={{ color: "var(--muted)", fontSize: "0.92rem", maxWidth: "520px", marginBottom: "16px" }}>
            Paste any suspicious message, email, or WhatsApp text. Two-pass Claude AI will
            analyse it for fraud signals in seconds.
          </p>

          {/* Backend status pill */}
          {/*<BackendPill status={backendOk} />*/}
        </header>

        <MessageInput onScan={handleScan} loading={loading} />

        {loading && <LoadingState />}

        {error && (
          <div style={{
            marginTop: "24px", padding: "14px 18px",
            background: "var(--high-bg)", border: "1px solid var(--high-border)",
            borderRadius: "var(--radius)", color: "var(--high)", fontSize: "0.9rem",
            animation: "fadeUp 0.3s ease",
          }}>⚠️ {error}</div>
        )}

        <ResultCard result={result} />
      </div>
    </div>
  );
}

function BackendPill({ status }) {
  const cfg = {
    null:  { bg: "rgba(100,116,139,0.1)", border: "rgba(100,116,139,0.2)", color: "#64748b", label: "Checking backend…",                      anim: "pulse 1.4s ease infinite" },
    true:  { bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.25)", color: "#34d399", label: "Backend connected",                       anim: "none" },
    false: { bg: "rgba(244,63,94,0.08)",  border: "rgba(244,63,94,0.25)",  color: "#f43f5e", label: "Backend offline — start FastAPI on :8000", anim: "none" },
  };
  const s = cfg[status];

  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "8px",
      padding: "5px 14px",
      borderRadius: "999px",          /* ← this is what makes it a pill */
      background: s.bg,
      border: `1px solid ${s.border}`,
      color: s.color, fontSize: "0.78rem", fontWeight: 600,
    }}>
      <span style={{
        width: "7px", height: "7px", borderRadius: "50%",
        background: "currentColor", flexShrink: 0,
        animation: s.anim,
      }} />
      {s.label}
    </div>
  );
}

function LoadingState() {
  return (
    <div style={{ marginTop: "36px", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", color: "var(--muted)", animation: "fadeUp 0.3s ease" }}>
      <div style={{
        width: "36px", height: "36px", borderRadius: "50%",
        border: "3px solid var(--border2)", borderTop: "3px solid var(--accent)",
        animation: "spin 0.75s linear infinite",
      }} />
      <div style={{ textAlign: "center" }}>
        <div style={{ color: "var(--text)", fontWeight: 600 }}>Scanning…</div>
        <div style={{ fontSize: "0.8rem" }}>Running two-pass AI analysis</div>
      </div>
    </div>
  );
}