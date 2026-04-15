// ─────────────────────────────────────────────────────────────────────────────
// IncomeFirstExport.js
// Generates a clean, printable / PDF-saveable Income-First plan
// No npm dependencies — uses browser print API
// ─────────────────────────────────────────────────────────────────────────────

export function exportIncomeFirstPDF({ name, idea, plan, intake }) {
  const date     = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const skillStr = (intake.skills || [])
    .filter(s => s !== "other")
    .join(", ")
    .replace(/,([^,]*)$/, " &$1");
  const otherStr = intake.otherSkills ? ` · ${intake.otherSkills}` : "";

  const renderLines = (text = "", accentColor = "#D8FF2C") => {
    if (!text) return "<p style='color:#888;font-style:italic'>Section not available.</p>";
    const lines = text.split("\n").filter(l => l.trim());
    return lines.map(line => {
      if (/^Week\s+\d/i.test(line)) {
        const m = line.match(/^(Week[^:]+:)(.*)/i);
        return `<div class="week-row"><span class="week-label">${m?.[1]||line}</span>${m?.[2]?.trim() ? `<span class="week-body">${m[2].trim()}</span>` : ""}</div>`;
      }
      if (/^(End of|Weekly Metrics|If You Fall Behind)/i.test(line)) {
        const m = line.match(/^([^:]+:)(.*)/);
        return `<div class="ms-row"><span class="ms-key">${m?.[1]||line}</span>${m?.[2]?.trim() ? `<span class="ms-val">${m[2].trim()}</span>` : ""}</div>`;
      }
      const kv = line.match(/^([A-Z][^:]{2,40}:)\s+(.*)/);
      if (kv) return `<div class="kv-row"><span class="kv-key">${kv[1]}</span><span class="kv-val">${kv[2]}</span></div>`;
      if (/\$\d/.test(line)) return `<div class="dollar-line">${line}</div>`;
      if (/^[-*•]\s/.test(line)) return `<div class="bullet"><span class="bdot">▸</span><span>${line.replace(/^[-*•]\s/, "")}</span></div>`;
      if (/^\d+\.\s/.test(line)) {
        const n = line.match(/^\d+/)[0];
        return `<div class="bullet"><span class="bdot num">${n}.</span><span>${line.replace(/^\d+\.\s*/, "")}</span></div>`;
      }
      if (line.startsWith("## ")) return `<h3 class="sh2">${line.slice(3)}</h3>`;
      if (line.startsWith("### ")) return `<h4 class="sh3">${line.slice(4)}</h4>`;
      return `<p class="body-p">${line}</p>`;
    }).join("");
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${name}'s Income-First Plan — ${idea.title}</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-size: 10.5pt; }
  body {
    font-family: 'Georgia', 'Times New Roman', serif;
    color: #1a1a1a;
    background: #fff;
    line-height: 1.6;
  }
  .page {
    width: 7.5in;
    margin: 0 auto;
    padding: 0.55in 0.6in 0.45in;
    page-break-after: always;
    position: relative;
  }
  .page:last-child { page-break-after: auto; }
  .brand-strip {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-bottom: 2.5px solid #96D400;
    padding-bottom: 10px;
    margin-bottom: 22px;
  }
  .brand-name {
    font-family: 'Arial', sans-serif;
    font-size: 7.5pt;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #6A9900;
  }
  .brand-date {
    font-family: 'Courier New', monospace;
    font-size: 7pt;
    color: #888;
  }
  .cover-eyebrow {
    font-family: 'Courier New', monospace;
    font-size: 7.5pt;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #6A9900;
    margin-bottom: 14px;
  }
  .cover-name {
    font-family: 'Arial', sans-serif;
    font-size: 28pt;
    font-weight: 900;
    color: #06091A;
    line-height: 1.1;
    margin-bottom: 6px;
  }
  .cover-sub {
    font-size: 11pt;
    color: #555;
    font-style: italic;
    margin-bottom: 32px;
  }
  .idea-hero {
    background: #f8fdf0;
    border-left: 5px solid #96D400;
    border-radius: 0 10px 10px 0;
    padding: 20px 24px;
    margin-bottom: 28px;
  }
  .idea-label {
    font-family: 'Courier New', monospace;
    font-size: 7pt;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #6A9900;
    margin-bottom: 5px;
  }
  .idea-title {
    font-family: 'Arial', sans-serif;
    font-size: 18pt;
    font-weight: 900;
    color: #06091A;
    margin-bottom: 5px;
  }
  .idea-earning {
    font-family: 'Courier New', monospace;
    font-size: 11pt;
    font-weight: 700;
    color: #6A9900;
    margin-bottom: 8px;
  }
  .idea-desc { font-size: 10pt; color: #444; line-height: 1.65; }
  .profile-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 28px;
  }
  .profile-cell {
    background: #f8fdf0;
    border: 1px solid #ddf0aa;
    border-radius: 8px;
    padding: 12px 14px;
  }
  .profile-cell-label {
    font-family: 'Courier New', monospace;
    font-size: 6.5pt;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #888;
    margin-bottom: 3px;
  }
  .profile-cell-val {
    font-family: 'Arial', sans-serif;
    font-size: 9.5pt;
    font-weight: 700;
    color: #1a1a1a;
  }
  .section-header {
    font-family: 'Arial', sans-serif;
    font-size: 10pt;
    font-weight: 900;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #6A9900;
    border-bottom: 1.5px solid #e8f5c8;
    padding-bottom: 5px;
    margin: 22px 0 12px;
  }
  .page-title {
    font-family: 'Arial', sans-serif;
    font-size: 15pt;
    font-weight: 900;
    color: #06091A;
    margin-bottom: 4px;
  }
  .page-sub {
    font-family: 'Courier New', monospace;
    font-size: 7.5pt;
    color: #888;
    letter-spacing: 0.1em;
    margin-bottom: 18px;
  }
  .week-row {
    background: #f8fdf0;
    border: 1px solid #ddf0aa;
    border-radius: 7px;
    padding: 9px 12px;
    margin-bottom: 7px;
  }
  .week-label {
    font-family: 'Courier New', monospace;
    font-size: 7.5pt;
    font-weight: 700;
    color: #6A9900;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    display: block;
    margin-bottom: 2px;
  }
  .week-body { font-size: 9.5pt; color: #333; line-height: 1.6; }
  .ms-row {
    display: grid;
    grid-template-columns: 160px 1fr;
    gap: 10px;
    padding: 6px 0;
    border-bottom: 1px solid #f5f5f2;
    align-items: start;
  }
  .ms-key {
    font-family: 'Courier New', monospace;
    font-size: 7.5pt;
    font-weight: 700;
    color: #6A9900;
  }
  .ms-val { font-size: 9pt; color: #333; line-height: 1.55; }
  .kv-row {
    background: #f8fdf0;
    border: 1px solid #ddf0aa;
    border-radius: 6px;
    padding: 7px 10px;
    margin-bottom: 5px;
  }
  .kv-key {
    font-family: 'Courier New', monospace;
    font-size: 6.5pt;
    font-weight: 700;
    color: #5a8800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    display: block;
    margin-bottom: 2px;
  }
  .kv-val { font-size: 9.5pt; color: #1a1a1a; line-height: 1.6; }
  .bullet {
    display: flex;
    gap: 8px;
    font-size: 9.5pt;
    color: #333;
    line-height: 1.6;
    margin-bottom: 4px;
    align-items: flex-start;
  }
  .bdot { color: #6A9900; flex-shrink: 0; font-size: 8pt; margin-top: 2px; }
  .bdot.num { color: #3ECFAB; font-weight: 700; }
  .dollar-line {
    font-family: 'Courier New', monospace;
    font-size: 9pt;
    color: #1a7a40;
    background: #f5faf7;
    border: 1px solid #d0e8d9;
    border-radius: 5px;
    padding: 5px 9px;
    margin-bottom: 5px;
  }
  .sh2 { font-size: 10.5pt; font-weight: 700; color: #06091A; margin: 14px 0 5px; }
  .sh3 { font-size: 9pt; font-weight: 700; color: #6A9900; text-transform: uppercase; letter-spacing: 0.08em; margin: 10px 0 4px; }
  .body-p { font-size: 9.5pt; color: #444; line-height: 1.65; margin-bottom: 5px; }
  .page-footer {
    position: absolute;
    bottom: 0.28in;
    left: 0.6in;
    right: 0.6in;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #e8f5c8;
    padding-top: 7px;
  }
  .footer-brand {
    font-family: 'Courier New', monospace;
    font-size: 6.5pt;
    color: #aaa;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .footer-pg {
    font-family: 'Courier New', monospace;
    font-size: 6.5pt;
    color: #bbb;
  }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page { width: 100%; padding: 0.45in 0.5in 0.55in; }
    .no-print { display: none !important; }
  }
  .screen-nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    background: #06091A;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 24px;
    z-index: 100;
    border-bottom: 1px solid rgba(216,255,44,0.2);
  }
  .screen-nav-title {
    font-family: 'Courier New', monospace;
    font-size: 10pt;
    color: #D8FF2C;
    font-weight: 700;
  }
  .print-btn {
    background: #D8FF2C;
    color: #06091A;
    border: none;
    border-radius: 6px;
    padding: 8px 20px;
    font-family: 'Courier New', monospace;
    font-size: 9pt;
    font-weight: 700;
    letter-spacing: 0.06em;
    cursor: pointer;
  }
  .print-btn:hover { opacity: 0.88; }
  .screen-body { margin-top: 54px; }
</style>
</head>
<body>

<div class="screen-nav no-print">
  <span class="screen-nav-title">📄 ${name}'s Income-First Plan — ${idea.title}</span>
  <button class="print-btn" onclick="window.print()">⬇ Save as PDF / Print</button>
</div>

<div class="screen-body">

<!-- PAGE 1: COVER -->
<div class="page">
  <div class="brand-strip">
    <span class="brand-name">Income-First · CKO Global LLC</span>
    <span class="brand-date">Generated ${date}</span>
  </div>

  <div class="cover-eyebrow">Your 90-Day Business Launch Plan</div>
  <div class="cover-name">${name}</div>
  <div class="cover-sub">Built by Income-First · CKO Global LLC · proactively-lazy.com</div>

  <div class="idea-hero">
    <div class="idea-label">Your Business Idea</div>
    <div class="idea-title">${idea.title}</div>
    <div class="idea-earning">${idea.monthOne} → ${idea.yearTwo} in 18mo</div>
    <div class="idea-desc">${idea.description || ""}</div>
  </div>

  <div class="profile-grid">
    <div class="profile-cell">
      <div class="profile-cell-label">Background</div>
      <div class="profile-cell-val">${intake.background || "—"}</div>
    </div>
    <div class="profile-cell">
      <div class="profile-cell-label">Skill Areas</div>
      <div class="profile-cell-val">${skillStr || "—"}${otherStr}</div>
    </div>
    <div class="profile-cell">
      <div class="profile-cell-label">Time Available</div>
      <div class="profile-cell-val">${intake.timeLabel || intake.timeAvail || "—"}</div>
    </div>
    <div class="profile-cell">
      <div class="profile-cell-label">Monthly Income Goal</div>
      <div class="profile-cell-val">${intake.goalLabel || intake.incomeGoal || "—"}</div>
    </div>
  </div>

  <div class="section-header">What's Inside This Plan</div>
  <div class="bullet"><span class="bdot">▸</span><span><strong>Pricing Strategy</strong> — 3 tiers, specific prices, revenue math</span></div>
  <div class="bullet"><span class="bdot">▸</span><span><strong>90-Day Roadmap</strong> — Week-by-week actions, Month 1-3</span></div>
  <div class="bullet"><span class="bdot">▸</span><span><strong>Marketing Playbook</strong> — Scripts, channels, outreach ready to use</span></div>
  <div class="bullet"><span class="bdot">▸</span><span><strong>Milestones</strong> — What success looks like at 30, 60, 90 days</span></div>

  <div class="page-footer">
    <span class="footer-brand">Income-First · CKO Global LLC · proactively-lazy.com</span>
    <span class="footer-pg">Page 1 of 4</span>
  </div>
</div>

<!-- PAGE 2: PRICING -->
<div class="page">
  <div class="brand-strip">
    <span class="brand-name">Income-First · ${name}</span>
    <span class="brand-date">${idea.title}</span>
  </div>

  <div class="page-title">Pricing Strategy</div>
  <div class="page-sub">Your offer tiers · revenue math · path to your goal</div>

  ${renderLines(plan.pricing, "#96D400")}

  <div class="page-footer">
    <span class="footer-brand">Income-First · CKO Global LLC</span>
    <span class="footer-pg">Page 2 of 4</span>
  </div>
</div>

<!-- PAGE 3: 90-DAY ROADMAP -->
<div class="page">
  <div class="brand-strip">
    <span class="brand-name">Income-First · ${name}</span>
    <span class="brand-date">${idea.title}</span>
  </div>

  <div class="page-title">90-Day Launch Roadmap</div>
  <div class="page-sub">Month-by-month · week-by-week · first client to full income</div>

  <div class="section-header">Month 1 — Foundation & First Clients</div>
  ${renderLines(plan.month1)}

  <div class="section-header">Month 2 — Deliver, Refine & Expand</div>
  ${renderLines(plan.month2)}

  <div class="section-header">Month 3 — Scale, Raise & Sustain</div>
  ${renderLines(plan.month3)}

  <div class="page-footer">
    <span class="footer-brand">Income-First · CKO Global LLC</span>
    <span class="footer-pg">Page 3 of 4</span>
  </div>
</div>

<!-- PAGE 4: MARKETING + MILESTONES -->
<div class="page">
  <div class="brand-strip">
    <span class="brand-name">Income-First · ${name}</span>
    <span class="brand-date">${idea.title}</span>
  </div>

  <div class="page-title">Marketing Playbook</div>
  <div class="page-sub">Your ideal client · where to find them · scripts ready to use</div>

  ${renderLines(plan.marketing)}

  <div class="section-header">Milestones & Accountability</div>
  ${renderLines(plan.milestones)}

  <div style="margin-top:22px;background:#f8fdf0;border:1.5px solid #ddf0aa;border-radius:10px;padding:16px 18px;">
    <div style="font-family:'Courier New',monospace;font-size:7pt;letter-spacing:0.16em;text-transform:uppercase;color:#6A9900;margin-bottom:6px;">The Only Rule</div>
    <div style="font-size:10pt;color:#333;line-height:1.7;font-style:italic;">"The only plan that doesn't work is the one you never start. Pick one idea. Say yes. Do it this week. Make income NOW, build for scale LATER."</div>
    <div style="font-family:'Courier New',monospace;font-size:7.5pt;color:#6A9900;margin-top:8px;">— Kelli Owens, Income-First</div>
  </div>

  <div style="margin-top:18px;display:flex;justify-content:space-between;align-items:center;background:#06091A;border-radius:8px;padding:12px 16px;">
    <div>
      <div style="font-family:'Courier New',monospace;font-size:7pt;letter-spacing:0.15em;text-transform:uppercase;color:#D8FF2C;margin-bottom:3px;">Continue Your Journey</div>
      <div style="font-family:'Arial',sans-serif;font-size:9pt;color:#e8e4dc;">proactively-lazy.com · kelli@proactively-lazy.com</div>
    </div>
  </div>

  <div class="page-footer">
    <span class="footer-brand">Income-First · CKO Global LLC · proactively-lazy.com</span>
    <span class="footer-pg">Page 4 of 4</span>
  </div>
</div>

</div>
</body>
</html>`;

  const win = window.open("", "_blank", "width=900,height=750,scrollbars=yes");
  if (!win) { alert("Pop-up blocked — please allow pop-ups for this site and try again."); return; }
  win.document.write(html);
  win.document.close();
  win.focus();
}

// Keep old export name as alias for backward compatibility
export const exportCashMachineQuickStartPDF = exportIncomeFirstPDF;
