const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const SESSION_KEY = 'quickbite_auth'

export function getStoredSession() {
  const saved = localStorage.getItem(SESSION_KEY)
  if (!saved) return null

  try {
    return JSON.parse(saved)
  } catch {
    clearSession()
    return null
  }
}

export function storeSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export async function apiRequest(path, options = {}) {
  const session = getStoredSession()
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }

  return data
}
