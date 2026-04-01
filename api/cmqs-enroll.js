// api/cmqs-enroll.js
// Posts enrolled student to GHL with correct tag based on referral code
// Tags: KelliCMQS (default), LoralCMQS (LORAL2026), BetaCMQS (BETA/BETA2026)

const TAG_MAP = {
  LORAL2026:   'LoralCMQS',
  CMQS:        'CMQSAccess',
  CMQS2026:    'CMQSAccess',
  TESTACCESS:  'CMQSAccess',
  KELLICMQS:   'KelliCMQS',
};

function resolveTag(referralCode) {
  if (!referralCode) return 'KelliCMQS';
  return TAG_MAP[referralCode.trim().toUpperCase()] || 'KelliCMQS';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    name,
    email,
    phone,
    referralCode,
    selectedIdea,
    selectedPricing,
    plan,
  } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const tag = resolveTag(referralCode);

  const week1Steps = plan?.month1?.weeks?.[0]?.steps
    ?.map((s, i) => `${i + 1}. ${s.what}\n   HOW: ${s.how}\n   TIME: ${s.time}`)
    .join('\n\n') || '';

  const week2Steps = plan?.month1?.weeks?.[1]?.steps
    ?.map((s, i) => `${i + 1}. ${s.what}\n   HOW: ${s.how}\n   TIME: ${s.time}`)
    .join('\n\n') || '';

  const ghlPayload = {
    firstName:  name.split(' ')[0],
    lastName:   name.split(' ').slice(1).join(' ') || '',
    email:      email.trim().toLowerCase(),
    phone:      phone?.trim() || '',
    tags:       [tag],
    source:     'CashMachineQuickStart',

    customField: {
      cmqs_referral_code:     referralCode?.toUpperCase() || '',
      cmqs_attribution_tag:   tag,
      cmqs_business_idea:     selectedIdea?.title || '',
      cmqs_idea_category:     selectedIdea?.category || '',
      cmqs_pricing_model:     `${selectedPricing?.name || ''} — ${selectedPricing?.price || ''}`,
      cmqs_monthly_potential: selectedPricing?.monthly || '',
      cmqs_month1_goal:       plan?.month1?.goal || '',
      cmqs_month2_goal:       plan?.month2?.goal || '',
      cmqs_month3_goal:       plan?.month3?.goal || '',
      cmqs_week1_summary:     plan?.month1?.weeks?.[0]?.summary || '',
      cmqs_week1_steps:       week1Steps,
      cmqs_week2_summary:     plan?.month1?.weeks?.[1]?.summary || '',
      cmqs_week2_steps:       week2Steps,
      cmqs_crossover_point:   plan?.dualTrack?.crossover || '',
      cmqs_day7_milestone:    plan?.milestones?.find(m => m.day === 7)?.goal || '',
      cmqs_day30_milestone:   plan?.milestones?.find(m => m.day === 30)?.goal || '',
      cmqs_enrolled_date:     new Date().toISOString().split('T')[0],
    },
  };

  try {
    const ghlRes = await fetch(process.env.GHL_CMQS_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ghlPayload),
    });

    if (!ghlRes.ok) {
      const errText = await ghlRes.text();
      console.error('GHL webhook error:', ghlRes.status, errText);
      return res.status(500).json({ error: 'GHL enrollment failed', detail: errText });
    }

    return res.status(200).json({ success: true, tag });

  } catch (err) {
    console.error('cmqs-enroll error:', err);
    return res.status(500).json({ error: 'Server error during enrollment' });
  }
}
