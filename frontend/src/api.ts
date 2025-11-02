const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

type Credentials = { email: string; password: string };

export async function login(creds: Credentials) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(creds),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function register(data: { name: string; email: string; password: string; password_confirmation: string }) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function authHeaders(token?: string): HeadersInit {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function fetchTasks(token?: string) {
  const res = await fetch(`${API_BASE}/tasks`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createTask(payload: any, token?: string) {
  const res = await fetch(`${API_BASE}/tasks`, { method: 'POST', headers: authHeaders(token), body: JSON.stringify(payload) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function toggleTask(id: number, token?: string) {
  const res = await fetch(`${API_BASE}/tasks/${id}/toggle`, { method: 'PATCH', headers: authHeaders(token) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateTask(id: number, payload: any, token?: string) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'PUT', headers: authHeaders(token), body: JSON.stringify(payload) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteTask(id: number, token?: string) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE', headers: authHeaders(token) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export default API_BASE;
