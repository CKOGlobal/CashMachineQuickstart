export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      nonPromotional,
      marketing: marketingConsent,
      businessIdea,
      pricingModel,
      category,
    } = req.body;

    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate the full 12-week plan using Claude (3-call progressive system)
    const generateMonth = async (monthNum, previousContext = '') => {
      const prompts = {
        1: `You are building Month 1 of a 12-week Cash Machine QuickStart plan.

Student: ${firstName} ${lastName}
Business Idea: ${businessIdea || 'Skills-based service business'}
Pricing: ${pricingModel || '$35-50/hr'}
Category: ${category || 'business'}

Build Month 1 (Weeks 1-4) with EDUCATIONAL DEPTH.

For each week, provide:
- Week number (1-4)
- Summary (1-2 sentences describing the week's focus)
- 3-5 specific steps, each with:
  * what: The action step
  * how: Detailed instructions
  * why: The reasoning/benefit
  * time: Time investment required
  * success: What success looks like

Also include:
- goal: Month 1 overall goal
- metrics: What to track this month

Return ONLY valid JSON matching this structure:
{
  "goal": "Month 1 goal here",
  "weeks": [
    {
      "week": 1,
      "summary": "Week summary",
      "steps": [
        {
          "what": "Action item",
          "how": "Step-by-step how",
          "why": "The reasoning",
          "time": "2-3 hours",
          "success": "What success looks like"
        }
      ]
    }
  ],
  "metrics": "Key metrics to track"
}`,
        2: `Continue building the Cash Machine QuickStart plan.

Student: ${firstName} ${lastName}
Business: ${businessIdea || 'Skills-based service'}
Pricing: ${pricingModel || '$35-50/hr'}

${previousContext}

Build Month 2 (Weeks 5-8) with the same educational depth.

Return ONLY valid JSON with the same structure as Month 1.`,
        3: `Final month of the Cash Machine QuickStart plan.

Student: ${firstName} ${lastName}
Business: ${businessIdea || 'Skills-based service'}

${previousContext}

Build Month 3 (Weeks 9-12) with the same educational depth, focusing on:
- Scaling operations
- Building systems
- Revenue consistency
- Exit strategy preparation

Return ONLY valid JSON with the same structure as previous months.`
      };

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 4000,
          messages: [{
            role: 'user',
            content: prompts[monthNum]
          }]
        }),
      });

      const data = await response.json();
      if (!data.content || !data.content[0]) {
        throw new Error(`Invalid AI response for month ${monthNum}`);
      }

      const text = data.content[0].text;
      const cleanJson = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanJson);
    };

    // Generate all 3 months
    const month1 = await generateMonth(1);
    const month2 = await generateMonth(2, `Month 1 covered: ${month1.goal}`);
    const month3 = await generateMonth(3, `Months 1-2 covered: ${month1.goal}, ${month2.goal}`);

    // Generate marketing plan
    const marketingResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: `Create marketing plan for: ${businessIdea || 'Skills-based service'} at ${pricingModel || '$35-50/hr'}

Return ONLY valid JSON:
{
  "channels": ["channel1", "channel2", "channel3"],
  "dmScript": "Personalized DM template",
  "socialPost": "Social media post template",
  "emailTemplate": "Email outreach template",
  "objections": {
    "tooExpensive": "Response to price objection",
    "needToThink": "Response to delay objection",
    "doItMyself": "Response to DIY objection"
  },
  "budget": "Budget allocation strategy"
}`
        }]
      }),
    });

    const marketingData = await marketingResponse.json();
    const marketingText = marketingData.content[0].text.replace(/```json\n?|\n?```/g, '').trim();
    const marketing = JSON.parse(marketingText);

    // Generate milestones
    const milestones = [
      { day: 7, goal: 'First customer booked' },
      { day: 14, goal: 'First service delivered' },
      { day: 30, goal: '$500+ monthly revenue' },
      { day: 60, goal: '10+ repeat customers' },
      { day: 90, goal: '$1,500+ monthly revenue' }
    ];

    const fullPlan = {
      selectedIdea: businessIdea || 'Skills-based service business',
      selectedPricing: pricingModel || '$35-50/hr',
      category: category || 'business',
      month1,
      month2,
      month3,
      marketing,
      milestones
    };

    // Send to GHL webhook
    const ghlWebhookUrl = process.env.GHL_CMQS_WEBHOOK_URL;
    
    if (ghlWebhookUrl) {
      try {
        await fetch(ghlWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            phone,
            nonPromotional: nonPromotional || false,
            marketing: marketingConsent || false,
            businessIdea: businessIdea || 'Skills-based service',
            pricingModel: pricingModel || '$35-50/hr',
            category: category || 'business',
            planGenerated: true,
            submittedAt: new Date().toISOString(),
            // GHL will use this to apply cmqs_paid tag and start automation
            tags: ['cmqs_paid']
          })
        });
      } catch (webhookError) {
        console.error('GHL webhook failed:', webhookError);
        // Don't fail the whole request if webhook fails - log and continue
      }
    }

    // Return the full plan to display to user
    return res.status(200).json({
      success: true,
      plan: fullPlan
    });

  } catch (error) {
    console.error('CMQS submit error:', error);
    return res.status(500).json({
      error: 'Failed to generate plan',
      message: error.message,
    });
  }
}
