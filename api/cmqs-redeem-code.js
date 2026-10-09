// api/cmqs-redeem-code.js
// Free / beta access codes, checked on the server so they never ship in the page code.
// Env var: CMQS_FREE_CODES — comma-separated list, e.g. "BETA2026,VIPFRIENDS"
// No env var = no free codes work.

import { createAccessToken, rateLimit, clientIp } from './_lib/access.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!rateLimit(`redeem:${clientIp(req)}`, 10, 15 * 60 * 1000)) {
    return res.status(429).json({ error: 'Too many attempts. Try again in a few minutes.' });
  }

  const code = String(req.body?.code || '').trim().toUpperCase();
  const email = String(req.body?.email || '').trim().toLowerCase();
  const name = String(req.body?.name || '').trim().slice(0, 80);

  if (!code) return res.status(400).json({ error: 'Code is required' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Valid email is required' });

  const freeCodes = (process.env.CMQS_FREE_CODES || '')
    .split(',').map(c => c.trim().toUpperCase()).filter(Boolean);

  if (!freeCodes.includes(code)) return res.status(400).json({ error: 'Invalid code' });

  try {
    const token = createAccessToken({ email, name, source: 'code', code });
    return res.status(200).json({ success: true, token });
  } catch (err) {
    console.error('[redeem-code]', err.message);
    return res.status(500).json({ error: 'Access not configured' });
  }
}
