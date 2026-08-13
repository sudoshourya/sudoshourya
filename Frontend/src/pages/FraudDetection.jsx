import { useState } from "react";
import { checkFraud } from "../api/client.js";

const initial = {
  transaction_id: "",
  amount: 5000,
  merchant_category: "retail",
  hour_of_day: 14,
  is_international: false,
  device_change_flag: false,
};

export default function FraudDetection() {
  const [form, setForm] = useState(initial);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const update = (key) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked
      : e.target.type === "number" ? Number(e.target.value)
      : e.target.value;
    setForm({ ...form, [key]: val });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setResult(await checkFraud(form));
    } catch (err) {
      setError(err.response?.data?.detail || "Request failed");
    }
  };

  return (
    <div>
      <h2>Fraud Detection</h2>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 360 }}>
        <input placeholder="Transaction ID" value={form.transaction_id} onChange={update("transaction_id")} required />
        <label>Amount <input type="number" value={form.amount} onChange={update("amount")} /></label>
        <input placeholder="Merchant Category" value={form.merchant_category} onChange={update("merchant_category")} />
        <label>Hour of Day (0-23) <input type="number" value={form.hour_of_day} onChange={update("hour_of_day")} /></label>
        <label><input type="checkbox" checked={form.is_international} onChange={update("is_international")} /> International</label>
        <label><input type="checkbox" checked={form.device_change_flag} onChange={update("device_change_flag")} /> Device changed</label>
        <button type="submit">Check Transaction</button>
      </form>

      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {result && (
        <div style={{ marginTop: 16, padding: 12, border: "1px solid #ddd" }}>
          <p><strong>Fraud Score:</strong> {result.fraud_score}</p>
          <p><strong>Is Fraud:</strong> {result.is_fraud ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  );
}
