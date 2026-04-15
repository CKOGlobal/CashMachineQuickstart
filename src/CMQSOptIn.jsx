import React, { useState } from 'react';

const ChatbotHelper = ({ plan, onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hey! I'm your AI coach. I know your entire 90-day plan for ${plan.selectedIdea}. When you get stuck on a task, DON'T just sit there - ask me for help. I'll guide you to figure it out.\n\nWhat do you need help with?`
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
      const contextualPrompt = messages.length === 1
        ? `You are a Socratic coach for the Income-First accountability program by CKO Global LLC. Your job is to help students DISCOVER answers, not give them answers.\n\nUser's Plan:\n- Business: ${plan.selectedIdea}\n- Pricing: ${plan.selectedPricing}\n- Category: ${plan.category}\n- Full 90-day breakdown: ${JSON.stringify(plan).substring(0, 500)}\n\nYour coaching style:\n- ALWAYS ask "What have you tried already?" before helping\n- Ask questions that lead them to the answer (Socratic method)\n- Be supportive but don't rescue - they need to figure it out\n- If they say "I don't know," ask "If you DID know, what would you guess?"\n- Keep responses SHORT (2-3 sentences max) - more questions, less explaining\n- Never say "you should" - instead ask "what options do you see?"\n\nUser question: ${input}`
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
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I hit a technical snag. Try asking again?' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }} onClick={onClose}>
      <div style={{ background: '#0A1025', border: '1px solid rgba(216,255,44,0.2)', borderRadius: '16px', width: '100%', maxWidth: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#ffffff' }}>💬 Your AI Coach</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '1.5rem', cursor: 'pointer', padding: '0', lineHeight: 1 }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: '15px', display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '80%', padding: '12px 16px', borderRadius: '12px', background: msg.role === 'user' ? 'rgba(216,255,44,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${msg.role === 'user' ? 'rgba(216,255,44,0.25)' : 'rgba(255,255,255,0.1)'}`, color: '#ffffff', fontSize: '0.95rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#ffffff', fontSize: '0.95rem', maxWidth: '80%' }}>
              Thinking...
            </div>
          )}
        </div>
        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '12px' }}>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} placeholder="Ask your question..." style={{ flex: 1, padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#ffffff', fontSize: '1rem', outline: 'none' }} />
          <button onClick={sendMessage} disabled={loading || !input.trim()} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #FF5035 0%, #FF7A1A 100%)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', opacity: loading || !input.trim() ? 0.5 : 1 }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default function CMQSOptIn() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nonPromotional: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [plan, setPlan] = useState(null);
  const [activeTab, setActiveTab] = useState('month1');
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const loadingMessages = [
    "Analyzing your business idea...",
    "Building Month 1 roadmap...",
    "Designing Week 1-4 tasks...",
    "Creating Month 2 strategy...",
    "Planning Weeks 5-8...",
    "Structuring Month 3 growth...",
    "Mapping Weeks 9-12...",
    "Generating marketing plan...",
    "Building objection responses...",
    "Creating milestone tracker...",
    "Almost done..."
  ];

  React.useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingMessageIndex(prev => prev < loadingMessages.length - 1 ? prev + 1 : prev);
      }, 2800);
      return () => clearInterval(interval);
    } else {
      setLoadingMessageIndex(0);
    }
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const response = await fetch('/api/cmqs-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          businessIdea: urlParams.get('idea') || localStorage.getItem('if_business_idea'),
          pricingModel: urlParams.get('pricing') || localStorage.getItem('if_pricing'),
          category: urlParams.get('category') || localStorage.getItem('if_category'),
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate plan');
      setPlan(data.plan);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: { minHeight: '100vh', background: '#06091A', color: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', padding: '20px' },
    header: { maxWidth: '900px', margin: '0 auto 30px', textAlign: 'center', padding: '20px' },
    brandLine: { fontSize: '0.85rem', fontFamily: '"IBM Plex Mono", monospace', color: '#D8FF2C', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' },
    hero: { fontSize: '2.5rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '15px' },
    tagline: { fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' },
    phase: { maxWidth: '900px', margin: '0 auto', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '40px' },
    tabs: { display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' },
    tab: { padding: '12px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer' },
    tabActive: { background: 'rgba(216,255,44,0.12)', border: '1px solid #D8FF2C', color: '#D8FF2C' },
    tabContent: { animation: 'fadeIn 0.3s ease-in' },
    sectionTitle: { fontSize: '1.6rem', fontWeight: '700', marginBottom: '20px', color: '#ffffff' },
    sectionText: { fontSize: '1rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6', marginBottom: '25px' },
    weekBlock: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '25px', marginBottom: '20px' },
    weekTitle: { fontSize: '1.2rem', fontWeight: '700', color: '#D8FF2C', marginBottom: '10px' },
    weekSummary: { fontSize: '1rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.5', marginBottom: '20px' },
    stepBlock: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '20px', marginBottom: '15px' },
    stepWhat: { fontSize: '1.05rem', fontWeight: '600', color: '#ffffff', marginBottom: '15px' },
    stepSection: { marginBottom: '12px' },
    stepLabel: { fontSize: '0.8rem', fontWeight: '700', color: '#D8FF2C', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' },
    stepContent: { fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6' },
    milestoneBlock: { display: 'flex', gap: '20px', background: 'rgba(62,207,171,0.1)', border: '1px solid rgba(62,207,171,0.3)', borderRadius: '10px', padding: '20px', marginBottom: '15px' },
    milestoneDay: { fontSize: '1.5rem', fontWeight: '800', color: '#3ECFAB', minWidth: '80px' },
    milestoneGoal: { fontSize: '1rem', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6', display: 'flex', alignItems: 'center' },
    exportSection: { marginTop: '40px', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' },
    accountabilityFooter: { marginTop: '40px', padding: '30px', background: 'rgba(216,255,44,0.06)', border: '1px solid rgba(216,255,44,0.2)', borderRadius: '12px', textAlign: 'center' },
    footer: { maxWidth: '900px', margin: '50px auto 0', padding: '30px 20px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }
  };

  const downloadPlan = () => {
    if (!plan) return;
    let text = `INCOME-FIRST — YOUR 90-DAY PLAN\n========================================\n\nBusiness: ${plan.selectedIdea}\nPricing: ${plan.selectedPricing}\n\n`;
    [1, 2, 3].forEach(n => {
      const m = plan[`month${n}`];
      if (!m) return;
      text += `MONTH ${n}: ${m.goal}\n${'='.repeat(50)}\n\n`;
      m.weeks.forEach(week => {
        text += `WEEK ${week.week}\n${week.summary}\n\n`;
        week.steps.forEach((step, i) => {
          text += `${i + 1}. ${step.what}\n   HOW: ${step.how}\n   WHY: ${step.why}\n   TIME: ${step.time}\n   SUCCESS: ${step.success}\n\n`;
        });
      });
    });
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'income-first-plan.txt'; a.click();
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#06091A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: '#0A1025', border: '1px solid rgba(216,255,44,0.15)', borderRadius: '8px', padding: '40px', maxWidth: '600px', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', border: '4px solid rgba(216,255,44,0.15)', borderTop: '4px solid #D8FF2C', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }} />
          <h2 style={{ color: '#D8FF2C', marginBottom: '15px', fontSize: '20px' }}>Generating Your 90-Day Plan...</h2>
          <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.6', marginBottom: '10px' }}>{loadingMessages[loadingMessageIndex]}</p>
          <p style={{ color: '#6B7280', fontSize: '13px' }}>Building your custom roadmap with AI. This takes about 30 seconds.</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (submitted && plan) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.brandLine}>Income-First</div>
          <h1 style={styles.hero}>Your 90-Day Plan Is Ready</h1>
          <p style={styles.tagline}>Here's your complete roadmap. Accountability check-ins start now.</p>
          <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(216,255,44,0.07)', border: '2px solid rgba(216,255,44,0.3)', borderRadius: '12px', textAlign: 'left' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>💡</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#D8FF2C', marginBottom: '10px' }}>Stuck on a task? Don't sit there wondering - ASK FOR HELP.</h3>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '15px', color: 'rgba(255,255,255,0.85)' }}>Your AI Coach knows this entire plan. It won't just give you answers - it'll ask questions to help you figure it out yourself.</p>
            <button onClick={() => setChatbotOpen(true)} style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #FF5035 0%, #FF7A1A 100%)', color: '#fff', fontSize: '1.05rem', fontWeight: '700', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%' }}>
              💬 Ask AI Coach
            </button>
          </div>
        </div>

        <div style={styles.phase}>
          <div style={styles.tabs}>
            {['month1', 'month2', 'month3', 'marketing', 'milestones'].map(tab => {
              if (tab !== 'month1' && !plan[tab]) return null;
              const labels = { month1: 'Month 1', month2: 'Month 2', month3: 'Month 3', marketing: 'Marketing', milestones: 'Milestones' };
              return <button key={tab} onClick={() => setActiveTab(tab)} style={activeTab === tab ? { ...styles.tab, ...styles.tabActive } : styles.tab}>{labels[tab]}</button>;
            })}
          </div>

          {activeTab === 'month1' && plan.month1 && (
            <div style={styles.tabContent}>
              <h3 style={styles.sectionTitle}>🚀 Month 1: {plan.month1.goal}</h3>
              <div style={{ padding: '15px 20px', background: 'rgba(216,255,44,0.06)', border: '1px solid rgba(216,255,44,0.2)', borderRadius: '8px', marginBottom: '25px', fontSize: '0.9rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.9)' }}>
                <strong style={{ color: '#D8FF2C' }}>📌 Getting Stuck Is Normal.</strong> When you hit a task and think "I don't know how to do this" — that's your cue to click "Ask AI Coach" above.
              </div>
              {plan.month1.weeks.map((week) => (
                <div key={week.week} style={styles.weekBlock}>
                  <h4 style={styles.weekTitle}>Week {week.week}</h4>
                  <p style={styles.weekSummary}>{week.summary}</p>
                  {week.steps.map((step, idx) => (
                    <div key={idx} style={styles.stepBlock}>
                      <div style={styles.stepWhat}>{step.what}</div>
                      <div style={styles.stepSection}><div style={styles.stepLabel}>How</div><div style={styles.stepContent}>{step.how}</div></div>
                      <div style={styles.stepSection}><div style={styles.stepLabel}>Why</div><div style={styles.stepContent}>{step.why}</div></div>
                      <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                        <div><div style={styles.stepLabel}>Time</div><div style={styles.stepContent}>{step.time}</div></div>
                        <div style={{ flex: 1 }}><div style={styles.stepLabel}>Success Looks Like</div><div style={styles.stepContent}>{step.success}</div></div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              <div style={{ ...styles.weekBlock, background: 'rgba(216,255,44,0.06)', border: '1px solid rgba(216,255,44,0.2)' }}>
                <strong style={{ color: '#D8FF2C' }}>📊 Track These Metrics:</strong> {plan.month1.metrics}
              </div>
            </div>
          )}

          {activeTab === 'month2' && plan.month2 && (
            <div style={styles.tabContent}>
              <h3 style={styles.sectionTitle}>📈 Month 2: {plan.month2.goal}</h3>
              {plan.month2.weeks.map((week) => (
                <div key={week.week} style={styles.weekBlock}>
                  <h4 style={styles.weekTitle}>Week {week.week}</h4>
                  <p style={styles.weekSummary}>{week.summary}</p>
                  {week.steps.map((step, idx) => (
                    <div key={idx} style={styles.stepBlock}>
                      <div style={styles.stepWhat}>{step.what}</div>
                      <div style={styles.stepSection}><div style={styles.stepLabel}>How</div><div style={styles.stepContent}>{step.how}</div></div>
                      <div style={styles.stepSection}><div style={styles.stepLabel}>Why</div><div style={styles.stepContent}>{step.why}</div></div>
                      <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                        <div><div style={styles.stepLabel}>Time</div><div style={styles.stepContent}>{step.time}</div></div>
                        <div style={{ flex: 1 }}><div style={styles.stepLabel}>Success Looks Like</div><div style={styles.stepContent}>{step.success}</div></div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              <div style={{ ...styles.weekBlock, background: 'rgba(216,255,44,0.06)', border: '1px solid rgba(216,255,44,0.2)' }}>
                <strong style={{ color: '#D8FF2C' }}>📊 Track These Metrics:</strong> {plan.month2.metrics}
              </div>
            </div>
          )}

          {activeTab === 'month3' && plan.month3 && (
            <div style={styles.tabContent}>
              <h3 style={styles.sectionTitle}>🎯 Month 3: {plan.month3.goal}</h3>
              {plan.month3.weeks.map((week) => (
                <div key={week.week} style={styles.weekBlock}>
                  <h4 style={styles.weekTitle}>Week {week.week}</h4>
                  <p style={styles.weekSummary}>{week.summary}</p>
                  {week.steps.map((step, idx) => (
                    <div key={idx} style={styles.stepBlock}>
                      <div style={styles.stepWhat}>{step.what}</div>
                      <div style={styles.stepSection}><div style={styles.stepLabel}>How</div><div style={styles.stepContent}>{step.how}</div></div>
                      <div style={styles.stepSection}><div style={styles.stepLabel}>Why</div><div style={styles.stepContent}>{step.why}</div></div>
                      <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                        <div><div style={styles.stepLabel}>Time</div><div style={styles.stepContent}>{step.time}</div></div>
                        <div style={{ flex: 1 }}><div style={styles.stepLabel}>Success Looks Like</div><div style={styles.stepContent}>{step.success}</div></div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              <div style={{ ...styles.weekBlock, background: 'rgba(216,255,44,0.06)', border: '1px solid rgba(216,255,44,0.2)' }}>
                <strong style={{ color: '#D8FF2C' }}>📊 Track These Metrics:</strong> {plan.month3.metrics}
              </div>
            </div>
          )}

          {activeTab === 'marketing' && plan.marketing && (
            <div style={styles.tabContent}>
              <h3 style={styles.sectionTitle}>📣 Your Marketing Plan</h3>
              <div style={styles.weekBlock}><strong>Channels:</strong><ul style={{ marginTop: '10px', lineHeight: '1.8' }}>{plan.marketing.channels.map((ch, i) => <li key={i}>{ch}</li>)}</ul></div>
              <div style={styles.weekBlock}><strong>DM Script:</strong><p style={{ marginTop: '10px', lineHeight: '1.6', fontStyle: 'italic' }}>"{plan.marketing.dmScript}"</p></div>
              <div style={styles.weekBlock}><strong>Social Post Template:</strong><p style={{ marginTop: '10px', lineHeight: '1.6', fontStyle: 'italic' }}>"{plan.marketing.socialPost}"</p></div>
              <div style={styles.weekBlock}><strong>Email Template:</strong><p style={{ marginTop: '10px', lineHeight: '1.6', fontStyle: 'italic' }}>"{plan.marketing.emailTemplate}"</p></div>
              <div style={{ ...styles.weekBlock, background: 'rgba(62,207,171,0.1)', border: '1px solid rgba(62,207,171,0.3)' }}>
                <strong style={{ color: '#3ECFAB' }}>💬 Objection Handling:</strong>
                <ul style={{ marginTop: '10px', lineHeight: '1.8' }}>
                  <li><strong>"Too expensive":</strong> {plan.marketing.objections?.tooExpensive}</li>
                  <li><strong>"Need to think":</strong> {plan.marketing.objections?.needToThink}</li>
                  <li><strong>"Can do it myself":</strong> {plan.marketing.objections?.doItMyself}</li>
                </ul>
              </div>
              <div style={styles.weekBlock}><strong>Budget Strategy:</strong><p style={{ marginTop: '10px', lineHeight: '1.6' }}>{plan.marketing.budget}</p></div>
            </div>
          )}

          {activeTab === 'milestones' && plan.milestones && (
            <div style={styles.tabContent}>
              <h3 style={styles.sectionTitle}>🏆 Your Milestones</h3>
              <p style={styles.sectionText}>These are the checkpoints. Hit these, and you're on track.</p>
              {plan.milestones.map((m, i) => (
                <div key={i} style={styles.milestoneBlock}>
                  <div style={styles.milestoneDay}>Day {m.day}</div>
                  <div style={styles.milestoneGoal}>{m.goal}</div>
                </div>
              ))}
            </div>
          )}

          <div style={styles.exportSection}>
            <button onClick={() => setChatbotOpen(true)} style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #FF5035 0%, #FF7A1A 100%)', color: '#fff', fontSize: '1rem', fontWeight: '700', border: 'none', borderRadius: '8px', cursor: 'pointer', marginRight: '15px' }}>
              💬 Ask AI Coach
            </button>
            <button onClick={downloadPlan} style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.1)', color: '#ffffff', fontSize: '1rem', fontWeight: '600', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer' }}>
              📥 Download Plan (TXT)
            </button>
          </div>

          <div style={styles.accountabilityFooter}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>🤝 Your Accountability Check-Ins Start Now</h3>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '15px' }}>You'll receive SMS check-ins throughout your 90-day journey. Reply DONE, STUCK, or ALMOST. No pressure, just progress.</p>
            <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.7)', margin: 0 }}>Reply STOP anytime to opt out. But we both know you're not going to do that. You've got this.</p>
          </div>
        </div>

        {chatbotOpen && <ChatbotHelper plan={plan} onClose={() => setChatbotOpen(false)} />}

        <div style={styles.footer}>
          <div style={{ marginBottom: '15px' }}><strong style={{ color: '#D8FF2C' }}>Income-First</strong></div>
          <div>CKO Global LLC · Operated by Kelli Owens<br />Email: <a href="mailto:Kelli@proactively-lazy.com" style={{ color: '#D8FF2C', textDecoration: 'none' }}>Kelli@proactively-lazy.com</a><br />Website: <a href="https://proactively-lazy.com" target="_blank" rel="noopener noreferrer" style={{ color: '#D8FF2C', textDecoration: 'none' }}>proactively-lazy.com</a></div>
          <div style={{ marginTop: '15px', fontSize: '0.85rem' }}>
            <a href="/terms" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', marginRight: '15px' }}>Terms of Service</a>
            <a href="/privacy" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Privacy Policy</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#06091A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>

      <div style={{ maxWidth: '600px', width: '100%', marginBottom: '24px', padding: '24px', background: '#0A1025', border: '1px solid rgba(216,255,44,0.2)', borderRadius: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'linear-gradient(135deg, #D8FF2C, #9BE600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>💰</div>
          <div>
            <div style={{ fontSize: '13px', fontFamily: '"IBM Plex Mono", monospace', color: '#D8FF2C', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '2px' }}>Income-First</div>
            <div style={{ fontSize: '11px', color: '#6B7280' }}>A 90-Day Business Launch Program by CKO Global LLC</div>
          </div>
        </div>

        <p style={{ color: '#9CA3AF', fontSize: '13px', lineHeight: '1.75', marginBottom: '12px', marginTop: 0 }}>
          <strong style={{ color: '#E5E7EB' }}>Income-First</strong> is a 90-day business coaching and accountability program. We help people identify skills-based income opportunities and build a real, cash-generating business. Participants receive an AI-generated action plan and SMS accountability check-ins to stay on track.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '10px 12px' }}>
            <div style={{ fontSize: '10px', fontFamily: '"IBM Plex Mono", monospace', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '3px' }}>Program Length</div>
            <div style={{ fontSize: '13px', color: '#E5E7EB', fontWeight: '600' }}>90 Days</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '10px 12px' }}>
            <div style={{ fontSize: '10px', fontFamily: '"IBM Plex Mono", monospace', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '3px' }}>Check-In Frequency</div>
            <div style={{ fontSize: '13px', color: '#E5E7EB', fontWeight: '600' }}>3× per week via SMS</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '10px 12px' }}>
            <div style={{ fontSize: '10px', fontFamily: '"IBM Plex Mono", monospace', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '3px' }}>Operated By</div>
            <div style={{ fontSize: '13px', color: '#E5E7EB', fontWeight: '600' }}>CKO Global LLC</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '10px 12px' }}>
            <div style={{ fontSize: '10px', fontFamily: '"IBM Plex Mono", monospace', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '3px' }}>Contact</div>
            <div style={{ fontSize: '12px', color: '#D8FF2C', fontWeight: '600' }}>Kelli@proactively-lazy.com</div>
          </div>
        </div>

        <div style={{ fontSize: '12px', color: '#4B5563', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
          CKO Global LLC · Operated by Kelli Owens ·{' '}
          <a href="https://proactively-lazy.com" target="_blank" rel="noopener noreferrer" style={{ color: '#D8FF2C', textDecoration: 'none' }}>proactively-lazy.com</a>
          {' '}·{' '}
          <a href="/privacy" style={{ color: '#6B7280', textDecoration: 'none' }}>Privacy Policy</a>
          {' '}·{' '}
          <a href="/terms" style={{ color: '#6B7280', textDecoration: 'none' }}>Terms of Service</a>
        </div>
      </div>

      <div style={{ background: '#0A1025', border: '1px solid rgba(216,255,44,0.15)', borderRadius: '8px', padding: '40px', maxWidth: '600px', width: '100%' }}>
        <h1 style={{ color: '#D8FF2C', marginBottom: '10px', fontSize: '28px', fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>
          Activate Your Coaching
        </h1>
        <p style={{ color: '#9CA3AF', marginBottom: '30px', fontSize: '16px', lineHeight: '1.6' }}>
          Complete your Income-First setup to receive your personalized 90-day business action plan and SMS accountability check-ins from CKO Global LLC.
        </p>

        {error && (
          <div style={{ padding: '15px', background: 'rgba(240,98,146,0.1)', border: '1px solid rgba(240,98,146,0.3)', borderRadius: '8px', color: '#F06292', fontSize: '0.95rem', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {[
            { label: 'First Name *', field: 'firstName', type: 'text', required: true },
            { label: 'Last Name *', field: 'lastName', type: 'text', required: true },
            { label: 'Email *', field: 'email', type: 'email', required: true },
            { label: 'Mobile Phone Number *', field: 'phone', type: 'tel', required: true, placeholder: '(555) 555-5555' },
          ].map(({ label, field, type, required, placeholder }) => (
            <div key={field} style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#E5E7EB', marginBottom: '8px', fontSize: '14px' }}>{label}</label>
              <input type={type} required={required} placeholder={placeholder} value={formData[field]} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                style={{ width: '100%', padding: '12px', background: '#1F2937', border: '1px solid #374151', borderRadius: '4px', color: '#E5E7EB', fontSize: '16px', boxSizing: 'border-box' }} />
            </div>
          ))}

          <div style={{ background: 'rgba(216,255,44,0.05)', border: '1px solid rgba(216,255,44,0.2)', borderRadius: '6px', padding: '20px', marginBottom: '20px' }}>
            <p style={{ color: '#D8FF2C', fontWeight: 700, marginBottom: '4px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📱 SMS Accountability Check-Ins</p>
            <p style={{ color: '#6B7280', fontSize: '12px', marginBottom: '14px', marginTop: 0, lineHeight: '1.5' }}>
              Income-First delivers accountability through SMS text messages. By checking the box below you consent to receive these messages at the mobile number you provided above.
            </p>

            <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', gap: '10px' }}>
              <input
                type="checkbox"
                checked={formData.nonPromotional}
                onChange={(e) => setFormData({ ...formData, nonPromotional: e.target.checked })}
                style={{ marginTop: '3px', width: '18px', height: '18px', cursor: 'pointer', flexShrink: 0 }}
              />
              <span style={{ color: '#D1D5DB', fontSize: '13px', lineHeight: '1.6' }}>
                I consent to receive recurring SMS text messages from <strong style={{ color: '#E5E7EB' }}>CKO Global LLC</strong> (Income-First) at the mobile number provided, including accountability check-ins, progress reminders, program updates, and service notifications. <strong>Message frequency: up to 3 messages per week for 90 days.</strong> Message &amp; data rates may apply. Reply <strong>HELP</strong> for help. Reply <strong>STOP</strong> to unsubscribe at any time.
              </span>
            </label>

            <div style={{ marginTop: '14px', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '5px', fontSize: '11px', color: '#4B5563', lineHeight: '1.6' }}>
              <strong style={{ color: '#6B7280' }}>How we contact you:</strong> SMS text messages sent to the mobile number above · No calls, no spam · Opt-out anytime by replying STOP · Consent is not a condition of purchase or program access.{' '}
              <a href="/privacy" style={{ color: '#D8FF2C', textDecoration: 'none' }}>Privacy Policy</a>
              {' '}·{' '}
              <a href="/terms" style={{ color: '#D8FF2C', textDecoration: 'none' }}>Terms of Service</a>
            </div>
          </div>

          <button type="submit" style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #FF5035 0%, #FF7A1A 100%)', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}>
            Activate My Coaching
          </button>

          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #374151', textAlign: 'center' }}>
            <p style={{ color: '#D8FF2C', fontSize: '14px', marginBottom: '6px', fontWeight: 600 }}>Income-First</p>
            <p style={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '3px' }}>CKO Global LLC · Operated by Kelli Owens</p>
            <p style={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '3px' }}>
              <a href="mailto:Kelli@proactively-lazy.com" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Kelli@proactively-lazy.com</a>
            </p>
            <p style={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '12px' }}>
              <a href="https://proactively-lazy.com" target="_blank" rel="noopener noreferrer" style={{ color: '#9CA3AF', textDecoration: 'none' }}>proactively-lazy.com</a>
            </p>
            <p style={{ color: '#6B7280', fontSize: '12px', lineHeight: '1.6' }}>
              By submitting this form, you agree to our{' '}
              <a href="/privacy" style={{ color: '#D8FF2C', textDecoration: 'none' }}>Privacy Policy</a>{' '}and{' '}
              <a href="/terms" style={{ color: '#D8FF2C', textDecoration: 'none' }}>Terms of Service</a>.
            </p>
          </div>
        </form>
      </div>

      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
