import { RiskBadge } from "./RiskBadge.jsx";

const GLOW        = { HIGH: "0 0 40px rgba(244,63,94,0.15)",  MEDIUM: "0 0 40px rgba(251,146,60,0.12)", LOW: "0 0 40px rgba(52,211,153,0.1)"  };
const BORDER      = { HIGH: "var(--high-border)",             MEDIUM: "var(--medium-border)",           LOW: "var(--low-border)"               };
const ACTION_CLR  = { BLOCK: "var(--high)",   CAUTION: "var(--medium)",    TRUST: "var(--low)"   };
const ACTION_BG   = { BLOCK: "var(--high-bg)", CAUTION: "var(--medium-bg)", TRUST: "var(--low-bg)" };

export function ResultCard({ result }) {
  if (!result) return null;
  const { risk_level, risk_score, summary, reasons, what_to_do, action } = result;

  return (
    <div style={{
      marginTop: "32px",
      background: "var(--surface)",
      border: `1px solid ${BORDER[risk_level]}`,
      borderRadius: "var(--radius)",
      padding: "28px",
      boxShadow: GLOW[risk_level],
      display: "flex", flexDirection: "column", gap: "22px",
      animation: "fadeUp 0.35s ease",
    }}>

      {/* Top row — badge + score + action */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
        <RiskBadge level={risk_level} />
        <span style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "var(--font-mono)", letterSpacing: "-0.02em" }}>
          {risk_score}<span style={{ fontSize: "0.85rem", color: "var(--muted)", fontWeight: 400 }}>/100</span>
        </span>
        <span style={{
          marginLeft: "auto",
          padding: "4px 12px", borderRadius: "999px",
          background: ACTION_BG[action], color: ACTION_CLR[action],
          fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.1em",
          border: `1px solid ${ACTION_CLR[action]}44`,
        }}>{action}</span>
      </div>

      <div style={{ height: "1px", background: "var(--border)" }} />

      {/* Summary */}
      <p style={{ fontSize: "1rem", lineHeight: 1.65 }}>{summary}</p>

      {/* Reasons */}
      <div>
        <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--muted)", marginBottom: "10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Why we flagged this
        </p>
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
          {reasons.map((r, i) => (
            <li key={i} style={{
              display: "flex", gap: "12px", alignItems: "flex-start",
              padding: "10px 14px",
              background: "var(--surface2)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)", fontSize: "0.88rem", lineHeight: 1.55,
            }}>
              <span style={{
                flexShrink: 0, width: "20px", height: "20px", borderRadius: "50%",
                background: "var(--border2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.7rem", fontWeight: 700, color: "var(--muted)",
                fontFamily: "var(--font-mono)",
              }}>{i + 1}</span>
              {r}
            </li>
          ))}
        </ul>
      </div>

      {/* Advice */}
      <div style={{
        padding: "14px 18px",
        background: "rgba(14,165,233,0.06)", border: "1px solid rgba(14,165,233,0.18)",
        borderRadius: "var(--radius-sm)", fontSize: "0.9rem", lineHeight: 1.6,
      }}>
        <span style={{ color: "var(--accent)", fontWeight: 700 }}>What to do: </span>
        {what_to_do}
      </div>
    </div>
  );
}