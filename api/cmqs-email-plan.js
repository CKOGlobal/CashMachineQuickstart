// api/cmqs-email-plan.js
// Sends the enrollee's full 90-day plan as a branded, printable HTML email via Resend
// Env vars required: RESEND_API_KEY
// From: kelli@proactively-lazy.com (must be verified in Resend dashboard)

function buildSteps(steps = []) {
  return steps.map((s, i) => `
    <div style="margin-bottom:14px; padding:14px; background:#f9f9f9; border-left:4px solid #C9A84C; border-radius:4px;">
      <p style="margin:0 0 6px; font-weight:700; color:#111; font-size:14px;">${i + 1}. ${s.what}</p>
      <p style="margin:0 0 4px; font-size:13px; color:#444;"><strong>How:</strong> ${s.how}</p>
      <p style="margin:0 0 4px; font-size:13px; color:#444;"><strong>Why:</strong> ${s.why}</p>
      <p style="margin:0 0 4px; font-size:13px; color:#444;"><strong>Time:</strong> ${s.time}</p>
      <p style="margin:0; font-size:13px; color:#444;"><strong>Success looks like:</strong> ${s.success}</p>
    </div>
  `).join('');
}

function buildWeeks(weeks = []) {
  return weeks.map(week => `
    <div style="margin-bottom:24px; padding:20px; background:#ffffff; border:1px solid #e5e7eb; border-radius:8px;">
      <h4 style="color:#C9A84C; margin:0 0 6px; font-size:16px;">Week ${week.week}</h4>
      <p style="color:#555; margin:0 0 14px; font-size:14px; font-style:italic;">${week.summary}</p>
      ${buildSteps(week.steps)}
    </div>
  `).join('');
}

