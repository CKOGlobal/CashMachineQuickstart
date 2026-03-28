import React, { useState, useEffect } from 'react';

// ============================================================================
// CASH MACHINE QUICKSTART - COMPLETE REBUILD
// - Scaffolded intake questions (fun, easy to understand)
// - Updated AI prompts ("start this week" for both tracks)
// - Accountability messaging (nice but firm boundaries)
// - Chatbot helper (paid users only)
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
  helperText: {
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.5)',
    marginTop: '8px',
    fontStyle: 'italic',
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
  chatbotModal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  chatbotContainer: {
    background: '#0d1117',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '16px',
    maxWidth: '700px',
    width: '100%',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
  },
  chatbotHeader: {
    padding: '20px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatbotMessages: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
  },
  chatbotInput: {
    padding: '20px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    gap: '10px',
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
          💬 24/7 AI Coach chatbot (knows your plan, answers questions instantly)
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

// ========== CHATBOT COMPONENT ==========
const ChatbotHelper = ({ plan, selectedIdea, selectedPricing, onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hey! I'm your AI coach. I know your plan (${selectedIdea?.title}), your pricing (${selectedPricing?.name}), and your milestones. What do you need help with?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Build context-aware prompt
      const contextualPrompt = messages.length === 1 
        ? `You are an accountability coach for the Cash Machine QuickStart program. 

User's Plan:
- Idea: ${selectedIdea?.title} (${selectedIdea?.category})
- Pricing: ${selectedPricing?.name} at ${selectedPricing?.price}
- 90-Day Plan summary: ${JSON.stringify(plan).substring(0, 300)}

Your role:
- Answer questions about their specific plan
- Help when they're stuck on execution  
- Be supportive but direct - no excuses accepted
- Always ask "What have you tried already?" before giving solutions
- Keep answers short and actionable (2-3 sentences max)

User question: ${input}`
        : input;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.length === 1
            ? [{ role: 'user', content: contextualPrompt }]
            : [...messages.slice(1), userMessage]
        })
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I hit a technical snag. Try asking again?' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.chatbotModal} onClick={onClose}>
      <div style={styles.chatbotContainer} onClick={(e) => e.stopPropagation()}>
        <div style={styles.chatbotHeader}>
          <h3 style={{margin: 0, fontSize: '1.2rem'}}>💬 Your AI Coach</h3>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <div style={styles.chatbotMessages}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{
              marginBottom: '15px',
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}>
              <div style={{
                maxWidth: '80%',
                padding: '12px 16px',
                borderRadius: '12px',
                background: msg.role === 'user' 
                  ? 'rgba(201,168,76,0.2)' 
                  : 'rgba(255,255,255,0.05)',
                border: `1px solid ${msg.role === 'user' 
                  ? 'rgba(201,168,76,0.3)' 
                  : 'rgba(255,255,255,0.1)'}`,
                fontSize: '0.95rem',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '0.95rem',
              maxWidth: '80%',
            }}>
              Thinking...
            </div>
          )}
        </div>

        <div style={styles.chatbotInput}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask your question..."
            style={{
              flex: 1,
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '1rem',
              outline: 'none',
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #C9A84C 0%, #E8C468 100%)',
              color: '#0d1117',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              opacity: loading || !input.trim() ? 0.5 : 1,
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

// ========== MAIN COMPONENT ==========
const CashMachineQuickStart = () => {
  const [phase, setPhase] = useState(1);
  const [hasPaid, setHasPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [adminClicks, setAdminClicks] = useState(0);

  const [name, setName] = useState('');
  const [procrastination, setProcrastination] = useState('');
  const [goodAt, setGoodAt] = useState('');
  const [hardPass, setHardPass] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [specificIdea, setSpecificIdea] = useState('');
  const [timeAvailable, setTimeAvailable] = useState('');
  const [incomeGoal, setIncomeGoal] = useState('');

  const [ideas, setIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [expandedIdea, setExpandedIdea] = useState(null);

  const [pricingOptions, setPricingOptions] = useState([]);
  const [selectedPricing, setSelectedPricing] = useState(null);

  const [plan, setPlan] = useState(null);
  const [activeTab, setActiveTab] = useState('dualtrack');

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
        setProcrastination(data.procrastination || '');
        setGoodAt(data.goodAt || '');
        setHardPass(data.hardPass || '');
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
      phase, hasPaid, name, procrastination, goodAt, hardPass, selectedSkills, specificIdea,
      timeAvailable, incomeGoal, ideas, selectedIdea, pricingOptions,
      selectedPricing, plan
    };
    localStorage.setItem('cmqs_state', JSON.stringify(state));
  }, [phase, hasPaid, name, procrastination, goodAt, hardPass, selectedSkills, specificIdea, 
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
            content: `Generate 8 cash machine ideas using the DUAL-TRACK system for: ${name}

Procrastination activity: ${procrastination}
What they're good at: ${goodAt}
Hard pass (avoid): ${hardPass}
Skills: ${selectedSkills.join(', ')}
${specificIdea ? `Specific idea: ${specificIdea}` : ''}
Time: ${timeAvailable}
Goal: ${incomeGoal}

DUAL-TRACK FRAMEWORK:
Generate exactly 8 ideas in this order:

IDEAS 1-2: BRIDGE IDEAS (Survival Income)
- Gig economy platforms they can START TODAY
- Examples: DoorDash, TaskRabbit, Rover, Instacart, Fiverr quick gigs
- Be honest: "This isn't a business. This pays bills while you build the real thing."
- Timeline: Start TODAY, cash THIS WEEK
- Set category: "bridge"

IDEAS 3-7: BUSINESS IDEAS (Real Business)
- Skills-based services they can START THIS WEEK
- Must be scalable, have exit potential, based on their actual skills
- Examples: social media management, tutoring, video editing, pet training, house cleaning, meal prep, photography, graphic design, personal training, tech support
- NOT: MLM, "build an audience first", high-capital businesses, drop shipping
- Timeline: Start THIS WEEK, first customer within 7 days, $500-2000/mo by month 3
- Set category: "business"

IDEA 8: WILDCARD (Creative/Unique)
- Something creative or unique based on their specific background
- Could be bridge OR business depending on what fits
- Set category: "wildcard"

IMPORTANT: Both bridge AND business ideas should START THIS WEEK. The difference is NOT speed—it's EXIT POTENTIAL. Bridge = you ARE the product (can't sell). Business = you OWN the product (can hire, scale, sell).

Return ONLY valid JSON array:
[{
  "title": "Specific, actionable idea name",
  "tagline": "One sentence - what you do and speed to first dollar",
  "category": "bridge" | "business" | "wildcard",
  "monthOne": "$X-$Y realistic first week earnings",
  "yearTwo": "18-month potential if they scale",
  "quickStart": "Step 1: Do this today. Step 2: First customer/gig. Step 3: Get paid.",
  "pros": ["benefit 1", "benefit 2", "benefit 3"],
  "cons": ["challenge 1", "challenge 2"],
  "fitScore": 85
}]

Rank by fitScore within each category. Bridge ideas = 70-80 fit (they're temporary). Business ideas = 80-95 fit (based on skills match). Be realistic and honest. No preamble.`
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
Good at: ${goodAt}
Time: ${timeAvailable}

Return ONLY valid JSON array:
[{
  "name": "Starter" | "Sweet Spot" | "Premium" | "Tiered" | "Package Deal",
  "price": "$X/hr or $X each",
  "monthly": "$X-$Y/mo potential",
  "rationale": "Why this works",
  "pros": ["benefit 1", "benefit 2"],
  "cons": ["limitation 1"],
  "growthPath": "→ Raise to $X-Y after [specific milestone]"
}]

CRITICAL: Each pricing model MUST include a "growthPath" field showing the next price increase and when.
Format: "→ Raise to $X-Y after [milestone]"
Milestones should be tangible: "10-15 successful projects", "fully booked 2 weeks out", "portfolio of 5 clients", "consistent 5-star reviews", "waiting list started"

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
            content: `Create a DUAL-TRACK 90-day plan for: ${selectedIdea.title}

Pricing: ${selectedPricing.name} at ${selectedPricing.price}
Person: ${name}
Good at: ${goodAt}
Hard pass: ${hardPass}
Time: ${timeAvailable}
Idea Category: ${selectedIdea.category || 'business'}

CRITICAL: This is for YOUNG ADULTS who have NEVER done this before. They need BABY STEPS with:
1. EXACT HOW (step 1, step 2, step 3 - what buttons to click, what websites to go to)
2. WHY (explain the reason behind each step so they understand and remember)
3. WHAT SUCCESS LOOKS LIKE (how they know they did it right)

DUAL-TRACK SYSTEM:
${selectedIdea.category === 'bridge' ? 
`This is a BRIDGE idea. The 90-day plan should focus on maximizing gig income while setting up a REAL business on the side.

Track A (Gig Income): ${selectedIdea.title} - Start high, maintain as needed
Track B (Business Setup): Identify and launch a scalable business based on their skills

Goal: By Day 90, have a real business generating $500-1000/mo` :
`This is a BUSINESS idea. The 90-day plan should show the transition from gig work to full business.

Track A (Gig Income - DECREASING): Start with gig platforms for survival cash
Track B (Business Income - INCREASING): ${selectedIdea.title}

Goal: Crossover by Day 60-90 where business income > gig income`}

Return ONLY valid JSON:
{
  "dualTrack": {
    "trackA": {
      "name": "Gig Income (Survival)",
      "weeks1_4": "Gig platforms + hours/week + expected income",
      "weeks5_8": "Reduced hours as business grows",
      "weeks9_12": "Minimal or phased out - business supports you"
    },
    "trackB": {
      "name": "${selectedIdea.title}",
      "weeks1_4": "Setup + first customers + learning",
      "weeks5_8": "Scale customers + refine offer",
      "weeks9_12": "Consistent income + growth systems"
    },
    "crossover": "Day 60-90: Business income replaces gig income"
  },
  "pricing": {
    "model": "${selectedPricing.name}",
    "rate": "${selectedPricing.price}",
    "breakdown": "Cost analysis + when to adjust",
    "adjustments": "Pricing evolution over 90 days"
  },
  "month1": {
    "goal": "Survival income + business foundation",
    "weeks": [
      {
        "week": 1,
        "summary": "Start gig work + business setup",
        "steps": [
          {
            "what": "Sign up for [Platform Name]",
            "how": "Step 1: Go to [website]. Step 2: Click 'Sign Up'. Step 3: Fill out profile with [specific info]. Step 4: Upload [specific documents].",
            "why": "This gets you into the system so you can start earning TODAY. The better your profile, the more gigs you'll get.",
            "time": "2 hours",
            "success": "Profile approved, first gig posted"
          },
          {
            "what": "Complete first gig/customer",
            "how": "Specific steps for this business type",
            "why": "Reason this matters",
            "time": "X hours",
            "success": "What completion looks like"
          }
        ]
      }
    ],
    "metrics": "Gig income + Business customers + Hours split"
  },
  "month2": {
    "goal": "Scale business, reduce gig dependency",
    "weeks": [
      {
        "week": 5,
        "summary": "Brief week summary",
        "steps": [
          {
            "what": "Action item",
            "how": "Exact steps",
            "why": "Reason",
            "time": "Hours",
            "success": "What success looks like"
          }
        ]
      }
    ],
    "metrics": "Customer count + Revenue split (gig vs business) + Repeat rate"
  },
  "month3": {
    "goal": "Business income > gig income",
    "weeks": [
      {
        "week": 9,
        "summary": "Brief week summary",
        "steps": [
          {
            "what": "Action item",
            "how": "Exact steps",
            "why": "Reason",
            "time": "Hours",
            "success": "What success looks like"
          }
        ]
      }
    ],
    "metrics": "Business revenue stable + Gig phased out + Growth trajectory"
  },
  "marketing": {
    "channels": ["Low-cost channel 1", "channel 2", "channel 3"],
    "dmScript": "Hey [Name]! 👋 [Personalized opener]. I just started [SERVICE] and I'm looking for a few people to work with. I'd love to help you with [SPECIFIC THING]. My rate is [PRICE]. Would you be open to a quick chat?",
    "socialPost": "📣 Post template with emojis and structure they can copy/paste",
    "emailTemplate": "Subject: [SUBJECT]\\n\\nHi [Name],\\n\\n[Body with specific value prop]\\n\\nWould you be open to a 10-minute call?",
    "objections": {
      "tooExpensive": "Response script",
      "needToThink": "Response script",
      "doItMyself": "Response script"
    },
    "budget": "Free strategies + platforms"
  },
  "milestones": [
    {"day": 7, "goal": "First gig income + business accounts set up"},
    {"day": 14, "goal": "First business customer + $200+ from gigs"},
    {"day": 30, "goal": "3-5 business customers + reducing gig hours"},
    {"day": 60, "goal": "Business generating $300-500/mo consistently"},
    {"day": 90, "goal": "Business $500-1000/mo + gigs phased out"}
  ]
}

IMPORTANT: Each week should have 3-5 DETAILED steps with EXACT how-to instructions. Assume they know NOTHING. Example:

GOOD:
"what": "Set up Google Business Profile"
"how": "Step 1: Go to google.com/business. Step 2: Click 'Manage now'. Step 3: Enter your business name exactly as: [Name] [Service Type]. Step 4: Choose 'Service Area Business' (not storefront). Step 5: Enter your ZIP code. Step 6: Choose category: [specific category]. Step 7: Add phone number and verify with code."
"why": "This makes you show up in Google Maps when people search '[your service] near me'. 60% of local customers find businesses this way."
"time": "1 hour"
"success": "Profile shows as 'Verified' with green checkmark"

BAD:
"what": "Set up business systems"
"how": "Create CRM and contracts"
"why": "You need these"

No preamble. Return valid JSON only.`
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
      {/* Hidden Admin Override - Click bottom-right corner 5 times */}
      <div 
        onClick={() => {
          const newCount = adminClicks + 1;
          setAdminClicks(newCount);
          if (newCount >= 5) {
            setHasPaid(true);
          }
        }}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          cursor: 'default',
          zIndex: 999,
          opacity: 0,
          userSelect: 'none',
        }}
        title=""
      >
      </div>

      <div style={styles.header}>
        <div style={styles.brandLine}>Loral Langemeier + Kelli Owens — Cash Machine QuickStart</div>
        <h1 style={styles.hero}>You're broke.<br/>We get it. Let's <span style={{color: '#C9A84C'}}>fix that.</span></h1>
        <p style={styles.tagline}>
          Get cash this week doing gig work. Build a real business over 90 days. 
          No MBA required. No trust fund needed. Just you, your skills, and a plan that actually works.
        </p>
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
            <label style={styles.label}>What do you do when you're supposed to be doing something else?</label>
            <textarea
              style={{...styles.input, minHeight: '100px'}}
              placeholder="e.g., I reorganize my closet by color when I should be studying. Or: I'm always making Spotify playlists. Or: I scroll Instagram and critique everyone's captions."
              value={procrastination}
              onChange={(e) => setProcrastination(e.target.value)}
            />
            <p style={styles.helperText}>
              Seriously — what's your favorite way to procrastinate? That's usually hiding money.
            </p>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>What do people bug you about because you're weirdly good at it?</label>
            <textarea
              style={{...styles.input, minHeight: '100px'}}
              placeholder="e.g., Everyone asks me to fix their phone/computer. Or: My friends pay me to write their dating app bios. Or: I'm the go-to person for last-minute airport runs because I'm crazy organized."
              value={goodAt}
              onChange={(e) => setGoodAt(e.target.value)}
            />
            <p style={styles.helperText}>
              Think about what feels easy to YOU but everyone else struggles with.
            </p>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>What's your hard pass? (Like, you'd fake sick to avoid it)</label>
            <textarea
              style={{...styles.input, minHeight: '100px'}}
              placeholder="e.g., Anything with numbers — I can't even balance my checkbook. Or: Talking to strangers on the phone. Or: Getting up before 9am. Or: Heavy lifting — I pulled a muscle opening a jar once."
              value={hardPass}
              onChange={(e) => setHardPass(e.target.value)}
            />
            <p style={styles.helperText}>
              Be honest. We won't suggest stuff that'll make you miserable.
            </p>
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
              Already have a money idea rattling around in your head?
            </label>
            <textarea
              style={{...styles.input, minHeight: '80px'}}
              placeholder="e.g., I want to help people declutter their homes. Or: I think I could flip vintage sneakers. Or: Honestly? No clue. Just show me what's possible."
              value={specificIdea}
              onChange={(e) => setSpecificIdea(e.target.value)}
            />
            <p style={styles.helperText}>
              (Optional) If you have something specific, tell us. If not, no worries — that's literally what this tool is for.
            </p>
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
            disabled={loading || !name || !procrastination || !goodAt || !hardPass || selectedSkills.length === 0 || !timeAvailable || !incomeGoal}
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
              Here's Your <span style={{color: '#C9A84C'}}>Dual-Track System</span>
            </h2>
            <p style={styles.phaseSubtitle}>
              <strong style={{color: '#60B8E8'}}>Bridge Ideas</strong> = Cash this week (pays bills while you build).<br/>
              <strong style={{color: '#C9A84C'}}>Business Ideas</strong> = What you're actually building (scalable, exit potential).<br/>
              Pick ONE business idea. Use bridge ideas as needed.
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
                onClick={() => {
                  setSelectedIdea(idea);
                  setExpandedIdea(idx);
                }}
              >
                <div style={styles.ideaHeader}>
                  <h3 style={styles.ideaTitle}>{idea.title}</h3>
                  <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                    <div style={{
                      padding: '4px 10px',
                      background: idea.category === 'bridge' ? 'rgba(96,184,232,0.2)' : 
                                 idea.category === 'wildcard' ? 'rgba(168,216,76,0.2)' : 
                                 'rgba(201,168,76,0.2)',
                      border: `1px solid ${idea.category === 'bridge' ? '#60B8E8' : 
                                           idea.category === 'wildcard' ? '#A8D84C' : 
                                           '#C9A84C'}`,
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: idea.category === 'bridge' ? '#60B8E8' : 
                             idea.category === 'wildcard' ? '#A8D84C' : 
                             '#C9A84C',
                      textTransform: 'uppercase',
                    }}>
                      {idea.category || 'business'}
                    </div>
                    <div style={styles.fitBadge}>
                      {idea.fitScore}% fit
                    </div>
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

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedIdea(expandedIdea === idx ? null : idx);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.2s',
                    marginBottom: expandedIdea === idx ? '15px' : '0',
                  }}
                >
                  {expandedIdea === idx ? '▼ Hide Details' : '► See Details'}
                </button>

                {expandedIdea === idx && (
                  <>
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
                  </>
                )}
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
                if (!hasPaid && adminClicks < 5) {
                  setPhase(2.5);
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
          {(hasPaid || adminClicks >= 5) ? (
            <>
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
                  <span style={{color: '#C9A84C'}}>Now Let's Build It.</span>
                </h2>
                <p style={styles.phaseSubtitle}>
                  You picked: <strong>{selectedIdea?.title}</strong> {selectedIdea?.category && `(${selectedIdea.category.toUpperCase()})`}
                </p>
              </div>

              <div style={styles.lockedOverlay}>
                <div style={{fontSize: '3rem', marginBottom: '15px'}}>🎯</div>
                <h3 style={{fontSize: '1.3rem', marginBottom: '10px'}}>
                  Ready for Your Dual-Track 90-Day Plan?
                </h3>
                <p style={{fontSize: '1rem', marginBottom: '30px', color: 'rgba(255,255,255,0.7)'}}>
                  Get the complete roadmap: pricing strategy, dual-track implementation (gig income + business building), marketing plan, and 90 days of accountability coaching (3x/week check-ins).
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

      {phase === 3 && (hasPaid || adminClicks >= 5) && (
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
                  {option.growthPath && (
                    <div style={{
                      marginTop: '10px',
                      padding: '8px',
                      background: 'rgba(201,168,76,0.1)',
                      border: '1px solid rgba(201,168,76,0.3)',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      color: '#C9A84C',
                      fontWeight: '600',
                    }}>
                      {option.growthPath}
                    </div>
                  )}
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

      {phase === 4 && plan && (hasPaid || adminClicks >= 5) && (
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
              { id: 'dualtrack', label: 'Dual-Track Plan', emoji: '🎯' },
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
            {activeTab === 'dualtrack' && plan.dualTrack && (
              <div>
                <h3 style={styles.sectionTitle}>Your 90-Day Dual-Track System</h3>
                <p style={styles.sectionText}>{plan.dualTrack.crossover}</p>
                
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px'}}>
                  <div style={{
                    padding: '20px',
                    background: 'rgba(96,184,232,0.1)',
                    border: '1px solid rgba(96,184,232,0.3)',
                    borderRadius: '12px'
                  }}>
                    <h4 style={{fontSize: '1.1rem', color: '#60B8E8', marginBottom: '10px'}}>
                      Track A: {plan.dualTrack.trackA.name}
                    </h4>
                    <p style={{fontSize: '0.9rem', marginBottom: '10px'}}><strong>Weeks 1-4:</strong> {plan.dualTrack.trackA.weeks1_4}</p>
                    <p style={{fontSize: '0.9rem', marginBottom: '10px'}}><strong>Weeks 5-8:</strong> {plan.dualTrack.trackA.weeks5_8}</p>
                    <p style={{fontSize: '0.9rem'}}><strong>Weeks 9-12:</strong> {plan.dualTrack.trackA.weeks9_12}</p>
                  </div>

                  <div style={{
                    padding: '20px',
                    background: 'rgba(201,168,76,0.1)',
                    border: '1px solid rgba(201,168,76,0.3)',
                    borderRadius: '12px'
                  }}>
                    <h4 style={{fontSize: '1.1rem', color: '#C9A84C', marginBottom: '10px'}}>
                      Track B: {plan.dualTrack.trackB.name}
                    </h4>
                    <p style={{fontSize: '0.9rem', marginBottom: '10px'}}><strong>Weeks 1-4:</strong> {plan.dualTrack.trackB.weeks1_4}</p>
                    <p style={{fontSize: '0.9rem', marginBottom: '10px'}}><strong>Weeks 5-8:</strong> {plan.dualTrack.trackB.weeks5_8}</p>
                    <p style={{fontSize: '0.9rem'}}><strong>Weeks 9-12:</strong> {plan.dualTrack.trackB.weeks9_12}</p>
                  </div>
                </div>
              </div>
            )}

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
                {plan.month1.weeks.map((weekData, idx) => (
                  <div key={idx} style={{marginBottom: '30px'}}>
                    <div style={{
                      ...styles.weekBlock,
                      background: 'rgba(201,168,76,0.1)',
                      border: '1px solid rgba(201,168,76,0.3)',
                      marginBottom: '15px',
                    }}>
                      <strong style={{color: '#C9A84C', fontSize: '1.1rem'}}>
                        Week {weekData.week || idx + 1}:
                      </strong> {weekData.summary || weekData}
                    </div>
                    
                    {weekData.steps && weekData.steps.map((step, stepIdx) => (
                      <div key={stepIdx} style={{
                        padding: '15px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        marginBottom: '12px',
                        marginLeft: '20px',
                      }}>
                        <div style={{fontSize: '0.95rem', marginBottom: '10px'}}>
                          <strong style={{color: '#3ECFAB'}}>✓ {step.what}</strong>
                          {step.time && <span style={{color: 'rgba(255,255,255,0.5)', marginLeft: '10px'}}>({step.time})</span>}
                        </div>
                        <div style={{fontSize: '0.9rem', marginBottom: '8px', lineHeight: '1.6'}}>
                          <strong>How:</strong> {step.how}
                        </div>
                        <div style={{fontSize: '0.9rem', marginBottom: '8px', lineHeight: '1.6', fontStyle: 'italic', color: 'rgba(255,255,255,0.8)'}}>
                          <strong>Why:</strong> {step.why}
                        </div>
                        {step.success && (
                          <div style={{fontSize: '0.85rem', color: '#3ECFAB', marginTop: '8px'}}>
                            <strong>Success:</strong> {step.success}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
                <p style={styles.sectionText}><strong>Track:</strong> {plan.month1.metrics}</p>
                
                <div style={{
                  marginTop: '20px',
                  padding: '15px',
                  background: 'rgba(62,207,171,0.1)',
                  border: '1px solid rgba(62,207,171,0.3)',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}>
                  <p style={{fontSize: '0.9rem', margin: 0, color: '#3ECFAB'}}>
                    💬 <strong>Stuck on any of these steps?</strong> Click "Ask Your AI Coach" above — it knows your exact plan and can walk you through it.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'month2' && (
              <div>
                <h3 style={styles.sectionTitle}>Month 2: {plan.month2.goal}</h3>
                {plan.month2.weeks.map((weekData, idx) => (
                  <div key={idx} style={{marginBottom: '30px'}}>
                    <div style={{
                      ...styles.weekBlock,
                      background: 'rgba(201,168,76,0.1)',
                      border: '1px solid rgba(201,168,76,0.3)',
                      marginBottom: '15px',
                    }}>
                      <strong style={{color: '#C9A84C', fontSize: '1.1rem'}}>
                        Week {weekData.week || (5 + idx)}:
                      </strong> {weekData.summary || weekData}
                    </div>
                    
                    {weekData.steps && weekData.steps.map((step, stepIdx) => (
                      <div key={stepIdx} style={{
                        padding: '15px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        marginBottom: '12px',
                        marginLeft: '20px',
                      }}>
                        <div style={{fontSize: '0.95rem', marginBottom: '10px'}}>
                          <strong style={{color: '#3ECFAB'}}>✓ {step.what}</strong>
                          {step.time && <span style={{color: 'rgba(255,255,255,0.5)', marginLeft: '10px'}}>({step.time})</span>}
                        </div>
                        <div style={{fontSize: '0.9rem', marginBottom: '8px', lineHeight: '1.6'}}>
                          <strong>How:</strong> {step.how}
                        </div>
                        <div style={{fontSize: '0.9rem', marginBottom: '8px', lineHeight: '1.6', fontStyle: 'italic', color: 'rgba(255,255,255,0.8)'}}>
                          <strong>Why:</strong> {step.why}
                        </div>
                        {step.success && (
                          <div style={{fontSize: '0.85rem', color: '#3ECFAB', marginTop: '8px'}}>
                            <strong>Success:</strong> {step.success}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
                <p style={styles.sectionText}><strong>Track:</strong> {plan.month2.metrics}</p>
                
                <div style={{
                  marginTop: '20px',
                  padding: '15px',
                  background: 'rgba(62,207,171,0.1)',
                  border: '1px solid rgba(62,207,171,0.3)',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}>
                  <p style={{fontSize: '0.9rem', margin: 0, color: '#3ECFAB'}}>
                    💬 <strong>Stuck on any of these steps?</strong> Click "Ask Your AI Coach" above — it knows your exact plan and can walk you through it.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'month3' && (
              <div>
                <h3 style={styles.sectionTitle}>Month 3: {plan.month3.goal}</h3>
                {plan.month3.weeks.map((weekData, idx) => (
                  <div key={idx} style={{marginBottom: '30px'}}>
                    <div style={{
                      ...styles.weekBlock,
                      background: 'rgba(201,168,76,0.1)',
                      border: '1px solid rgba(201,168,76,0.3)',
                      marginBottom: '15px',
                    }}>
                      <strong style={{color: '#C9A84C', fontSize: '1.1rem'}}>
                        Week {weekData.week || (9 + idx)}:
                      </strong> {weekData.summary || weekData}
                    </div>
                    
                    {weekData.steps && weekData.steps.map((step, stepIdx) => (
                      <div key={stepIdx} style={{
                        padding: '15px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        marginBottom: '12px',
                        marginLeft: '20px',
                      }}>
                        <div style={{fontSize: '0.95rem', marginBottom: '10px'}}>
                          <strong style={{color: '#3ECFAB'}}>✓ {step.what}</strong>
                          {step.time && <span style={{color: 'rgba(255,255,255,0.5)', marginLeft: '10px'}}>({step.time})</span>}
                        </div>
                        <div style={{fontSize: '0.9rem', marginBottom: '8px', lineHeight: '1.6'}}>
                          <strong>How:</strong> {step.how}
                        </div>
                        <div style={{fontSize: '0.9rem', marginBottom: '8px', lineHeight: '1.6', fontStyle: 'italic', color: 'rgba(255,255,255,0.8)'}}>
                          <strong>Why:</strong> {step.why}
                        </div>
                        {step.success && (
                          <div style={{fontSize: '0.85rem', color: '#3ECFAB', marginTop: '8px'}}>
                            <strong>Success:</strong> {step.success}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
                <p style={styles.sectionText}><strong>Track:</strong> {plan.month3.metrics}</p>
                
                <div style={{
                  marginTop: '20px',
                  padding: '15px',
                  background: 'rgba(62,207,171,0.1)',
                  border: '1px solid rgba(62,207,171,0.3)',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}>
                  <p style={{fontSize: '0.9rem', margin: 0, color: '#3ECFAB'}}>
                    💬 <strong>Stuck on any of these steps?</strong> Click "Ask Your AI Coach" above — it knows your exact plan and can walk you through it.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'marketing' && (
              <div>
                <h3 style={styles.sectionTitle}>Marketing Roadmap + Scripts</h3>
                
                <div style={{marginBottom: '20px'}}>
                  <p style={styles.sectionText}><strong>Best Channels:</strong> {plan.marketing.channels.join(', ')}</p>
                  <p style={styles.sectionText}><strong>Budget:</strong> {plan.marketing.budget}</p>
                </div>

                {plan.marketing.dmScript && (
                  <div style={{
                    padding: '15px',
                    background: 'rgba(96,184,232,0.1)',
                    border: '1px solid rgba(96,184,232,0.3)',
                    borderRadius: '8px',
                    marginBottom: '15px',
                  }}>
                    <h4 style={{color: '#60B8E8', fontSize: '0.95rem', marginBottom: '10px'}}>📱 DM Script (Copy + Personalize)</h4>
                    <p style={{fontSize: '0.9rem', whiteSpace: 'pre-wrap', fontFamily: "'IBM Plex Mono', monospace"}}>
                      {plan.marketing.dmScript}
                    </p>
                  </div>
                )}

                {plan.marketing.socialPost && (
                  <div style={{
                    padding: '15px',
                    background: 'rgba(201,168,76,0.1)',
                    border: '1px solid rgba(201,168,76,0.3)',
                    borderRadius: '8px',
                    marginBottom: '15px',
                  }}>
                    <h4 style={{color: '#C9A84C', fontSize: '0.95rem', marginBottom: '10px'}}>📣 Social Post Template</h4>
                    <p style={{fontSize: '0.9rem', whiteSpace: 'pre-wrap', fontFamily: "'IBM Plex Mono', monospace"}}>
                      {plan.marketing.socialPost}
                    </p>
                  </div>
                )}

                {plan.marketing.emailTemplate && (
                  <div style={{
                    padding: '15px',
                    background: 'rgba(62,207,171,0.1)',
                    border: '1px solid rgba(62,207,171,0.3)',
                    borderRadius: '8px',
                    marginBottom: '15px',
                  }}>
                    <h4 style={{color: '#3ECFAB', fontSize: '0.95rem', marginBottom: '10px'}}>📧 Email Template</h4>
                    <p style={{fontSize: '0.9rem', whiteSpace: 'pre-wrap', fontFamily: "'IBM Plex Mono', monospace"}}>
                      {plan.marketing.emailTemplate}
                    </p>
                  </div>
                )}

                {plan.marketing.objections && (
                  <div style={{
                    padding: '15px',
                    background: 'rgba(240,98,146,0.1)',
                    border: '1px solid rgba(240,98,146,0.3)',
                    borderRadius: '8px',
                  }}>
                    <h4 style={{color: '#F06292', fontSize: '0.95rem', marginBottom: '10px'}}>🛡️ Objection Handling</h4>
                    <div style={{fontSize: '0.9rem'}}>
                      <p style={{marginBottom: '8px'}}>
                        <strong>"You're too expensive":</strong> {plan.marketing.objections.tooExpensive}
                      </p>
                      <p style={{marginBottom: '8px'}}>
                        <strong>"I need to think about it":</strong> {plan.marketing.objections.needToThink}
                      </p>
                      <p>
                        <strong>"I can do it myself":</strong> {plan.marketing.objections.doItMyself}
                      </p>
                    </div>
                  </div>
                )}
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
            <div style={{display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap'}}>
              <button 
                style={styles.buttonSecondary} 
                onClick={() => {
                  // Helper function to format weeks
                  const formatWeeks = (weeks) => {
                    return weeks.map(weekData => {
                      if (typeof weekData === 'string') {
                        return `  ${weekData}\n`;
                      }
                      
                      let output = `\n  WEEK ${weekData.week}: ${weekData.summary}\n`;
                      output += `  ${'─'.repeat(70)}\n\n`;
                      
                      if (weekData.steps) {
                        weekData.steps.forEach((step, idx) => {
                          output += `  STEP ${idx + 1}: ${step.what}`;
                          if (step.time) output += ` (${step.time})`;
                          output += `\n\n`;
                          output += `  HOW:\n  ${step.how}\n\n`;
                          output += `  WHY:\n  ${step.why}\n\n`;
                          if (step.success) {
                            output += `  SUCCESS LOOKS LIKE:\n  ${step.success}\n\n`;
                          }
                          output += `\n`;
                        });
                      }
                      
                      return output;
                    }).join('\n');
                  };

                  // Generate comprehensive plan document
                  const planContent = `
╔════════════════════════════════════════════════════════════════════════════╗
║                  CASH MACHINE QUICKSTART - 90-DAY PLAN                     ║
║                                                                            ║
║  Generated for: ${name}                                                   
║  Date: ${new Date().toLocaleDateString()}                                 
╚════════════════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YOUR BUSINESS IDEA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${selectedIdea.title} (${selectedIdea.category.toUpperCase()})
${selectedIdea.tagline}

First Week Earnings: ${selectedIdea.monthOne}
18-Month Potential: ${selectedIdea.yearTwo}

QUICK START:
${selectedIdea.quickStart}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DUAL-TRACK SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${plan.dualTrack.crossover}

TRACK A: ${plan.dualTrack.trackA.name}
  Weeks 1-4: ${plan.dualTrack.trackA.weeks1_4}
  Weeks 5-8: ${plan.dualTrack.trackA.weeks5_8}
  Weeks 9-12: ${plan.dualTrack.trackA.weeks9_12}

TRACK B: ${plan.dualTrack.trackB.name}
  Weeks 1-4: ${plan.dualTrack.trackB.weeks1_4}
  Weeks 5-8: ${plan.dualTrack.trackB.weeks5_8}
  Weeks 9-12: ${plan.dualTrack.trackB.weeks9_12}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRICING STRATEGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Model: ${plan.pricing.model}
Rate: ${plan.pricing.rate}

${plan.pricing.breakdown}

When to Adjust: ${plan.pricing.adjustments}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MONTH 1: ${plan.month1.goal}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${formatWeeks(plan.month1.weeks)}

TRACK THESE METRICS:
${plan.month1.metrics}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MONTH 2: ${plan.month2.goal}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${formatWeeks(plan.month2.weeks)}

TRACK THESE METRICS:
${plan.month2.metrics}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MONTH 3: ${plan.month3.goal}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${formatWeeks(plan.month3.weeks)}

TRACK THESE METRICS:
${plan.month3.metrics}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MARKETING PLAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Best Channels: ${plan.marketing.channels.join(', ')}
Budget: ${plan.marketing.budget}

────────────────────────────────────────────────────────────────────────────

DM SCRIPT (Copy + Personalize):

${plan.marketing.dmScript}

────────────────────────────────────────────────────────────────────────────

SOCIAL POST TEMPLATE:

${plan.marketing.socialPost}

────────────────────────────────────────────────────────────────────────────

EMAIL TEMPLATE:

${plan.marketing.emailTemplate}

────────────────────────────────────────────────────────────────────────────

OBJECTION HANDLING:

"You're too expensive":
${plan.marketing.objections.tooExpensive}

"I need to think about it":
${plan.marketing.objections.needToThink}

"I can do it myself":
${plan.marketing.objections.doItMyself}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

90-DAY MILESTONES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${plan.milestones.map(m => `Day ${m.day.toString().padStart(2, '0')}: ${m.goal}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACCOUNTABILITY CHECK-INS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You'll receive 3 check-ins per week for 90 days:

  Monday: "What's your win for this week?"
  Wednesday: "How's progress on your milestone?"
  Friday: "Where are you at — on track, almost there, or stuck?"

Reply STOP to opt out anytime.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cash Machine QuickStart
CKO Global INC
Email: Kelli@proactively-lazy.com
Website: proactively-lazy.com

Generated: ${new Date().toLocaleString()}
`;

                  // Create downloadable text file
                  const blob = new Blob([planContent], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `CashMachine_90DayPlan_${name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
              >
                📥 Download Full 90-Day Plan
              </button>
              <button 
                style={{
                  ...styles.buttonSecondary,
                  background: 'rgba(62,207,171,0.2)',
                  border: '1px solid #3ECFAB',
                  color: '#3ECFAB',
                }}
                onClick={() => setChatbotOpen(true)}
              >
                💬 Ask Your AI Coach
              </button>
            </div>
          </div>

          <div style={styles.accountabilityFooter}>
            <h3 style={{fontSize: '1.2rem', marginBottom: '15px'}}>
              🤝 Your Accountability Coach (Not Your Babysitter)
            </h3>
            <p style={{fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '15px'}}>
              Here's the deal: We give you the map. You walk the path.
            </p>
            <p style={{fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '15px'}}>
              Starting Monday, you'll get 3 check-ins per week for 90 days:
            </p>
            <ul style={{listStyle: 'none', padding: 0, margin: '0 0 15px 0'}}>
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
            <p style={{fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '15px'}}>
              We're your coach in your corner. We'll check in, celebrate wins, and help when you're genuinely stuck. 
              But we're not here to make excuses for you or do the work for you.
            </p>
            <p style={{fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '15px'}}>
              <strong>Your wins? Those are YOURS. Own them.</strong><br/>
              <strong>Your setbacks? Also YOURS. Learn from them.</strong>
            </p>
            <p style={{fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '15px'}}>
              If you ghost us for 2 weeks straight, we'll check in ONE more time. After that, we assume you quit 
              and you'll stop getting messages. No hard feelings — this isn't for everyone.
            </p>
            <p style={{fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '15px'}}>
              But if you show up, stay honest, and do the work? We've got your back every step of the way.
            </p>
            <p style={{fontSize: '0.9rem', marginTop: '15px', fontStyle: 'italic', color: 'rgba(255,255,255,0.7)'}}>
              Plus: Got a question at 2am when you're stuck on pricing? Use the chatbot helper 24/7. 
              It knows your plan, your pricing, and your milestones. It's like having a coach who never sleeps.
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

      {chatbotOpen && phase === 4 && (hasPaid || adminClicks >= 5) && (
        <ChatbotHelper
          plan={plan}
          selectedIdea={selectedIdea}
          selectedPricing={selectedPricing}
          onClose={() => setChatbotOpen(false)}
        />
      )}

      <div style={styles.footer}>
        <div style={{marginBottom: '15px'}}>
          <strong style={{color: '#C9A84C'}}>Cash Machine QuickStart</strong>
        </div>
        <div>
          CKO Global INC<br/>
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
