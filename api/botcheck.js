// api/botcheck.js — Bot/scraper detection + Resend email alerts
// ============================================================
// Cash Machine QuickStart — CKO Global LLC
// Import and call rejectIfBot(req, res) at the top of any API route.
// ============================================================

const ALERT_TO   = "kelli@proactively-lazy.com";
const ALERT_FROM = "security@proactively-lazy.com";

const blockTracker = new Map();
const TRACKER_TTL_MS = 10 * 60 * 1000;

const ALLOWED_ORIGINS = new Set([
  "https://cash-machine-quickstart.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:4173",
]);

const BAD_UA_PATTERNS = [
  "python-requests","python-urllib","python-httpx","scrapy","wget","curl",
  "httpie","go-http-client","java/","jakarta commons","libwww-perl",
  "lwp-trivial","php/","ruby","node-fetch","got/","undici",
  "playwright","puppeteer","selenium","webdriver","headlesschrome","phantomjs",
  "zgrab","masscan","nmap","nikto","sqlmap","arachni","openvas","burpsuite",
  "dirbuster","apachebench","gptbot","chatgpt","ccbot","anthropic-ai",
  "claude-web","google-extended","perplexitybot","bytespider","semrushbot",
  "ahrefsbot","mj12bot","dotbot","dataforseo","screaming frog","sitebulb",
  "seokicks","blexbot",
];

function classifyThreat(reason, origin, referer, ua) {
  if (!origin && !referer) {
    return { level: "HIGH", label: "Direct API Access — No Browser Origin" };
  }
  for (const pattern of BAD_UA_PATTERNS) {
    if (ua.includes(pattern)) {
      return { level: "HIGH", label: `Known Scraper Tool: ${pattern}` };
    }
  }
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return { level: "MEDIUM", label: `Unauthorized Origin: ${origin}` };
  }
  if (reason.includes("Headless")) {
    return { level: "HIGH", label: "Headless Browser Detected" };
  }
  return { level: "LOW", label: "Automated Scan (Background Noise)" };
}

function trackBlock(ip, reason) {
  const now = Date.now();
  for (const [key, val] of blockTracker.entries()) {
    if (now - val.firstSeen > TRACKER_TTL_MS) blockTracker.delete(key);
  }
  if (!blockTracker.has(ip)) {
    blockTracker.set(ip, { count: 1, firstSeen: now, lastSeen: now, reasons: [reason] });
    return 1;
  }
  const entry = blockTracker.get(ip);
  entry.count++;
  entry.lastSeen = now;
  if (!entry.reasons.includes(reason)) entry.reasons.push(reason);
  return entry.count;
}

