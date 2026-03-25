import { useState, useEffect } from "react";
import { exportCashMachineQuickStartPDF } from "./CashMachineQuickStartExport";

const SKILL_CATEGORIES = [
  { id: "creative",  emoji: "🎨", label: "Creative & Arts",        examples: "Design, writing, music, photography" },
  { id: "tech",      emoji: "💻", label: "Tech & Digital",         examples: "Coding, social media, software, AI" },
  { id: "trades",    emoji: "🔧", label: "Trades & Hands-On",      examples: "Building, fixing, landscaping, auto" },
  { id: "teaching",  emoji: "📚", label: "Teaching & Coaching",    examples: "Tutoring, training, mentoring, consulting" },
  { id: "sales",     emoji: "📣", label: "Sales & Marketing",      examples: "Selling, negotiating, networking, ads" },
  { id: "care",      emoji: "🤝", label: "Care & Service",         examples: "Childcare, eldercare, pet care, cleaning" },
  { id: "finance",   emoji: "📊", label: "Finance & Numbers",      examples: "Bookkeeping, taxes, investing, analysis" },
  { id: "wellness",  emoji: "💪", label: "Health & Wellness",      examples: "Fitness, nutrition, therapy, beauty" },
  { id: "logistics", emoji: "🚚", label: "Operations & Logistics", examples: "Driving, organizing, planning, admin" },
  { id: "food",      emoji: "🍳", label: "Food & Hospitality",     examples: "Cooking, catering, bartending, events" },
];

const TIME_OPTIONS = [
  { id: "t5",  label: "Under 5 hrs/wk", sub: "Pocket money" },
  { id: "t10", label: "5-10 hrs/wk",    sub: "Side income" },
  { id: "t20", label: "10-20 hrs/wk",   sub: "Serious cash" },
  { id: "t40", label: "20+ hrs/wk",     sub: "Full income" },
];

const GOAL_OPTIONS = [
  { id: "g500",  label: "$500/mo",     sub: "Cover a bill" },
  { id: "g1500", label: "$1,500/mo",   sub: "Real breathing room" },
  { id: "g5k",   label: "$5,000/mo",   sub: "Life-changing" },
  { id: "g10k",  label: "$10,000+/mo", sub: "Build wealth" },
];

const DELIVERY_OPTIONS = [
  { id: "1on1",     label: "1-on-1",          sub: "Direct client work" },
  { id: "group",    label: "Group / Class",    sub: "Teach or lead many" },
  { id: "product",  label: "Physical Product", sub: "Sell something made" },
  { id: "digital",  label: "Digital / Info",   sub: "Courses, templates, guides" },
  { id: "retainer", label: "Retainer",         sub: "Ongoing monthly work" },
  { id: "gig",      label: "Gig / Project",    sub: "One-off jobs" },
];

const LS_KEY = "cmqs_state";

// ── API ──────────────────────────────────────────────────────────────────────
async function callAPI(message) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "user", content: message }] }),
  });
  if (!res.ok) throw new Error("API error " + res.status);
  const data = await res.json();
  return data.reply || data.content || "";
}

function extractJSON(text) {
  const s = text.replace(/```json/g, "").replace(/```/g, "").trim();
  const fo = s.indexOf("{");
  const fa = s.indexOf("[");
  let start = -1;
  let isArr = false;
  if (fo === -1 && fa === -1) throw new Error("No JSON in response");
  if (fo === -1)        { start = fa; isArr = true; }
  else if (fa === -1)   { start = fo; isArr = false; }
  else if (fa < fo)     { start = fa; isArr = true; }
  else                  { start = fo; isArr = false; }
  const end = isArr ? s.lastIndexOf("]") : s.lastIndexOf("}");
  if (end === -1) throw new Error("Malformed JSON");
  return s.slice(start, end + 1);
}

function parseSections(text) {
  const keys    = ["pricing", "month1", "month2", "month3", "marketing", "milestones"];
  const headers = ["PRICING", "MONTH1", "MONTH2", "MONTH3", "MARKETING", "MILESTONES"];
  const plan = {};
  headers.forEach(function(header, i) {
    var marker     = "===" + header + "===";
    var nextMarker = i < headers.length - 1 ? "===" + headers[i + 1] + "===" : null;
    var si         = text.indexOf(marker);
    if (si === -1) { plan[keys[i]] = "Section missing — please try again."; return; }
    var cs = si + marker.length;
    var ei = nextMarker ? text.indexOf(nextMarker) : text.length;
    plan[keys[i]] = text.slice(cs, ei === -1 ? text.length : ei).trim();
  });
  return plan;
}

// ── ATOMS ────────────────────────────────────────────────────────────────────
function Chip({ label, emoji, sub, selected, onClick }) {
  return (
    <button onClick={onClick} style={{ ...st.chip, ...(selected ? st.chipOn : {}) }}>
      {emoji && <span style={st.chipEmoji}>{emoji}</span>}
      <div style={st.chipInner}>
        <span style={st.chipLabel}>{label}</span>
        {sub && <span style={st.chipSub}>{sub}</span>}
      </div>
      {selected && <span style={st.chipCheck}>✓</span>}
    </button>
  );
}

function SectionLabel({ children }) {
  return <div style={st.sectionLabel}>{children}</div>;
}

function Loader({ text, sub }) {
  return (
    <div style={st.loaderWrap}>
      <div style={st.loaderRing} />
      <div style={st.loaderText}>{text}</div>
      {sub && <div style={st.loaderSub}>{sub}</div>}
    </div>
  );
}

function PhaseHeader({ badge, title, sub }) {
  return (
    <div style={st.phaseHeader}>
      <div style={st.phaseBadge}>{badge}</div>
      <h2 style={st.phaseTitle}>{title}</h2>
      {sub && <p style={st.phaseSub}>{sub}</p>}
    </div>
  );
}