function buildMilestones(milestones = []) {
  return milestones.map(m => `
    <tr>
      <td style="padding:10px 14px; border-bottom:1px solid #e5e7eb; font-weight:700; color:#C9A84C; white-space:nowrap;">Day ${m.day}</td>
      <td style="padding:10px 14px; border-bottom:1px solid #e5e7eb; color:#333;">${m.goal}</td>
    </tr>
  `).join('');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, selectedIdea, selectedPricing, plan } = req.body;
  if (!email) return res.status(400).json({ error: 'Email address is required' });

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
    <h1 style="color:#ffffff; font-size:28px; font-weight:800; margin:0 0 8px;">${firstName}'s 90-Day Cash Machine Plan</h1>
    <p style="color:#9CA3AF; font-size:14px; margin:0;">${selectedIdea?.title || 'Your Business'} · ${selectedPricing?.name || ''} at ${selectedPricing?.price || ''}</p>
  </div>

  <div class="no-print" style="background:#fef3c7; border-bottom:1px solid #fcd34d; padding:12px 40px; text-align:center;">
    <p style="margin:0; font-size:13px; color:#92400e;">📄 To save as PDF: File → Print → Save as PDF &nbsp;|&nbsp; Ctrl+P (Windows) or ⌘+P (Mac)</p>
  </div>

  <div style="max-width:800px; margin:0 auto; padding:32px 20px;">

    ${plan?.dualTrack ? `
    <div style="margin-bottom:32px; padding:24px; background:#ffffff; border:1px solid #e5e7eb; border-radius:8px;">
      <h2 style="color:#C9A84C; font-size:20px; margin:0 0 16px;">🎯 Your Dual-Track System</h2>
      <div style="padding:14px; background:#eff6ff; border-left:4px solid #3b82f6; border-radius:4px; margin-bottom:12px;">
        <p style="font-weight:700; color:#1d4ed8; margin:0 0 6px; font-size:14px;">Track A: ${plan.dualTrack.trackA?.name || 'Gig Income'}</p>
        <p style="font-size:13px; color:#444; margin:0 0 4px;"><strong>Weeks 1-4:</strong> ${plan.dualTrack.trackA?.weeks1_4 || ''}</p>
        <p style="font-size:13px; color:#444; margin:0 0 4px;"><strong>Weeks 5-8:</strong> ${plan.dualTrack.trackA?.weeks5_8 || ''}</p>
        <p style="font-size:13px; color:#444; margin:0;"><strong>Weeks 9-12:</strong> ${plan.dualTrack.trackA?.weeks9_12 || ''}</p>
      </div>
      <div style="padding:14px; background:#fffbeb; border-left:4px solid #C9A84C; border-radius:4px; margin-bottom:12px;">
        <p style="font-weight:700; color:#92400e; margin:0 0 6px; font-size:14px;">Track B: ${plan.dualTrack.trackB?.name || selectedIdea?.title || 'Your Business'}</p>
        <p style="font-size:13px; color:#444; margin:0 0 4px;"><strong>Weeks 1-4:</strong> ${plan.dualTrack.trackB?.weeks1_4 || ''}</p>
        <p style="font-size:13px; color:#444; margin:0 0 4px;"><strong>Weeks 5-8:</strong> ${plan.dualTrack.trackB?.weeks5_8 || ''}</p>
        <p style="font-size:13px; color:#444; margin:0;"><strong>Weeks 9-12:</strong> ${plan.dualTrack.trackB?.weeks9_12 || ''}</p>
      </div>
      <p style="margin:0; font-size:13px; padding:10px 14px; background:#f0fdf4; border-radius:4px; color:#166534;">
        <strong>🎯 Crossover Point:</strong> ${plan.dualTrack.crossover || ''}
      </p>
    </div>
    ` : ''}

    ${plan?.month1 ? `
    <h2 style="color:#C9A84C; font-size:22px; margin:0 0 16px; padding-bottom:8px; border-bottom:2px solid #C9A84C;">🚀 Month 1: ${plan.month1.goal}</h2>
    ${buildWeeks(plan.month1.weeks)}
    <p style="font-size:13px; padding:12px 16px; background:#fffbeb; border-radius:6px; margin-bottom:32px;"><strong>📊 Track:</strong> ${plan.month1.metrics}</p>
    ` : ''}

    ${plan?.month2 ? `
    <h2 style="color:#C9A84C; font-size:22px; margin:0 0 16px; padding-bottom:8px; border-bottom:2px solid #C9A84C;">📈 Month 2: ${plan.month2.goal}</h2>
    ${buildWeeks(plan.month2.weeks)}
    <p style="font-size:13px; padding:12px 16px; background:#fffbeb; border-radius:6px; margin-bottom:32px;"><strong>📊 Track:</strong> ${plan.month2.metrics}</p>
    ` : ''}

    ${plan?.month3 ? `
    <h2 style="color:#C9A84C; font-size:22px; margin:0 0 16px; padding-bottom:8px; border-bottom:2px solid #C9A84C;">🎯 Month 3: ${plan.month3.goal}</h2>
    ${buildWeeks(plan.month3.weeks)}
    <p style="font-size:13px; padding:12px 16px; background:#fffbeb; border-radius:6px; margin-bottom:32px;"><strong>📊 Track:</strong> ${plan.month3.metrics}</p>
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
      <p style="margin:0 0 10px; font-size:14px;"><strong>Channels:</strong> ${plan.marketing.channels?.join(', ') || ''}</p>
      <p style="margin:0 0 10px; font-size:14px;"><strong>DM Script:</strong> <em>"${plan.marketing.dmScript || ''}"</em></p>
      <p style="margin:0 0 10px; font-size:14px;"><strong>Social Post:</strong> <em>"${plan.marketing.socialPost || ''}"</em></p>
      <p style="margin:0 0 16px; font-size:14px;"><strong>Budget Strategy:</strong> ${plan.marketing.budget || ''}</p>
      <div style="padding:14px; background:#f0fdf4; border-radius:6px;">
        <p style="font-weight:700; color:#166534; margin:0 0 8px; font-size:14px;">💬 Objection Handling</p>
        <p style="margin:0 0 6px; font-size:13px;"><strong>"Too expensive":</strong> ${plan.marketing.objections?.tooExpensive || ''}</p>
        <p style="margin:0 0 6px; font-size:13px;"><strong>"Need to think":</strong> ${plan.marketing.objections?.needToThink || ''}</p>
        <p style="margin:0; font-size:13px;"><strong>"Can do it myself":</strong> ${plan.marketing.objections?.doItMyself || ''}</p>
      </div>
    </div>
    ` : ''}

    <div style="text-align:center; padding:24px; border-top:1px solid #e5e7eb; margin-top:16px;">
      <p style="color:#C9A84C; font-weight:700; margin:0 0 6px;">Cash Machine QuickStart</p>
      <p style="color:#9CA3AF; font-size:13px; margin:0 0 4px;">CKO Global INC · Kelli Owens</p>
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
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Kelli Owens <kelli@proactively-lazy.com>',
        to: [email.trim().toLowerCase()],
        subject: `${firstName}, here's your 90-Day Cash Machine Plan 🚀`,
        html,
      }),
    });
    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error('Resend error:', resendRes.status, errText);
      return res.status(500).json({ error: 'Email send failed', detail: errText });
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('cmqs-email-plan error:', err);
    return res.status(500).json({ error: 'Server error sending email' });
  }
}