async function sendAlert({ ip, ua, origin, referer, reason, threat, repeatCount, path }) {
  const apiKey = process.env.CASH_MACHINE_RESEND;
  if (!apiKey) {
    console.warn("[botcheck] RESEND_API_KEY not set — alert skipped");
    return;
  }

  const now     = new Date().toLocaleString("en-US", { timeZone: "America/Chicago" });
  const subject = threat.level === "HIGH"
    ? `🚨 CMQS Scrape Alert — ${threat.label}`
    : `⚠️ CMQS Repeated Block — ${ip} (${repeatCount}x in 10 min)`;

  const html = `
    <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #07090F; color: #E5E7EB; border-radius: 8px; overflow: hidden;">
      <div style="background: ${threat.level === 'HIGH' ? '#7f1d1d' : '#78350f'}; padding: 20px 24px;">
        <div style="font-size: 11px; color: rgba(255,255,255,0.6); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px;">Cash Machine QuickStart — Security Alert</div>
        <div style="font-size: 22px; font-weight: 800; color: #ffffff;">${subject}</div>
        <div style="font-size: 12px; color: rgba(255,255,255,0.7); margin-top: 4px;">${now} CT</div>
      </div>
      <div style="padding: 24px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.07);">
            <td style="padding: 10px 0; color: #9CA3AF; width: 140px;">Threat Level</td>
            <td style="padding: 10px 0; font-weight: 700; color: ${threat.level === 'HIGH' ? '#F87171' : '#FBBF24'};">${threat.level} — ${threat.label}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.07);">
            <td style="padding: 10px 0; color: #9CA3AF;">IP Address</td>
            <td style="padding: 10px 0; font-family: monospace; color: #C9A84C;">${ip}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.07);">
            <td style="padding: 10px 0; color: #9CA3AF;">Block Count</td>
            <td style="padding: 10px 0; font-weight: 700; color: ${repeatCount >= 3 ? '#F87171' : '#E5E7EB'};">${repeatCount}x in last 10 minutes${repeatCount >= 5 ? ' — PERSISTENT ATTACKER' : ''}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.07);">
            <td style="padding: 10px 0; color: #9CA3AF;">Endpoint Hit</td>
            <td style="padding: 10px 0; font-family: monospace; color: #3ECFAB;">${path || '/api/chat'}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.07);">
            <td style="padding: 10px 0; color: #9CA3AF;">Block Reason</td>
            <td style="padding: 10px 0;">${reason}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.07);">
            <td style="padding: 10px 0; color: #9CA3AF;">Origin</td>
            <td style="padding: 10px 0; font-family: monospace;">${origin || '(none)'}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.07);">
            <td style="padding: 10px 0; color: #9CA3AF;">Referer</td>
            <td style="padding: 10px 0; font-family: monospace;">${referer || '(none)'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #9CA3AF;">User Agent</td>
            <td style="padding: 10px 0; font-size: 11px; font-family: monospace; word-break: break-all;">${ua || '(none)'}</td>
          </tr>
        </table>
        ${repeatCount >= 5 ? `
        <div style="margin-top: 20px; padding: 14px 16px; background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.4); border-radius: 6px;">
          <div style="font-weight: 700; color: #F87171; margin-bottom: 4px;">⚠️ Persistent Attacker Detected</div>
          <div style="font-size: 12px; color: rgba(255,255,255,0.7);">This IP has been blocked ${repeatCount} times in 10 minutes. Add it to your Vercel IP Block list.</div>
          <div style="margin-top: 8px; font-size: 11px; font-family: monospace; color: #C9A84C;">Vercel → cash-machine-quickstart → Firewall → Rules → IP Blocking → Add IP: ${ip}</div>
        </div>` : ''}
        <div style="margin-top: 20px; padding: 12px 14px; background: rgba(255,255,255,0.03); border-radius: 6px; font-size: 11px; color: #6B7280;">
          Request was automatically blocked. No data was exposed.
        </div>
      </div>
      <div style="padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.07); font-size: 11px; color: #4B5563; text-align: center;">
        Cash Machine QuickStart Security Monitor · CKO Global LLC
      </div>
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: ALERT_FROM, to: ALERT_TO, subject, html }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("[botcheck] Resend error:", err);
    } else {
      console.log("[botcheck] Alert email sent →", ALERT_TO);
    }
  } catch (err) {
    console.error("[botcheck] Failed to send alert:", err.message);
  }
}

function shouldAlert(threat, repeatCount) {
  if (threat.level === "HIGH")   return true;
  if (repeatCount >= 3)          return true;
  if (threat.level === "MEDIUM") return true;
  return false;
}

export function checkRequest(req) {
  const origin  = req.headers["origin"]  || "";
  const referer = req.headers["referer"] || "";
  const ua      = (req.headers["user-agent"] || "").toLowerCase();

  const originOk  = ALLOWED_ORIGINS.has(origin);
  const refererOk = [...ALLOWED_ORIGINS].some(o => referer.startsWith(o));

  if (!originOk && !refererOk) {
    if (!origin && !referer) {
      return { blocked: true, status: 403, reason: "Direct API access is not permitted." };
    }
    if (origin && !originOk) {
      return { blocked: true, status: 403, reason: `Origin not allowed: ${origin}` };
    }
  }

  if (!ua && !originOk) {
    return { blocked: true, status: 403, reason: "Missing User-Agent header." };
  }

  for (const pattern of BAD_UA_PATTERNS) {
    if (ua.includes(pattern)) {
      return { blocked: true, status: 403, reason: `Automated client detected (${pattern}).` };
    }
  }

  const acceptLang = req.headers["accept-language"] || "";
  const accept     = req.headers["accept"] || "";

  if (!acceptLang && ua.includes("chrome") && !originOk) {
    return { blocked: true, status: 403, reason: "Headless browser fingerprint detected." };
  }
  if (accept === "application/json" && !refererOk && !originOk) {
    return { blocked: true, status: 403, reason: "Non-browser request pattern detected." };
  }

  return { blocked: false };
}

export function rejectIfBot(req, res) {
  const check = checkRequest(req);
  if (!check.blocked) return false;

  const ip      = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || "unknown";
  const origin  = req.headers["origin"]  || "";
  const referer = req.headers["referer"] || "";
  const ua      = req.headers["user-agent"] || "";
  const path    = req.url || "";

  const repeatCount = trackBlock(ip, check.reason);
  const threat      = classifyThreat(check.reason, origin, referer, ua.toLowerCase());

  console.warn("[botcheck] BLOCKED —", { threat: threat.level, label: threat.label, reason: check.reason, ip, ua, origin, referer, path, repeatCount });

  if (shouldAlert(threat, repeatCount)) {
    sendAlert({ ip, ua, origin, referer, reason: check.reason, threat, repeatCount, path })
      .catch(err => console.error("[botcheck] Alert send failed:", err.message));
  }

  res.status(check.status || 403).json({ error: check.reason });
  return true;
}
