import { Routes, Route, Link, useNavigate } from "react-router-dom";
import LoanScoring from "./pages/LoanScoring.jsx";
import ChurnPrediction from "./pages/ChurnPrediction.jsx";
import FraudDetection from "./pages/FraudDetection.jsx";
import RBIQA from "./pages/RBIQA.jsx";
import CreditAgent from "./pages/CreditAgent.jsx";
import Login from "./pages/Login.jsx";

const modules = [
  { path: "/loan-scoring", label: "Loan Scoring" },
  { path: "/churn-prediction", label: "Churn Prediction" },
  { path: "/fraud-detection", label: "Fraud Detection" },
  { path: "/rbi-qa", label: "RBI Compliance Q&A" },
  { path: "/credit-agent", label: "AI Credit Agent" },
];

function Nav() {
  const navigate = useNavigate();
  const isAuthed = Boolean(localStorage.getItem("access_token"));

  const logout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <nav style={{ display: "flex", gap: 16, padding: 16, borderBottom: "1px solid #ddd" }}>
      <strong>Fintech AI Platform</strong>
      {modules.map((m) => (
        <Link key={m.path} to={m.path}>{m.label}</Link>
      ))}
      <span style={{ marginLeft: "auto" }}>
        {isAuthed ? (
          <button onClick={logout}>Log out</button>
        ) : (
          <Link to="/login">Log in</Link>
        )}
      </span>
    </nav>
  );
}

export default function App() {
  return (
    <div>
      <Nav />
      <main style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/loan-scoring" element={<LoanScoring />} />
          <Route path="/churn-prediction" element={<ChurnPrediction />} />
          <Route path="/fraud-detection" element={<FraudDetection />} />
          <Route path="/rbi-qa" element={<RBIQA />} />
          <Route path="/credit-agent" element={<CreditAgent />} />
        </Routes>
      </main>
    </div>
  );
}
