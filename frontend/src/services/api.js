// Thin wrapper around the backend auth API + token storage.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const TOKEN_KEY = 'auth_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

// Core request helper. Attaches the Bearer token and parses JSON.
async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`)
  }
  return data
}

export const api = {
  register: (payload) => request('/api/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/api/auth/login', { method: 'POST', body: payload }),
  me: () => request('/api/auth/me', { auth: true }),

  // Shared: any authenticated role.
  stats: () => request('/api/users/stats', { auth: true }),

  // Admin-only (server returns 403 for viewers).
  listUsers: () => request('/api/users', { auth: true }),
  updateUserRole: (id, role) =>
    request(`/api/users/${id}/role`, { method: 'PATCH', body: { role }, auth: true }),
  deleteUser: (id) => request(`/api/users/${id}`, { method: 'DELETE', auth: true }),
}
