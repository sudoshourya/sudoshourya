import { useState } from "react";
import { askRBI } from "../api/client.js";

export default function RBIQA() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      setResult(await askRBI({ question }));
    } catch (err) {
      setError(err.response?.data?.detail || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>RBI Compliance Q&amp;A</h2>
      <form onSubmit={submit} style={{ display: "flex", gap: 8 }}>
        <input
          style={{ flex: 1 }}
          placeholder="Ask about RBI regulations..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>{loading ? "Asking..." : "Ask"}</button>
      </form>

      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {result && (
        <div style={{ marginTop: 16, padding: 12, border: "1px solid #ddd" }}>
          <p>{result.answer}</p>
          {result.sources?.length > 0 && (
            <p style={{ fontSize: 12, color: "#666" }}>
              Sources: {result.sources.join(", ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
