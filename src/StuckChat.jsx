import React, { useState, useEffect, useRef } from 'react';

export default function StuckChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState(null);
  const [escalating, setEscalating] = useState(false);
  const messagesEndRef = useRef(null);

  const params = new URLSearchParams(window.location.search);
  const week = params.get('week') || '1';
  const contactId = params.get('contact') || 'test';

  useEffect(() => {
    const savedState = localStorage.getItem('if_state');
    if (savedState) {
      const state = JSON.parse(savedState);
      setContext(state);
      setMessages([{
        role: 'assistant',
        content: `Hey! I'm your Income-First coach. I see you're on Week ${week}${state.selectedIdea ? ` working on ${state.selectedIdea.title}` : ''}.\n\nWhat's got you stuck? I'm here to help you get moving again.`
      }]);
    } else {
      setMessages([{
        role: 'assistant',
        content: `Hey! I'm your Income-First coach. You're on Week ${week}.\n\nWhat's got you stuck? Tell me what's going on and I'll help you get unstuck.`
      }]);
    }
    scrollToBottom();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const systemPrompt = `You are the Income-First support coach helping a student who is stuck.

Context:
- Current Week: ${week}
${context?.selectedIdea ? `- Business Idea: ${context.selectedIdea.title}` : ''}
${context?.selectedPricing ? `- Pricing: ${context.selectedPricing.name} at ${context.selectedPricing.price}` : ''}
${context?.plan ? `- This Week's Focus: Week ${week} tasks from their plan` : ''}

The student replied "STUCK" to this week's check-in. Your job:

1. **Ask specific diagnostic questions** - Don't just say "what's wrong?" Ask: "Are you stuck finding customers? Pricing? Writing your offer? Time management?"

2. **Provide actionable help** from their plan:
   - If stuck finding customers: Give specific platforms/places (Instagram local hashtags, Facebook groups, Nextdoor, local businesses to contact)
   - If stuck on what to say: Provide DM/email scripts they can copy/paste
   - If stuck on time: Show them how to cut gig hours, add business hours
   - If stuck on rejection: This is normal, here's what to adjust
   - If stuck on pricing: Remind them of their chosen model, why it works

3. **Give scripts and templates** - Don't just advise, give them exact words to use

4. **Be encouraging but direct** - "This is totally normal. Here's exactly what to do..."

5. **Never say "I can't help"** - Always provide something actionable. If they need more, they can click "Talk to Kelli"

6. **Keep responses focused** - 2-3 short paragraphs max, actionable guidance

Be conversational, supportive, and specific. You're their accountability partner who knows their plan inside-out. Program is Income-First by CKO Global LLC.`;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages,
            userMessage
          ]
        })
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I had trouble processing that. Can you try rephrasing?' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleEscalate = async () => {
    if (escalating) return;
    setEscalating(true);
    try {
      const transcript = messages
        .map(m => `${m.role === 'user' ? 'Student' : 'AI'}: ${m.content}`)
        .join('\n\n');

      await fetch('/api/stuck-escalation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact_id: contactId,
          week: parseInt(week),
          chat_transcript: transcript,
          business_idea: context?.selectedIdea?.title || 'Unknown',
        })
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `✅ Got it. I've notified Kelli and you'll get a text in the next few minutes with a link to book a 20-minute call.\n\nShe'll review this chat and your plan before you talk, so she'll know exactly where you're stuck.\n\nYou're not alone in this! 💪`
      }]);
    } catch (err) {
      console.error('Escalation error:', err);
      alert('Error sending notification. Please text Kelli directly at the number in your welcome email.');
    } finally {
      setEscalating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#06091A', color: '#fff', fontFamily: "'IBM Plex Mono', monospace", display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#D8FF2C', marginBottom: '5px' }}>
          🤝 Income-First Coach — Week {week}
        </div>
        <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
          {context?.selectedIdea?.title || 'Your Business Idea'}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', maxWidth: '800px', width: '100%', margin: '0 auto' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ maxWidth: '80%', padding: '12px 16px', borderRadius: '12px', background: msg.role === 'user' ? 'rgba(216,255,44,0.12)' : 'rgba(255,255,255,0.05)', border: `1px solid ${msg.role === 'user' ? 'rgba(216,255,44,0.25)' : 'rgba(255,255,255,0.1)'}`, color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <div style={{ padding: '12px', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', fontStyle: 'italic' }}>AI is thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', padding: '15px 20px 120px', maxWidth: '800px', width: '100%', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.95rem', outline: 'none' }}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{ padding: '12px 24px', background: '#D8FF2C', border: 'none', borderRadius: '8px', color: '#06091A', fontWeight: '700', fontSize: '0.95rem', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', fontFamily: "'IBM Plex Mono', monospace", opacity: loading || !input.trim() ? 0.5 : 1 }}
          >
            Send
          </button>
        </div>

        <button
          onClick={handleEscalate}
          disabled={escalating}
          style={{ width: '100%', padding: '16px', background: 'rgba(240,98,146,0.2)', border: '1px solid rgba(240,98,146,0.4)', borderRadius: '8px', color: '#F06292', fontWeight: '600', fontSize: '0.95rem', cursor: escalating ? 'not-allowed' : 'pointer', fontFamily: "'IBM Plex Mono', monospace", opacity: escalating ? 0.5 : 1 }}
        >
          {escalating ? 'Sending notification...' : "This isn't helping - I need to talk to Kelli"}
        </button>
      </div>
    </div>
  );
}
