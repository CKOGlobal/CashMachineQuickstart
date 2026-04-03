// api/api-chat.js - Anthropic API proxy for Cash Machine QuickStart
// ============================================================
// SECURITY: Multi-layer bot/scraper protection via botcheck.js
// ============================================================

import { rejectIfBot } from "./botcheck.js";

const ALLOWED_ORIGINS = [
  "https://cash-machine-quickstart.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:4173",
];

export default async function handler(req, res) {
  // ── Bot / scraper guard — runs before everything else ──
  if (rejectIfBot(req, res)) return;

  // ── CORS — locked to platform domains only ──
  const origin = req.headers["origin"] || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin)
    ? origin
    : "https://cash-machine-quickstart.vercel.app";

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin",  allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") { res.status(200).end(); return; }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request: messages array required" });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", response.status, errorText);
      return res.status(response.status).json({ error: `API error: ${response.status}`, details: errorText });
    }

    const data  = await response.json();
    const reply = data.content
      .filter(item => item.type === "text")
      .map(item => item.text)
      .join("\n");

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("Chat API error:", error);
    return res.status(500).json({ error: "Internal server error", message: error.message });
  }
}
