export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      email,
      phone,
      name,
      contact_id,
      // Optional: if you want to pass their selections from the free tool
      business_idea,
      pricing_model,
      category,
    } = req.body;

    if (!email || !contact_id) {
      return res.status(400).json({ error: 'Missing required fields: email, contact_id' });
    }

    // Generate the 90-day plan using Claude
    const planResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: `Generate a CONDENSED 90-day dual-track plan for GHL automation.

Student: ${name || 'Student'}
Business Idea: ${business_idea || 'Skills-based service business'}
Pricing: ${pricing_model || 'Starting at $35-50/hr'}
Category: ${category || 'business'}

CRITICAL REQUIREMENTS:
- Each week's tasks must be UNDER 200 CHARACTERS (GHL custom field limit)
- Focus on ACTIONS, not explanations
- Format: "Action 1 + Action 2 + Milestone"

Return ONLY valid JSON:
{
  "business_idea": "${business_idea || 'Skills-based service'}",
  "category": "${category || 'business'}",
  "pricing": "${pricing_model || '$35-50/hr'}",
  "week_1": "Sign up DoorDash/TaskRabbit (gig income) + Set up business accounts (IG, email) + Post first offer",
  "week_2": "Gig work 20hrs + DM 10 potential customers + Launch offer post + Book first call",
  "week_3": "Gig 20hrs + Land first 1-2 customers + Deliver first service + Ask for testimonial",
  "week_4": "Gig 15hrs + 3-5 customers + Refine offer based on feedback + Raise prices 10%",
  "week_5": "Gig 15hrs + 5-8 customers + Build repeat client systems + Automate booking",
  "week_6": "Gig 10hrs + 8-10 customers + Create referral program + Test upsell offer",
  "week_7": "Gig 10hrs + 10-12 customers + Optimize delivery time + Increase rates",
  "week_8": "Gig 5-10hrs + 12-15 customers + Hire help or automate + Scale marketing",
  "week_9": "Gig 5hrs (only if needed) + 15+ customers + Consistent $500-800/mo revenue",
  "week_10": "Phase out gigs completely + 15-20 customers + $800-1200/mo business revenue",
  "week_11": "Business only + 20+ customers + $1000-1500/mo + Build exit systems",
  "week_12": "Full business mode + Consistent revenue + Plan next 90 days or exit strategy"
}

Each task string must be under 200 characters. Be specific and actionable.`
        }]
      }),
    });

    const planData = await planResponse.json();
    
    if (!planData.content || !planData.content[0]) {
      throw new Error('Invalid AI response');
    }

    const planText = planData.content[0].text;
    const cleanJson = planText.replace(/```json\n?|\n?```/g, '').trim();
    const plan = JSON.parse(cleanJson);

    // Create plan URL (you can store plans in a database or use contact_id as key)
    const plan_url = `https://cash-machine-quickstart.vercel.app/plan/${contact_id}`;

    // Return data for GHL to store in custom fields
    const response = {
      success: true,
      contact_id,
      plan_url,
      business_idea: plan.business_idea,
      category: plan.category,
      pricing: plan.pricing,
      week_1_tasks: plan.week_1,
      week_2_tasks: plan.week_2,
      week_3_tasks: plan.week_3,
      week_4_tasks: plan.week_4,
      week_5_tasks: plan.week_5,
      week_6_tasks: plan.week_6,
      week_7_tasks: plan.week_7,
      week_8_tasks: plan.week_8,
      week_9_tasks: plan.week_9,
      week_10_tasks: plan.week_10,
      week_11_tasks: plan.week_11,
      week_12_tasks: plan.week_12,
      current_week: 1,
    };

    // Log for debugging
    console.log('Payment webhook processed:', {
      contact_id,
      email,
      business_idea: plan.business_idea,
    });

    return res.status(200).json(response);

  } catch (error) {
    console.error('Payment webhook error:', error);
    return res.status(500).json({
      error: 'Failed to generate plan',
      message: error.message,
    });
  }
}
