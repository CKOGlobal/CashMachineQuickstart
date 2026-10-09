// api/cmqs-email-plan.js
// Sends the enrollee's full 90-day plan as a branded, printable HTML email via Resend
// Env vars required: RESEND_API_KEY
// From: kelli@proactively-lazy.com (must be verified in Resend dashboard)
// Requires a valid access link (x-cmqs-access header). The plan is only ever sent
// to the email on that access link, and every AI/user value is HTML-escaped.

import { requireAccess, rateLimit, escapeHtml as esc, sendEmail } from './_lib/access.js';

function buildSteps(steps = []) {
  return steps.map((s, i) => `
    <div style="margin-bottom:14px; padding:14px; background:#f9f9f9; border-left:4px solid #C9A84C; border-radius:4px;">
      <p style="margin:0 0 6px; font-weight:700; color:#111; font-size:14px;">${esc(i + 1)}. ${esc(s.what)}</p>
      <p style="margin:0 0 4px; font-size:13px; color:#444;"><strong>How:</strong> ${esc(s.how)}</p>
      <p style="margin:0 0 4px; font-size:13px; color:#444;"><strong>Why:</strong> ${esc(s.why)}</p>
      <p style="margin:0 0 4px; font-size:13px; color:#444;"><strong>Time:</strong> ${esc(s.time)}</p>
      <p style="margin:0; font-size:13px; color:#444;"><strong>Success looks like:</strong> ${esc(s.success)}</p>
    </div>
  `).join('');
}

function buildWeeks(weeks = []) {
  return weeks.map(week => `
    <div style="margin-bottom:24px; padding:20px; background:#ffffff; border:1px solid #e5e7eb; border-radius:8px;">
      <h4 style="color:#C9A84C; margin:0 0 6px; font-size:16px;">Week ${esc(week.week)}</h4>
      <p style="color:#555; margin:0 0 14px; font-size:14px; font-style:italic;">${esc(week.summary)}</p>
      ${buildSteps(week.steps)}
    </div>
  `).join('');
}

