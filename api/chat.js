// ─────────────────────────────────────────────────────────────────────────────
// api/chat.js
// Vercel serverless function - proxies browser requests to Anthropic API
// Prevents CORS issues and keeps API key secure server-side
// ─────────────────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Missing messages array" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY not set in environment variables");
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", response.status, errorText);
      return res.status(response.status).json({
        error: "Anthropic API error",
        details: errorText,
      });
    }

    const data = await response.json();

    // Extract text content from response
    const textContent = data.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    return res.status(200).json({
      reply: textContent,
      content: textContent,
      raw: data,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
}
