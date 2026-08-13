import { useState } from "react";
import { chatWithCreditAgent } from "../api/client.js";

export default function CreditAgent() {
  const [messages, setMessages] = useState([]); // {role, content}
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const data = await chatWithCreditAgent({
        user_id: "demo-user", // swap for real authenticated user id
        session_id: sessionId,
        message: input,
      });
      setSessionId(data.session_id);
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Error: could not reach the agent." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>AI Credit Agent</h2>
      <div style={{ border: "1px solid #ddd", minHeight: 300, padding: 12, marginBottom: 12 }}>
        {messages.map((m, i) => (
          <p key={i}>
            <strong>{m.role === "user" ? "You" : "Agent"}:</strong> {m.content}
          </p>
        ))}
        {loading && <p><em>Agent is thinking...</em></p>}
      </div>
      <form onSubmit={send} style={{ display: "flex", gap: 8 }}>
        <input
          style={{ flex: 1 }}
          placeholder="Ask about a loan or start an application..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" disabled={loading}>Send</button>
      </form>
    </div>
  );
}
