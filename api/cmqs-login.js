// api/cmqs-login.js
// Buyer login: enter the email used at checkout → if GHL shows a successful payment,
// a personal login link is emailed to that address. The link is never returned to the
// browser, so knowing someone's email doesn't get you into their program.

import { createAccessToken, accessLink, sendEmail, accessEmailHtml, findPaidPurchase, isBlocked, rateLimit, clientIp } from './_lib/access.js';

const SENT = 'If that email has a Cash Machine QuickStart purchase, your login link is on its way. Check your inbox (and spam) in the next minute or two.';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const email = String(req.body?.email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Enter the email you used at checkout.' });

  if (!rateLimit(`login-ip:${clientIp(req)}`, 10, 15 * 60 * 1000) || !rateLimit(`login-email:${email}`, 3, 60 * 60 * 1000)) {
    return res.status(429).json({ error: 'Too many attempts. Check your inbox for the link we already sent, or try again in a bit.' });
  }

  let purchase;
  try {
    purchase = await findPaidPurchase(email);
  } catch (err) {
    console.error('[login] purchase check failed:', err.message);
    return res.status(503).json({ error: 'Login is temporarily unavailable. Email kelli@proactively-lazy.com and we\'ll get you in.' });
  }

  if (!purchase.paid || isBlocked(email)) {
    console.log('[login] no access issued', { email, paid: purchase.paid });
    return res.status(200).json({ ok: true, message: SENT });
  }

  try {
    const token = createAccessToken({ email, name: purchase.firstName, contactId: purchase.contactId, source: 'paid' });
    await sendEmail({
      to: email,
      subject: 'Your Cash Machine QuickStart login link 🔑',
      html: accessEmailHtml(purchase.firstName, accessLink(token)),
    });
    console.log('[login] link emailed', { email, contactId: purchase.contactId });
  } catch (err) {
    console.error('[login] send failed:', err.message);
    return res.status(503).json({ error: 'We couldn\'t send the email just now. Try again in a minute.' });
  }
  return res.status(200).json({ ok: true, message: SENT });
}
