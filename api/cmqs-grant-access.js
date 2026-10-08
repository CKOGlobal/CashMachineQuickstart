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

import { createAccessToken, accessLink, requireWebhookSecret, sendEmail, escapeHtml } from './_lib/access.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!requireWebhookSecret(req, res)) return;

  const b = req.body || {};
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

function accessEmailHtml(firstName, link) {
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
      <p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 20px;">Your payment went through. This is your personal access link — tap it to build your 90-day plan and unlock your AI coach.</p>
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
