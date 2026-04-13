import { useEffect, useState } from "react";

const API_URL = window.location.origin;
const PAGE_SIZE = 20;

export default function FraudShieldScanHistory() {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({ SAFE: 0, CAUTION: 0, HIGH_RISK: 0, total: 0 });
  const [currentPage, setCurrentPage] = useState(0);
  const [currentFilter, setCurrentFilter] = useState("ALL");
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [currentPage]);

  const loadHistory = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        limit: PAGE_SIZE,
        offset: currentPage * PAGE_SIZE,
        days: 30,
      });

      const res = await fetch(`${API_URL}/audit/history?${params}`);
      const data = await res.json();

      setRecords(data.records || []);
      setTotalRecords(data.total || 0);
      setLoading(false);

      loadStats();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const res = await fetch(`${API_URL}/audit/history?limit=1000&days=30`);
      const data = await res.json();

      const s = { SAFE: 0, CAUTION: 0, HIGH_RISK: 0 };
      data.records.forEach((r) => {
        if (s[r.risk_band] !== undefined) s[r.risk_band]++;
      });

      setStats({ ...s, total: data.total });
    } catch {}
  };

  const filtered =
    currentFilter === "ALL"
      ? records
      : records.filter((r) => r.risk_band === currentFilter);

  const totalPages = Math.ceil(totalRecords / PAGE_SIZE);

  return (
    <>
      <style>{`
        body{background:#0B1829;color:#DCE8F5;font-family:Inter}
        .app{max-width:840px;margin:auto;padding:40px 24px}

        .header{display:flex;align-items:center;margin-bottom:30px}
        .brand{font-weight:600}
        .brand span{color:#00C49A}
        
        .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:20px 0}
        .card{background:#112338;padding:14px;border-radius:8px}
        .value{font-size:22px}
        .label{font-size:11px;color:#4A6080}

        .filters{display:flex;gap:8px;margin-bottom:10px}
        .btn{padding:6px 12px;border:1px solid #1E3A56;background:none;color:#4A6080;border-radius:6px;cursor:pointer}
        .btn.active{color:#00C49A;border-color:#00C49A}

        .table{background:#0E1F33;border-radius:10px;padding:10px}
        .row{display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr 1fr;padding:8px 0;font-size:12px}
        .badge{padding:2px 8px;border-radius:10px;font-size:11px}
        .SAFE{background:#00C49A22;color:#00C49A}
        .CAUTION{background:#DD8A0022;color:#DD8A00}
        .HIGH_RISK{background:#FF6B6B22;color:#FF6B6B}

        .pagination{margin-top:10px;display:flex;justify-content:center;gap:10px}
        .page-btn{padding:6px 12px;border:1px solid #1E3A56;background:none;color:#aaa;border-radius:6px;cursor:pointer}
      `}</style>

      <div className="app">
        {/* HEADER */}
        <div className="header">
          <div className="brand">
            Fraud<span>Shield</span>
          </div>
        </div>

        {/* STATS */}
        <div className="stats">
          <Stat label="Total" value={stats.total} />
          <Stat label="Safe" value={stats.SAFE} />
          <Stat label="Caution" value={stats.CAUTION} />
          <Stat label="High Risk" value={stats.HIGH_RISK} />
        </div>

        {/* FILTERS */}
        <div className="filters">
          {["ALL", "SAFE", "CAUTION", "HIGH_RISK"].map((f) => (
            <button
              key={f}
              className={`btn ${currentFilter === f ? "active" : ""}`}
              onClick={() => {
                setCurrentFilter(f);
                setCurrentPage(0);
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div className="table">
          {loading ? (
            <div>Loading...</div>
          ) : filtered.length === 0 ? (
            <div>No scans found</div>
          ) : (
            filtered.map((r, i) => (
              <div className="row" key={i}>
                <span>{new Date(r.timestamp).toLocaleString()}</span>
                <span>
                  <span className={`badge ${r.risk_band}`}>
                    {r.risk_band}
                  </span>
                </span>
                <span>{r.risk_score}</span>
                <span>{r.detected_language}</span>
                <span>{r.source}</span>
                <span>
                  {r.user_confirmed_fraud ? "✓ Confirmed" : "—"}
                </span>
              </div>
            ))
          )}
        </div>

        {/* PAGINATION */}
        <div className="pagination">
          <button
            className="page-btn"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>

          <span style={{ fontSize: "12px" }}>
            Page {currentPage + 1} of {totalPages || 1}
          </span>

          <button
            className="page-btn"
            disabled={currentPage >= totalPages - 1}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

/* SMALL COMPONENT */
function Stat({ label, value }) {
  return (
    <div className="card">
      <div className="value">{value}</div>
      <div className="label">{label}</div>
    </div>
  );
}
