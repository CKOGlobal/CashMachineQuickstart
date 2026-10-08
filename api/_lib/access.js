// api/_lib/access.js
// Signed access tokens for the paid Cash Machine QuickStart program.
// No database: a token is base64url(JSON payload) + "." + HMAC-SHA256 signature.
// Env vars required: CMQS_ACCESS_SECRET (long random string, 32+ chars)

import crypto from 'node:crypto';

export const SITE_URL = process.env.CMQS_SITE_URL || 'https://cash-machine-quickstart.vercel.app';

const TOKEN_TTL_DAYS = 365;

const b64url = (buf) => Buffer.from(buf).toString('base64url');

function getSecret() {
  const secret = process.env.CMQS_ACCESS_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('CMQS_ACCESS_SECRET is missing or too short (32+ chars required)');
  }
  return secret;
}

function sign(data) {
  return b64url(crypto.createHmac('sha256', getSecret()).update(data).digest());
}

// payload: { email, name?, contactId?, source: 'paid' | 'code', code? }
export function createAccessToken(payload) {
  const now = Math.floor(Date.now() / 1000);
  const body = b64url(JSON.stringify({
    e:   String(payload.email || '').trim().toLowerCase(),
    n:   payload.name || '',
    c:   payload.contactId || '',
    s:   payload.source || 'paid',
    k:   payload.code || '',
    iat: now,
    exp: now + TOKEN_TTL_DAYS * 86400,
  }));
  return `${body}.${sign(body)}`;
}

// Returns the decoded payload, or null if the token is missing, forged, or expired.
export function verifyAccessToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  let expected;
  try { expected = sign(body); } catch (e) { console.error('[access]', e.message); return null; }
  const a = Buffer.from(sig || '');
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const p = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!p.e || !p.exp || p.exp < Math.floor(Date.now() / 1000)) return null;
    if (isBlocked(p.e)) return null;
    return { email: p.e, name: p.n, contactId: p.c, source: p.s, code: p.k, exp: p.exp };
  } catch {
    return null;
  }
}

// Refunds / chargebacks: add the buyer's email to CMQS_BLOCKED_EMAILS (comma-separated)
// and redeploy. Their link — and any copy they shared — stops working immediately.
function isBlocked(email) {
  return (process.env.CMQS_BLOCKED_EMAILS || '')
    .split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
    .includes(String(email).toLowerCase());
}

export function accessLink(token) {
  return `${SITE_URL}/access?t=${encodeURIComponent(token)}`;
}

// Reads the token from the x-cmqs-access header. Sends 401 and returns null if invalid.
export function requireAccess(req, res) {
  const access = verifyAccessToken(req.headers['x-cmqs-access']);
  if (!access) {
    res.status(401).json({ error: 'Access link required. Check your email for your Cash Machine QuickStart access link.' });
    return null;
  }
  return access;
}

// Shared-secret check for server-to-server calls from GHL.
// Accepts the secret in the x-cmqs-secret header, a top-level "secret" body field,
// or customData.secret (where GHL's standard Webhook action puts custom data).
export function requireWebhookSecret(req, res) {
  const expected = process.env.CMQS_WEBHOOK_SECRET;
  const given = req.headers['x-cmqs-secret'] || req.body?.secret || req.body?.customData?.secret || '';
  if (!expected) {
    console.error('[access] CMQS_WEBHOOK_SECRET is not set — rejecting webhook');
    res.status(500).json({ error: 'Webhook secret not configured' });
    return false;
  }
  const a = Buffer.from(String(given));
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

// Best-effort per-key rate limit. In-memory, so it resets when Vercel recycles
// the function instance — it stops casual abuse, not a determined attacker.
// The Anthropic console spend limit is the hard backstop.
const buckets = new Map();
export function rateLimit(key, max, windowMs) {
  const now = Date.now();
  const hit = buckets.get(key);
  if (!hit || now - hit.start > windowMs) {
    buckets.set(key, { start: now, count: 1 });
    if (buckets.size > 5000) {
      for (const [k, v] of buckets) if (now - v.start > windowMs) buckets.delete(k);
    }
    return true;
  }
  hit.count++;
  return hit.count <= max;
}

export function clientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function sendEmail({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY || process.env.CASH_MACHINE_RESEND;
  if (!apiKey) throw new Error('RESEND_API_KEY not set');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'Kelli Owens <kelli@proactively-lazy.com>', to: [to], subject, html }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}
