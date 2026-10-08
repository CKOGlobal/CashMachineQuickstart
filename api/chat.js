// api/chat.js - Anthropic API proxy for Cash Machine QuickStart
// ============================================================
// SECURITY: Multi-layer bot/scraper protection via botcheck.js
// Two modes:
//   1. Free funnel  — { kind: "ideas", intake: {...} }. The prompt is built here
//      on the server from capped fields; the browser cannot send its own prompt.
//      Rate limited per visitor.
//   2. Paid program — { messages, system? } with a valid access link in the
//      x-cmqs-access header. Rate limited per student.
// ============================================================
export const config = {
  maxDuration: 60,
};
import { rejectIfBot } from "./botcheck.js";
import { verifyAccessToken, rateLimit, clientIp } from "./_lib/access.js";

const MODEL = "claude-sonnet-4-6";

const ALLOWED_ORIGINS = [
  "https://cash-machine-quickstart.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:4173",
];

const HOUR = 60 * 60 * 1000;
const FREE_IDEAS_PER_HOUR   = 5;
const PAID_CALLS_PER_HOUR   = 60;
const MAX_MESSAGES          = 40;
const MAX_MESSAGE_CHARS     = 12000;
const MAX_SYSTEM_CHARS      = 6000;

const clip = (v, n) => String(v ?? "").slice(0, n);

function buildIdeasPrompt(intake = {}) {
  const skills = Array.isArray(intake.selectedSkills)
    ? intake.selectedSkills.slice(0, 12).map(s => clip(s, 40)).join(", ")
    : "";
  return `Generate 8 Cash Machine QuickStart business ideas using the DUAL-TRACK system for: ${clip(intake.name, 80)}
Procrastination: ${clip(intake.procrastination, 500)}
Good at: ${clip(intake.goodAt, 500)}
Hard pass: ${clip(intake.hardPass, 500)}
Skills: ${skills}
${intake.specificIdea ? `Specific idea: ${clip(intake.specificIdea, 500)}` : ""}
Time: ${clip(intake.timeAvailable, 80)} | Goal: ${clip(intake.incomeGoal, 80)}

IDEAS 1-2: BRIDGE (category:"bridge") — gig platforms, start TODAY, cash THIS WEEK
IDEAS 3-7: BUSINESS (category:"business") — skills-based services, scalable, exit potential, first client in 7 days
IDEA 8: WILDCARD (category:"wildcard") — creative/unique

Return ONLY valid JSON array:
[{"title":"","tagline":"","category":"bridge|business|wildcard","monthOne":"$X-Y first week","yearTwo":"18-mo potential","quickStart":"Step 1...","pros":[],"cons":[],"fitScore":85}]
No preamble.`;
}

function cleanMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) return null;
  const out = [];
  for (const m of messages) {
    if (!m || (m.role !== "user" && m.role !== "assistant")) return null;
    if (typeof m.content !== "string" || !m.content.trim()) return null;
    out.push({ role: m.role, content: clip(m.content, MAX_MESSAGE_CHARS) });
  }
  if (out[0].role !== "user") return null;
  return out;
}

export default async function handler(req, res) {
  // ── Bot / scraper guard — runs before everything else ──
  if (rejectIfBot(req, res)) return;
  // ── CORS — locked to platform domains only ──
  const origin = req.headers["origin"] || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin)
    ? origin
    : "https://cash-machine-quickstart.vercel.app";
  res.setHeader("Access-Control-Allow-Origin",  allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-cmqs-access");
  res.setHeader("Vary", "Origin");
  if (req.method === "OPTIONS") { res.status(200).end(); return; }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body || {};
    let messages;
    let system;
    let maxTokens;

    if (body.kind === "ideas") {
      if (!rateLimit(`ideas:${clientIp(req)}`, FREE_IDEAS_PER_HOUR, HOUR)) {
        return res.status(429).json({ error: "You've generated a lot of ideas this hour. Take a breather and try again soon." });
      }
      messages  = [{ role: "user", content: buildIdeasPrompt(body.intake) }];
      maxTokens = 4096;
    } else {
      const access = verifyAccessToken(req.headers["x-cmqs-access"]);
      if (!access) {
        return res.status(401).json({ error: "Access link required. Check your email for your Cash Machine QuickStart access link." });
      }
      if (!rateLimit(`paid:${access.email}`, PAID_CALLS_PER_HOUR, HOUR)) {
        return res.status(429).json({ error: "Too many requests this hour. Give it a few minutes." });
      }
      messages = cleanMessages(body.messages);
      if (!messages) {
        return res.status(400).json({ error: "Invalid request: messages must alternate user/assistant and start with user" });
      }
      if (typeof body.system === "string" && body.system.trim()) system = clip(body.system, MAX_SYSTEM_CHARS);
      maxTokens = 8192;
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens,
        ...(system ? { system } : {}),
        messages,
      }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", response.status, errorText);
      return res.status(502).json({ error: "The AI service had a hiccup. Please try again." });
    }
    const data  = await response.json();
    const reply = data.content
      .filter(item => item.type === "text")
      .map(item => item.text)
      .join("\n");
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
