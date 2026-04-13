import { useEffect, useState } from "react";

const API = window.location.origin;

const SRC_LABELS = {
  web_app: "Web app",
  extension: "Extension",
  whatsapp: "WhatsApp",
  gmail: "Gmail",
  api: "API",
  webhook: "Webhook",
  mobile_app: "Mobile",
  share_sheet: "Share",
  sms: "SMS",
};

export default function FraudShieldAdminDashboard() {
  const [adminKey, setAdminKey] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  const [summary, setSummary] = useState({});
  const [patterns, setPatterns] = useState({});
  const [history, setHistory] = useState([]);

  const unlock = () => {
    if (!adminKey.trim()) return;
    setUnlocked(true);
  };

  useEffect(() => {
    if (unlocked) loadAll();
  }, [unlocked]);

  const loadAll = async () => {
    await Promise.all([loadSummary(), loadPatterns(), loadHistory()]);
  };

  const loadSummary = async () => {
    try {
      const res = await fetch(
        `${API}/audit/summary?days=30&admin_key=${adminKey}`
      );

      if (res.status === 403) {
        alert("Invalid admin key");
        return;
      }

      const data = await res.json();
      setSummary(data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadPatterns = async () => {
    try {
      const res = await fetch(
        `${API}/audit/patterns?days=30&admin_key=${adminKey}`
      );
      const data = await res.json();
      setPatterns(data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadHistory = async () => {
    try {
      const res = await fetch(`${API}/audit/history?limit=10&days=7`);
      const data = await res.json();
      setHistory(data.records || []);
    } catch (e) {
      console.error(e);
    }
  };

  const total = summary.total_scans || 1;

  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:Inter, sans-serif;background:#0B1829;color:#DCE8F5}
        .app{max-width:1100px;margin:auto;padding:32px 24px 60px}
        .header{display:flex;align-items:center;gap:12px;margin-bottom:40px}
        .brand{font-size:18px;font-weight:600;color:#fff}
        .brand span{color:#00C49A}
        .admin-badge{margin-left:auto;background:#DD8A0020;border:1px solid #DD8A0044;padding:4px 10px;border-radius:6px;font-size:11px}

        .auth-gate{max-width:360px;margin:80px auto;background:#112338;padding:30px;border-radius:12px}
        .auth-input{width:100%;padding:12px;margin-bottom:12px;background:#0B1829;border:1px solid #1E3A56;color:#fff;border-radius:8px}
        .auth-btn{width:100%;padding:12px;background:#00C49A;border:none;border-radius:8px;font-weight:600;cursor:pointer}

        .cards-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:20px 0}
        .card{background:#112338;padding:18px;border-radius:10px}
        .card-num{font-size:24px;font-weight:700}
        .card-label{font-size:11px;color:#4A6080}

        .bar-row{display:flex;align-items:center;gap:10px;margin:10px 0}
        .bar-track{flex:1;height:14px;background:#0B1829;border-radius:4px}
        .bar-fill{height:100%;background:#00C49A;border-radius:4px}
        .bar-label{width:100px;font-size:12px}
        .bar-val{width:40px;font-size:11px;color:#aaa}

        .table-card{background:#0E1F33;padding:12px;border-radius:10px;margin-top:10px}
        .table-row{display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr;font-size:12px;padding:8px 0}

        .refresh-btn{padding:6px 12px;border:1px solid #1E3A56;background:none;color:#aaa;border-radius:6px;cursor:pointer}
      `}</style>

      <div className="app">
        {/* HEADER */}
        <div className="header">
          <span className="brand">
            Fraud<span>Shield</span>
          </span>
          <span className="admin-badge">Admin Dashboard</span>
        </div>

        {/* AUTH */}
        {!unlocked && (
          <div className="auth-gate">
            <input
              type="password"
              placeholder="Admin key"
              className="auth-input"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && unlock()}
            />
            <button className="auth-btn" onClick={unlock}>
              Access Dashboard
            </button>
          </div>
        )}

        {/* DASHBOARD */}
        {unlocked && (
          <>
            <button className="refresh-btn" onClick={loadAll}>
              Refresh
            </button>

            <div className="cards-row">
              <Card label="Total" value={summary.total_scans} />
              <Card label="High Risk" value={summary.by_band?.HIGH_RISK} />
              <Card label="Override" value={summary.confirmed_fraud_reports} />
              <Card label="Latency" value={`${summary.avg_latency_ms || 0}ms`} />
            </div>

            {/* BARS */}
            <div className="table-card">
              {["SAFE", "CAUTION", "HIGH_RISK"].map((band) => {
                const count = summary.by_band?.[band] || 0;
                return (
                  <BarRow
                    key={band}
                    label={band}
                    value={count}
                    percent={(count / total) * 100}
                  />
                );
              })}
            </div>

            {/* HISTORY */}
            <div className="table-card">
              {history
                .filter((r) => r.risk_band !== "SAFE")
                .slice(0, 10)
                .map((r, i) => (
                  <div key={i} className="table-row">
                    <span>{new Date(r.timestamp).toLocaleString()}</span>
                    <span>{r.risk_band}</span>
                    <span>{r.risk_score}</span>
                    <span>{SRC_LABELS[r.source]}</span>
                    <span>{r.detected_language}</span>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

/* SMALL COMPONENTS */

function Card({ label, value }) {
  return (
    <div className="card">
      <div className="card-num">{(value || 0).toLocaleString()}</div>
      <div className="card-label">{label}</div>
    </div>
  );
}

function BarRow({ label, value, percent }) {
  return (
    <div className="bar-row">
      <span className="bar-label">{label}</span>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${percent}%` }} />
      </div>
      <span className="bar-val">{value}</span>
    </div>
  );
}
