import React, { useState, useEffect } from 'react';

// ============================================================================
// CASH MACHINE QUICKSTART - PROPERLY FIXED
// All helper components defined OUTSIDE main component to prevent re-creation
// ============================================================================

// ========== STYLES (OUTSIDE COMPONENT) ==========
const styles = {
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
    boxSizing: 'border-box',
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
  footer: {
    maxWidth: '900px',
    margin: '40px auto 0',
    padding: '30px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    textAlign: 'center',
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.6)',
  },
};

// ========== SKILL CATEGORIES ==========
const skillCategories = [
  { id: 'creative', label: 'Creative & Arts', emoji: '🎨' },
  { id: 'tech', label: 'Tech & Digital', emoji: '💻' },
  { id: 'trades', label: 'Trades & Hands-On', emoji: '🔧' },
  { id: 'teaching', label: 'Teaching & Coaching', emoji: '📚' },
  { id: 'sales', label: 'Sales & Marketing', emoji: '📈' },
  { id: 'care', label: 'Care & Service', emoji: '❤️' },
  { id: 'finance', label: 'Finance & Numbers', emoji: '💰' },
  { id: 'health', label: 'Health & Wellness', emoji: '🏃' },
  { id: 'operations', label: 'Operations & Logistics', emoji: '📦' },
  { id: 'food', label: 'Food & Hospitality', emoji: '🍳' },
  { id: 'none', label: 'None of these', emoji: '🤷' },
];

// ========== HELPER COMPONENTS (OUTSIDE MAIN COMPONENT) ==========

const Chip = ({ label, selected, onClick }) => (
  <button
    onClick={onClick}
    style={{
      ...styles.chip,
      ...(selected ? styles.chipSelected : {})
    }}
  >
    {label}
  </button>
);

