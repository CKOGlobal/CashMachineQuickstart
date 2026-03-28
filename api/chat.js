// api/chat.js - Anthropic API proxy for Cash Machine QuickStart
// Deployed to Vercel as serverless function

// Vercel configuration - requires Pro plan for 60s timeout
export const config = {
  maxDuration: 60, // 60 seconds (requires Vercel Pro plan)
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request: messages array required' });
    }
    
    // Call Anthropic API with increased timeout and max_tokens
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192, // Increased from 4096 for detailed 90-day plans
        messages: messages
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: `API error: ${response.status}`,
        details: errorText 
      });
    }
    
    const data = await response.json();
    
    // Extract text from response
    const reply = data.content
      .filter(item => item.type === 'text')
      .map(item => item.text)
      .join('\n');
    
    return res.status(200).json({ reply });
    
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