function buildMilestones(milestones = []) {
  return milestones.map(m => `
    <tr>
      <td style="padding:10px 14px; border-bottom:1px solid #e5e7eb; font-weight:700; color:#C9A84C; white-space:nowrap;">Day ${esc(m.day)}</td>
      <td style="padding:10px 14px; border-bottom:1px solid #e5e7eb; color:#333;">${esc(m.goal)}</td>
    </tr>
  `).join('');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const access = requireAccess(req, res);
  if (!access) return;

  if (!rateLimit(`email-plan:${access.email}`, 5, 60 * 60 * 1000)) {
    return res.status(429).json({ error: 'Plan already sent several times this hour. Check your inbox (and spam folder).' });
  }

  const { name, selectedIdea, selectedPricing, plan } = req.body;
  const email = access.email;

  const firstName = name?.split(' ')[0] || 'there';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your 90-Day Cash Machine Plan</title>
  <style>@media print { body { font-size: 12px; } .no-print { display: none; } }</style>
</head>
<body style="margin:0; padding:0; background:#f3f4f6; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

  <div style="background:#0d1117; padding:32px 40px; text-align:center;">
    <p style="color:#C9A84C; font-size:12px; letter-spacing:2px; text-transform:uppercase; margin:0 0 10px;">Cash Machine QuickStart · Kelli Owens + Loral Langemeier</p>
    <h1 style="color:#ffffff; font-size:28px; font-weight:800; margin:0 0 8px;">${esc(firstName)}'s 90-Day Cash Machine Plan</h1>
    <p style="color:#9CA3AF; font-size:14px; margin:0;">${esc(selectedIdea?.title || 'Your Business')} · ${esc(selectedPricing?.name || '')} at ${esc(selectedPricing?.price || '')}</p>
  </div>

  <div class="no-print" style="background:#fef3c7; border-bottom:1px solid #fcd34d; padding:12px 40px; text-align:center;">
    <p style="margin:0; font-size:13px; color:#92400e;">📄 To save as PDF: File → Print → Save as PDF &nbsp;|&nbsp; Ctrl+P (Windows) or ⌘+P (Mac)</p>
  </div>

  <div style="max-width:800px; margin:0 auto; padding:32px 20px;">

    ${plan?.dualTrack ? `
    <div style="margin-bottom:32px; padding:24px; background:#ffffff; border:1px solid #e5e7eb; border-radius:8px;">
      <h2 style="color:#C9A84C; font-size:20px; margin:0 0 16px;">🎯 Your Dual-Track System</h2>
      <div style="padding:14px; background:#eff6ff; border-left:4px solid #3b82f6; border-radius:4px; margin-bottom:12px;">
        <p style="font-weight:700; color:#1d4ed8; margin:0 0 6px; font-size:14px;">Track A: ${esc(plan.dualTrack.trackA?.name || 'Gig Income')}</p>
        <p style="font-size:13px; color:#444; margin:0 0 4px;"><strong>Weeks 1-4:</strong> ${esc(plan.dualTrack.trackA?.weeks1_4 || '')}</p>
        <p style="font-size:13px; color:#444; margin:0 0 4px;"><strong>Weeks 5-8:</strong> ${esc(plan.dualTrack.trackA?.weeks5_8 || '')}</p>
        <p style="font-size:13px; color:#444; margin:0;"><strong>Weeks 9-12:</strong> ${esc(plan.dualTrack.trackA?.weeks9_12 || '')}</p>
      </div>
      <div style="padding:14px; background:#fffbeb; border-left:4px solid #C9A84C; border-radius:4px; margin-bottom:12px;">
        <p style="font-weight:700; color:#92400e; margin:0 0 6px; font-size:14px;">Track B: ${esc(plan.dualTrack.trackB?.name || selectedIdea?.title || 'Your Business')}</p>
        <p style="font-size:13px; color:#444; margin:0 0 4px;"><strong>Weeks 1-4:</strong> ${esc(plan.dualTrack.trackB?.weeks1_4 || '')}</p>
        <p style="font-size:13px; color:#444; margin:0 0 4px;"><strong>Weeks 5-8:</strong> ${esc(plan.dualTrack.trackB?.weeks5_8 || '')}</p>
        <p style="font-size:13px; color:#444; margin:0;"><strong>Weeks 9-12:</strong> ${esc(plan.dualTrack.trackB?.weeks9_12 || '')}</p>
      </div>
      <p style="margin:0; font-size:13px; padding:10px 14px; background:#f0fdf4; border-radius:4px; color:#166534;">
        <strong>🎯 Crossover Point:</strong> ${esc(plan.dualTrack.crossover || '')}
      </p>
    </div>
    ` : ''}

    ${plan?.month1 ? `
    <h2 style="color:#C9A84C; font-size:22px; margin:0 0 16px; padding-bottom:8px; border-bottom:2px solid #C9A84C;">🚀 Month 1: ${esc(plan.month1.goal)}</h2>
    ${buildWeeks(plan.month1.weeks)}
    <p style="font-size:13px; padding:12px 16px; background:#fffbeb; border-radius:6px; margin-bottom:32px;"><strong>📊 Track:</strong> ${esc(plan.month1.metrics)}</p>
    ` : ''}

    ${plan?.month2 ? `
    <h2 style="color:#C9A84C; font-size:22px; margin:0 0 16px; padding-bottom:8px; border-bottom:2px solid #C9A84C;">📈 Month 2: ${esc(plan.month2.goal)}</h2>
    ${buildWeeks(plan.month2.weeks)}
    <p style="font-size:13px; padding:12px 16px; background:#fffbeb; border-radius:6px; margin-bottom:32px;"><strong>📊 Track:</strong> ${esc(plan.month2.metrics)}</p>
    ` : ''}

    ${plan?.month3 ? `
    <h2 style="color:#C9A84C; font-size:22px; margin:0 0 16px; padding-bottom:8px; border-bottom:2px solid #C9A84C;">🎯 Month 3: ${esc(plan.month3.goal)}</h2>
    ${buildWeeks(plan.month3.weeks)}
    <p style="font-size:13px; padding:12px 16px; background:#fffbeb; border-radius:6px; margin-bottom:32px;"><strong>📊 Track:</strong> ${esc(plan.month3.metrics)}</p>
    ` : ''}

    ${plan?.milestones?.length ? `
    <h2 style="color:#C9A84C; font-size:22px; margin:0 0 16px; padding-bottom:8px; border-bottom:2px solid #C9A84C;">🏆 Your Milestones</h2>
    <table style="width:100%; border-collapse:collapse; background:#ffffff; border:1px solid #e5e7eb; border-radius:8px; overflow:hidden; margin-bottom:32px;">
      <thead><tr style="background:#0d1117;"><th style="padding:12px 14px; text-align:left; color:#C9A84C; font-size:13px;">Day</th><th style="padding:12px 14px; text-align:left; color:#C9A84C; font-size:13px;">Goal</th></tr></thead>
      <tbody>${buildMilestones(plan.milestones)}</tbody>
    </table>
    ` : ''}

    ${plan?.marketing ? `
    <h2 style="color:#C9A84C; font-size:22px; margin:0 0 16px; padding-bottom:8px; border-bottom:2px solid #C9A84C;">📣 Your Marketing Plan</h2>
    <div style="padding:20px; background:#ffffff; border:1px solid #e5e7eb; border-radius:8px; margin-bottom:32px;">
      <p style="margin:0 0 10px; font-size:14px;"><strong>Channels:</strong> ${esc(plan.marketing.channels?.join(', ') || '')}</p>
      <p style="margin:0 0 10px; font-size:14px;"><strong>DM Script:</strong> <em>"${esc(plan.marketing.dmScript || '')}"</em></p>
      <p style="margin:0 0 10px; font-size:14px;"><strong>Social Post:</strong> <em>"${esc(plan.marketing.socialPost || '')}"</em></p>
      <p style="margin:0 0 16px; font-size:14px;"><strong>Budget Strategy:</strong> ${esc(plan.marketing.budget || '')}</p>
      <div style="padding:14px; background:#f0fdf4; border-radius:6px;">
        <p style="font-weight:700; color:#166534; margin:0 0 8px; font-size:14px;">💬 Objection Handling</p>
        <p style="margin:0 0 6px; font-size:13px;"><strong>"Too expensive":</strong> ${esc(plan.marketing.objections?.tooExpensive || '')}</p>
        <p style="margin:0 0 6px; font-size:13px;"><strong>"Need to think":</strong> ${esc(plan.marketing.objections?.needToThink || '')}</p>
        <p style="margin:0; font-size:13px;"><strong>"Can do it myself":</strong> ${esc(plan.marketing.objections?.doItMyself || '')}</p>
      </div>
    </div>
    ` : ''}

    <div style="text-align:center; padding:24px; border-top:1px solid #e5e7eb; margin-top:16px;">
      <p style="color:#C9A84C; font-weight:700; margin:0 0 6px;">Cash Machine QuickStart</p>
      <p style="color:#9CA3AF; font-size:13px; margin:0 0 4px;">CKO Global Inc · Kelli Owens</p>
      <p style="color:#9CA3AF; font-size:13px; margin:0;">
        <a href="https://proactively-lazy.com" style="color:#C9A84C;">proactively-lazy.com</a> ·
        <a href="mailto:kelli@proactively-lazy.com" style="color:#C9A84C;">kelli@proactively-lazy.com</a>
      </p>
      <p style="color:#d1d5db; font-size:11px; margin:12px 0 0;">Reply STOP to any SMS to unsubscribe. Message & data rates may apply.</p>
    </div>

  </div>
</body>
</html>`;

  try {
    await sendEmail({
      to: email,
      subject: `${String(firstName).replace(/[\r\n]/g, ' ').slice(0, 60)}, here's your 90-Day Cash Machine Plan 🚀`,
      html,
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('cmqs-email-plan error:', err.message);
    return res.status(500).json({ error: 'Email send failed. Please try again.' });
  }
}
