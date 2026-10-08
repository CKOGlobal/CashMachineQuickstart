// src/access.js
// Stores the student's personal access link (from their email/SMS) in this browser
// and attaches it to every paid API call. The server re-checks it on every request.

const KEY = 'cmqs_access';

export function getAccessToken() {
  try { return localStorage.getItem(KEY) || ''; } catch { return ''; }
}

export function setAccessToken(token) {
  try { localStorage.setItem(KEY, token); } catch { /* private mode — link still works per visit */ }
}

export function clearAccessToken() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}

// Picks up ?t=<token> from the current URL (SMS links), saves it, and strips it from the address bar.
export function captureTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const t = params.get('t');
  if (!t) return '';
  setAccessToken(t);
  params.delete('t');
  const qs = params.toString();
  window.history.replaceState({}, '', window.location.pathname + (qs ? `?${qs}` : ''));
  return t;
}

// Returns { valid, email, name, contactId } — clears a stored token the server rejects.
export async function verifyAccess(token = getAccessToken()) {
  if (!token) return { valid: false };
  try {
    const res = await fetch('/api/cmqs-verify-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    if (res.status === 401) { clearAccessToken(); return { valid: false }; }
    if (!res.ok) return { valid: false, error: true };
    return await res.json();
  } catch {
    return { valid: false, error: true };
  }
}

export function authFetch(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}), 'x-cmqs-access': getAccessToken() },
  });
}

export const PURCHASE_URL = 'https://link.fastpaydirect.com/payment-link/69c56d24c6a0e600f4d05aed';
