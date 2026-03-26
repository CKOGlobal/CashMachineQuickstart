import React, { useState, useEffect } from 'react';

// ============================================================================
// CASH MACHINE QUICKSTART - Complete Component
// Real payment link: https://link.fastpaydirect.com/payment-link/69c56d24c6a0e600f4d05aed
// ============================================================================

const CashMachineQuickStart = () => {
  // ========== STATE ==========
  const [testMode, setTestMode] = useState(false);
  const [phase, setPhase] = useState(1);
  const [hasPaid, setHasPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Phase 1: About You
  const [name, setName] = useState('');
  const [background, setBackground] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [specificIdea, setSpecificIdea] = useState('');
  const [timeAvailable, setTimeAvailable] = useState('');
  const [incomeGoal, setIncomeGoal] = useState('');

  // Phase 2: Your Ideas
  const [ideas, setIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);

  // Phase 3: Pricing Strategy
  const [pricingOptions, setPricingOptions] = useState([]);
  const [selectedPricing, setSelectedPricing] = useState(null);

  // Phase 4: 90-Day Plan
  const [plan, setPlan] = useState(null);
  const [activeTab, setActiveTab] = useState('pricing');

  // ========== LOCALSTORAGE PERSISTENCE ==========
  useEffect(() => {
    const saved = localStorage.getItem('cmqs_state');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setPhase(data.phase || 1);
        setHasPaid(data.hasPaid || false);
        setName(data.name || '');
        setBackground(data.background || '');
        setSelectedSkills(data.selectedSkills || []);
        setSpecificIdea(data.specificIdea || '');
        setTimeAvailable(data.timeAvailable || '');
        setIncomeGoal(data.incomeGoal || '');
        setIdeas(data.ideas || []);
        setSelectedIdea(data.selectedIdea || null);
        setPricingOptions(data.pricingOptions || []);
        setSelectedPricing(data.selectedPricing || null);
        setPlan(data.plan || null);
      } catch (err) {
        console.error('Failed to load saved state:', err);
      }
    }
  }, []);

  useEffect(() => {
    const state = {
      phase, hasPaid, name, background, selectedSkills, specificIdea,
      timeAvailable, incomeGoal, ideas, selectedIdea, pricingOptions,
      selectedPricing, plan
    };
    localStorage.setItem('cmqs_state', JSON.stringify(state));
  }, [phase, hasPaid, name, background, selectedSkills, specificIdea, 
      timeAvailable, incomeGoal, ideas, selectedIdea, pricingOptions,
      selectedPricing, plan]);

  // ========== SKILL CATEGORIES ==========
  const skillCategories = [
    { id: 'creative', label: 'Creative & Arts', emoji: '🎨', desc: 'Design, writing, music, photography' },
    { id: 'tech', label: 'Tech & Digital', emoji: '💻', desc: 'Coding, social media, software, AI' },
    { id: 'trades', label: 'Trades & Hands-On', emoji: '🔧', desc: 'Building, fixing, landscaping, auto' },
    { id: 'teaching', label: 'Teaching & Coaching', emoji: '📚', desc: 'Tutoring, training, mentoring, consulting' },
    { id: 'sales', label: 'Sales & Marketing', emoji: '📈', desc: 'Selling, negotiating, networking, ads' },
    { id: 'care', label: 'Care & Service', emoji: '❤️', desc: 'Childcare, eldercare, pet care, cleaning' },
    { id: 'finance', label: 'Finance & Numbers', emoji: '💰', desc: 'Bookkeeping, taxes, investing, analysis' },
    { id: 'health', label: 'Health & Wellness', emoji: '🏃', desc: 'Fitness, nutrition, therapy, beauty' },
    { id: 'operations', label: 'Operations & Logistics', emoji: '📦', desc: 'Driving, organizing, planning, admin' },
    { id: 'food', label: 'Food & Hospitality', emoji: '🍳', desc: 'Cooking, catering, bartending, events' },
  ];

  // ========== AI CALLS ==========
  const generateIdeas = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Generate 8 cash machine ideas for: ${name}

Background: ${background}
Skills: ${selectedSkills.join(', ')}
${specificIdea ? `Specific idea: ${specificIdea}` : ''}
Time: ${timeAvailable}
Goal: ${incomeGoal}

Return ONLY valid JSON array with 8 objects:
[{
  "title": "Idea name",
  "tagline": "One sentence pitch",
  "monthOne": "$X-$Y/mo realistic first month",
  "yearTwo": "18-month scale potential",
  "quickStart": "First 3 steps",
  "pros": ["benefit 1", "benefit 2", "benefit 3"],
  "cons": ["challenge 1", "challenge 2"],
  "fitScore": 85
}]

