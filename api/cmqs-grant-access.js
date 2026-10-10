// api/cmqs-grant-access.js
// Called by the GHL workflow after a successful Cash Machine QuickStart payment.
// Creates the buyer's personal access link, emails it, and hands it back to GHL
// so the workflow can store it on the contact and text it.
//
// GHL Workflow → Webhook action:
//   URL:    https://cash-machine-quickstart.vercel.app/api/cmqs-grant-access
//   Method: POST
//   Custom data: secret = <CMQS_WEBHOOK_SECRET>   (or header x-cmqs-secret)
//   (GHL sends the contact's email / first_name / contact_id automatically)
//
// Env vars: CMQS_ACCESS_SECRET, CMQS_WEBHOOK_SECRET, RESEND_API_KEY
// Optional: GHL_ACCESS_WEBHOOK_URL — GHL inbound webhook that receives
//           { email, contact_id, cmqs_access_link, cmqs_access_token }

import { createAccessToken, accessLink, requireWebhookSecret, sendEmail, accessEmailHtml } from './_lib/access.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!requireWebhookSecret(req, res)) return;

  // GHL sends contact fields at the top level; custom data arrives under customData
  const b = { ...(req.body?.customData || {}), ...(req.body || {}) };
  const email = String(b.email || b.contact?.email || '').trim().toLowerCase();
  const firstName = b.first_name || b.firstName || b.contact?.first_name || (b.full_name || b.name || '').split(' ')[0] || '';
  const contactId = b.contact_id || b.contactId || b.contact?.id || '';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  let token;
  try {
    token = createAccessToken({ email, name: firstName, contactId, source: 'paid' });
  } catch (err) {
    console.error('[grant-access]', err.message);
    return res.status(500).json({ error: 'Access tokens not configured' });
  }
  const link = accessLink(token);

  const results = { emailed: false, ghlUpdated: false };

  try {
    await sendEmail({
      to: email,
      subject: 'Your Cash Machine QuickStart access link 🔑',
      html: accessEmailHtml(firstName, link),
    });
    results.emailed = true;
  } catch (err) {
    console.error('[grant-access] email failed:', err.message);
  }

  if (process.env.GHL_ACCESS_WEBHOOK_URL) {
    try {
      const r = await fetch(process.env.GHL_ACCESS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, contact_id: contactId, cmqs_access_link: link, cmqs_access_token: token }),
      });
      results.ghlUpdated = r.ok;
      if (!r.ok) console.error('[grant-access] GHL webhook', r.status, await r.text());
    } catch (err) {
      console.error('[grant-access] GHL webhook failed:', err.message);
    }
  }

  console.log('[grant-access] issued', { email, contactId, ...results });
  return res.status(200).json({ success: true, cmqs_access_link: link, cmqs_access_token: token, ...results });
}
