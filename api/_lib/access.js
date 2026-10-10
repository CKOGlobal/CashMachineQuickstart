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
export function isBlocked(email) {
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

// Email that delivers a buyer's personal login link (used by grant-access and login).
export function accessEmailHtml(firstName, link) {
  const name = escapeHtml(firstName || 'there');
  const href = escapeHtml(link);
  return `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
    <div style="background:#0d1117;border-radius:10px 10px 0 0;padding:28px 32px;text-align:center;">
      <p style="color:#C9A84C;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Cash Machine QuickStart</p>
      <h1 style="color:#ffffff;font-size:24px;margin:0;">You're in, ${name}. 🎉</h1>
    </div>
    <div style="background:#ffffff;border-radius:0 0 10px 10px;padding:28px 32px;">
      <p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 20px;">Here's your personal login link — tap it to open your 90-day plan and AI coach.</p>
      <p style="text-align:center;margin:0 0 24px;">
        <a href="${href}" style="display:inline-block;padding:14px 28px;background:#C9A84C;color:#0d1117;font-weight:700;text-decoration:none;border-radius:8px;font-size:16px;">Open My Program →</a>
      </p>
      <p style="font-size:13px;color:#666;line-height:1.6;margin:0 0 8px;">Save this email. The link is yours for 12 months and works on any device. Please don't share it — it's tied to your enrollment.</p>
      <p style="font-size:12px;color:#999;line-height:1.6;margin:0;word-break:break-all;">If the button doesn't work, paste this into your browser:<br>${href}</p>
    </div>
    <p style="text-align:center;font-size:12px;color:#9CA3AF;margin:16px 0 0;">Questions? <a href="mailto:kelli@proactively-lazy.com" style="color:#C9A84C;">kelli@proactively-lazy.com</a></p>
  </div>
</body></html>`;
}

// ── GHL purchase check ──────────────────────────────────────────────────────
// Asks GHL (outbound — not affected by Vercel's firewall) whether this email has a
// successful payment of at least CMQS_MIN_PAYMENT (default 97).
// Env: GHL_API_TOKEN (Private Integration token: View Contacts + View Payment
// Transactions), GHL_LOCATION_ID.
const GHL_API = 'https://services.leadconnectorhq.com';
const PAID_STATUSES = ['succeeded', 'paid', 'completed', 'success'];

async function ghlGet(path) {
  const res = await fetch(`${GHL_API}${path}`, {
    headers: {
      Authorization: `Bearer ${process.env.GHL_API_TOKEN}`,
      Version: '2021-07-28',
      Accept: 'application/json',
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`GHL ${res.status} on ${path.split('?')[0]}: ${text.slice(0, 300)}`);
  return JSON.parse(text);
}

// Returns { paid, contactId, firstName } — throws if GHL isn't configured or errors.
export async function findPaidPurchase(email) {
  const locationId = process.env.GHL_LOCATION_ID;
  if (!process.env.GHL_API_TOKEN || !locationId) throw new Error('GHL_API_TOKEN / GHL_LOCATION_ID not set');

  const found = await ghlGet(`/contacts/search/duplicate?locationId=${encodeURIComponent(locationId)}&email=${encodeURIComponent(email)}`);
  const contact = found?.contact || found?.contacts?.[0] || null;
  if (!contact?.id) return { paid: false };

  const tx = await ghlGet(`/payments/transactions?altId=${encodeURIComponent(locationId)}&altType=location&contactId=${encodeURIComponent(contact.id)}&limit=100`);
  const list = tx?.data || tx?.transactions || [];
  const minAmount = Number(process.env.CMQS_MIN_PAYMENT || 97);
  const paid = list.some(t =>
    PAID_STATUSES.includes(String(t.status || '').toLowerCase()) && Number(t.amount) >= minAmount
  );
  if (!paid) {
    console.log('[purchase-check] no qualifying payment', {
      contactId: contact.id,
      transactions: list.map(t => ({ status: t.status, amount: t.amount, source: t.entitySourceName })),
    });
  }
  return { paid, contactId: contact.id, firstName: contact.firstName || contact.firstNameRaw || '' };
}