Rank by fitScore (best=95, stretch=75). Be realistic. No preamble.`
          }]
        })
      });
      const data = await res.json();
      const json = data.reply.replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(json);
      setIdeas(parsed);
      setPhase(2);
    } catch (err) {
      setError('Failed to generate ideas. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generatePricing = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Generate 5 pricing strategies for: ${selectedIdea.title}

Context: ${selectedIdea.tagline}
Market: ${background}
Time: ${timeAvailable}

Return ONLY valid JSON array:
[{
  "name": "Starter" | "Sweet Spot" | "Premium" | "Tiered" | "AI Suggests",
  "price": "$X/hr or $X each",
  "monthly": "$X-$Y/mo potential",
  "rationale": "Why this works",
  "pros": ["benefit 1", "benefit 2"],
  "cons": ["limitation 1"]
}]

No preamble.`
          }]
        })
      });
      const data = await res.json();
      const json = data.reply.replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(json);
      setPricingOptions(parsed);
      setPhase(3);
    } catch (err) {
      setError('Failed to generate pricing. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generate90DayPlan = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Create 90-day plan for: ${selectedIdea.title}

Pricing: ${selectedPricing.name} at ${selectedPricing.price}
Person: ${name}
Background: ${background}
Time: ${timeAvailable}

Return ONLY valid JSON:
{
  "pricing": {
    "model": "${selectedPricing.name}",
    "rate": "${selectedPricing.price}",
    "breakdown": "Cost analysis",
    "adjustments": "When to raise prices"
  },
  "month1": {
    "goal": "First revenue",
    "weeks": ["Week 1 tasks", "Week 2 tasks", "Week 3 tasks", "Week 4 tasks"],
    "metrics": "What to track"
  },
  "month2": {
    "goal": "Scale operations",
    "weeks": ["Week 5-8 tasks"],
    "metrics": "Growth KPIs"
  },
  "month3": {
    "goal": "Optimize & expand",
    "weeks": ["Week 9-12 tasks"],
    "metrics": "Efficiency metrics"
  },
  "marketing": {
    "channels": ["channel 1", "channel 2", "channel 3"],
    "content": "What to post",
    "budget": "Free/low-cost options"
  },
  "milestones": [
    {"day": 7, "goal": "First action"},
    {"day": 14, "goal": "First customer contact"},
    {"day": 30, "goal": "First revenue"},
    {"day": 60, "goal": "Repeat customer"},
    {"day": 90, "goal": "Consistent income"}
  ]
}

No preamble.`
          }]
        })
      });
      const data = await res.json();
      const json = data.reply.replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(json);
      setPlan(parsed);
      setPhase(4);
    } catch (err) {
      setError('Failed to generate plan. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ========== COMPONENTS ==========

  const TestModeToggle = () => (
    <div style={st.testToggle}>
      <label style={st.testLabel}>
        <input
          type="checkbox"
          checked={testMode}
          onChange={(e) => {
            setTestMode(e.target.checked);
            if (e.target.checked) setHasPaid(true);
          }}
        />
        <span style={{marginLeft: '8px'}}>TEST MODE (Skip Payment)</span>
      </label>
    </div>
  );

  const ProgressSteps = () => (
    <div style={st.progressBar}>
      {[1, 2, 3, 4].map((step) => (
        <div key={step} style={{
          ...st.progressStep,
          ...(phase >= step ? st.progressStepActive : {}),
          ...(phase === step ? st.progressStepCurrent : {})
        }}>
          <div style={st.progressCircle}>{step}</div>
          <span style={st.progressLabel}>
            {step === 1 && 'About You'}
            {step === 2 && 'Your Ideas'}
            {step === 3 && 'Price It'}
            {step === 4 && '90-Day Plan'}
          </span>
        </div>
      ))}
    </div>
  );

  const Chip = ({ label, selected, onClick }) => (
    <button
      onClick={onClick}
      style={{
        ...st.chip,
        ...(selected ? st.chipSelected : {})
      }}
    >
      {label}
    </button>
  );

  const PaymentGate = () => (
    <div style={st.paymentGate}>
      <div style={st.paymentHeader}>
        <span style={{fontSize: '2.5rem'}}>💳</span>
        <h2 style={st.paymentTitle}>Ready to Start Your Cash Machine?</h2>
        <p style={st.paymentSubtitle}>
          90 days of accountability, AI-powered ideas, and a personalized action plan
        </p>
      </div>

      <div style={st.pricingCard}>
        <div style={st.priceRow}>
          <span>Program Access (90 Days)</span>
          <span style={st.priceAmount}>$67.00</span>
        </div>
        <div style={st.priceRow}>
          <span style={{fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)'}}>
            Processing Fee (Stripe)
          </span>
          <span style={{fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)'}}>$2.97</span>
        </div>
        <div style={{...st.priceRow, ...st.priceTotal}}>
          <span style={{fontSize: '1.2rem', fontWeight: '700'}}>Total</span>
          <span style={{fontSize: '1.5rem', fontWeight: '700', color: '#C9A84C'}}>$69.97</span>
        </div>
        <p style={{fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '10px', textAlign: 'center'}}>
          One-time payment • 7-day money-back guarantee
        </p>
      </div>

      <div style={st.includesBox}>
        <h3 style={{fontSize: '1.1rem', marginBottom: '15px', color: '#C9A84C'}}>
          ✅ What's Included:
        </h3>
        <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
          <li style={{marginBottom: '8px', fontSize: '0.95rem'}}>
            🤖 AI-generated cash machine ideas based on your skills
          </li>
          <li style={{marginBottom: '8px', fontSize: '0.95rem'}}>
            📋 Personalized 90-day action plan with pricing strategy
          </li>
          <li style={{marginBottom: '8px', fontSize: '0.95rem'}}>
            📱 90 days of accountability check-ins (SMS/Email)
          </li>
          <li style={{marginBottom: '8px', fontSize: '0.95rem'}}>
            🎯 Weekly progress coaching (12 weeks of support)
          </li>
          <li style={{marginBottom: '8px', fontSize: '0.95rem'}}>
            🎉 Milestone celebrations at 30, 60, and 90 days
          </li>
          <li style={{marginBottom: '8px', fontSize: '0.95rem'}}>
            📥 Downloadable PDF action plan
          </li>
        </ul>
      </div>

      <div style={st.accountabilityBox}>
        <h3 style={{fontSize: '1.1rem', marginBottom: '10px'}}>
          🤝 Why Accountability Matters
        </h3>
        <p style={{fontSize: '0.95rem', lineHeight: '1.6', margin: 0}}>
          Think of this as your accountability partner — someone checking in three times a week 
          to make sure you're actually doing the work. No judgment, no pressure, just: 
          "Hey, where are you at?" Because ideas don't make money. Action does.
        </p>
        <p style={{fontSize: '0.9rem', marginTop: '15px', fontStyle: 'italic', color: 'rgba(255,255,255,0.7)'}}>
          You've got this. We've got your back.
        </p>
      </div>

      <a 
        href="https://link.fastpaydirect.com/payment-link/69c56d24c6a0e600f4d05aed"
        target="_blank"
        rel="noopener noreferrer"
        style={st.purchaseButton}
      >
        Purchase Now - $69.97
      </a>

      <div style={st.consentNotice}>
        <p style={{fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: '1.5'}}>
          By purchasing, you consent to receive SMS accountability check-ins (3x per week for 90 days) 
          and email communications. Reply STOP to opt out anytime. Message & data rates may apply.
        </p>
        <p style={{fontSize: '0.85rem', marginTop: '10px'}}>
          <a href="/terms.html" target="_blank" style={{color: '#C9A84C', textDecoration: 'none'}}>
            Terms of Service
          </a>
          {' • '}
          <a href="/privacy.html" target="_blank" style={{color: '#C9A84C', textDecoration: 'none'}}>
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );

  // ========== PHASE 1: ABOUT YOU ==========
  const Phase1 = () => (
    <div style={st.phase}>
      <div style={st.phaseHeader}>
        <span style={{fontSize: '2rem'}}>👋</span>
        <h2 style={st.phaseTitle}>
          Let's find the money hiding in what you <span style={{color: '#C9A84C'}}>already know how to do.</span>
        </h2>
        <p style={st.phaseSubtitle}>
          You don't need a fancy degree or a trust fund. You need to get paid for stuff you can do right now.
        </p>
      </div>

      <div style={st.formGroup}>
        <label style={st.label}>First name</label>
        <input
          style={st.input}
          placeholder="e.g., Alex"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div style={st.formGroup}>
        <label style={st.label}>What do you do, and what are you actually good at?</label>
        <textarea
          style={{...st.input, minHeight: '100px'}}
          placeholder="Be real. e.g. I'm a sophomore who runs my school's IG and people pay me for social media help. Or: I fix computers and everyone thinks I'm a wizard. Or: Honestly? No clue. Just show me options."
          value={background}
          onChange={(e) => setBackground(e.target.value)}
        />
      </div>

      <div style={st.formGroup}>
        <label style={st.label}>Pick the skills that feel like you (check all that apply)</label>
        <div style={st.chipGrid}>
          {skillCategories.map((cat) => (
            <Chip
              key={cat.id}
              label={`${cat.emoji} ${cat.label}`}
              selected={selectedSkills.includes(cat.id)}
              onClick={() => {
                if (selectedSkills.includes(cat.id)) {
                  setSelectedSkills(selectedSkills.filter(s => s !== cat.id));
                } else {
                  setSelectedSkills([...selectedSkills, cat.id]);
                }
              }}
            />
          ))}
        </div>
      </div>

      <div style={st.formGroup}>
        <label style={st.label}>
          Got a specific money idea already? Spill it. (optional but helps us help you)
        </label>
        <textarea
          style={{...st.input, minHeight: '80px'}}
          placeholder="e.g. I want to tutor high schoolers in calculus. Or: I flip vintage sneakers on Depop. Or: Honestly? No clue. Just show me what's possible."
          value={specificIdea}
          onChange={(e) => setSpecificIdea(e.target.value)}
        />
      </div>

      <div style={st.formGroup}>
        <label style={st.label}>Time you can commit per week</label>
        <div style={st.chipRow}>
          {['Under 5 hrs/wk', '5-10 hrs/wk', '10-20 hrs/wk', '20+ hrs/wk'].map((opt) => (
            <Chip
              key={opt}
              label={opt}
              selected={timeAvailable === opt}
              onClick={() => setTimeAvailable(opt)}
            />
          ))}
        </div>
      </div>

      <div style={st.formGroup}>
        <label style={st.label}>Monthly income goal</label>
        <div style={st.chipRow}>
          {['$500/mo', '$1,500/mo', '$5,000/mo', '$10,000+/mo'].map((opt) => (
            <Chip
              key={opt}
              label={opt}
              selected={incomeGoal === opt}
              onClick={() => setIncomeGoal(opt)}
            />
          ))}
        </div>
      </div>

      {error && <div style={st.error}>{error}</div>}

      <button
        style={{...st.button, ...(loading ? st.buttonDisabled : {})}}
        onClick={generateIdeas}
        disabled={loading || !name || !background || selectedSkills.length === 0 || !timeAvailable || !incomeGoal}
      >
        {loading ? '🤖 Generating Ideas...' : 'Show Me My Options →'}
      </button>
    </div>
  );

  // ========== PHASE 2: YOUR IDEAS ==========
  const Phase2 = () => (
    <div style={st.phase}>
      <div style={st.phaseHeader}>
        <span style={{fontSize: '2rem'}}>💡</span>
        <h2 style={st.phaseTitle}>
          Here are <span style={{color: '#C9A84C'}}>8 ways you could start making money</span> based on what you told us.
        </h2>
        <p style={st.phaseSubtitle}>
          We ranked them Best Fit → Stretch Goal. Pick one. You can always pivot later.
        </p>
      </div>

      {/* Payment Gate Check */}
      {!hasPaid && !testMode && (
        <>
          <div style={st.lockedOverlay}>
            <div style={{fontSize: '3rem', marginBottom: '15px'}}>🔒</div>
            <h3 style={{fontSize: '1.3rem', marginBottom: '10px'}}>
              Your Ideas Are Ready
            </h3>
            <p style={{fontSize: '1rem', marginBottom: '30px', color: 'rgba(255,255,255,0.7)'}}>
              Complete your purchase to unlock your personalized cash machine ideas and 90-day action plan
            </p>
          </div>
          <PaymentGate />
        </>
      )}

      {(hasPaid || testMode) && (
        <>
          <div style={st.ideasGrid}>
            {ideas.map((idea, idx) => (
              <div
                key={idx}
                style={{
                  ...st.ideaCard,
                  ...(selectedIdea?.title === idea.title ? st.ideaCardSelected : {})
                }}
                onClick={() => setSelectedIdea(idea)}
              >
                <div style={st.ideaHeader}>
                  <h3 style={st.ideaTitle}>{idea.title}</h3>
                  <div style={st.fitBadge}>
                    {idea.fitScore}% fit
                  </div>
                </div>
                <p style={st.ideaTagline}>{idea.tagline}</p>
                <div style={st.ideaEarnings}>
                  <div>
                    <div style={st.earningLabel}>Month 1</div>
                    <div style={st.earningAmount}>{idea.monthOne}</div>
                  </div>
                  <div>
                    <div style={st.earningLabel}>18 Months</div>
                    <div style={st.earningAmount}>{idea.yearTwo}</div>
                  </div>
                </div>
                <div style={st.quickStart}>
                  <strong>Quick Start:</strong> {idea.quickStart}
                </div>
                <div style={st.proscons}>
                  <div>
                    <strong style={{color: '#3ECFAB'}}>Pros:</strong>
                    <ul style={{margin: '5px 0 0 20px', fontSize: '0.9rem'}}>
                      {idea.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                    </ul>
                  </div>
                  <div>
                    <strong style={{color: '#F06292'}}>Cons:</strong>
                    <ul style={{margin: '5px 0 0 20px', fontSize: '0.9rem'}}>
                      {idea.cons.map((con, i) => <li key={i}>{con}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {error && <div style={st.error}>{error}</div>}

          <div style={st.buttonRow}>
            <button style={st.buttonSecondary} onClick={() => setPhase(1)}>
              ← Back
            </button>
            <button
              style={{...st.button, ...(loading || !selectedIdea ? st.buttonDisabled : {})}}
              onClick={generatePricing}
              disabled={loading || !selectedIdea}
            >
              {loading ? '🤖 Generating Pricing...' : 'Next: Price It →'}
            </button>
          </div>
        </>
      )}
    </div>
  );

  // ========== PHASE 3: PRICING STRATEGY ==========
  const Phase3 = () => (
    <div style={st.phase}>
      <div style={st.phaseHeader}>
        <span style={{fontSize: '2rem'}}>💰</span>
        <h2 style={st.phaseTitle}>
          Let's figure out <span style={{color: '#C9A84C'}}>what to charge</span> for "{selectedIdea?.title}"
        </h2>
        <p style={st.phaseSubtitle}>
          Pricing isn't random. Here are 5 strategies that actually work.
        </p>
      </div>

      <div style={st.pricingGrid}>
        {pricingOptions.map((option, idx) => (
          <div
            key={idx}
            style={{
              ...st.pricingCard2,
              ...(selectedPricing?.name === option.name ? st.pricingCardSelected : {})
            }}
            onClick={() => setSelectedPricing(option)}
          >
            <h3 style={st.pricingName}>{option.name}</h3>
            <div style={st.pricingPrice}>{option.price}</div>
            <div style={st.pricingMonthly}>{option.monthly}</div>
            <p style={st.pricingRationale}>{option.rationale}</p>
            <div style={st.pricingProscons}>
              <div>
                <strong style={{color: '#3ECFAB'}}>✓</strong> {option.pros.join(', ')}
              </div>
              <div style={{marginTop: '5px'}}>
                <strong style={{color: '#F06292'}}>⚠</strong> {option.cons.join(', ')}
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && <div style={st.error}>{error}</div>}

      <div style={st.buttonRow}>
        <button style={st.buttonSecondary} onClick={() => setPhase(2)}>
          ← Back
        </button>
        <button
          style={{...st.button, ...(loading || !selectedPricing ? st.buttonDisabled : {})}}
          onClick={generate90DayPlan}
          disabled={loading || !selectedPricing}
        >
          {loading ? '🤖 Building Your Plan...' : 'Next: 90-Day Plan →'}
        </button>
      </div>
    </div>
  );

  // ========== PHASE 4: 90-DAY PLAN ==========
  const Phase4 = () => {
    if (!plan) return <div>Loading plan...</div>;

    const tabs = [
      { id: 'pricing', label: 'Pricing', emoji: '💰' },
      { id: 'month1', label: 'Month 1', emoji: '🚀' },
      { id: 'month2', label: 'Month 2', emoji: '📈' },
      { id: 'month3', label: 'Month 3', emoji: '🎯' },
      { id: 'marketing', label: 'Marketing', emoji: '📣' },
      { id: 'milestones', label: 'Milestones', emoji: '🏆' },
    ];

    return (
      <div style={st.phase}>
        <div style={st.phaseHeader}>
          <span style={{fontSize: '2rem'}}>🎉</span>
          <h2 style={st.phaseTitle}>
            Your <span style={{color: '#C9A84C'}}>90-Day Cash Machine Plan</span> is Ready
          </h2>
          <p style={st.phaseSubtitle}>
            {name}, here's your roadmap. Follow this and you'll be making money in 30 days.
          </p>
        </div>

        <div style={st.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              style={{
                ...st.tab,
                ...(activeTab === tab.id ? st.tabActive : {})
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>

        <div style={st.tabContent}>
          {activeTab === 'pricing' && (
            <div>
              <h3 style={st.sectionTitle}>Your Pricing Model: {plan.pricing.model}</h3>
              <p style={st.sectionText}><strong>Rate:</strong> {plan.pricing.rate}</p>
              <p style={st.sectionText}>{plan.pricing.breakdown}</p>
              <p style={st.sectionText}><strong>When to Adjust:</strong> {plan.pricing.adjustments}</p>
            </div>
          )}

          {activeTab === 'month1' && (
            <div>
              <h3 style={st.sectionTitle}>Month 1: {plan.month1.goal}</h3>
              {plan.month1.weeks.map((week, idx) => (
                <div key={idx} style={st.weekBlock}>
                  <strong>Week {idx + 1}:</strong> {week}
                </div>
              ))}
              <p style={st.sectionText}><strong>Track:</strong> {plan.month1.metrics}</p>
            </div>
          )}

          {activeTab === 'month2' && (
            <div>
              <h3 style={st.sectionTitle}>Month 2: {plan.month2.goal}</h3>
              {plan.month2.weeks.map((week, idx) => (
                <div key={idx} style={st.weekBlock}>
                  <strong>Weeks {5 + idx * 4}-{8 + idx * 4}:</strong> {week}
                </div>
              ))}
              <p style={st.sectionText}><strong>Track:</strong> {plan.month2.metrics}</p>
            </div>
          )}

          {activeTab === 'month3' && (
            <div>
              <h3 style={st.sectionTitle}>Month 3: {plan.month3.goal}</h3>
              {plan.month3.weeks.map((week, idx) => (
                <div key={idx} style={st.weekBlock}>
                  <strong>Weeks {9 + idx * 4}-{12}:</strong> {week}
                </div>
              ))}
              <p style={st.sectionText}><strong>Track:</strong> {plan.month3.metrics}</p>
            </div>
          )}

          {activeTab === 'marketing' && (
            <div>
              <h3 style={st.sectionTitle}>Marketing Strategy</h3>
              <p style={st.sectionText}><strong>Channels:</strong> {plan.marketing.channels.join(', ')}</p>
              <p style={st.sectionText}><strong>Content:</strong> {plan.marketing.content}</p>
              <p style={st.sectionText}><strong>Budget:</strong> {plan.marketing.budget}</p>
            </div>
          )}

          {activeTab === 'milestones' && (
            <div>
              <h3 style={st.sectionTitle}>Your 90-Day Milestones</h3>
              {plan.milestones.map((milestone, idx) => (
                <div key={idx} style={st.milestoneBlock}>
                  <div style={st.milestoneDay}>Day {milestone.day}</div>
                  <div style={st.milestoneGoal}>{milestone.goal}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={st.exportSection}>
          <button style={st.buttonSecondary} onClick={() => window.print()}>
            📥 Download PDF
          </button>
        </div>

        <div style={st.accountabilityFooter}>
          <h3 style={{fontSize: '1.2rem', marginBottom: '15px'}}>
            🎯 Your Accountability Coach
          </h3>
          <p style={{fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '15px'}}>
            Starting Monday, you'll get 3 check-ins per week for 90 days:
          </p>
          <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
            <li style={{marginBottom: '8px'}}>
              <strong>Monday:</strong> "What's your win for this week?"
            </li>
            <li style={{marginBottom: '8px'}}>
              <strong>Wednesday:</strong> "How's progress on your milestone?"
            </li>
            <li style={{marginBottom: '8px'}}>
              <strong>Friday:</strong> "Where are you at — on track, almost there, or stuck?"
            </li>
          </ul>
          <p style={{fontSize: '0.9rem', marginTop: '15px', fontStyle: 'italic', color: 'rgba(255,255,255,0.7)'}}>
            This is your coach in your corner, helping you stay focused when life gets busy.
          </p>
        </div>

        <button style={st.buttonSecondary} onClick={() => {
          if (window.confirm('Start over? This will clear your current plan.')) {
            localStorage.removeItem('cmqs_state');
            window.location.reload();
          }
        }}>
          Start Over
        </button>
      </div>
    );
  };

  // ========== STYLES ========== 
  const st = {
    container: {
      minHeight: '100vh',
      background: '#0d1117',
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '20px',
    },
    header: {
      maxWidth: '900px',
      margin: '0 auto 30px',
      textAlign: 'center',
      padding: '20px',
    },
    brandLine: {
      fontSize: '0.85rem',
      fontFamily: '"IBM Plex Mono", monospace',
      color: '#C9A84C',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      marginBottom: '15px',
    },
    hero: {
      fontSize: '2.5rem',
      fontWeight: '800',
      lineHeight: '1.2',
      marginBottom: '15px',
    },
    tagline: {
      fontSize: '1.1rem',
      color: 'rgba(255,255,255,0.7)',
      lineHeight: '1.6',
    },
    testToggle: {
      textAlign: 'center',
      marginBottom: '20px',
    },
    testLabel: {
      fontSize: '0.9rem',
      color: 'rgba(255,255,255,0.6)',
      cursor: 'pointer',
    },
    progressBar: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '40px',
      maxWidth: '700px',
      margin: '30px auto',
      padding: '0 20px',
    },
    progressStep: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      opacity: 0.4,
    },
    progressStepActive: {
      opacity: 1,
    },
    progressStepCurrent: {
      opacity: 1,
    },
    progressCircle: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.1)',
      border: '2px solid rgba(255,255,255,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '700',
      fontSize: '1.1rem',
    },
    progressLabel: {
      fontSize: '0.85rem',
      fontWeight: '600',
      textAlign: 'center',
    },
    phase: {
      maxWidth: '900px',
      margin: '0 auto',
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '16px',
      padding: '40px',
    },
    phaseHeader: {
      textAlign: 'center',
      marginBottom: '40px',
    },
    phaseTitle: {
      fontSize: '1.8rem',
      fontWeight: '700',
      lineHeight: '1.3',
      marginBottom: '10px',
    },
    phaseSubtitle: {
      fontSize: '1rem',
      color: 'rgba(255,255,255,0.7)',
      lineHeight: '1.6',
    },
    formGroup: {
      marginBottom: '30px',
    },
    label: {
      display: 'block',
      fontSize: '0.95rem',
      fontWeight: '600',
      marginBottom: '10px',
      color: 'rgba(255,255,255,0.9)',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '8px',
      color: '#ffffff',
      fontSize: '1rem',
      outline: 'none',
      transition: 'border 0.2s',
    },
    chipGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '12px',
    },
    chipRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
    },
    chip: {
      padding: '10px 16px',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '8px',
      color: '#ffffff',
      fontSize: '0.9rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      outline: 'none',
    },
    chipSelected: {
      background: 'rgba(201,168,76,0.2)',
      border: '1px solid #C9A84C',
      color: '#C9A84C',
    },
    button: {
      width: '100%',
      padding: '16px',
      background: 'linear-gradient(135deg, #C9A84C 0%, #E8C468 100%)',
      color: '#0d1117',
      fontSize: '1.1rem',
      fontWeight: '700',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    buttonSecondary: {
      padding: '12px 24px',
      background: 'rgba(255,255,255,0.1)',
      color: '#ffffff',
      fontSize: '1rem',
      fontWeight: '600',
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    buttonRow: {
      display: 'flex',
      gap: '15px',
      marginTop: '30px',
    },
    error: {
      padding: '15px',
      background: 'rgba(240,98,146,0.1)',
      border: '1px solid rgba(240,98,146,0.3)',
      borderRadius: '8px',
      color: '#F06292',
      fontSize: '0.95rem',
      marginBottom: '20px',
    },
    paymentGate: {
      maxWidth: '600px',
      margin: '30px auto',
      padding: '30px',
    },
    paymentHeader: {
      textAlign: 'center',
      marginBottom: '30px',
    },
    paymentTitle: {
      fontSize: '1.8rem',
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: '10px',
    },
    paymentSubtitle: {
      fontSize: '1rem',
      color: 'rgba(255,255,255,0.7)',
    },
    pricingCard: {
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
    },
    priceRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 0',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
    },
    priceTotal: {
      borderBottom: 'none',
      marginTop: '10px',
      paddingTop: '15px',
      borderTop: '2px solid #C9A84C',
    },
    priceAmount: {
      fontWeight: '600',
      color: '#ffffff',
    },
    includesBox: {
      background: 'rgba(201,168,76,0.1)',
      border: '1px solid rgba(201,168,76,0.3)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
    },
    accountabilityBox: {
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '30px',
    },
    purchaseButton: {
      display: 'block',
      width: '100%',
      padding: '18px',
      background: 'linear-gradient(135deg, #C9A84C 0%, #E8C468 100%)',
      color: '#0d1117',
      fontSize: '1.2rem',
      fontWeight: '700',
      textAlign: 'center',
      textDecoration: 'none',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      marginBottom: '20px',
    },
    consentNotice: {
      textAlign: 'center',
      marginTop: '20px',
    },
    lockedOverlay: {
      textAlign: 'center',
      padding: '40px',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      marginBottom: '30px',
    },
    ideasGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '20px',
      marginBottom: '30px',
    },
    ideaCard: {
      background: 'rgba(255,255,255,0.03)',
      border: '2px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      padding: '20px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    ideaCardSelected: {
      border: '2px solid #C9A84C',
      background: 'rgba(201,168,76,0.1)',
    },
    ideaHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start',
      marginBottom: '10px',
    },
    ideaTitle: {
      fontSize: '1.2rem',
      fontWeight: '700',
      color: '#ffffff',
    },
    fitBadge: {
      padding: '4px 10px',
      background: 'rgba(62,207,171,0.2)',
      border: '1px solid #3ECFAB',
      borderRadius: '6px',
      fontSize: '0.85rem',
      fontWeight: '600',
      color: '#3ECFAB',
    },
    ideaTagline: {
      fontSize: '0.95rem',
      color: 'rgba(255,255,255,0.7)',
      marginBottom: '15px',
      lineHeight: '1.5',
    },
    ideaEarnings: {
      display: 'flex',
      gap: '20px',
      marginBottom: '15px',
    },
    earningLabel: {
      fontSize: '0.8rem',
      color: 'rgba(255,255,255,0.5)',
      marginBottom: '3px',
    },
    earningAmount: {
      fontSize: '1.1rem',
      fontWeight: '700',
      color: '#C9A84C',
    },
    quickStart: {
      fontSize: '0.9rem',
      padding: '10px',
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '6px',
      marginBottom: '15px',
    },
    proscons: {
      fontSize: '0.9rem',
      lineHeight: '1.5',
    },
    pricingGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px',
      marginBottom: '30px',
    },
    pricingCard2: {
      background: 'rgba(255,255,255,0.03)',
      border: '2px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      padding: '20px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    pricingCardSelected: {
      border: '2px solid #C9A84C',
      background: 'rgba(201,168,76,0.1)',
    },
    pricingName: {
      fontSize: '1.2rem',
      fontWeight: '700',
      color: '#C9A84C',
      marginBottom: '10px',
    },
    pricingPrice: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: '5px',
    },
    pricingMonthly: {
      fontSize: '0.9rem',
      color: 'rgba(255,255,255,0.6)',
      marginBottom: '15px',
    },
    pricingRationale: {
      fontSize: '0.95rem',
      lineHeight: '1.5',
      marginBottom: '15px',
    },
    pricingProscons: {
      fontSize: '0.9rem',
      lineHeight: '1.5',
    },
    tabs: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      marginBottom: '30px',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      paddingBottom: '10px',
    },
    tab: {
      padding: '10px 16px',
      background: 'transparent',
      border: 'none',
      color: 'rgba(255,255,255,0.6)',
      fontSize: '0.95rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      borderBottom: '2px solid transparent',
    },
    tabActive: {
      color: '#C9A84C',
      borderBottom: '2px solid #C9A84C',
    },
    tabContent: {
      padding: '20px',
      background: 'rgba(255,255,255,0.03)',
      borderRadius: '12px',
      marginBottom: '30px',
    },
    sectionTitle: {
      fontSize: '1.3rem',
      fontWeight: '700',
      color: '#C9A84C',
      marginBottom: '15px',
    },
    sectionText: {
      fontSize: '1rem',
      lineHeight: '1.6',
      marginBottom: '15px',
    },
    weekBlock: {
      padding: '15px',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '8px',
      marginBottom: '12px',
      fontSize: '0.95rem',
      lineHeight: '1.6',
    },
    milestoneBlock: {
      display: 'flex',
      gap: '20px',
      padding: '15px',
      background: 'rgba(201,168,76,0.1)',
      border: '1px solid rgba(201,168,76,0.3)',
      borderRadius: '8px',
      marginBottom: '12px',
    },
    milestoneDay: {
      fontSize: '1.1rem',
      fontWeight: '700',
      color: '#C9A84C',
      minWidth: '70px',
    },
    milestoneGoal: {
      fontSize: '1rem',
      lineHeight: '1.6',
    },
    exportSection: {
      textAlign: 'center',
      marginTop: '30px',
      marginBottom: '30px',
    },
    accountabilityFooter: {
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      padding: '25px',
      marginBottom: '30px',
    },
  };

  // ========== RENDER ==========
  return (
    <div style={st.container}>
      <div style={st.header}>
        <div style={st.brandLine}>Loral Langemeier + Kelli Owens — Cash Machine QuickStart</div>
        <h1 style={st.hero}>You're broke.<br/>We get it. Let's fix that.</h1>
        <p style={st.tagline}>
          Turn what you already know into actual money — this week. No MBA required. No trust fund needed. 
          Just you, your skills, and a plan that actually works.
        </p>
      </div>

      <TestModeToggle />
      <ProgressSteps />

      {phase === 1 && <Phase1 />}
      {phase === 2 && <Phase2 />}
      {phase === 3 && <Phase3 />}
      {phase === 4 && <Phase4 />}
    </div>
  );
};

export default CashMachineQuickStart;
