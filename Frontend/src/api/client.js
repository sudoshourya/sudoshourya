import axios from "axios";

// Point this at your Railway backend URL in production (via .env: VITE_API_URL)
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const client = axios.create({ baseURL: API_BASE_URL });

// Attach JWT to every request if present
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;

// --- Module-specific API calls ---

export const scoreLoan = (payload) =>
  client.post("/api/loan-scoring/score", payload).then((r) => r.data);

export const predictChurn = (payload) =>
  client.post("/api/churn-prediction/predict", payload).then((r) => r.data);

export const checkFraud = (payload) =>
  client.post("/api/fraud-detection/check", payload).then((r) => r.data);

export const askRBI = (payload) =>
  client.post("/api/rbi-qa/ask", payload).then((r) => r.data);

export const chatWithCreditAgent = (payload) =>
  client.post("/api/credit-agent/chat", payload).then((r) => r.data);

export const login = (email, password) => {
  const form = new URLSearchParams();
  form.append("username", email);
  form.append("password", password);
  return client
    .post("/api/auth/login", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
    .then((r) => r.data);
};

export const signup = (email, password) =>
  client.post("/api/auth/signup", { email, password }).then((r) => r.data);
