export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { contact_id, week, chat_transcript, business_idea } = req.body;

    if (!contact_id || !week) {
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
          event: 'stuck_escalation',
          week,
          business_idea: business_idea || 'Unknown',
          chat_transcript,
          timestamp: new Date().toISOString(),
        }),
      });
    }

    // Log for debugging (you can remove this in production)
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
      message: error.message,
    });
  }
}
