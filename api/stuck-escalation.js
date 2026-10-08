// Requires a valid access link (x-cmqs-access header) so only enrolled students can
// create "needs a call" tasks in GHL.

import { requireAccess, rateLimit } from './_lib/access.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const access = requireAccess(req, res);
  if (!access) return;

  if (!rateLimit(`stuck:${access.email}`, 3, 60 * 60 * 1000)) {
    return res.status(429).json({ error: 'Kelli has already been notified. Hang tight for her text.' });
  }

  try {
    const { week, business_idea } = req.body;
    const contact_id = access.contactId || req.body.contact_id || '';
    const chat_transcript = String(req.body.chat_transcript || '').slice(0, 20000);

    if (!week) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Send webhook to GHL
    // GHL will receive this and trigger:
    // 1. SMS with talktokelli.com link
    // 2. Tag: cmqs_needs_call
    // 3. Task for Kelli with transcript attached

    const ghlWebhookUrl = process.env.GHL_STUCK_WEBHOOK_URL;

    if (ghlWebhookUrl) {
      await fetch(ghlWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contact_id,
          email: access.email,
          event: 'stuck_escalation',
          week,
          business_idea: business_idea || 'Unknown',
          chat_transcript,
          timestamp: new Date().toISOString(),
        }),
      });
    }

    console.log('Stuck escalation:', {
      contact_id,
      week,
      business_idea,
      transcript_length: chat_transcript?.length || 0,
    });

    return res.status(200).json({
      success: true,
      message: 'Escalation notification sent to GHL',
    });
  } catch (error) {
    console.error('Stuck escalation error:', error);
    return res.status(500).json({
      error: 'Failed to process escalation',
    });
  }
}
