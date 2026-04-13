import { useState, useEffect } from "react";
import { scanMessage, checkHealth } from "../api.js";
import { MessageInput } from "../components/MessageInput.jsx";
import { ResultCard } from "../components/ResultCard.jsx";

export default function FraudShieldScanner() {
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [backendOk, setBackend] = useState(null);

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
    <div style={{ padding: "40px 20px" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>

        <h1 style={{ fontSize: "1.6rem", marginBottom: "10px" }}>
          Fraud<span style={{ color: "#00C49A" }}>Shield</span>
        </h1>

        <p style={{ marginBottom: "20px", color: "#4A6080" }}>
          Paste any suspicious message and scan for fraud signals.
        </p>

        <MessageInput onScan={handleScan} loading={loading} />

        {loading && <LoadingState />}

        {error && <div style={{ color: "red", marginTop: "20px" }}>⚠️ {error}</div>}

        <ResultCard result={result} />
      </div>
    </div>
  );
}

/* Loader */
function LoadingState() {
  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      Scanning...
    </div>
  );
}
