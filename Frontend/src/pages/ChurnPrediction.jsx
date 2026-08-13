import { useState } from "react";
import { predictChurn } from "../api/client.js";

const initial = {
  customer_id: "",
  tenure_months: 12,
  monthly_transactions: 10,
  avg_balance: 25000,
  num_support_tickets: 1,
  has_active_loan: false,
};

export default function ChurnPrediction() {
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
      setResult(await predictChurn(form));
    } catch (err) {
      setError(err.response?.data?.detail || "Request failed");
    }
  };

  return (
    <div>
      <h2>Churn Prediction</h2>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 360 }}>
        <input placeholder="Customer ID" value={form.customer_id} onChange={update("customer_id")} required />
        <label>Tenure (months) <input type="number" value={form.tenure_months} onChange={update("tenure_months")} /></label>
        <label>Monthly Transactions <input type="number" value={form.monthly_transactions} onChange={update("monthly_transactions")} /></label>
        <label>Avg Balance <input type="number" value={form.avg_balance} onChange={update("avg_balance")} /></label>
        <label>Support Tickets <input type="number" value={form.num_support_tickets} onChange={update("num_support_tickets")} /></label>
        <label><input type="checkbox" checked={form.has_active_loan} onChange={update("has_active_loan")} /> Has active loan</label>
        <button type="submit">Predict Churn</button>
      </form>

      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {result && (
        <div style={{ marginTop: 16, padding: 12, border: "1px solid #ddd" }}>
          <p><strong>Churn Probability:</strong> {result.churn_probability}</p>
          <p><strong>Will Churn:</strong> {result.will_churn ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  );
}
