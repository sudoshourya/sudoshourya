import { useState } from "react";
import { scoreLoan } from "../api/client.js";

const initial = {
  applicant_id: "",
  age: 30,
  annual_income: 600000,
  loan_amount: 200000,
  loan_term_months: 36,
  credit_history_length_years: 5,
  existing_debts: 50000,
  employment_type: "salaried",
};

export default function LoanScoring() {
  const [form, setForm] = useState(initial);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const update = (key) => (e) =>
    setForm({ ...form, [key]: e.target.type === "number" ? Number(e.target.value) : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setResult(await scoreLoan(form));
    } catch (err) {
      setError(err.response?.data?.detail || "Request failed");
    }
  };

  return (
    <div>
      <h2>Loan Scoring</h2>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 360 }}>
        <input placeholder="Applicant ID" value={form.applicant_id} onChange={update("applicant_id")} required />
        <label>Age <input type="number" value={form.age} onChange={update("age")} /></label>
        <label>Annual Income <input type="number" value={form.annual_income} onChange={update("annual_income")} /></label>
        <label>Loan Amount <input type="number" value={form.loan_amount} onChange={update("loan_amount")} /></label>
        <label>Loan Term (months) <input type="number" value={form.loan_term_months} onChange={update("loan_term_months")} /></label>
        <label>Credit History (years) <input type="number" value={form.credit_history_length_years} onChange={update("credit_history_length_years")} /></label>
        <label>Existing Debts <input type="number" value={form.existing_debts} onChange={update("existing_debts")} /></label>
        <label>
          Employment Type
          <select value={form.employment_type} onChange={update("employment_type")}>
            <option value="salaried">Salaried</option>
            <option value="self_employed">Self-employed</option>
            <option value="unemployed">Unemployed</option>
          </select>
        </label>
        <button type="submit">Score Application</button>
      </form>

      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {result && (
        <div style={{ marginTop: 16, padding: 12, border: "1px solid #ddd" }}>
          <p><strong>Credit Score:</strong> {result.credit_score}</p>
          <p><strong>Risk Band:</strong> {result.risk_band}</p>
          <p><strong>Approved:</strong> {result.approved ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  );
}