const PaymentGate = () => (
  <div style={styles.paymentGate}>
    <div style={styles.paymentHeader}>
      <span style={{fontSize: '2.5rem'}}>💳</span>
      <h2 style={styles.paymentTitle}>Ready to Start Your Cash Machine?</h2>
      <p style={styles.paymentSubtitle}>
        90 days of accountability, AI-powered ideas, and a personalized action plan
      </p>
    </div>

    <div style={styles.pricingCard}>
      <div style={styles.priceRow}>
        <span>Program Access (90 Days)</span>
        <span style={styles.priceAmount}>$67.00</span>
      </div>
      <div style={styles.priceRow}>
        <span style={{fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)'}}>
          Processing Fee (Stripe)
        </span>
        <span style={{fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)'}}>$2.97</span>
      </div>
      <div style={{...styles.priceRow, ...styles.priceTotal}}>
        <span style={{fontSize: '1.2rem', fontWeight: '700'}}>Total</span>
        <span style={{fontSize: '1.5rem', fontWeight: '700', color: '#C9A84C'}}>$69.97</span>
      </div>
      <p style={{fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '10px', textAlign: 'center'}}>
        One-time payment • 7-day money-back guarantee
      </p>
    </div>

    <div style={styles.includesBox}>
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

    <div style={styles.accountabilityBox}>
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
      style={styles.purchaseButton}
    >
      Purchase Now - $69.97
    </a>

    <div style={styles.consentNotice}>
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

// ========== MAIN COMPONENT ==========
const CashMachineQuickStart = () => {
  const [testMode, setTestMode] = useState(false);
  const [phase, setPhase] = useState(1);
  const [hasPaid, setHasPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [background, setBackground] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [specificIdea, setSpecificIdea] = useState('');
  const [timeAvailable, setTimeAvailable] = useState('');
  const [incomeGoal, setIncomeGoal] = useState('');

  const [ideas, setIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);

  const [pricingOptions, setPricingOptions] = useState([]);
  const [selectedPricing, setSelectedPricing] = useState(null);

  const [plan, setPlan] = useState(null);
  const [activeTab, setActiveTab] = useState('pricing');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
            content: `Generate 8 FAST CASH ideas for someone who needs money NOW - not long-term business building.

Person: ${name}
Background: ${background}
Skills: ${selectedSkills.join(', ')}
${specificIdea ? `Specific idea: ${specificIdea}` : ''}
Time: ${timeAvailable}
Goal: ${incomeGoal}

CRITICAL REQUIREMENTS:
- They can start making money TOMORROW or within 48 hours
- NO network required, NO audience building, NO relationship marketing
- Focus on: gig economy platforms, service work, cash jobs, local opportunities
- Real examples: TaskRabbit, DoorDash, Rover, Fiverr quick gigs, local cleaning/handyman, Facebook Marketplace flips, babysitting, tutoring, event work
- Month 1 earnings = realistic first WEEK earnings (they need cash NOW)
- Ideas must work for someone starting from ZERO connections

Return ONLY valid JSON array with 8 objects:
[{
  "title": "Idea name (specific, actionable)",
  "tagline": "One sentence - what you do and how fast you get paid",
  "monthOne": "$X-$Y realistic FIRST WEEK (not month)",
  "yearTwo": "18-month potential if they scale",
  "quickStart": "Step 1: Sign up/do this TODAY. Step 2: First job/gig. Step 3: Get paid.",
  "pros": ["benefit 1", "benefit 2", "benefit 3"],
  "cons": ["challenge 1", "challenge 2"],
  "fitScore": 85
}]

Rank by fitScore (best=95, stretch=75). Prioritize SPEED TO CASH. Be realistic. No preamble.`
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.brandLine}>Loral Langemeier + Kelli Owens — Cash Machine QuickStart</div>
        <h1 style={styles.hero}>You're broke.<br/>We get it. Let's <span style={{color: '#C9A84C'}}>fix that.</span></h1>
        <p style={styles.tagline}>
          Turn what you already know into actual money — this week. No MBA required. No trust fund needed. 
          Just you, your skills, and a plan that actually works.
        </p>
      </div>

      <div style={styles.testToggle}>
        <label style={styles.testLabel}>
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

      <div style={styles.progressBar}>
        {[1, 2, 3, 4].map((step) => (
          <div key={step} style={{
            ...styles.progressStep,
            ...(phase >= step ? styles.progressStepActive : {}),
            ...(phase === step ? styles.progressStepCurrent : {})
          }}>
            <div style={styles.progressCircle}>{step}</div>
            <span style={styles.progressLabel}>
              {step === 1 && 'About You'}
              {step === 2 && 'Your Ideas'}
              {step === 3 && 'Price It'}
              {step === 4 && '90-Day Plan'}
            </span>
          </div>
        ))}
      </div>

      {phase === 1 && (
        <div style={styles.phase}>
          <div style={styles.phaseHeader}>
            <span style={{fontSize: '2rem'}}>👋</span>
            <h2 style={styles.phaseTitle}>
              Let's find the money hiding in what you <span style={{color: '#C9A84C'}}>already know how to do.</span>
            </h2>
            <p style={styles.phaseSubtitle}>
              You don't need a fancy degree or a trust fund. You need to get paid for stuff you can do right now.
            </p>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>First name</label>
            <input
              style={styles.input}
              placeholder="e.g., Alex"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>What do you do, and what are you actually good at?</label>
            <textarea
              style={{...styles.input, minHeight: '100px'}}
              placeholder="Be real. e.g. I'm a sophomore who runs my school's IG and people pay me for social media help. Or: I fix computers and everyone thinks I'm a wizard. Or: Honestly? No clue. Just show me options."
              value={background}
              onChange={(e) => setBackground(e.target.value)}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Pick the skills that feel like you (check all that apply)</label>
            <div style={styles.chipGrid}>
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

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Got a specific money idea already? Spill it. (optional but helps us help you)
            </label>
            <textarea
              style={{...styles.input, minHeight: '80px'}}
              placeholder="e.g. I want to tutor high schoolers in calculus. Or: I flip vintage sneakers on Depop. Or: Honestly? No clue. Just show me what's possible."
              value={specificIdea}
              onChange={(e) => setSpecificIdea(e.target.value)}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Time you can commit per week</label>
            <div style={styles.chipRow}>
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

          <div style={styles.formGroup}>
            <label style={styles.label}>Monthly income goal</label>
            <div style={styles.chipRow}>
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

          {error && <div style={styles.error}>{error}</div>}

          <button
            style={{...styles.button, ...(loading ? styles.buttonDisabled : {})}}
            onClick={generateIdeas}
            disabled={loading || !name || !background || selectedSkills.length === 0 || !timeAvailable || !incomeGoal}
          >
            {loading ? '🤖 Generating Ideas...' : 'Show Me My Options →'}
          </button>
        </div>
      )}

      {phase === 2 && (
        <div style={styles.phase}>
          <div style={styles.phaseHeader}>
            <span style={{fontSize: '2rem'}}>💡</span>
            <h2 style={styles.phaseTitle}>
              Here are <span style={{color: '#C9A84C'}}>8 ways you could start making money</span> based on what you told us.
            </h2>
            <p style={styles.phaseSubtitle}>
              We ranked them Best Fit → Stretch Goal. Pick one. You can always pivot later.
            </p>
          </div>

          <div style={styles.ideasGrid}>
                {ideas.map((idea, idx) => (
                  <div
                    key={idx}
                    style={{
                      ...styles.ideaCard,
                      ...(selectedIdea?.title === idea.title ? styles.ideaCardSelected : {})
                    }}
                    onClick={() => setSelectedIdea(idea)}
                  >
                    <div style={styles.ideaHeader}>
                      <h3 style={styles.ideaTitle}>{idea.title}</h3>
                      <div style={styles.fitBadge}>
                        {idea.fitScore}% fit
                      </div>
                    </div>
                    <p style={styles.ideaTagline}>{idea.tagline}</p>
                    <div style={styles.ideaEarnings}>
                      <div>
                        <div style={styles.earningLabel}>First Week</div>
                        <div style={styles.earningAmount}>{idea.monthOne}</div>
                      </div>
                      <div>
                        <div style={styles.earningLabel}>18 Months</div>
                        <div style={styles.earningAmount}>{idea.yearTwo}</div>
                      </div>
                    </div>
                    <div style={styles.quickStart}>
                      <strong>Quick Start:</strong> {idea.quickStart}
                    </div>
                    <div style={styles.proscons}>
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

              {error && <div style={styles.error}>{error}</div>}

              <div style={styles.buttonRow}>
                <button style={styles.buttonSecondary} onClick={() => setPhase(1)}>
                  ← Back
                </button>
                <button
                  style={{...styles.button, ...(loading || !selectedIdea ? styles.buttonDisabled : {})}}
                  onClick={() => {
                    if (!hasPaid && !testMode) {
                      setPhase(2.5); // Trigger payment gate
                    } else {
                      generatePricing();
                    }
                  }}
                  disabled={loading || !selectedIdea}
                >
                  {loading ? '🤖 Generating Pricing...' : 'Get Your Complete Plan →'}
                </button>
              </div>
        </div>
      )}

      {phase === 2.5 && (
        <div style={styles.phase}>
          {(hasPaid || testMode) ? (
            <>
              {/* Auto-advance to Phase 3 and generate pricing */}
              {(() => {
                if (pricingOptions.length === 0 && !loading) {
                  generatePricing();
                } else if (pricingOptions.length > 0) {
                  setPhase(3);
                }
                return (
                  <div style={{textAlign: 'center', padding: '60px 20px'}}>
                    <div style={{fontSize: '3rem', marginBottom: '20px'}}>🎉</div>
                    <h2 style={{fontSize: '1.5rem', marginBottom: '15px'}}>Welcome back!</h2>
                    <p style={{color: 'rgba(255,255,255,0.7)'}}>
                      {loading ? 'Generating your pricing strategies...' : 'Loading your plan...'}
                    </p>
                  </div>
                );
              })()}
            </>
          ) : (
            <>
              <div style={styles.phaseHeader}>
                <span style={{fontSize: '2rem'}}>💡</span>
                <h2 style={styles.phaseTitle}>
                  You've Seen What's Possible.<br/>
                  <span style={{color: '#C9A84C'}}>Now Let's Make It Happen.</span>
                </h2>
                <p style={styles.phaseSubtitle}>
                  You picked: <strong>{selectedIdea?.title}</strong>
                </p>
              </div>

              <div style={styles.lockedOverlay}>
                <div style={{fontSize: '3rem', marginBottom: '15px'}}>🔒</div>
                <h3 style={{fontSize: '1.3rem', marginBottom: '10px'}}>
                  Ready for the How-To?
                </h3>
                <p style={{fontSize: '1rem', marginBottom: '30px', color: 'rgba(255,255,255,0.7)'}}>
                  Get the complete implementation guide: pricing strategy, marketing plan, 90-day action plan, and 90 days of accountability coaching.
                </p>
              </div>

              <PaymentGate />

              <div style={styles.buttonRow}>
                <button style={styles.buttonSecondary} onClick={() => setPhase(2)}>
                  ← Back to Ideas
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {phase === 3 && (hasPaid || testMode) && (
        <div style={styles.phase}>
          <div style={styles.phaseHeader}>
            <span style={{fontSize: '2rem'}}>💰</span>
            <h2 style={styles.phaseTitle}>
              Let's figure out <span style={{color: '#C9A84C'}}>what to charge</span> for "{selectedIdea?.title}"
            </h2>
            <p style={styles.phaseSubtitle}>
              Pricing isn't random. Here are 5 strategies that actually work.
            </p>
          </div>

          <div style={styles.pricingGrid}>
            {pricingOptions.map((option, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.pricingCard2,
                  ...(selectedPricing?.name === option.name ? styles.pricingCardSelected : {})
                }}
                onClick={() => setSelectedPricing(option)}
              >
                <h3 style={styles.pricingName}>{option.name}</h3>
                <div style={styles.pricingPrice}>{option.price}</div>
                <div style={styles.pricingMonthly}>{option.monthly}</div>
                <p style={styles.pricingRationale}>{option.rationale}</p>
                <div style={styles.pricingProscons}>
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

          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.buttonRow}>
            <button style={styles.buttonSecondary} onClick={() => setPhase(2)}>
              ← Back
            </button>
            <button
              style={{...styles.button, ...(loading || !selectedPricing ? styles.buttonDisabled : {})}}
              onClick={generate90DayPlan}
              disabled={loading || !selectedPricing}
            >
              {loading ? '🤖 Building Your Plan...' : 'Next: 90-Day Plan →'}
            </button>
          </div>
        </div>
      )}

      {phase === 4 && plan && (hasPaid || testMode) && (
        <div style={styles.phase}>
          <div style={styles.phaseHeader}>
            <span style={{fontSize: '2rem'}}>🎉</span>
            <h2 style={styles.phaseTitle}>
              Your <span style={{color: '#C9A84C'}}>90-Day Cash Machine Plan</span> is Ready
            </h2>
            <p style={styles.phaseSubtitle}>
              {name}, here's your roadmap. Follow this and you'll be making money in 30 days.
            </p>
          </div>

          <div style={styles.tabs}>
            {[
              { id: 'pricing', label: 'Pricing', emoji: '💰' },
              { id: 'month1', label: 'Month 1', emoji: '🚀' },
              { id: 'month2', label: 'Month 2', emoji: '📈' },
              { id: 'month3', label: 'Month 3', emoji: '🎯' },
              { id: 'marketing', label: 'Marketing', emoji: '📣' },
              { id: 'milestones', label: 'Milestones', emoji: '🏆' },
            ].map((tab) => (
              <button
                key={tab.id}
                style={{
                  ...styles.tab,
                  ...(activeTab === tab.id ? styles.tabActive : {})
                }}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.emoji} {tab.label}
              </button>
            ))}
          </div>

          <div style={styles.tabContent}>
            {activeTab === 'pricing' && (
              <div>
                <h3 style={styles.sectionTitle}>Your Pricing Model: {plan.pricing.model}</h3>
                <p style={styles.sectionText}><strong>Rate:</strong> {plan.pricing.rate}</p>
                <p style={styles.sectionText}>{plan.pricing.breakdown}</p>
                <p style={styles.sectionText}><strong>When to Adjust:</strong> {plan.pricing.adjustments}</p>
              </div>
            )}

            {activeTab === 'month1' && (
              <div>
                <h3 style={styles.sectionTitle}>Month 1: {plan.month1.goal}</h3>
                {plan.month1.weeks.map((week, idx) => (
                  <div key={idx} style={styles.weekBlock}>
                    <strong>Week {idx + 1}:</strong> {week}
                  </div>
                ))}
                <p style={styles.sectionText}><strong>Track:</strong> {plan.month1.metrics}</p>
              </div>
            )}

            {activeTab === 'month2' && (
              <div>
                <h3 style={styles.sectionTitle}>Month 2: {plan.month2.goal}</h3>
                {plan.month2.weeks.map((week, idx) => (
                  <div key={idx} style={styles.weekBlock}>
                    <strong>Weeks {5 + idx * 4}-{8 + idx * 4}:</strong> {week}
                  </div>
                ))}
                <p style={styles.sectionText}><strong>Track:</strong> {plan.month2.metrics}</p>
              </div>
            )}

            {activeTab === 'month3' && (
              <div>
                <h3 style={styles.sectionTitle}>Month 3: {plan.month3.goal}</h3>
                {plan.month3.weeks.map((week, idx) => (
                  <div key={idx} style={styles.weekBlock}>
                    <strong>Weeks {9 + idx * 4}-{12}:</strong> {week}
                  </div>
                ))}
                <p style={styles.sectionText}><strong>Track:</strong> {plan.month3.metrics}</p>
              </div>
            )}

            {activeTab === 'marketing' && (
              <div>
                <h3 style={styles.sectionTitle}>Marketing Strategy</h3>
                <p style={styles.sectionText}><strong>Channels:</strong> {plan.marketing.channels.join(', ')}</p>
                <p style={styles.sectionText}><strong>Content:</strong> {plan.marketing.content}</p>
                <p style={styles.sectionText}><strong>Budget:</strong> {plan.marketing.budget}</p>
              </div>
            )}

            {activeTab === 'milestones' && (
              <div>
                <h3 style={styles.sectionTitle}>Your 90-Day Milestones</h3>
                {plan.milestones.map((milestone, idx) => (
                  <div key={idx} style={styles.milestoneBlock}>
                    <div style={styles.milestoneDay}>Day {milestone.day}</div>
                    <div style={styles.milestoneGoal}>{milestone.goal}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={styles.exportSection}>
            <button style={styles.buttonSecondary} onClick={() => window.print()}>
              📥 Download PDF
            </button>
          </div>

          <div style={styles.accountabilityFooter}>
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

          <button style={styles.buttonSecondary} onClick={() => {
            if (window.confirm('Start over? This will clear your current plan.')) {
              localStorage.removeItem('cmqs_state');
              window.location.reload();
            }
          }}>
            Start Over
          </button>
        </div>
      )}

      <div style={styles.footer}>
        <div style={{marginBottom: '15px'}}>
          <strong style={{color: '#C9A84C'}}>Cash Machine QuickStart</strong>
        </div>
        <div>
          CKO Global LLC<br/>
          Email: <a href="mailto:Kelli@proactively-lazy.com" style={{color: '#C9A84C', textDecoration: 'none'}}>Kelli@proactively-lazy.com</a><br/>
          Website: <a href="https://proactively-lazy.com" target="_blank" rel="noopener noreferrer" style={{color: '#C9A84C', textDecoration: 'none'}}>proactively-lazy.com</a>
        </div>
        <div style={{marginTop: '15px', fontSize: '0.85rem'}}>
          <a href="/terms.html" target="_blank" style={{color: 'rgba(255,255,255,0.5)', textDecoration: 'none', marginRight: '15px'}}>Terms of Service</a>
          <a href="/privacy.html" target="_blank" style={{color: 'rgba(255,255,255,0.5)', textDecoration: 'none'}}>Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default CashMachineQuickStart;
