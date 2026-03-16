const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Helper: build headers with JWT token
const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

// ── AUTH ──────────────────────────────────────────

export async function registerUser(email, password) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Registration failed');
  return data; // { message: "User registered successfully" }
}

export async function loginUser(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Login failed');
  return data; // { access_token, token_type }
}

export async function getCurrentUser(token) {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: authHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Failed to get user');
  return data; // { id, email, created_at }
}

// ── TYPING SESSION ────────────────────────────────

export async function submitTypingSession(events, token) {
  const res = await fetch(`${BASE_URL}/session/predict`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ events }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Prediction failed');
  return data; // { session_id, probability, prediction, message }
}

// ── HISTORY ───────────────────────────────────────

export async function getSessionHistory(token) {
  const res = await fetch(`${BASE_URL}/sessions/history`, {
    headers: authHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Failed to fetch history');
  return data; // { sessions: [...] }
}

export async function getSessionDetail(sessionId, token) {
  const res = await fetch(`${BASE_URL}/sessions/${sessionId}`, {
    headers: authHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Failed to fetch session');
  return data;
}

// ── FEEDBACK ──────────────────────────────────────

export async function submitFeedback(payload, token) {
  const res = await fetch(`${BASE_URL}/feedback`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Feedback submission failed');
  return data;
}