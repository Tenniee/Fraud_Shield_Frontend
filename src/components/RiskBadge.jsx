const CFG = {
  HIGH:   { color: "var(--high)",   bg: "var(--high-bg)",   border: "var(--high-border)",   emoji: "🔴", label: "HIGH RISK" },
  MEDIUM: { color: "var(--medium)", bg: "var(--medium-bg)", border: "var(--medium-border)", emoji: "🟡", label: "MEDIUM RISK" },
  LOW:    { color: "var(--low)",    bg: "var(--low-bg)",    border: "var(--low-border)",    emoji: "🟢", label: "LOW RISK" },
};

export function RiskBadge({ level }) {
  const { color, bg, border, emoji, label } = CFG[level] ?? CFG.LOW;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "7px",
      padding: "5px 14px",
      borderRadius: "999px",          /* ← pill */
      background: bg,
      border: `1.5px solid ${border}`,
      color, fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.06em",
    }}>
      {emoji} {label}
    </span>
  );
}