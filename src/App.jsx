import { useState } from "react";

import Navbar from "./components/Navbar.jsx";
import FraudShieldScanner from "./components/FraudShieldScanner.jsx";
import FraudShieldAdminDashboard from "./components/FraudShieldAdminDashboard.jsx";
import FraudShieldScanHistory from "./components/FraudShieldScanHistory.jsx";

export default function App() {
  const [page, setPage] = useState("scan");

  return (
    <div style={{ minHeight: "100vh", background: "#0B1829", color: "#DCE8F5" }}>
      
      {/* NAVBAR */}
      <Navbar current={page} setCurrent={setPage} />

      {/* PAGE SWITCHING */}
      {page === "scan" && <FraudShieldScanner />}
      {page === "history" && <FraudShieldScanHistory />}
      {page === "admin" && <FraudShieldAdminDashboard />}
      
    </div>
  );
}
