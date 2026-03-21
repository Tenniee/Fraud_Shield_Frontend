const BASE = "https://fraud-shield-backend.onrender.com";

export async function scanMessage(message) {
  const res = await fetch(`${BASE}/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Scan failed");
  }
  return res.json();
}

export async function fetchDemo(id) {
  const res = await fetch(`${BASE}/demo/${id}`);
  if (!res.ok) throw new Error("Could not load demo");
  return res.json();
}

export async function checkHealth() {
  const res = await fetch(`${BASE}/health`);
  return res.ok;
}