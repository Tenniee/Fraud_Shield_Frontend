export default function Navbar({ current, setCurrent }) {
  const tabs = [
    { key: "scan", label: "Scan" },
    { key: "history", label: "History" },
    { key: "admin", label: "Admin" },
  ];

  return (
    <div style={{
      display: "flex",
      gap: "10px",
      padding: "16px 20px",
      borderBottom: "1px solid #1E3A56",
      background: "#0B1829"
    }}>
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => setCurrent(tab.key)}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            border: "1px solid #1E3A56",
            background: current === tab.key ? "#00C49A22" : "transparent",
            color: current === tab.key ? "#00C49A" : "#4A6080",
            cursor: "pointer"
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