// ── PHASE 1 — INTAKE ─────────────────────────────────────────────────────────
function PhaseIntake({ state, setState, onNext }) {
  const { name, background, skills, timeAvail, incomeGoal } = state;
  const toggle = (id) =>
    setState((p) => ({
      ...p,
      skills: p.skills.includes(id) ? p.skills.filter((x) => x !== id) : [...p.skills, id],
    }));
  const hasSkills = skills.length > 0 && (
    !skills.includes("other") || (state.otherSkills && state.otherSkills.trim().length > 0)
  );
  const ok = name.trim() && background.trim() && hasSkills && timeAvail && incomeGoal;

  return (
    <div>
      <PhaseHeader
        badge="STEP 1 OF 4  ·  ABOUT YOU"
        title={<>Let's find money in what you <span style={st.gold}>already know.</span></>}
        sub="No fancy degrees. No huge investment. Just you, your skills, and a plan to get paid."
      />
      <div style={st.formGroup}>
        <label style={st.label}>First name</label>
        <input style={st.input} placeholder="e.g. Alex" value={name}
          onChange={(e) => setState((p) => ({ ...p, name: e.target.value }))} />
      </div>
      <div style={st.formGroup}>
        <label style={st.label}>What do you do, and what are you good at?</label>
        <textarea style={{ ...st.input, ...st.textarea }} rows={3}
          placeholder="e.g. I'm a college sophomore studying marketing. I run my school's Instagram page and people always ask me for social media help."
          value={background}
          onChange={(e) => setState((p) => ({ ...p, background: e.target.value }))} />
      </div>
      <div style={st.formGroup}>
        <SectionLabel>Pick the skills that feel like YOU (check all that apply)</SectionLabel>
        <div style={st.chipGrid}>
          {SKILL_CATEGORIES.map((c) => (
            <Chip key={c.id} emoji={c.emoji} label={c.label} sub={c.examples}
              selected={skills.includes(c.id)} onClick={() => toggle(c.id)} />
          ))}
          <Chip emoji="🌀" label="None of these" sub="I have something else"
            selected={skills.includes("other")} onClick={() => toggle("other")} />
        </div>
        <div style={{ ...st.formGroup, marginTop: "0.85rem" }}>
          <label style={st.label}>
            Got a specific idea already? Tell us.{" "}
            <span style={st.optional}>(optional but helpful)</span>
          </label>
          <textarea style={{ ...st.input, ...st.textarea }} rows={2}
            placeholder="e.g. I want to tutor high schoolers in math. Or: I flip thrift store clothes on Depop. Or: No clue, just need money."
            value={state.otherSkills || ""}
            onChange={(e) => setState((p) => ({ ...p, otherSkills: e.target.value }))} />
          {skills.includes("other") && !state.otherSkills?.trim() && (
            <div style={st.otherHint}>↑ Even random ideas help — no judgment.</div>
          )}
        </div>
      </div>
      <div style={st.twoCol}>
        <div style={st.formGroup}>
          <SectionLabel>Time you can commit per week</SectionLabel>
          <div style={st.chipCol}>
            {TIME_OPTIONS.map((t) => (
              <Chip key={t.id} label={t.label} sub={t.sub}
                selected={timeAvail === t.id}
                onClick={() => setState((p) => ({ ...p, timeAvail: t.id }))} />
            ))}
          </div>
        </div>
        <div style={st.formGroup}>
          <SectionLabel>Monthly income goal</SectionLabel>
          <div style={st.chipCol}>
            {GOAL_OPTIONS.map((g) => (
              <Chip key={g.id} label={g.label} sub={g.sub}
                selected={incomeGoal === g.id}
                onClick={() => setState((p) => ({ ...p, incomeGoal: g.id }))} />
            ))}
          </div>
        </div>
      </div>
      <div style={st.navRow}>
        <div />
        <button onClick={onNext} disabled={!ok}
          style={{ ...st.btnPrimary, ...(!ok ? st.btnDisabled : {}) }}>
          Show Me My Fast Cash Ideas →
        </button>
      </div>
    </div>
  );
}

// ── PHASE 2 — IDEAS ──────────────────────────────────────────────────────────
const RANK_META = [
  { label: "Best Fit",          color: "#C9A84C", bg: "rgba(201,168,76,0.12)",  border: "rgba(201,168,76,0.35)", dot: "🥇" },
  { label: "Strong Fit",        color: "#C9A84C", bg: "rgba(201,168,76,0.07)",  border: "rgba(201,168,76,0.22)", dot: "🥈" },
  { label: "Strong Fit",        color: "#C9A84C", bg: "rgba(201,168,76,0.07)",  border: "rgba(201,168,76,0.22)", dot: "🥈" },
  { label: "Good Option",       color: "#3ECFAB", bg: "rgba(62,207,171,0.07)",  border: "rgba(62,207,171,0.22)", dot: "🎯" },
  { label: "Good Option",       color: "#3ECFAB", bg: "rgba(62,207,171,0.07)",  border: "rgba(62,207,171,0.22)", dot: "🎯" },
  { label: "Worth Trying",      color: "#E8A838", bg: "rgba(232,168,56,0.06)",  border: "rgba(232,168,56,0.2)",  dot: "💡" },
  { label: "Worth Trying",      color: "#E8A838", bg: "rgba(232,168,56,0.06)",  border: "rgba(232,168,56,0.2)",  dot: "💡" },
  { label: "Stretch Goal",      color: "#9B7FE8", bg: "rgba(155,127,232,0.06)", border: "rgba(155,127,232,0.2)", dot: "🚀" },
];

function IdeaCard({ idea, index, onSelect }) {
  const [open, setOpen] = useState(false);
  const meta = RANK_META[index] || RANK_META[RANK_META.length - 1];
  const pros = idea.pros || [];
  const cons = idea.cons || [];

  return (
    <div style={{ ...idSt.card, borderColor: open ? meta.border : "rgba(255,255,255,0.08)", background: open ? meta.bg : "rgba(255,255,255,0.03)" }}>
      <div style={idSt.header} onClick={() => setOpen(!open)}>
        <div style={idSt.headerLeft}>
          <div style={idSt.rankBadge}>
            <span style={{ fontSize: "1rem" }}>{meta.dot}</span>
            <span style={{ ...idSt.rankLabel, color: meta.color }}>{meta.label}</span>
            <span style={idSt.rankNum}>#{index + 1}</span>
          </div>
          <div style={idSt.titleRow}>
            <span style={idSt.title}>{idea.title}</span>
            <span style={idSt.category}>{idea.category}</span>
          </div>
          <div style={idSt.earningRow}>
            <span style={{ ...idSt.earning, color: meta.color }}>{idea.monthOne}</span>
            <span style={idSt.scaleHint}>→ {idea.yearTwo} in 18mo</span>
          </div>
        </div>
        <div style={idSt.headerRight}>
          <span style={idSt.expandHint}>{open ? "Less ▴" : "More ▾"}</span>
        </div>
      </div>
      <p style={idSt.desc}>{idea.description}</p>
      {open && (
        <div style={idSt.expanded}>
          <div style={idSt.proConGrid}>
            <div style={{ ...idSt.proConCol, borderColor: "rgba(74,222,128,0.2)" }}>
              <div style={{ ...idSt.proConLabel, color: "#4ade80" }}>✓ Why This Works</div>
              {pros.length > 0
                ? pros.map((p, i) => <div key={i} style={idSt.proItem}><span style={{ color: "#4ade80", flexShrink: 0 }}>+</span><span>{p}</span></div>)
                : <div style={idSt.proItem}><span style={{ color: "#4ade80" }}>+</span><span>Matches your skills</span></div>}
            </div>
            <div style={{ ...idSt.proConCol, borderColor: "rgba(248,113,113,0.2)" }}>
              <div style={{ ...idSt.proConLabel, color: "#f87171" }}>✗ The Real Talk</div>
              {cons.length > 0
                ? cons.map((c, i) => <div key={i} style={idSt.proItem}><span style={{ color: "#f87171", flexShrink: 0 }}>−</span><span>{c}</span></div>)
                : <div style={idSt.proItem}><span style={{ color: "#f87171" }}>−</span><span>Takes hustle to build</span></div>}
            </div>
          </div>
          {idea.quickStart && (
            <div style={idSt.quickStart}>
              <span style={idSt.quickStartLabel}>⚡ This week:</span>
              <span>{idea.quickStart}</span>
            </div>
          )}
          {idea.timeToFirst && (
            <div style={idSt.stat}>
              <span style={idSt.statLabel}>⏱ First dollar:</span>
              <span style={idSt.statVal}>{idea.timeToFirst}</span>
            </div>
          )}
          <button onClick={() => onSelect(idea)} style={idSt.selectBtn}>Pick This One →</button>
        </div>
      )}
    </div>
  );
}

const idSt = {
  card:         { border: "1px solid", borderRadius: "12px", padding: "1.1rem 1.25rem", marginBottom: "0.65rem", transition: "all 0.22s", cursor: "default" },
  header:       { display: "flex", justifyContent: "space-between", alignItems: "flex-start", cursor: "pointer", marginBottom: "0.45rem" },
  headerLeft:   { display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1 },
  headerRight:  { flexShrink: 0, paddingLeft: "0.75rem" },
  rankBadge:    { display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.15rem" },
  rankLabel:    { fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" },
  rankNum:      { fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.58rem", color: "#94a3b8", marginLeft: "0.25rem" },
  titleRow:     { display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" },
  title:        { fontSize: "1rem", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.01em" },
  category:     { fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.58rem", color: "#94a3b8", background: "rgba(255,255,255,0.06)", borderRadius: "3px", padding: "0.1rem 0.45rem", letterSpacing: "0.08em" },
  earningRow:   { display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" },
  earning:      { fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.78rem", fontWeight: 700 },
  scaleHint:    { fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.68rem", color: "#94a3b8", fontStyle: "italic" },
  expandHint:   { fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.62rem", color: "#94a3b8", whiteSpace: "nowrap" },
  desc:         { fontSize: "0.81rem", color: "#94a3b8", lineHeight: 1.65, margin: "0 0 0.25rem" },
  expanded:     { marginTop: "0.85rem", paddingTop: "0.85rem", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: "0.65rem", animation: "fadeUp 0.2s ease both" },
  proConGrid:   { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" },
  proConCol:    { background: "rgba(255,255,255,0.025)", border: "1px solid", borderRadius: "8px", padding: "0.75rem" },
  proConLabel:  { fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" },
  proItem:      { display: "flex", gap: "0.4rem", fontSize: "0.78rem", color: "#cbd5e1", lineHeight: 1.55, marginBottom: "0.3rem", alignItems: "flex-start" },
  quickStart:   { display: "flex", gap: "0.6rem", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.18)", borderRadius: "8px", padding: "0.65rem 0.85rem", fontSize: "0.8rem", color: "#e2e8f0", lineHeight: 1.55, alignItems: "flex-start" },
  quickStartLabel: { fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.65rem", fontWeight: 700, color: "#C9A84C", flexShrink: 0, marginTop: "1px" },
  stat:         { display: "flex", alignItems: "center", gap: "0.5rem" },
  statLabel:    { fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.64rem", color: "#94a3b8" },
  statVal:      { fontSize: "0.8rem", color: "#e2e8f0", fontWeight: 600 },
  selectBtn:    { background: "#C9A84C", color: "#0d1117", border: "none", borderRadius: "8px", padding: "0.65rem 1.25rem", fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.74rem", fontWeight: 700, letterSpacing: "0.05em", cursor: "pointer", alignSelf: "flex-start", transition: "all 0.18s" },
};

function PhaseIdeas({ name, ideas, onSelect, onBack }) {
  return (
    <div>
      <PhaseHeader
        badge="STEP 2 OF 4  ·  YOUR IDEAS"
        title={<>{name}, here are your <span style={st.gold}>8 fast cash paths</span> — ranked best to reach.</>}
        sub="Each shows what you'll make NOW + what it could become in 18 months. Tap any card for details."
      />
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
        {[
          { dot: "🥇", label: "Best Fit", color: "#C9A84C" },
          { dot: "🎯", label: "Good Option", color: "#3ECFAB" },
          { dot: "💡", label: "Worth Trying", color: "#E8A838" },
          { dot: "🚀", label: "Stretch Goal", color: "#9B7FE8" },
        ].map((r) => (
          <div key={r.label} style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "50px", padding: "0.25rem 0.65rem" }}>
            <span style={{ fontSize: "0.75rem" }}>{r.dot}</span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.6rem", color: r.color, letterSpacing: "0.08em" }}>{r.label}</span>
          </div>
        ))}
      </div>
      <div>
        {ideas.map((idea, i) => <IdeaCard key={i} idea={idea} index={i} onSelect={onSelect} />)}
      </div>
      <div style={st.navRow}>
        <button onClick={onBack} style={st.btnGhost}>← Back</button>
        <div />
      </div>
    </div>
  );
}

// ── PAYMENT GATE ─────────────────────────────────────────────────────────────
function PaymentGate({ onUnlock, testMode, onEnableTestMode }) {
  return (
    <div style={paySt.wrap}>
      <div style={paySt.badge}>UNLOCK YOUR 90-DAY PLAN</div>
      <h2 style={paySt.title}>You've seen your ideas. Now let's build the plan.</h2>
      <p style={paySt.sub}>
        Get your personalized 90-day roadmap, pricing strategy, marketing scripts, and 3 months of daily accountability — all for $67.
      </p>
      <div style={paySt.includes}>
        <div style={paySt.includesLabel}>What You Get:</div>
        <div style={paySt.checkList}>
          <div style={paySt.checkItem}><span style={paySt.checkDot}>✓</span>Custom pricing strategy (3 tiers + revenue math)</div>
          <div style={paySt.checkItem}><span style={paySt.checkDot}>✓</span>Month-by-month action plan (Weeks 1-12)</div>
          <div style={paySt.checkItem}><span style={paySt.checkDot}>✓</span>Marketing playbook (scripts, channels, outreach)</div>
          <div style={paySt.checkItem}><span style={paySt.checkDot}>✓</span>90 days of daily motivation (SMS/Email)</div>
          <div style={paySt.checkItem}><span style={paySt.checkDot}>✓</span>12 weekly accountability check-ins</div>
          <div style={paySt.checkItem}><span style={paySt.checkDot}>✓</span>Downloadable PDF + email copy</div>
        </div>
      </div>
      <div style={paySt.priceBox}>
        <div style={paySt.priceLabel}>One-Time Investment</div>
        <div style={paySt.priceNum}>$67</div>
        <div style={paySt.priceSub}>90-day accountability program · No recurring fees</div>
      </div>
      <div style={paySt.comingSoon}>
        <div style={paySt.csTitle}>⚙️ Coming Soon</div>
        <div style={paySt.csText}>
          Payment integration is being built by the Integrated Wealth Systems team.
          <br />To enable early access or test this program, contact:
        </div>
        <div style={paySt.csEmails}>
          <a href="mailto:homework@askloral.com" style={paySt.csEmail}>homework@askloral.com</a>
          <span style={paySt.csDivider}>or</span>
          <a href="mailto:Kelli@proactively-lazy.com" style={paySt.csEmail}>Kelli@proactively-lazy.com</a>
        </div>
      </div>
      {!testMode && (
        <button onClick={onEnableTestMode} style={paySt.testBtn}>
          🔧 Enable Test Mode (Bypass Payment)
        </button>
      )}
      {testMode && (
        <button onClick={onUnlock} style={paySt.unlockBtn}>
          ✓ Test Mode Active — Proceed to Plan
        </button>
      )}
    </div>
  );
}

const paySt = {
  wrap:          { padding: "3rem 1.5rem", textAlign: "center", maxWidth: 580, margin: "0 auto" },
  badge:         { fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.18em", color: "#C9A84C", marginBottom: "1rem" },
  title:         { fontSize: "clamp(1.3rem,3vw,1.75rem)", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em", marginBottom: "0.75rem", lineHeight: 1.2 },
  sub:           { fontSize: "0.9rem", color: "#94a3b8", lineHeight: 1.65, marginBottom: "1.75rem" },
  includes:      { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "1.5rem", textAlign: "left" },
  includesLabel: { fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "0.75rem" },
  checkList:     { display: "flex", flexDirection: "column", gap: "0.5rem" },
  checkItem:     { display: "flex", gap: "0.6rem", fontSize: "0.85rem", color: "#cbd5e1", lineHeight: 1.55, alignItems: "flex-start" },
  checkDot:      { color: "#4ade80", flexShrink: 0, fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.8rem", marginTop: "1px" },
  priceBox:      { background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.5rem" },
  priceLabel:    { fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "0.35rem" },
  priceNum:      { fontFamily: "'IBM Plex Mono', monospace", fontSize: "2.5rem", fontWeight: 900, color: "#C9A84C", lineHeight: 1, marginBottom: "0.35rem" },
  priceSub:      { fontSize: "0.78rem", color: "#94a3b8" },
  comingSoon:    { background: "rgba(62,207,171,0.06)", border: "1px solid rgba(62,207,171,0.18)", borderRadius: "12px", padding: "1.25rem 1.5rem", marginBottom: "1.5rem" },
  csTitle:       { fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.72rem", fontWeight: 700, color: "#3ECFAB", letterSpacing: "0.1em", marginBottom: "0.6rem" },
  csText:        { fontSize: "0.85rem", color: "#cbd5e1", lineHeight: 1.6, marginBottom: "0.75rem" },
  csEmails:      { display: "flex", flexDirection: "column", gap: "0.4rem", alignItems: "center" },
  csEmail:       { fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.8rem", color: "#3ECFAB", textDecoration: "none", fontWeight: 600 },
  csDivider:     { fontSize: "0.72rem", color: "#94a3b8", fontStyle: "italic" },
  testBtn:       { background: "rgba(155,127,232,0.15)", color: "#9B7FE8", border: "1px solid rgba(155,127,232,0.3)", borderRadius: "8px", padding: "0.7rem 1.5rem", fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.74rem", fontWeight: 700, letterSpacing: "0.05em", cursor: "pointer", transition: "all 0.18s" },
  unlockBtn:     { background: "#C9A84C", color: "#0d1117", border: "none", borderRadius: "8px", padding: "0.75rem 1.75rem", fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.05em", cursor: "pointer", transition: "all 0.18s" },
};

// ── PHASE 3 — PRICING ────────────────────────────────────────────────────────
function PhasePricing({ name, idea, onNext, onBack }) {
  const [deliveries, setDeliveries] = useState([]);
  const [otherDelivery, setOtherDelivery] = useState("");
  const [positioning, setPositioning] = useState("");
  const [notes, setNotes] = useState("");

  const toggleDelivery = (id) =>
    setDeliveries((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const ok = deliveries.length > 0 && !!positioning;

  const tiers = [
    { id: "starter",  label: "Start Low, Build Fast",      color: "#3ECFAB", range: "Low price",      desc: "Charge less, get clients fast, build reviews.", detail: "Best for: first 30 days, proving it works.", examples: "e.g. $20/session, $50 intro, $75 package" },
    { id: "mid",      label: "Sweet Spot Pricing",         color: "#C9A84C", range: "Balanced",       desc: "Fair price, steady clients, sustainable income.", detail: "Best for: consistent money without burnout.", examples: "e.g. $50/hr, $200/package, $300/mo" },
    { id: "premium",  label: "Premium / High-End",         color: "#E8A838", range: "High price",     desc: "Charge what you're worth. Fewer clients, more money.", detail: "Best for: proven results, specialized skills.", examples: "e.g. $100+/hr, $500+/package" },
    { id: "tiered",   label: "All 3 Tiers (Recommended)",  color: "#9B7FE8", range: "Full ladder",    desc: "Give options. Starter brings them in. Premium funds the dream.", detail: "Best for: maximum flexibility and revenue.", examples: "e.g. $75 / $200 / $500" },
    { id: "suggest",  label: "Not Sure — Pick for Me",     color: "#F06292", range: "AI suggests",    desc: "Let the AI recommend the right pricing for YOUR situation.", detail: "Best for: first-timers who need guidance.", examples: "We'll analyze your idea and tell you what to charge." },
  ];

  return (
    <div>
      <PhaseHeader
        badge="STEP 3 OF 4  ·  PRICING"
        title={<>Let's price your <span style={st.gold}>{idea.title}.</span></>}
        sub="What you charge matters. Price it right and you'll make money. Price it wrong and you'll quit in a month."
      />
      <div style={st.selectedBar}>
        <span style={st.selectedBarLabel}>Selected</span>
        <span style={st.selectedBarTitle}>{idea.title}</span>
        <span style={st.selectedBarEarning}>{idea.monthOne}</span>
      </div>
      <div style={st.formGroup}>
        <SectionLabel>How will you deliver this? <span style={{ color: "#C9A84C", fontWeight: 400 }}>(pick all that apply)</span></SectionLabel>
        <div style={st.chipGrid}>
          {DELIVERY_OPTIONS.map((d) => (
            <Chip key={d.id} label={d.label} sub={d.sub}
              selected={deliveries.includes(d.id)} onClick={() => toggleDelivery(d.id)} />
          ))}
        </div>
        <div style={{ marginTop: "0.75rem" }}>
          <label style={st.label}>Other delivery method? <span style={st.optional}>(optional)</span></label>
          <input style={st.input} placeholder="e.g. Subscription, pop-up shop, licensed digital product..."
            value={otherDelivery} onChange={(e) => setOtherDelivery(e.target.value)} />
        </div>
      </div>
      <div style={st.formGroup}>
        <SectionLabel>Where do you want to price yourself?</SectionLabel>
        <div style={st.tierList}>
          {tiers.map((tier) => {
            const active = positioning === tier.id;
            return (
              <button key={tier.id} onClick={() => setPositioning(tier.id)}
                style={{ ...st.tierCard, ...(active ? { borderColor: tier.color, background: tier.color + "11" } : {}) }}>
                <div style={{ ...st.tierDot, background: active ? tier.color : "transparent", borderColor: tier.color }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.2rem", flexWrap: "wrap" }}>
                    <div style={{ ...st.tierLabel, ...(active ? { color: tier.color } : {}) }}>{tier.label}</div>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.62rem", color: active ? tier.color : "#94a3b8", background: active ? tier.color + "18" : "rgba(255,255,255,0.05)", borderRadius: "4px", padding: "0.1rem 0.5rem", letterSpacing: "0.08em" }}>{tier.range}</span>
                  </div>
                  <div style={st.tierDesc}>{tier.desc}</div>
                  {active && (
                    <div style={{ marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      <div style={{ fontSize: "0.75rem", color: "#cbd5e1", lineHeight: 1.55 }}><span style={{ color: tier.color, fontWeight: 600 }}>✓ </span>{tier.detail}</div>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.68rem", color: "#94a3b8", fontStyle: "italic" }}>{tier.examples}</div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div style={st.formGroup}>
        <label style={st.label}>Anything else we should know? <span style={st.optional}>(optional)</span></label>
        <textarea style={{ ...st.input, ...st.textarea }} rows={2}
          placeholder="e.g. My city is expensive. My clients are broke college students. I want to start cheap and raise rates after 10 clients."
          value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <div style={st.navRow}>
        <button onClick={onBack} style={st.btnGhost}>← Back</button>
        <button onClick={() => onNext({ delivery: deliveries.join(", ") + (otherDelivery ? ", " + otherDelivery : ""), positioning, pricingNotes: notes })}
          disabled={!ok} style={{ ...st.btnPrimary, ...(!ok ? st.btnDisabled : {}) }}>
          Build My 90-Day Plan →
        </button>
      </div>
    </div>
  );
}

// ── PHASE 4 — PLAN ───────────────────────────────────────────────────────────
function isScriptLine(line) {
  return /^(Script|Outreach|Hi |Hey |Hello |Subject:|Dear |Message:|"Hi|"Hey)/i.test(line);
}

function PlanBlock({ text }) {
  if (!text) return null;
  const lines = text.split("\n").filter(Boolean);
  const elements = [];
  let scriptBuffer = [];

  const flushScript = (key) => {
    if (scriptBuffer.length === 0) return;
    elements.push(
      <div key={"script-" + key} style={planSt.scriptBox}>
        <div style={planSt.scriptLabel}>✉ SCRIPT</div>
        {scriptBuffer.map((l, i) => <div key={i} style={planSt.scriptLine}>{l}</div>)}
      </div>
    );
    scriptBuffer = [];
  };

  lines.forEach((line, i) => {
    if (line.startsWith("## "))  { flushScript(i); elements.push(<div key={i} style={planSt.sectionHeading}>{line.slice(3)}</div>); return; }
    if (line.startsWith("### ")) { flushScript(i); elements.push(<div key={i} style={planSt.subHeading}>{line.slice(4)}</div>); return; }
    const weekMatch = line.match(/^(Week\s+\d[^:]*:)(.*)/i);
    if (weekMatch) { flushScript(i); elements.push(<div key={i} style={planSt.weekRow}><div style={planSt.weekBadge}>{weekMatch[1].trim()}</div>{weekMatch[2].trim() && <div style={planSt.weekBody}>{weekMatch[2].trim()}</div>}</div>); return; }
    const msMatch = line.match(/^(End of [^:]+:|Weekly Metrics:|If You Fall Behind:)(.*)/i);
    if (msMatch) { flushScript(i); elements.push(<div key={i} style={planSt.msRow}><div style={planSt.msKey}>{msMatch[1].trim()}</div>{msMatch[2].trim() && <div style={planSt.msVal}>{msMatch[2].trim()}</div>}</div>); return; }
    const kvMatch = line.match(/^([A-Z][^:]{2,40}:)\s+(.*)/);
    if (kvMatch && !isScriptLine(line)) { flushScript(i); elements.push(<div key={i} style={planSt.kvRow}><span style={planSt.kvKey}>{kvMatch[1]}</span><span style={planSt.kvVal}>{kvMatch[2]}</span></div>); return; }
    if (isScriptLine(line) || scriptBuffer.length > 0) { scriptBuffer.push(line); return; }
    if (/^[-*•]\s/.test(line))  { flushScript(i); elements.push(<div key={i} style={planSt.bullet}><span style={planSt.bulletDot}>▸</span><span>{line.replace(/^[-*•]\s/, "")}</span></div>); return; }
    if (/^\d+\.\s/.test(line))  { flushScript(i); const n = line.match(/^\d+/)[0]; elements.push(<div key={i} style={planSt.bullet}><span style={{ ...planSt.bulletDot, color: "#3ECFAB", fontWeight: 700 }}>{n}.</span><span>{line.replace(/^\d+\.\s*/, "")}</span></div>); return; }
    if (/\$\d/.test(line))      { flushScript(i); elements.push(<div key={i} style={planSt.dollarLine}>{line}</div>); return; }
    flushScript(i);
    elements.push(<p key={i} style={planSt.bodyP}>{line}</p>);
  });
  flushScript("end");
  return <div style={{ animation: "fadeUp 0.25s ease both" }}>{elements}</div>;
}

const planSt = {
  sectionHeading: { fontSize: "1rem", fontWeight: 800, color: "#f1f5f9", margin: "1.5rem 0 0.6rem", paddingBottom: "0.4rem", borderBottom: "1px solid rgba(255,255,255,0.08)", letterSpacing: "-0.01em" },
  subHeading:     { fontSize: "0.82rem", fontWeight: 700, color: "#C9A84C", margin: "1.1rem 0 0.4rem", letterSpacing: "0.04em", textTransform: "uppercase" },
  bodyP:          { fontSize: "0.84rem", color: "#94a3b8", lineHeight: 1.75, margin: "0 0 0.5rem" },
  bullet:         { display: "flex", gap: "0.6rem", fontSize: "0.84rem", color: "#cbd5e1", lineHeight: 1.65, marginBottom: "0.4rem", alignItems: "flex-start" },
  bulletDot:      { color: "#C9A84C", flexShrink: 0, fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.68rem", marginTop: "4px" },
  weekRow:        { background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.18)", borderRadius: "10px", padding: "0.75rem 1rem", marginBottom: "0.6rem" },
  weekBadge:      { fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.68rem", fontWeight: 700, color: "#C9A84C", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.25rem" },
  weekBody:       { fontSize: "0.83rem", color: "#e2e8f0", lineHeight: 1.65 },
  msRow:          { display: "grid", gridTemplateColumns: "200px 1fr", gap: "0.75rem", padding: "0.6rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)", alignItems: "start" },
  msKey:          { fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.7rem", fontWeight: 700, color: "#C9A84C", letterSpacing: "0.04em" },
  msVal:          { fontSize: "0.83rem", color: "#cbd5e1", lineHeight: 1.6 },
  kvRow:          { display: "flex", flexDirection: "column", gap: "0.15rem", padding: "0.6rem 0.85rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", marginBottom: "0.5rem" },
  kvKey:          { fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.65rem", fontWeight: 700, color: "#E8A838", letterSpacing: "0.1em", textTransform: "uppercase" },
  kvVal:          { fontSize: "0.84rem", color: "#e2e8f0", lineHeight: 1.65 },
  scriptBox:      { background: "rgba(62,207,171,0.06)", border: "1px solid rgba(62,207,171,0.22)", borderRadius: "10px", padding: "1rem 1.1rem", marginBottom: "0.75rem" },
  scriptLabel:    { fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.6rem", fontWeight: 700, color: "#3ECFAB", letterSpacing: "0.14em", marginBottom: "0.5rem" },
  scriptLine:     { fontSize: "0.83rem", color: "#e2e8f0", lineHeight: 1.75, fontStyle: "italic" },
  dollarLine:     { fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.82rem", color: "#4ade80", background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: "6px", padding: "0.45rem 0.75rem", marginBottom: "0.4rem" },
};

const TAB_META = [
  { id: "pricing",    label: "Pricing",    emoji: "💰" },
  { id: "month1",     label: "Month 1",    emoji: "📅" },
  { id: "month2",     label: "Month 2",    emoji: "📅" },
  { id: "month3",     label: "Month 3",    emoji: "📅" },
  { id: "marketing",  label: "Marketing",  emoji: "📣" },
  { id: "milestones", label: "Milestones", emoji: "🎯" },
];

function PhasePlan({ plan, idea, name, intake, onReset }) {
  const [tab, setTab] = useState("pricing");
  const current = TAB_META.find((t) => t.id === tab);

  const handlePDF = () => {
    exportCashMachineQuickStartPDF({ name, idea, plan, intake });
  };

  return (
    <div>
      <div style={planSt2.heroBar}>
        <div>
          <div style={planSt2.heroBadge}>STEP 4 OF 4  ·  YOUR 90-DAY PLAN</div>
          <div style={planSt2.heroTitle}>{name}, your plan is ready. Now go make money.</div>
          <div style={planSt2.heroSub}>
            <span style={planSt2.ideaTag}>{idea.title}</span>
            <span style={planSt2.ideaEarning}>{idea.monthOne} → {idea.yearTwo}</span>
          </div>
        </div>
      </div>

      <div style={planSt2.exportBar}>
        <div style={planSt2.exportLabel}>
          <span style={{ fontSize: "0.8rem" }}>📄</span>
          <span>Save your plan</span>
        </div>
        <button onClick={handlePDF} style={planSt2.exportBtn}>
          ⬇ Download PDF
        </button>
      </div>

      <div style={planSt2.tabBar}>
        {TAB_META.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ ...planSt2.tab, ...(tab === t.id ? planSt2.tabActive : {}) }}>
            <span style={planSt2.tabEmoji}>{t.emoji}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div style={planSt2.activeLabel}>
        <span style={planSt2.activeDot} />
        {current.emoji} {current.label}
      </div>

      <div style={planSt2.content} key={tab}>
        <PlanBlock text={plan[tab]} tabId={tab} />
      </div>

      <div style={planSt2.footer}>
        <div style={planSt2.footerQuote}>
          "The only plan that doesn't work is the one you never start. Pick one idea. Say yes. Do it this week."
        </div>
        <button onClick={onReset} style={st.btnGhost}>Start Over →</button>
      </div>
    </div>
  );
}

const planSt2 = {
  heroBar:      { background: "linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.02))", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "14px", padding: "1.5rem 1.75rem", marginBottom: "1.25rem" },
  heroBadge:    { fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.57rem", letterSpacing: "0.16em", color: "#C9A84C", marginBottom: "0.4rem" },
  heroTitle:    { fontSize: "clamp(1.1rem,2.5vw,1.4rem)", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em", marginBottom: "0.6rem" },
  heroSub:      { display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" },
  ideaTag:      { fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.75rem", fontWeight: 700, color: "#0d1117", background: "#C9A84C", borderRadius: "4px", padding: "0.2rem 0.65rem" },
  ideaEarning:  { fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.78rem", color: "#C9A84C", fontWeight: 600 },
  exportBar:    { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", background: "rgba(62,207,171,0.06)", border: "1px solid rgba(62,207,171,0.2)", borderRadius: "10px", padding: "0.85rem 1.1rem", marginBottom: "1.25rem", flexWrap: "wrap" },
  exportLabel:  { display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.68rem", color: "rgba(232,228,220,0.55)", letterSpacing: "0.08em", textTransform: "uppercase" },
  exportBtn:    { background: "#3ECFAB", color: "#0d1117", border: "none", borderRadius: "6px", padding: "0.55rem 1.1rem", fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", cursor: "pointer", transition: "all 0.18s", whiteSpace: "nowrap" },
  tabBar:       { display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.75rem" },
  tab:          { display: "flex", alignItems: "center", gap: "0.35rem", fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.66rem", letterSpacing: "0.04em", color: "#94a3b8", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "0.4rem 0.85rem", cursor: "pointer", transition: "all 0.18s" },
  tabActive:    { background: "rgba(201,168,76,0.12)", borderColor: "rgba(201,168,76,0.35)", color: "#C9A84C", fontWeight: 700 },
  tabEmoji:     { fontSize: "0.85rem" },
  activeLabel:  { display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.68rem", color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.25rem", paddingBottom: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.06)" },
  activeDot:    { width: 6, height: 6, borderRadius: "50%", background: "#C9A84C", flexShrink: 0, boxShadow: "0 0 6px rgba(201,168,76,0.6)" },
  content:      { minHeight: 280, animation: "fadeUp 0.22s ease both" },
  footer:       { marginTop: "2rem", paddingTop: "1.25rem", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" },
  footerQuote:  { fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.7rem", color: "#94a3b8", fontStyle: "italic", maxWidth: 420 },
};

// ── ROOT ─────────────────────────────────────────────────────────────────────
const DEFAULT_INTAKE = { name: "", background: "", skills: [], timeAvail: "", incomeGoal: "", otherSkills: "", timeLabel: "", goalLabel: "" };

export default function CashMachineQuickStart() {
  const [phase,    setPhase]    = useState(1);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [ideas,    setIdeas]    = useState([]);
  const [selected, setSelected] = useState(null);
  const [plan,     setPlan]     = useState(null);
  const [intake,   setIntake]   = useState(DEFAULT_INTAKE);
  const [testMode, setTestMode] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const s = JSON.parse(saved);
        if (s.intake)   setIntake(s.intake);
        if (s.ideas)    setIdeas(s.ideas);
        if (s.selected) setSelected(s.selected);
        if (s.plan)     setPlan(s.plan);
        if (s.phase)    setPhase(s.phase);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (phase > 1) {
        localStorage.setItem(LS_KEY, JSON.stringify({ phase, intake, ideas, selected, plan }));
      }
    } catch {}
  }, [phase, intake, ideas, selected, plan]);

  const handleIntakeSubmit = async () => {
    setLoading(true); setError("");
    const { name, background, skills, timeAvail, incomeGoal, otherSkills } = intake;
    const skillLabels = skills.map((id) => { const c = SKILL_CATEGORIES.find(c => c.id === id); return c ? c.label : id; }).filter(l => l !== "other").join(", ");
    const timeOpt  = TIME_OPTIONS.find((t) => t.id === timeAvail) || {};
    const goalOpt  = GOAL_OPTIONS.find((g) => g.id === incomeGoal) || {};
    const timeLabel = timeOpt.label || timeAvail;
    const goalLabel = goalOpt.label || incomeGoal;
    const hasOtherChip = skills.includes("other");
    const otherNote = otherSkills ? (hasOtherChip && !skillLabels ? " Their specific idea: " + otherSkills + "." : " Additional context: " + otherSkills + ".") : "";

    setIntake(p => ({ ...p, timeLabel, goalLabel }));

    const prompt = "You are a Cash Machine advisor helping students and young people make money NOW using Loral Langemeier's 21st Century Lemonade Stand methodology + Kelli Owens' Exit First Framework."
      + " Generate exactly 8 unique fast cash business ideas for this person, ranked from BEST FIT (#1) to STRETCH GOAL (#8)."
      + " Name: " + name + ". Background: " + background + ". Skills: " + (skillLabels || "flexible") + "." + otherNote
      + " Time: " + timeLabel + "/week. Goal: " + goalLabel + "."
      + " Each idea must be startable THIS WEEK with zero or minimal startup cost."
      + " CRITICAL: Each idea must show BOTH short-term (Month 1) AND long-term (18 months) earning potential."
      + " Return ONLY a valid JSON array, no markdown, no extra text."
      + " Each object must have exactly these keys:"
      + " title, category, monthOne ($X-$Y/mo realistic Month 1 earnings), yearTwo (what it becomes in 18mo if scaled), description (2-3 sentences),"
      + " pros (array of 3 short strings), cons (array of 2 short strings),"
      + " quickStart (one action THIS WEEK), timeToFirst (e.g. 3-7 days)";

    try {
      const raw    = await callAPI(prompt);
      const parsed = JSON.parse(extractJSON(raw));
      setIdeas(parsed); setPhase(2);
    } catch (err) { setError("Couldn't generate ideas: " + err.message); }
    finally { setLoading(false); }
  };

  const handleSelectIdea = (idea) => { 
    setSelected(idea); 
    setPhase("payment");
  };

  const handlePaymentUnlock = () => {
    setPhase(3);
  };

  const handlePricingSubmit = async ({ delivery, positioning, pricingNotes }) => {
    setLoading(true); setError("");
    const { name, background, skills, timeAvail, incomeGoal, otherSkills, timeLabel, goalLabel } = intake;
    const skillLabels     = skills.map(id => { const c = SKILL_CATEGORIES.find(c => c.id === id); return c ? c.label : id; }).filter(l => l !== "other").join(", ");
    const positioningLabel = positioning === "suggest"  ? "Not sure — please recommend the best pricing strategy" :
                             positioning === "tiered"   ? "Build all 3 tiers: Starter, Core, and Premium" :
                             positioning === "starter"  ? "Start Low, Build Fast (low price, high volume)" :
                             positioning === "mid"      ? "Sweet Spot Pricing (balanced value and price)" :
                             positioning === "premium"  ? "Premium / High-End (high price, fewer clients)" : positioning;
    const otherNote = otherSkills ? " Extra: " + otherSkills + "." : "";

    const prompt = "You are a Cash Machine business coach using Loral Langemeier's methodology + Kelli Owens' Exit First Framework. Write a personalized 90-day launch plan for a student/young person."
      + " Person: " + name + ". Background: " + background + ". Skills: " + (skillLabels || "flexible") + "." + otherNote
      + " Fast Cash Idea: " + selected.title + " (" + selected.category + "). Delivery: " + delivery + "."
      + " Pricing strategy: " + positioningLabel + ". Time: " + (timeLabel||timeAvail) + "/week. Goal: " + (goalLabel||incomeGoal) + "."
      + " Notes: " + (pricingNotes || "None") + "."
      + " VOICE: Direct, no-BS, student-friendly. Loral's urgency (make money NOW) + Kelli's strategy (build for scale). No fluff."
      + " Write the plan using EXACTLY these 6 section headers in this exact order. No text before the first header."
      + "\n===PRICING===\nWrite 3 offer tiers with specific dollar amounts. Show revenue math to reach " + (goalLabel||incomeGoal) + ". Be realistic for students."
      + "\n===MONTH1===\nWeek 1-2: Setup and foundation. Week 3-4: Outreach and first paying client. Goal: 1-3 clients, prove it works."
      + "\n===MONTH2===\nWeek 5-6: Deliver results, get testimonials, refine. Week 7-8: Expand, hit Month 2 income target."
      + "\n===MONTH3===\nWeek 9-10: Raise rates, build referral system. Week 11-12: Hit " + (goalLabel||incomeGoal) + " and plan for scale."
      + "\n===MARKETING===\nIdeal Client: Who and why. Top 3 Channels: Where to find them (be specific — campus groups, Instagram, local spots). Core Message: One sentence. Outreach Script A (cold): Full message ready to copy. Outreach Script B (warm): Full message ready to copy."
      + "\n===MILESTONES===\nEnd of Week 2: milestone. End of Month 1: target. End of Month 2: target. End of Month 3: final target (" + (goalLabel||incomeGoal) + "). Weekly Metrics: 3 things to track. If You Fall Behind: 2-3 recovery actions.";

    try {
      const raw    = await callAPI(prompt);
      const parsed = parseSections(raw);
      setPlan(parsed); setPhase(4);
    } catch (err) { setError("Couldn't build your plan: " + err.message); }
    finally { setLoading(false); }
  };

  const handleReset = () => {
    setPhase(1); setIdeas([]); setSelected(null); setPlan(null); setError("");
    setIntake(DEFAULT_INTAKE); setTestMode(false);
    try { localStorage.removeItem(LS_KEY); } catch {}
  };

  return (
    <div style={st.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        input, textarea   { font-family: inherit; }
        input:focus, textarea:focus { border-color: #C9A84C !important; outline: none; box-shadow: 0 0 0 3px rgba(201,168,76,0.08); }
        button:not(:disabled):hover { opacity: 0.82; transform: translateY(-1px); }
        button { transition: all 0.18s ease; cursor: pointer; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.2); border-radius: 4px; }
      `}</style>

      {testMode && (
        <div style={{ background: "rgba(155,127,232,0.15)", border: "1px solid rgba(155,127,232,0.3)", borderRadius: "8px", padding: "0.6rem 1rem", margin: "0 auto 1.5rem", maxWidth: 760, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.72rem", color: "#9B7FE8", fontWeight: 700 }}>🔧 TEST MODE ACTIVE — Payment gate bypassed</span>
          <button onClick={() => setTestMode(false)} style={{ background: "transparent", color: "#9B7FE8", border: "1px solid rgba(155,127,232,0.4)", borderRadius: "6px", padding: "0.35rem 0.75rem", fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.65rem", fontWeight: 700, cursor: "pointer" }}>
            Disable
          </button>
        </div>
      )}

      <div style={st.hero}>
        <div style={st.heroBadge}>LORAL LANGEMEIER + KELLI OWENS  ·  CASH MACHINE QUICKSTART</div>
        <h1 style={st.heroTitle}>
          Stop saving pennies.<br />
          <span style={st.gold}>Go make actual money.</span>
        </h1>
        <p style={st.heroSub}>Turn what you already know into cash — this week. No business plan. No investment. Just you and a plan that works.</p>
      </div>

      <div style={st.stepper}>
        {["About You", "Your Ideas", "Price It", "90-Day Plan"].map((label, i) => {
          const n = i + 1;
          const active = phase === n || (phase === "payment" && n === 2) || (phase === 3 && n === 3) || (phase === 4 && n === 4);
          const done = (phase === "payment" && n === 1) || (phase === 3 && n <= 2) || (phase === 4 && n <= 3);
          return (
            <div key={i} style={st.stepItem}>
              <div style={{ ...st.stepDot, ...(active ? st.stepDotActive : done ? st.stepDotDone : {}) }}>
                {done ? "✓" : n}
              </div>
              <span style={{ ...st.stepLabel, ...(active ? st.stepLabelActive : {}) }}>{label}</span>
              {i < 3 && <div style={{ ...st.stepLine, ...(done ? st.stepLineDone : {}) }} />}
            </div>
          );
        })}
      </div>

      <div style={st.card}>
        {loading ? (
          <Loader
            text={phase === 1 ? "Finding your fast cash ideas..." : "Building your 90-day plan..."}
            sub={phase === 1 ? "Matching skills + time + goals" : "Pricing · Roadmap · Marketing"}
          />
        ) : error ? (
          <div style={st.errorWrap}>
            <div style={st.errorIcon}>⚠</div>
            <div style={st.errorText}>{error}</div>
            <button onClick={() => setError("")} style={st.btnPrimary}>Try Again</button>
          </div>
        ) : (
          <>
            {phase === 1 && <PhaseIntake state={intake} setState={setIntake} onNext={handleIntakeSubmit} />}
            {phase === 2 && <PhaseIdeas name={intake.name} ideas={ideas} onSelect={handleSelectIdea} onBack={() => setPhase(1)} />}
            {phase === "payment" && <PaymentGate onUnlock={handlePaymentUnlock} testMode={testMode} onEnableTestMode={() => setTestMode(true)} />}
            {phase === 3 && <PhasePricing name={intake.name} idea={selected} onNext={handlePricingSubmit} onBack={() => setPhase("payment")} />}
            {phase === 4 && plan && <PhasePlan plan={plan} idea={selected} name={intake.name} intake={intake} onReset={handleReset} />}
          </>
        )}
      </div>
    </div>
  );
}

// ── STYLES ───────────────────────────────────────────────────────────────────
const goldColor  = "#C9A84C";
const goldDim    = "rgba(201,168,76,0.10)";
const goldBorder = "rgba(201,168,76,0.28)";
const bg         = "#0d1117";
const cardBg     = "rgba(255,255,255,0.035)";
const border     = "rgba(255,255,255,0.08)";
const textPri    = "#f1f5f9";
const textMuted  = "#94a3b8";
const mono       = "'IBM Plex Mono', monospace";

const st = {
  page:      { background: bg, minHeight: "100vh", color: textPri, fontFamily: "'Inter', system-ui, sans-serif", padding: "2rem 1rem 6rem" },
  gold:      { color: goldColor },
  hero:      { textAlign: "center", maxWidth: 620, margin: "0 auto 2.5rem" },
  heroBadge: { display: "inline-block", fontFamily: mono, fontSize: "0.58rem", letterSpacing: "0.18em", color: goldColor, border: "1px solid " + goldBorder, borderRadius: "3px", padding: "0.25rem 0.75rem", marginBottom: "1.25rem" },
  heroTitle: { fontSize: "clamp(1.75rem,4.5vw,2.6rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15, margin: "0 0 0.75rem" },
  heroSub:   { fontSize: "0.95rem", color: textMuted, lineHeight: 1.7, margin: 0 },
  stepper:        { display: "flex", alignItems: "center", justifyContent: "center", maxWidth: 560, margin: "0 auto 2rem", flexWrap: "wrap", gap: "0.25rem" },
  stepItem:       { display: "flex", alignItems: "center", gap: "0.4rem" },
  stepDot:        { width: 26, height: 26, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid " + border, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono, fontSize: "0.62rem", color: textMuted, flexShrink: 0, fontWeight: 600 },
  stepDotActive:  { background: goldDim, borderColor: goldColor, color: goldColor },
  stepDotDone:    { background: goldColor, borderColor: goldColor, color: "#0d1117" },
  stepLabel:      { fontSize: "0.68rem", color: textMuted, whiteSpace: "nowrap" },
  stepLabelActive:{ color: goldColor, fontWeight: 600 },
  stepLine:       { width: 28, height: 1, background: border, margin: "0 0.2rem" },
  stepLineDone:   { background: goldColor },
  card:           { maxWidth: 760, margin: "0 auto", background: cardBg, border: "1px solid " + border, borderRadius: "16px", padding: "2rem 2rem 1.75rem", animation: "fadeUp 0.35s ease both" },
  phaseHeader:    { marginBottom: "1.75rem" },
  phaseBadge:     { fontFamily: mono, fontSize: "0.57rem", letterSpacing: "0.16em", color: goldColor, marginBottom: "0.6rem" },
  phaseTitle:     { fontSize: "clamp(1.2rem,3vw,1.65rem)", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 0.5rem", lineHeight: 1.2 },
  phaseSub:       { color: textMuted, fontSize: "0.86rem", lineHeight: 1.65, margin: 0 },
  formGroup:      { marginBottom: "1.5rem" },
  label:          { display: "block", fontSize: "0.8rem", color: textMuted, fontWeight: 500, marginBottom: "0.5rem" },
  optional:       { color: "rgba(148,163,184,0.45)", fontWeight: 400 },
  sectionLabel:   { fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: textMuted, marginBottom: "0.75rem" },
  input:          { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid " + border, borderRadius: "8px", color: textPri, fontFamily: "'Inter', system-ui, sans-serif", fontSize: "0.88rem", padding: "0.6rem 0.85rem", transition: "border-color 0.2s, box-shadow 0.2s" },
  textarea:       { resize: "vertical", lineHeight: 1.6, minHeight: "72px" },
  twoCol:         { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" },
  chipGrid:       { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(185px,1fr))", gap: "0.55rem" },
  chipCol:        { display: "flex", flexDirection: "column", gap: "0.5rem" },
  chip:           { display: "flex", alignItems: "flex-start", gap: "0.5rem", background: "rgba(255,255,255,0.04)", border: "1px solid " + border, borderRadius: "8px", padding: "0.6rem 0.7rem", cursor: "pointer", color: textPri, textAlign: "left", position: "relative" },
  chipOn:         { background: goldDim, borderColor: goldColor },
  chipEmoji:      { fontSize: "1rem", flexShrink: 0, marginTop: "1px" },
  chipInner:      { display: "flex", flexDirection: "column", gap: "0.1rem", flex: 1 },
  chipLabel:      { fontSize: "0.8rem", fontWeight: 600, lineHeight: 1.3 },
  chipSub:        { fontSize: "0.66rem", color: textMuted, lineHeight: 1.3 },
  chipCheck:      { position: "absolute", top: "0.35rem", right: "0.5rem", fontSize: "0.62rem", color: goldColor, fontFamily: mono, fontWeight: 700 },
  selectedBar:         { display: "flex", alignItems: "center", gap: "0.75rem", background: goldDim, border: "1px solid " + goldBorder, borderRadius: "8px", padding: "0.6rem 1rem", marginBottom: "1.75rem", flexWrap: "wrap" },
  selectedBarLabel:    { fontFamily: mono, fontSize: "0.58rem", letterSpacing: "0.12em", color: textMuted, textTransform: "uppercase", flexShrink: 0 },
  selectedBarTitle:    { fontSize: "0.88rem", fontWeight: 700, color: textPri, flex: 1 },
  selectedBarEarning:  { fontFamily: mono, fontSize: "0.76rem", color: goldColor, fontWeight: 600, flexShrink: 0 },
  tierList:  { display: "flex", flexDirection: "column", gap: "0.6rem" },
  tierCard:  { display: "flex", alignItems: "flex-start", gap: "0.85rem", background: "rgba(255,255,255,0.03)", border: "1px solid " + border, borderRadius: "10px", padding: "0.85rem 1rem", cursor: "pointer", color: textPri, textAlign: "left", transition: "all 0.2s" },
  tierDot:   { width: 16, height: 16, borderRadius: "50%", border: "2px solid", flexShrink: 0, marginTop: "2px", transition: "all 0.2s" },
  tierLabel: { fontSize: "0.86rem", fontWeight: 700, color: textPri, marginBottom: "0.15rem" },
  tierDesc:  { fontSize: "0.73rem", color: textMuted, lineHeight: 1.5 },
  loaderWrap: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 1rem", gap: "1rem" },
  loaderRing: { width: 42, height: 42, border: "3px solid rgba(201,168,76,0.15)", borderTopColor: goldColor, borderRadius: "50%", animation: "spin 0.85s linear infinite" },
  loaderText: { fontSize: "1rem", fontWeight: 600, color: textPri },
  loaderSub:  { fontSize: "0.76rem", color: textMuted, fontFamily: mono, textAlign: "center" },
  errorWrap:  { display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "3rem 1rem", textAlign: "center" },
  errorIcon:  { fontSize: "2rem" },
  errorText:  { color: "#f87171", fontSize: "0.83rem", fontFamily: mono, maxWidth: 400 },
  navRow:     { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2rem", paddingTop: "1.25rem", borderTop: "1px solid " + border },
  btnPrimary: { background: goldColor, color: "#0d1117", border: "none", borderRadius: "8px", padding: "0.65rem 1.5rem", fontFamily: mono, fontSize: "0.76rem", fontWeight: 700, letterSpacing: "0.04em" },
  btnGhost:   { background: "transparent", color: textMuted, border: "1px solid " + border, borderRadius: "8px", padding: "0.6rem 1.2rem", fontFamily: mono, fontSize: "0.73rem" },
  btnDisabled:{ opacity: 0.32, cursor: "not-allowed", pointerEvents: "none" },
  otherHint:  { fontSize: "0.72rem", color: "#C9A84C", fontFamily: mono, marginTop: "0.4rem", fontStyle: "italic" },
};
