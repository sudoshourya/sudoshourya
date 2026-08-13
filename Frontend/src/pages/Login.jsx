import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, signup } from "../api/client.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const fn = mode === "login" ? login : signup;
      const data = mode === "login" ? await login(email, password) : await signup(email, password);
      localStorage.setItem("access_token", data.access_token);
      navigate("/loan-scoring");
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    }
  };

  return (
    <div>
      <h2>{mode === "login" ? "Log in" : "Sign up"}</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 320 }}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">{mode === "login" ? "Log in" : "Sign up"}</button>
      </form>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <button onClick={() => setMode(mode === "login" ? "signup" : "login")} style={{ marginTop: 8 }}>
        {mode === "login" ? "Need an account? Sign up" : "Already have an account? Log in"}
      </button>
    </div>
  );
}
