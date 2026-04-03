import React, { useState, useEffect } from 'react';

// ============================================================================
// CASH MACHINE QUICKSTART - PROGRESSIVE PLAN GENERATION
// - Enrollment posts to GHL with tag: KelliCMQS / LoralCMQS / BetaCMQS
// - Email plan sends full branded HTML plan via Resend
// - Codes: KELLICMQS ($97, KelliCMQS), LORAL2026 ($69.97, LoralCMQS),
//          CMQS/CMQS2026 (free, CMQSAccess). No code = KelliCMQS full price.
// ============================================================================

const styles = {
  container: { minHeight: '100vh', background: '#0d1117', color: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', padding: '20px' },
  header: { maxWidth: '900px', margin: '0 auto 30px', textAlign: 'center', padding: '20px' },
  brandLine: { fontSize: '0.85rem', fontFamily: '"IBM Plex Mono", monospace', color: '#C9A84C', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' },
  hero: { fontSize: '2.5rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '15px' },
  tagline: { fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' },
  progressBar: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', maxWidth: '700px', margin: '30px auto', padding: '0 20px' },
  progressStep: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: 0.4 },
  progressStepActive: { opacity: 1 },
  progressCircle: { width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1.1rem' },
  progressLabel: { fontSize: '0.85rem', fontWeight: '600', textAlign: 'center' },
  phase: { maxWidth: '900px', margin: '0 auto', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '40px' },
  phaseHeader: { textAlign: 'center', marginBottom: '40px' },
  phaseTitle: { fontSize: '1.8rem', fontWeight: '700', lineHeight: '1.3', marginBottom: '10px' },
  phaseSubtitle: { fontSize: '1rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' },
  formGroup: { marginBottom: '30px' },
  label: { display: 'block', fontSize: '0.95rem', fontWeight: '600', marginBottom: '10px', color: 'rgba(255,255,255,0.9)' },
  helperText: { fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '8px', fontStyle: 'italic' },
  input: { width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#ffffff', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' },
  chipGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' },
  chipRow: { display: 'flex', flexWrap: 'wrap', gap: '12px' },
  chip: { padding: '10px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#ffffff', fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer', outline: 'none' },
  chipSelected: { background: 'rgba(201,168,76,0.2)', border: '1px solid #C9A84C', color: '#C9A84C' },
  button: { width: '100%', padding: '16px', background: 'linear-gradient(135deg, #C9A84C 0%, #E8C468 100%)', color: '#0d1117', fontSize: '1.1rem', fontWeight: '700', border: 'none', borderRadius: '12px', cursor: 'pointer' },
  buttonDisabled: { opacity: 0.5, cursor: 'not-allowed' },
  buttonSecondary: { padding: '12px 24px', background: 'rgba(255,255,255,0.1)', color: '#ffffff', fontSize: '1rem', fontWeight: '600', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer' },
  buttonRow: { display: 'flex', gap: '15px', marginTop: '30px' },
  error: { padding: '15px', background: 'rgba(240,98,146,0.1)', border: '1px solid rgba(240,98,146,0.3)', borderRadius: '8px', color: '#F06292', fontSize: '0.95rem', marginBottom: '20px' },
  successMsg: { padding: '15px', background: 'rgba(62,207,171,0.1)', border: '1px solid rgba(62,207,171,0.3)', borderRadius: '8px', color: '#3ECFAB', fontSize: '0.95rem', marginBottom: '20px' },
  loadingBanner: { padding: '20px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '12px', marginBottom: '30px', textAlign: 'center' },
  loadingSpinner: { width: '40px', height: '40px', border: '4px solid rgba(201,168,76,0.2)', borderTop: '4px solid #C9A84C', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 15px' },
  paymentGate: { maxWidth: '600px', margin: '30px auto', padding: '30px' },
  paymentHeader: { textAlign: 'center', marginBottom: '30px' },
  paymentTitle: { fontSize: '1.8rem', fontWeight: '700', color: '#ffffff', marginBottom: '10px' },
  paymentSubtitle: { fontSize: '1rem', color: 'rgba(255,255,255,0.7)' },
  pricingCard: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px', marginBottom: '20px' },
  priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  priceTotal: { borderBottom: 'none', marginTop: '10px', paddingTop: '15px', borderTop: '2px solid #C9A84C' },
  priceAmount: { fontWeight: '600', color: '#ffffff' },
  includesBox: { background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '12px', padding: '20px', marginBottom: '20px' },
  accountabilityBox: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px', marginBottom: '30px' },
  purchaseButton: { display: 'block', width: '100%', padding: '18px', background: 'linear-gradient(135deg, #C9A84C 0%, #E8C468 100%)', color: '#0d1117', fontSize: '1.2rem', fontWeight: '700', textAlign: 'center', textDecoration: 'none', borderRadius: '12px', border: 'none', cursor: 'pointer', marginBottom: '20px' },
  lockedOverlay: { textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', marginBottom: '30px' },
  ideasGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginBottom: '30px' },
  ideaCard: { background: 'rgba(255,255,255,0.03)', border: '2px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px', cursor: 'pointer' },
  ideaCardSelected: { border: '2px solid #C9A84C', background: 'rgba(201,168,76,0.1)' },
  ideaHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' },
  ideaTitle: { fontSize: '1.2rem', fontWeight: '700', color: '#ffffff' },
  fitBadge: { padding: '4px 10px', background: 'rgba(62,207,171,0.2)', border: '1px solid #3ECFAB', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600', color: '#3ECFAB' },
  ideaTagline: { fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', marginBottom: '15px', lineHeight: '1.5' },
  ideaEarnings: { display: 'flex', gap: '20px', marginBottom: '15px' },
  earningLabel: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '3px' },
  earningAmount: { fontSize: '1.1rem', fontWeight: '700', color: '#C9A84C' },
  quickStart: { fontSize: '0.9rem', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', marginBottom: '15px' },
  proscons: { fontSize: '0.9rem', lineHeight: '1.5' },
  pricingGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' },
  pricingCard2: { background: 'rgba(255,255,255,0.03)', border: '2px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px', cursor: 'pointer' },
  pricingCardSelected: { border: '2px solid #C9A84C', background: 'rgba(201,168,76,0.1)' },
  pricingName: { fontSize: '1.2rem', fontWeight: '700', color: '#C9A84C', marginBottom: '10px' },
  pricingPrice: { fontSize: '1.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '5px' },
  pricingMonthly: { fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '15px' },
  pricingRationale: { fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '15px' },
  pricingProscons: { fontSize: '0.9rem', lineHeight: '1.5' },
  tabs: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' },
  tab: { padding: '10px 16px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', borderBottom: '2px solid transparent' },
  tabActive: { color: '#C9A84C', borderBottom: '2px solid #C9A84C' },
  tabContent: { padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', marginBottom: '30px' },
  sectionTitle: { fontSize: '1.3rem', fontWeight: '700', color: '#C9A84C', marginBottom: '15px' },
  sectionText: { fontSize: '1rem', lineHeight: '1.6', marginBottom: '15px' },
  weekBlock: { padding: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', marginBottom: '20px' },
  weekTitle: { fontSize: '1.2rem', fontWeight: '700', color: '#C9A84C', marginBottom: '10px' },
  weekSummary: { fontSize: '1rem', color: 'rgba(255,255,255,0.8)', marginBottom: '15px' },
  stepBlock: { padding: '15px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', marginBottom: '12px' },
  stepWhat: { fontSize: '1.05rem', fontWeight: '700', color: '#ffffff', marginBottom: '10px' },
  stepSection: { marginBottom: '10px' },
  stepLabel: { fontSize: '0.85rem', fontWeight: '600', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px' },
  stepContent: { fontSize: '0.95rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.9)' },
  milestoneBlock: { display: 'flex', gap: '20px', padding: '15px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '8px', marginBottom: '12px' },
  milestoneDay: { fontSize: '1.1rem', fontWeight: '700', color: '#C9A84C', minWidth: '70px' },
  milestoneGoal: { fontSize: '1rem', lineHeight: '1.6' },
  accountabilityFooter: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '25px', marginBottom: '30px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001, padding: '20px' },
  modalBox: { background: '#0d1117', border: '1px solid rgba(201,168,76,0.4)', borderRadius: '16px', maxWidth: '520px', width: '100%', padding: '36px', maxHeight: '90vh', overflowY: 'auto' },
  chatbotModal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
  chatbotContainer: { background: '#0d1117', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '16px', maxWidth: '700px', width: '100%', maxHeight: '80vh', display: 'flex', flexDirection: 'column' },
  chatbotHeader: { padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  chatbotMessages: { flex: 1, overflowY: 'auto', padding: '20px' },
  chatbotInput: { padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '10px' },
  footer: { maxWidth: '900px', margin: '40px auto 0', padding: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' },
};

const ss = document.createElement('style');
ss.textContent = `@keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }`;
document.head.appendChild(ss);

// ── Referral codes ────────────────────────────────────────────────────────────
const referralCodes = {
  KELLICMQS:  { type: 'full',     price: 97.00, name: 'Kelli — Cash Machine' },
  LORAL2026:  { type: 'discount', price: 69.97, name: 'Loral Partnership'    },
  CMQS:       { type: 'free',     price: 0,     name: 'CMQS Access'          },
  CMQS2026:   { type: 'free',     price: 0,     name: 'CMQS Access'          },
  TESTACCESS: { type: 'free',     price: 0,     name: 'Test Access'          },
};

const TAG_MAP = { KELLICMQS: 'KelliCMQS', LORAL2026: 'LoralCMQS', CMQS: 'CMQSAccess', CMQS2026: 'CMQSAccess', TESTACCESS: 'CMQSAccess' };
const resolveTag = (code) => (code ? TAG_MAP[code.toUpperCase()] : null) || 'KelliCMQS';

const skillCategories = [
  { id: 'creative',   label: 'Creative & Arts',       emoji: '🎨' },
  { id: 'tech',       label: 'Tech & Digital',         emoji: '💻' },
  { id: 'trades',     label: 'Trades & Hands-On',      emoji: '🔧' },
  { id: 'teaching',   label: 'Teaching & Coaching',    emoji: '📚' },
  { id: 'sales',      label: 'Sales & Marketing',      emoji: '📈' },
  { id: 'care',       label: 'Care & Service',         emoji: '❤️'  },
  { id: 'finance',    label: 'Finance & Numbers',      emoji: '💰' },
  { id: 'health',     label: 'Health & Wellness',      emoji: '🏃' },
  { id: 'operations', label: 'Operations & Logistics', emoji: '📦' },
  { id: 'food',       label: 'Food & Hospitality',     emoji: '🍳' },
  { id: 'none',       label: 'None of these',          emoji: '🤷' },
];

const Chip = ({ label, selected, onClick }) => (
  <button onClick={onClick} style={{ ...styles.chip, ...(selected ? styles.chipSelected : {}) }}>{label}</button>
);

// ── Enrollment modal ──────────────────────────────────────────────────────────
const EnrollmentModal = ({ name, referralCode, selectedIdea, selectedPricing, plan, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [smsConsent, setSmsConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const enroll = async () => {
    if (!email.trim()) { setErr('Email is required'); return; }
    setLoading(true); setErr('');
    try {
      const res = await fetch('/api/cmqs-enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: email.trim(), phone: phone.trim(), smsConsent, referralCode: referralCode || '', selectedIdea, selectedPricing, plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Enrollment failed');
      onSuccess(email.trim(), data.tag);
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>🎯 Lock In Your Plan</h2>
        <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', marginBottom: '24px', lineHeight: '1.5' }}>
          Enter your details and we'll enroll you in <strong>Cash Machine QuickStart</strong> (by CKO Global LLC), send your 90-day plan to your inbox, and fire off your Week 1 welcome email right away.
        </p>

        {err && <div style={styles.error}>{err}</div>}

        <div style={styles.formGroup}>
          <label style={styles.label}>Email Address *</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" style={styles.input} />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Mobile Number (for SMS check-ins)</label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" style={styles.input} />
          <p style={styles.helperText}>Optional but recommended — this is how your 3×/week accountability check-ins are delivered.</p>
        </div>

        {/* ── SMS CONSENT — Complete CTA for A2P ── */}
        {phone.trim().length > 5 && (
          <div style={{ background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
            <p style={{ fontSize: '11px', fontFamily: '"IBM Plex Mono", monospace', color: '#C9A84C', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', marginTop: 0 }}>📱 SMS Consent Required</p>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', marginBottom: '10px' }}>
              <input
                type="checkbox"
                checked={smsConsent}
                onChange={e => setSmsConsent(e.target.checked)}
                style={{ marginTop: '3px', width: '18px', height: '18px', cursor: 'pointer', flexShrink: 0 }}
              />
              <span style={{ color: '#D1D5DB', fontSize: '12px', lineHeight: '1.65' }}>
                I consent to receive recurring SMS text messages from <strong style={{ color: '#E5E7EB' }}>CKO Global LLC</strong> (Cash Machine QuickStart) at the mobile number I provided, including accountability check-ins, progress reminders, and program notifications. <strong>Message frequency: up to 3 messages per week for 90 days.</strong> Message &amp; data rates may apply. Reply <strong>HELP</strong> for help. Reply <strong>STOP</strong> to unsubscribe at any time.
              </span>
            </label>
            <p style={{ fontSize: '11px', color: '#4B5563', marginBottom: 0, marginTop: 0, lineHeight: '1.5' }}>
              Consent is not required as a condition of purchase.{' '}
              <a href="/privacy" target="_blank" style={{ color: '#C9A84C', textDecoration: 'none' }}>Privacy Policy</a>
              {' '}·{' '}
              <a href="/terms" target="_blank" style={{ color: '#C9A84C', textDecoration: 'none' }}>Terms of Service</a>
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onClose} style={{ ...styles.buttonSecondary, flex: 1 }}>Cancel</button>
          <button
            onClick={enroll}
            disabled={loading || !email.trim() || (phone.trim().length > 5 && !smsConsent)}
            style={{ ...styles.button, flex: 2, width: 'auto', ...((loading || !email.trim() || (phone.trim().length > 5 && !smsConsent)) ? styles.buttonDisabled : {}) }}
          >
            {loading ? 'Enrolling...' : 'Send My Plan & Enroll →'}
          </button>
        </div>

        {phone.trim().length > 5 && !smsConsent && (
          <p style={{ fontSize: '11px', color: '#F06292', marginTop: '8px', textAlign: 'center' }}>
            Please check the SMS consent box above to continue with a phone number.
          </p>
        )}

        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '16px', textAlign: 'center', lineHeight: '1.5' }}>
          By enrolling you agree to our{' '}
          <a href="/privacy" target="_blank" style={{ color: '#C9A84C', textDecoration: 'none' }}>Privacy Policy</a>{' '}and{' '}
          <a href="/terms" target="_blank" style={{ color: '#C9A84C', textDecoration: 'none' }}>Terms of Service</a>.
        </p>
      </div>
    </div>
  );
};

// ── Payment gate ──────────────────────────────────────────────────────────────
const PaymentGate = ({ onReferralCodeChange }) => {
  const [referralCode, setReferralCode] = useState('');
  const [appliedCode, setAppliedCode]   = useState(null);
  const [codeError, setCodeError]       = useState('');

  const baseProgramPrice = 97.00;
  const processingFee    = appliedCode?.type === 'free' ? 0 : 2.97;
  const programPrice     = appliedCode ? appliedCode.price : baseProgramPrice;
  const totalPrice       = programPrice + processingFee;

  const applyCode = () => {
    const code = referralCode.trim().toUpperCase();
    if (!code) { setCodeError('Please enter a referral code'); return; }
    if (referralCodes[code]) { setAppliedCode(referralCodes[code]); setCodeError(''); if (onReferralCodeChange) onReferralCodeChange(code); }
    else { setCodeError('Invalid referral code'); setAppliedCode(null); }
  };
  const removeCode = () => { setReferralCode(''); setAppliedCode(null); setCodeError(''); if (onReferralCodeChange) onReferralCodeChange(''); };

  return (
    <div style={styles.paymentGate}>
      <div style={styles.paymentHeader}>
        <span style={{ fontSize: '2.5rem' }}>💳</span>
        <h2 style={styles.paymentTitle}>Ready to Start Your Cash Machine?</h2>
        <p style={styles.paymentSubtitle}>90 days of accountability, AI-powered ideas, and a personalized action plan</p>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '600', marginBottom: '10px', color: 'rgba(255,255,255,0.9)' }}>Have a referral code?</label>
        {!appliedCode ? (
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="text" value={referralCode} onChange={e => { setReferralCode(e.target.value.toUpperCase()); setCodeError(''); }} placeholder="Enter code" style={{ flex: 1, padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#ffffff', fontSize: '1rem', outline: 'none' }} />
            <button onClick={applyCode} style={{ padding: '12px 24px', background: 'rgba(201,168,76,0.2)', border: '1px solid #C9A84C', borderRadius: '8px', color: '#C9A84C', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>Apply</button>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(62,207,171,0.1)', border: '1px solid rgba(62,207,171,0.3)', borderRadius: '8px' }}>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#3ECFAB', marginBottom: '3px' }}>✓ {appliedCode.name}</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>Code: {referralCode}</div>
            </div>
            <button onClick={removeCode} style={{ padding: '6px 12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', cursor: 'pointer' }}>Remove</button>
          </div>
        )}
        {codeError && <p style={{ fontSize: '0.85rem', color: '#F06292', marginTop: '8px', marginBottom: 0 }}>{codeError}</p>}
      </div>

      <div style={styles.pricingCard}>
        <div style={styles.priceRow}>
          <span>Program Access (90 Days)</span>
          <div style={{ textAlign: 'right' }}>
            {appliedCode && programPrice < baseProgramPrice && <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'line-through', marginBottom: '3px' }}>${baseProgramPrice.toFixed(2)}</div>}
            <span style={styles.priceAmount}>${programPrice.toFixed(2)}</span>
          </div>
        </div>
        {processingFee > 0 && (
          <div style={styles.priceRow}><span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Processing Fee (Stripe)</span><span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>${processingFee.toFixed(2)}</span></div>
        )}
        <div style={{ ...styles.priceRow, ...styles.priceTotal }}>
          <span style={{ fontSize: '1.2rem', fontWeight: '700' }}>Total</span>
          <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#C9A84C' }}>${totalPrice.toFixed(2)}</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '10px', textAlign: 'center' }}>{appliedCode?.type === 'free' ? 'Free beta access' : 'One-time payment'} • 7-day money-back guarantee</p>
      </div>

      <div style={styles.includesBox}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', color: '#C9A84C' }}>✅ What's Included:</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {['🤖 AI-generated cash machine ideas based on your skills','📋 Personalized 90-day action plan with pricing strategy','📱 90 days of SMS accountability check-ins (up to 3× per week)','🎯 Weekly progress coaching (12 weeks of support)','💬 24/7 AI Coach chatbot (knows your plan, answers questions instantly)','🎉 Milestone celebrations at 30, 60, and 90 days','📧 Plan emailed directly to you — printable and saveable'].map((item, i) => (
            <li key={i} style={{ marginBottom: '8px', fontSize: '0.95rem' }}>{item}</li>
          ))}
        </ul>
      </div>

      <div style={styles.accountabilityBox}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>🤝 Why Accountability Matters</h3>
        <p style={{ fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>Think of this as your accountability partner — someone checking in three times a week to make sure you're actually doing the work. No judgment, no pressure, just: "Hey, where are you at?" Because ideas don't make money. Action does.</p>
        <p style={{ fontSize: '0.9rem', marginTop: '15px', fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }}>You've got this. We've got your back.</p>
      </div>

      <a href={appliedCode?.type === 'free' ? '/cmqs-opt-in?code=' + referralCode + '&type=free' : 'https://link.fastpaydirect.com/payment-link/69c56d24c6a0e600f4d05aed?code=' + referralCode}
        target={appliedCode?.type === 'free' ? '_self' : '_blank'} rel={appliedCode?.type === 'free' ? '' : 'noopener noreferrer'}
        style={{ ...styles.purchaseButton, background: appliedCode?.type === 'free' ? 'linear-gradient(135deg, #3ECFAB 0%, #60E8C0 100%)' : 'linear-gradient(135deg, #C9A84C 0%, #E8C468 100%)' }}>
        {appliedCode?.type === 'free' ? '🎉 Activate Free Beta Access' : `Purchase Now - $${totalPrice.toFixed(2)}`}
      </a>

      {/* SMS disclosure on payment page */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '14px 16px', marginBottom: '20px' }}>
        <p style={{ fontSize: '11px', color: '#6B7280', lineHeight: '1.6', margin: 0 }}>
          <strong style={{ color: '#9CA3AF' }}>📱 SMS Accountability Check-Ins:</strong> After enrollment, you'll be prompted to consent to SMS messages from <strong style={{ color: '#9CA3AF' }}>CKO Global LLC</strong> (Cash Machine QuickStart). Messages include check-ins, progress reminders, and program notifications. Frequency: up to 3 messages per week for 90 days. Msg &amp; data rates may apply. Reply STOP to cancel, HELP for info. Consent is not required for purchase.{' '}
          <a href="/privacy" target="_blank" style={{ color: '#C9A84C', textDecoration: 'none' }}>Privacy Policy</a>
          {' '}·{' '}
          <a href="/terms" target="_blank" style={{ color: '#C9A84C', textDecoration: 'none' }}>Terms of Service</a>
        </p>
      </div>

      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <p style={{ fontSize: '0.85rem' }}>
          <a href="/terms" target="_blank" style={{ color: '#C9A84C', textDecoration: 'none', marginRight: '15px' }}>Terms of Service</a>
          <a href="/privacy" target="_blank" style={{ color: '#C9A84C', textDecoration: 'none' }}>Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

// ── Chatbot ───────────────────────────────────────────────────────────────────
const ChatbotHelper = ({ plan, selectedIdea, selectedPricing, onClose }) => {
  const [messages, setMessages] = useState([{ role: 'assistant', content: `Hey! I'm your AI coach. I know your plan (${selectedIdea?.title}), your pricing (${selectedPricing?.name}), and your milestones. What do you need help with?` }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input };
    setMessages(p => [...p, userMsg]); setInput(''); setLoading(true);
    try {
      const prompt = messages.length === 1
        ? `You are an accountability coach for Cash Machine QuickStart.\nIdea: ${selectedIdea?.title} (${selectedIdea?.category})\nPricing: ${selectedPricing?.name} at ${selectedPricing?.price}\nPlan: ${JSON.stringify(plan).substring(0,300)}\nRole: short, direct, no excuses. Ask "What have you tried?" before giving solutions.\nQuestion: ${input}`
        : input;
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: messages.length === 1 ? [{ role: 'user', content: prompt }] : [...messages.slice(1), userMsg] }) });
      const data = await res.json();
      setMessages(p => [...p, { role: 'assistant', content: data.reply }]);
    } catch { setMessages(p => [...p, { role: 'assistant', content: 'Sorry, technical snag. Try again?' }]); }
    finally { setLoading(false); }
  };

  return (
    <div style={styles.chatbotModal} onClick={onClose}>
      <div style={styles.chatbotContainer} onClick={e => e.stopPropagation()}>
        <div style={styles.chatbotHeader}>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>💬 Your AI Coach</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '1.5rem', cursor: 'pointer', padding: 0, lineHeight: 1 }}>×</button>
        </div>
        <div style={styles.chatbotMessages}>
          {messages.map((msg, i) => (
            <div key={i} style={{ marginBottom: '15px', display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '80%', padding: '12px 16px', borderRadius: '12px', background: msg.role === 'user' ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${msg.role === 'user' ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.1)'}`, fontSize: '0.95rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>{msg.content}</div>
            </div>
          ))}
          {loading && <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '0.95rem', maxWidth: '80%' }}>Thinking...</div>}
        </div>
        <div style={styles.chatbotInput}>
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && send()} placeholder="Ask your question..." style={{ flex: 1, padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#ffffff', fontSize: '1rem', outline: 'none' }} />
          <button onClick={send} disabled={loading || !input.trim()} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #C9A84C 0%, #E8C468 100%)', color: '#0d1117', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', opacity: loading || !input.trim() ? 0.5 : 1 }}>Send</button>
        </div>
      </div>
    </div>
  );
};

// ── Month tab renderer ────────────────────────────────────────────────────────
const MonthTab = ({ m, emoji, label }) => {
  if (!m) return null;
  return (
    <div style={styles.tabContent}>
      <h3 style={styles.sectionTitle}>{emoji} {label}: {m.goal}</h3>
      <div style={{ padding: '15px 20px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '8px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '1.5rem' }}>💡</span>
        <div>
          <strong style={{ color: '#C9A84C', fontSize: '0.95rem' }}>Stuck or confused?</strong>
          <p style={{ margin: '3px 0 0', fontSize: '0.9rem', lineHeight: '1.5', color: 'rgba(255,255,255,0.8)' }}>Click <strong>"💬 Ask AI Coach"</strong> below. It knows your entire plan.</p>
        </div>
      </div>
      {m.weeks.map(week => (
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
      <div style={{ ...styles.weekBlock, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)' }}>
        <strong style={{ color: '#C9A84C' }}>📊 Track These Metrics:</strong> {m.metrics}
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
const CashMachineQuickStart = () => {
  const [phase, setPhase]                   = useState(1);
  const [hasPaid, setHasPaid]               = useState(false);
  const [loading, setLoading]               = useState(false);
  const [loadingMonth, setLoadingMonth]     = useState(null);
  const [error, setError]                   = useState('');
  const [chatbotOpen, setChatbotOpen]       = useState(false);
  const [enrollOpen, setEnrollOpen]         = useState(false);
  const [enrolledEmail, setEnrolledEmail]   = useState('');
  const [enrolledTag, setEnrolledTag]       = useState('');
  const [emailSending, setEmailSending]     = useState(false);
  const [emailSent, setEmailSent]           = useState(false);
  const [emailError, setEmailError]         = useState('');
  const [adminClicks, setAdminClicks]       = useState(0);
  const [activeReferralCode, setActiveReferralCode] = useState('');

  const [name, setName]                     = useState('');
  const [procrastination, setProcrastination] = useState('');
  const [goodAt, setGoodAt]                 = useState('');
  const [hardPass, setHardPass]             = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [specificIdea, setSpecificIdea]     = useState('');
  const [timeAvailable, setTimeAvailable]   = useState('');
  const [incomeGoal, setIncomeGoal]         = useState('');
  const [ideas, setIdeas]                   = useState([]);
  const [selectedIdea, setSelectedIdea]     = useState(null);
  const [expandedIdea, setExpandedIdea]     = useState(null);
  const [pricingOptions, setPricingOptions] = useState([]);
  const [selectedPricing, setSelectedPricing] = useState(null);
  const [plan, setPlan]                     = useState(null);
  const [activeTab, setActiveTab]           = useState('dualtrack');

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const saved = localStorage.getItem('cmqs_state');
    if (!saved) return;
    try {
      const d = JSON.parse(saved);
      setPhase(d.phase||1); setHasPaid(d.hasPaid||false); setName(d.name||'');
      setProcrastination(d.procrastination||''); setGoodAt(d.goodAt||''); setHardPass(d.hardPass||'');
      setSelectedSkills(d.selectedSkills||[]); setSpecificIdea(d.specificIdea||'');
      setTimeAvailable(d.timeAvailable||''); setIncomeGoal(d.incomeGoal||'');
      setIdeas(d.ideas||[]); setSelectedIdea(d.selectedIdea||null);
      setPricingOptions(d.pricingOptions||[]); setSelectedPricing(d.selectedPricing||null);
      setPlan(d.plan||null); setEnrolledEmail(d.enrolledEmail||''); setEnrolledTag(d.enrolledTag||'');
      setActiveReferralCode(d.activeReferralCode||'');
    } catch(e) { console.error(e); }
  }, []);

  useEffect(() => {
    localStorage.setItem('cmqs_state', JSON.stringify({
      phase, hasPaid, name, procrastination, goodAt, hardPass, selectedSkills, specificIdea,
      timeAvailable, incomeGoal, ideas, selectedIdea, pricingOptions, selectedPricing, plan,
      enrolledEmail, enrolledTag, activeReferralCode,
    }));
  }, [phase, hasPaid, name, procrastination, goodAt, hardPass, selectedSkills, specificIdea,
      timeAvailable, incomeGoal, ideas, selectedIdea, pricingOptions, selectedPricing, plan,
      enrolledEmail, enrolledTag, activeReferralCode]);

  const sendEmailPlan = async (emailAddr) => {
    setEmailSending(true); setEmailError(''); setEmailSent(false);
    try {
      const res = await fetch('/api/cmqs-email-plan', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: emailAddr, selectedIdea, selectedPricing, plan }),
      });
      if (res.ok) setEmailSent(true);
      else { const d = await res.json(); setEmailError(d.error || 'Email failed'); }
    } catch(e) { setEmailError('Could not send email. Please try again.'); }
    finally { setEmailSending(false); }
  };

  const handleEnrollSuccess = async (email, tag) => {
    setEnrolledEmail(email); setEnrolledTag(tag); setEnrollOpen(false);
    await sendEmailPlan(email);
  };

  const aiCall = async (content) => {
    const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{ role: 'user', content }] }) });
    const data = await res.json();
    return JSON.parse(data.reply.replace(/```json\n?|\n?```/g, '').trim());
  };

  const generateIdeas = async () => {
    setLoading(true); setError('');
    try {
      const parsed = await aiCall(`Generate 8 cash machine ideas using the DUAL-TRACK system for: ${name}
Procrastination: ${procrastination}
Good at: ${goodAt}
Hard pass: ${hardPass}
Skills: ${selectedSkills.join(', ')}
${specificIdea ? `Specific idea: ${specificIdea}` : ''}
Time: ${timeAvailable} | Goal: ${incomeGoal}

IDEAS 1-2: BRIDGE (category:"bridge") — gig platforms, start TODAY, cash THIS WEEK
IDEAS 3-7: BUSINESS (category:"business") — skills-based services, scalable, exit potential, first client in 7 days
IDEA 8: WILDCARD (category:"wildcard") — creative/unique

Return ONLY valid JSON array:
[{"title":"","tagline":"","category":"bridge|business|wildcard","monthOne":"$X-Y first week","yearTwo":"18-mo potential","quickStart":"Step 1...","pros":[],"cons":[],"fitScore":85}]
No preamble.`);
      setIdeas(parsed); setPhase(2);
    } catch(e) { setError('Failed to generate ideas. Please try again.'); }
    finally { setLoading(false); }
  };

  const generatePricing = async () => {
    setLoading(true); setError('');
    try {
      const parsed = await aiCall(`Generate 5 pricing strategies for: ${selectedIdea.title}
Context: ${selectedIdea.tagline} | Good at: ${goodAt} | Time: ${timeAvailable}
Return ONLY valid JSON array:
[{"name":"Starter|Sweet Spot|Premium|Tiered|Package Deal","price":"$X/hr","monthly":"$X-Y/mo","rationale":"","pros":[],"cons":[],"growthPath":"→ Raise to $X-Y after [milestone]"}]
No preamble.`);
      setPricingOptions(parsed); setPhase(3);
    } catch(e) { setError('Failed to generate pricing. Please try again.'); }
    finally { setLoading(false); }
  };

  const generate90DayPlan = async () => {
    setError(''); setPhase(4);
    setPlan({ dualTrack: null, pricing: null, month1: null, month2: null, month3: null, marketing: null, milestones: null });

    setLoadingMonth('base');
    try {
      const base = await aiCall(`Create the FOUNDATION for a 90-day plan for: ${selectedIdea.title}
Pricing: ${selectedPricing.name} at ${selectedPricing.price} | Person: ${name} | Good at: ${goodAt} | Time: ${timeAvailable} | Category: ${selectedIdea.category}
Return ONLY valid JSON:
{"dualTrack":{"trackA":{"name":"Gig Income (Survival)","weeks1_4":"","weeks5_8":"","weeks9_12":""},"trackB":{"name":"${selectedIdea.title}","weeks1_4":"","weeks5_8":"","weeks9_12":""},"crossover":""},"pricing":{"model":"${selectedPricing.name}","rate":"${selectedPricing.price}","breakdown":"","adjustments":""},"marketing":{"channels":[],"dmScript":"","socialPost":"","emailTemplate":"","objections":{"tooExpensive":"","needToThink":"","doItMyself":""},"budget":""},"milestones":[{"day":7,"goal":""},{"day":14,"goal":""},{"day":30,"goal":""},{"day":60,"goal":""},{"day":90,"goal":""}]}
No preamble.`);
      setPlan(prev => ({ ...prev, dualTrack: base.dualTrack, pricing: base.pricing, marketing: base.marketing, milestones: base.milestones }));
    } catch(e) { setError('Failed to generate plan foundation.'); setLoadingMonth(null); return; }

    const months = [
      { num: 1, weeks: '1-4', startWeek: 1, focus: 'Build foundation, land first client/gig, start gig income' },
      { num: 2, weeks: '5-8', startWeek: 5, focus: 'Scale business, reduce gig dependency' },
      { num: 3, weeks: '9-12', startWeek: 9, focus: 'Business income > gig income. Growth systems.' },
    ];
    for (const { num, weeks, startWeek, focus } of months) {
      setLoadingMonth(num);
      try {
        const m = await aiCall(`Generate MONTH ${num} (weeks ${weeks}) for: ${selectedIdea.title}
Person: ${name} | Good at: ${goodAt} | Hard pass: ${hardPass} | Category: ${selectedIdea.category}
FOCUS: ${focus}
Return ONLY valid JSON:
{"goal":"Month ${num} goal","weeks":[{"week":${startWeek},"summary":"","steps":[{"what":"","how":"2-3 sentences","why":"1-2 sentences","time":"X hrs","success":""}]},{"week":${startWeek+1},"summary":"","steps":[{...},{...},{...}]},{"week":${startWeek+2},"summary":"","steps":[{...},{...},{...}]},{"week":${startWeek+3},"summary":"","steps":[{...},{...},{...}]}],"metrics":""}
IMPORTANT: EXACTLY 3 steps per week. Concise how/why. No preamble.`);
        setPlan(prev => ({ ...prev, [`month${num}`]: m }));
      } catch(e) { setError(`Month ${num} generation failed.`); }
    }
    setLoadingMonth(null);
  };

  const downloadPlan = () => {
    const lines = [
      `CASH MACHINE QUICKSTART — 90-DAY ACTION PLAN`,
      `For: ${name} | Idea: ${selectedIdea?.title} | Pricing: ${selectedPricing?.name} at ${selectedPricing?.price}`,
      ``, `=== DUAL-TRACK ===`,
      `Track A: ${plan.dualTrack.trackA.name}`,
      `  Wks 1-4: ${plan.dualTrack.trackA.weeks1_4}`,
      `  Wks 5-8: ${plan.dualTrack.trackA.weeks5_8}`,
      `  Wks 9-12: ${plan.dualTrack.trackA.weeks9_12}`,
      `Track B: ${plan.dualTrack.trackB.name}`,
      `  Wks 1-4: ${plan.dualTrack.trackB.weeks1_4}`,
      `  Wks 5-8: ${plan.dualTrack.trackB.weeks5_8}`,
      `  Wks 9-12: ${plan.dualTrack.trackB.weeks9_12}`,
      `Crossover: ${plan.dualTrack.crossover}`, ``,
      ...[1,2,3].flatMap(n => {
        const m = plan[`month${n}`]; if (!m) return [];
        return [`=== MONTH ${n}: ${m.goal} ===`,
          ...m.weeks.flatMap(w => [`Week ${w.week}: ${w.summary}`, ...w.steps.map((s,i) => `  ${i+1}. ${s.what}\n     HOW: ${s.how}\n     WHY: ${s.why}\n     TIME: ${s.time}\n     SUCCESS: ${s.success}`)]),
          `Metrics: ${m.metrics}`, ``];
      }),
      `=== MILESTONES ===`,
      ...(plan.milestones?.map(m => `Day ${m.day}: ${m.goal}`) || []),
      ``, `Generated by Cash Machine QuickStart — CKO Global LLC`, `proactively-lazy.com | kelli@proactively-lazy.com`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${name.replace(/\s+/g,'_')}_90Day_Plan.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  // ── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div style={styles.container}>
      {/* god-mode bypass */}
      <div onClick={() => { const n = adminClicks+1; setAdminClicks(n); if (n>=5) setHasPaid(true); }} style={{ position:'fixed', bottom:'20px', right:'20px', width:'60px', height:'60px', opacity:0, zIndex:999, userSelect:'none' }} />

      {/* ── HEADER ── */}
      <div style={styles.header}>
        <div style={styles.brandLine}>Cash Machine QuickStart · Kelli Owens + Loral Langemeier</div>
        <h1 style={styles.hero}>You're broke.<br/>We get it. Let's <span style={{color:'#C9A84C'}}>fix that.</span></h1>
        <p style={styles.tagline}>Get cash this week doing gig work. Build a real business over 90 days. No MBA required. No trust fund needed.</p>

        {/* ── BUSINESS CONTEXT BLOCK — Required for A2P SMS Registration ── */}
        <div style={{ maxWidth: '700px', margin: '28px auto 0', padding: '22px 24px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', textAlign: 'left' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginBottom: '16px' }}>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <div style={{ fontSize: '10px', fontFamily: '"IBM Plex Mono", monospace', color: '#C9A84C', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '5px' }}>About This Program</div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.7', margin: 0 }}>
                <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Cash Machine QuickStart</strong> is a 90-day business coaching and accountability program offered by <strong style={{ color: 'rgba(255,255,255,0.85)' }}>CKO Global LLC</strong>, in partnership with Loral Langemeier / Live Out Loud. We help people identify skills-based income opportunities and build a cash-generating business from scratch.
              </p>
            </div>
            <div style={{ flex: '1', minWidth: '180px' }}>
              <div style={{ fontSize: '10px', fontFamily: '"IBM Plex Mono", monospace', color: '#C9A84C', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>What You Get</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.8' }}>
                📋 AI-generated 90-day action plan<br/>
                📱 SMS accountability check-ins (3×/week)<br/>
                💬 24/7 AI Coach access<br/>
                📧 Plan delivered to your inbox
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
            <span><strong style={{ color: 'rgba(255,255,255,0.55)' }}>Company:</strong> CKO Global LLC</span>
            <span><strong style={{ color: 'rgba(255,255,255,0.55)' }}>Operated by:</strong> Kelli Owens</span>
            <span>
              <strong style={{ color: 'rgba(255,255,255,0.55)' }}>Email:</strong>{' '}
              <a href="mailto:kelli@proactively-lazy.com" style={{ color: '#C9A84C', textDecoration: 'none' }}>kelli@proactively-lazy.com</a>
            </span>
            <span>
              <a href="https://proactively-lazy.com" target="_blank" rel="noopener noreferrer" style={{ color: '#C9A84C', textDecoration: 'none' }}>proactively-lazy.com</a>
            </span>
            <span>
              <a href="/privacy" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Privacy Policy</a>
              {' '}·{' '}
              <a href="/terms" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Terms of Service</a>
            </span>
          </div>
        </div>
      </div>

      <div style={styles.progressBar}>
        {[1,2,3,4].map(s => (
          <div key={s} style={{...styles.progressStep,...(phase>=s?styles.progressStepActive:{})}}>
            <div style={styles.progressCircle}>{s}</div>
            <span style={styles.progressLabel}>{s===1?'About You':s===2?'Your Ideas':s===3?'Price It':'90-Day Plan'}</span>
          </div>
        ))}
      </div>

      {/* ── PHASE 1 ── */}
      {phase===1 && (
        <div style={styles.phase}>
          <div style={styles.phaseHeader}>
            <span style={{fontSize:'2rem'}}>👋</span>
            <h2 style={styles.phaseTitle}>Let's find the money hiding in what you <span style={{color:'#C9A84C'}}>already know how to do.</span></h2>
            <p style={styles.phaseSubtitle}>You don't need a fancy degree or a trust fund. You need to get paid for stuff you can do right now.</p>
          </div>

          <div style={styles.formGroup}><label style={styles.label}>First name</label><input style={styles.input} placeholder="e.g., Alex" value={name} onChange={e=>setName(e.target.value)}/></div>
          <div style={styles.formGroup}><label style={styles.label}>What do you do when you're supposed to be doing something else?</label><textarea style={{...styles.input,minHeight:'100px'}} placeholder="e.g., I reorganize my closet by color when I should be studying." value={procrastination} onChange={e=>setProcrastination(e.target.value)}/><p style={styles.helperText}>Seriously — what's your favorite way to procrastinate? That's usually hiding money.</p></div>
          <div style={styles.formGroup}><label style={styles.label}>What do people bug you about because you're weirdly good at it?</label><textarea style={{...styles.input,minHeight:'100px'}} placeholder="e.g., Everyone asks me to fix their phone/computer." value={goodAt} onChange={e=>setGoodAt(e.target.value)}/><p style={styles.helperText}>Think about what feels easy to YOU but everyone else struggles with.</p></div>
          <div style={styles.formGroup}><label style={styles.label}>What's your hard pass? (Like, you'd fake sick to avoid it)</label><textarea style={{...styles.input,minHeight:'100px'}} placeholder="e.g., Anything with numbers. Or: Talking to strangers on the phone." value={hardPass} onChange={e=>setHardPass(e.target.value)}/><p style={styles.helperText}>Be honest. We won't suggest stuff that'll make you miserable.</p></div>
          <div style={styles.formGroup}><label style={styles.label}>Pick the skills that feel like you (check all that apply)</label><div style={styles.chipGrid}>{skillCategories.map(c=><Chip key={c.id} label={`${c.emoji} ${c.label}`} selected={selectedSkills.includes(c.id)} onClick={()=>setSelectedSkills(p=>p.includes(c.id)?p.filter(s=>s!==c.id):[...p,c.id])}/>)}</div></div>
          <div style={styles.formGroup}><label style={styles.label}>Already have a money idea rattling around in your head?</label><textarea style={{...styles.input,minHeight:'80px'}} placeholder="e.g., I want to help people declutter. Or: Honestly? No clue." value={specificIdea} onChange={e=>setSpecificIdea(e.target.value)}/><p style={styles.helperText}>(Optional) If not, no worries — that's literally what this tool is for.</p></div>
          <div style={styles.formGroup}><label style={styles.label}>Time you can commit per week</label><div style={styles.chipRow}>{['Under 5 hrs/wk','5-10 hrs/wk','10-20 hrs/wk','20+ hrs/wk'].map(o=><Chip key={o} label={o} selected={timeAvailable===o} onClick={()=>setTimeAvailable(o)}/>)}</div></div>
          <div style={styles.formGroup}><label style={styles.label}>Monthly income goal</label><div style={styles.chipRow}>{['$500/mo','$1,500/mo','$5,000/mo','$10,000+/mo'].map(o=><Chip key={o} label={o} selected={incomeGoal===o} onClick={()=>setIncomeGoal(o)}/>)}</div></div>

          {error && <div style={styles.error}>{error}</div>}
          <button style={{...styles.button,...(loading?styles.buttonDisabled:{})}} onClick={generateIdeas} disabled={loading||!name||!procrastination||!goodAt||!hardPass||selectedSkills.length===0||!timeAvailable||!incomeGoal}>
            {loading?'🤖 Generating Ideas...':'Show Me My Options →'}
          </button>
        </div>
      )}

      {/* ── PHASE 2 ── */}
      {phase===2 && (
        <div style={styles.phase}>
          <div style={styles.phaseHeader}>
            <span style={{fontSize:'2rem'}}>💡</span>
            <h2 style={styles.phaseTitle}>Here's Your <span style={{color:'#C9A84C'}}>Dual-Track System</span></h2>
            <p style={styles.phaseSubtitle}><strong style={{color:'#60B8E8'}}>Bridge Ideas</strong> = Cash this week.<br/><strong style={{color:'#C9A84C'}}>Business Ideas</strong> = What you're actually building.<br/>Pick ONE business idea. Use bridge ideas as needed.</p>
          </div>
          <div style={styles.ideasGrid}>
            {ideas.map((idea,idx)=>(
              <div key={idx} style={{...styles.ideaCard,...(selectedIdea?.title===idea.title?styles.ideaCardSelected:{})}} onClick={()=>{setSelectedIdea(idea);setExpandedIdea(idx);}}>
                <div style={styles.ideaHeader}>
                  <h3 style={styles.ideaTitle}>{idea.title}</h3>
                  <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                    <div style={{padding:'4px 10px',background:idea.category==='bridge'?'rgba(96,184,232,0.2)':idea.category==='wildcard'?'rgba(168,216,76,0.2)':'rgba(201,168,76,0.2)',border:`1px solid ${idea.category==='bridge'?'#60B8E8':idea.category==='wildcard'?'#A8D84C':'#C9A84C'}`,borderRadius:'6px',fontSize:'0.75rem',fontWeight:'600',color:idea.category==='bridge'?'#60B8E8':idea.category==='wildcard'?'#A8D84C':'#C9A84C',textTransform:'uppercase'}}>{idea.category||'business'}</div>
                    <div style={styles.fitBadge}>{idea.fitScore}% fit</div>
                  </div>
                </div>
                <p style={styles.ideaTagline}>{idea.tagline}</p>
                <div style={styles.ideaEarnings}>
                  <div><div style={styles.earningLabel}>First Week</div><div style={styles.earningAmount}>{idea.monthOne}</div></div>
                  <div><div style={styles.earningLabel}>18 Months</div><div style={styles.earningAmount}>{idea.yearTwo}</div></div>
                </div>
                <button onClick={e=>{e.stopPropagation();setExpandedIdea(expandedIdea===idx?null:idx);}} style={{width:'100%',padding:'10px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'6px',color:'rgba(255,255,255,0.7)',fontSize:'0.85rem',fontWeight:'600',cursor:'pointer',display:'flex',justifyContent:'center',gap:'5px',marginBottom:expandedIdea===idx?'15px':'0'}}>
                  {expandedIdea===idx?'▼ Hide Details':'► See Details'}
                </button>
                {expandedIdea===idx&&(
                  <>
                    <div style={styles.quickStart}><strong>Quick Start:</strong> {idea.quickStart}</div>
                    <div style={styles.proscons}>
                      <div><strong style={{color:'#3ECFAB'}}>Pros:</strong><ul style={{margin:'5px 0 0 20px',fontSize:'0.9rem'}}>{idea.pros.map((p,i)=><li key={i}>{p}</li>)}</ul></div>
                      <div><strong style={{color:'#F06292'}}>Cons:</strong><ul style={{margin:'5px 0 0 20px',fontSize:'0.9rem'}}>{idea.cons.map((c,i)=><li key={i}>{c}</li>)}</ul></div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          {error&&<div style={styles.error}>{error}</div>}
          <div style={styles.buttonRow}>
            <button style={styles.buttonSecondary} onClick={()=>setPhase(1)}>← Back</button>
            <button style={{...styles.button,...(loading||!selectedIdea?styles.buttonDisabled:{})}} onClick={()=>{if(!hasPaid&&adminClicks<5){setPhase(2.5);}else{generatePricing();}}} disabled={loading||!selectedIdea}>
              {loading?'🤖 Generating Pricing...':'Get Your Complete Plan →'}
            </button>
          </div>
        </div>
      )}

      {/* ── PHASE 2.5 ── */}
      {phase===2.5&&(
        <div style={styles.phase}>
          {(hasPaid||adminClicks>=5)?(
            (()=>{
              if(pricingOptions.length===0&&!loading) generatePricing();
              else if(pricingOptions.length>0) setPhase(3);
              return(<div style={{textAlign:'center',padding:'60px 20px'}}><div style={{fontSize:'3rem',marginBottom:'20px'}}>🎉</div><h2 style={{fontSize:'1.5rem',marginBottom:'15px'}}>Welcome back!</h2><p style={{color:'rgba(255,255,255,0.7)'}}>{loading?'Generating your pricing strategies...':'Loading your plan...'}</p></div>);
            })()
          ):(
            <>
              <div style={styles.phaseHeader}><span style={{fontSize:'2rem'}}>💡</span><h2 style={styles.phaseTitle}>You've Seen What's Possible.<br/><span style={{color:'#C9A84C'}}>Now Let's Build It.</span></h2><p style={styles.phaseSubtitle}>You picked: <strong>{selectedIdea?.title}</strong></p></div>
              <div style={styles.lockedOverlay}><div style={{fontSize:'3rem',marginBottom:'15px'}}>🎯</div><h3 style={{fontSize:'1.3rem',marginBottom:'10px'}}>Ready for Your Dual-Track 90-Day Plan?</h3><p style={{fontSize:'1rem',marginBottom:'30px',color:'rgba(255,255,255,0.7)'}}>Get the complete roadmap: pricing strategy, dual-track implementation, marketing plan, and 90 days of accountability coaching.</p></div>
              <PaymentGate onReferralCodeChange={setActiveReferralCode}/>
              <div style={styles.buttonRow}><button style={styles.buttonSecondary} onClick={()=>setPhase(2)}>← Back to Ideas</button></div>
            </>
          )}
        </div>
      )}

      {/* ── PHASE 3 ── */}
      {phase===3&&(hasPaid||adminClicks>=5)&&(
        <div style={styles.phase}>
          <div style={styles.phaseHeader}><span style={{fontSize:'2rem'}}>💰</span><h2 style={styles.phaseTitle}>Let's figure out <span style={{color:'#C9A84C'}}>what to charge</span> for "{selectedIdea?.title}"</h2><p style={styles.phaseSubtitle}>Pricing isn't random. Here are 5 strategies that actually work.</p></div>
          <div style={styles.pricingGrid}>
            {pricingOptions.map((o,idx)=>(
              <div key={idx} style={{...styles.pricingCard2,...(selectedPricing?.name===o.name?styles.pricingCardSelected:{})}} onClick={()=>setSelectedPricing(o)}>
                <h3 style={styles.pricingName}>{o.name}</h3>
                <div style={styles.pricingPrice}>{o.price}</div>
                <div style={styles.pricingMonthly}>{o.monthly}</div>
                <p style={styles.pricingRationale}>{o.rationale}</p>
                <div style={styles.pricingProscons}>
                  <div><strong style={{color:'#3ECFAB'}}>✓</strong> {o.pros.join(', ')}</div>
                  <div style={{marginTop:'5px'}}><strong style={{color:'#F06292'}}>⚠</strong> {o.cons.join(', ')}</div>
                  {o.growthPath&&<div style={{marginTop:'10px',padding:'8px',background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.3)',borderRadius:'6px',fontSize:'0.85rem',color:'#C9A84C',fontWeight:'600'}}>{o.growthPath}</div>}
                </div>
              </div>
            ))}
          </div>
          {error&&<div style={styles.error}>{error}</div>}
          <div style={styles.buttonRow}>
            <button style={styles.buttonSecondary} onClick={()=>setPhase(2)}>← Back</button>
            <button style={{...styles.button,...(loading||!selectedPricing?styles.buttonDisabled:{})}} onClick={generate90DayPlan} disabled={loading||!selectedPricing}>
              {loading?'🤖 Building Your Plan...':'Next: 90-Day Plan →'}
            </button>
          </div>
        </div>
      )}

      {/* ── PHASE 4 ── */}
      {phase===4&&(
        <div style={styles.phase}>
          {loadingMonth&&(
            <div style={styles.loadingBanner}>
              <div style={styles.loadingSpinner}/>
              <h3 style={{fontSize:'1.2rem',marginBottom:'10px'}}>
                {loadingMonth==='base'&&'🎯 Building Your Plan Foundation...'}
                {loadingMonth===1&&'🚀 Generating Month 1...'}
                {loadingMonth===2&&'📈 Generating Month 2...'}
                {loadingMonth===3&&'🎯 Generating Month 3...'}
              </h3>
              <p style={{fontSize:'0.95rem',color:'rgba(255,255,255,0.7)',margin:0}}>
                {loadingMonth==='base'&&'Setting up dual-track system, pricing, and marketing...'}
                {loadingMonth===1&&'Creating detailed week-by-week steps...'}
                {loadingMonth===2&&'You can start reading Month 1 while this loads!'}
                {loadingMonth===3&&'Almost done! Month 3 coming right up...'}
              </p>
            </div>
          )}

          {plan&&plan.dualTrack&&(
            <>
              <div style={styles.phaseHeader}>
                <span style={{fontSize:'2rem'}}>🎉</span>
                <h2 style={styles.phaseTitle}>Your <span style={{color:'#C9A84C'}}>90-Day Cash Machine Plan</span> is Ready</h2>
                <p style={styles.phaseSubtitle}>{name}, here's your roadmap. Follow this and you'll be making money in 30 days.</p>
              </div>

              {error&&<div style={styles.error}>{error}</div>}
              {enrolledEmail&&<div style={styles.successMsg}>✅ Enrolled! Plan sent to <strong>{enrolledEmail}</strong> · Tag: <strong>{enrolledTag}</strong></div>}
              {emailSent&&<div style={styles.successMsg}>📧 Plan sent to {enrolledEmail}! Check your inbox.</div>}
              {emailError&&<div style={styles.error}>{emailError}</div>}

              {/* Action bar */}
              <div style={{display:'flex',flexWrap:'wrap',gap:'12px',marginBottom:'30px',padding:'20px',background:'rgba(201,168,76,0.05)',border:'1px solid rgba(201,168,76,0.2)',borderRadius:'12px',alignItems:'center'}}>
                {!enrolledEmail?(
                  <button onClick={()=>setEnrollOpen(true)} style={{padding:'14px 24px',background:'linear-gradient(135deg, #C9A84C 0%, #E8C468 100%)',color:'#0d1117',fontSize:'1rem',fontWeight:'700',border:'none',borderRadius:'8px',cursor:'pointer'}}>
                    🎯 Enroll & Send My Plan
                  </button>
                ):(
                  <button onClick={()=>sendEmailPlan(enrolledEmail)} disabled={emailSending} style={{padding:'14px 24px',background:'rgba(62,207,171,0.2)',border:'1px solid #3ECFAB',color:'#3ECFAB',fontSize:'1rem',fontWeight:'700',borderRadius:'8px',cursor:emailSending?'not-allowed':'pointer',opacity:emailSending?0.6:1}}>
                    {emailSending?'Sending...':'📧 Re-send Plan to My Email'}
                  </button>
                )}
                <button onClick={()=>setChatbotOpen(true)} style={{padding:'14px 24px',background:'rgba(255,255,255,0.1)',color:'#ffffff',fontSize:'1rem',fontWeight:'700',border:'1px solid rgba(255,255,255,0.2)',borderRadius:'8px',cursor:'pointer'}}>💬 Ask AI Coach</button>
                <button onClick={downloadPlan} style={{padding:'14px 24px',background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.8)',fontSize:'1rem',fontWeight:'600',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'8px',cursor:'pointer'}}>📥 Download TXT</button>
              </div>

              {/* Tabs */}
              <div style={styles.tabs}>
                {[
                  {id:'dualtrack',label:'Dual-Track',emoji:'🎯'},
                  {id:'pricing',label:'Pricing',emoji:'💰'},
                  {id:'month1',label:'Month 1',emoji:'🚀',show:!!plan.month1},
                  {id:'month2',label:'Month 2',emoji:'📈',show:!!plan.month2},
                  {id:'month3',label:'Month 3',emoji:'🎯',show:!!plan.month3},
                  {id:'marketing',label:'Marketing',emoji:'📣',show:!!plan.marketing},
                  {id:'milestones',label:'Milestones',emoji:'🏆',show:!!plan.milestones},
                ].map(t=>{
                  if(t.show===false) return null;
                  return <button key={t.id} style={{...styles.tab,...(activeTab===t.id?styles.tabActive:{})}} onClick={()=>setActiveTab(t.id)}>{t.emoji} {t.label}</button>;
                })}
              </div>

              {activeTab==='dualtrack'&&plan.dualTrack&&(
                <div style={styles.tabContent}>
                  <h3 style={styles.sectionTitle}>🎯 The Dual-Track System</h3>
                  <p style={styles.sectionText}>Track A pays bills <strong>this week</strong>. Track B builds the business that'll replace your day job.</p>
                  <div style={{...styles.weekBlock,borderLeft:'4px solid #60B8E8'}}>
                    <h4 style={{fontSize:'1.1rem',fontWeight:'700',color:'#60B8E8',marginBottom:'10px'}}>Track A: {plan.dualTrack.trackA?.name}</h4>
                    <p style={{marginBottom:'8px'}}><strong>Weeks 1-4:</strong> {plan.dualTrack.trackA?.weeks1_4}</p>
                    <p style={{marginBottom:'8px'}}><strong>Weeks 5-8:</strong> {plan.dualTrack.trackA?.weeks5_8}</p>
                    <p style={{marginBottom:0}}><strong>Weeks 9-12:</strong> {plan.dualTrack.trackA?.weeks9_12}</p>
                  </div>
                  <div style={{...styles.weekBlock,borderLeft:'4px solid #C9A84C'}}>
                    <h4 style={{fontSize:'1.1rem',fontWeight:'700',color:'#C9A84C',marginBottom:'10px'}}>Track B: {plan.dualTrack.trackB?.name}</h4>
                    <p style={{marginBottom:'8px'}}><strong>Weeks 1-4:</strong> {plan.dualTrack.trackB?.weeks1_4}</p>
                    <p style={{marginBottom:'8px'}}><strong>Weeks 5-8:</strong> {plan.dualTrack.trackB?.weeks5_8}</p>
                    <p style={{marginBottom:0}}><strong>Weeks 9-12:</strong> {plan.dualTrack.trackB?.weeks9_12}</p>
                  </div>
                  <div style={{padding:'15px',background:'rgba(62,207,171,0.1)',border:'1px solid rgba(62,207,171,0.3)',borderRadius:'8px',marginTop:'15px'}}>
                    <strong style={{color:'#3ECFAB'}}>🎯 Crossover Point:</strong> {plan.dualTrack.crossover}
                  </div>
                </div>
              )}

              {activeTab==='pricing'&&plan.pricing&&(
                <div style={styles.tabContent}>
                  <h3 style={styles.sectionTitle}>💰 Your Pricing Strategy</h3>
                  <div style={styles.weekBlock}>
                    <p style={{marginBottom:'10px'}}><strong>Model:</strong> {plan.pricing.model}</p>
                    <p style={{marginBottom:'10px'}}><strong>Rate:</strong> {plan.pricing.rate}</p>
                    <p style={{marginBottom:'10px'}}><strong>Breakdown:</strong> {plan.pricing.breakdown}</p>
                    <p style={{marginBottom:0}}><strong>When to Adjust:</strong> {plan.pricing.adjustments}</p>
                  </div>
                </div>
              )}

              {activeTab==='month1'&&<MonthTab m={plan.month1} emoji="🚀" label="Month 1"/>}
              {activeTab==='month2'&&<MonthTab m={plan.month2} emoji="📈" label="Month 2"/>}
              {activeTab==='month3'&&<MonthTab m={plan.month3} emoji="🎯" label="Month 3"/>}

              {activeTab==='marketing'&&plan.marketing&&(
                <div style={styles.tabContent}>
                  <h3 style={styles.sectionTitle}>📣 Your Marketing Plan</h3>
                  <div style={styles.weekBlock}><strong>Channels:</strong><ul style={{marginTop:'10px',lineHeight:'1.8'}}>{plan.marketing.channels.map((c,i)=><li key={i}>{c}</li>)}</ul></div>
                  <div style={styles.weekBlock}><strong>DM Script:</strong><p style={{marginTop:'10px',lineHeight:'1.6',fontStyle:'italic'}}>"{plan.marketing.dmScript}"</p></div>
                  <div style={styles.weekBlock}><strong>Social Post:</strong><p style={{marginTop:'10px',lineHeight:'1.6',fontStyle:'italic'}}>"{plan.marketing.socialPost}"</p></div>
                  <div style={styles.weekBlock}><strong>Email Template:</strong><p style={{marginTop:'10px',lineHeight:'1.6',fontStyle:'italic'}}>"{plan.marketing.emailTemplate}"</p></div>
                  <div style={{...styles.weekBlock,background:'rgba(62,207,171,0.1)',border:'1px solid rgba(62,207,171,0.3)'}}>
                    <strong style={{color:'#3ECFAB'}}>💬 Objection Handling:</strong>
                    <ul style={{marginTop:'10px',lineHeight:'1.8'}}>
                      <li><strong>"Too expensive":</strong> {plan.marketing.objections?.tooExpensive}</li>
                      <li><strong>"Need to think":</strong> {plan.marketing.objections?.needToThink}</li>
                      <li><strong>"Can do it myself":</strong> {plan.marketing.objections?.doItMyself}</li>
                    </ul>
                  </div>
                  <div style={styles.weekBlock}><strong>Budget Strategy:</strong><p style={{marginTop:'10px',lineHeight:'1.6'}}>{plan.marketing.budget}</p></div>
                </div>
              )}

              {activeTab==='milestones'&&plan.milestones&&(
                <div style={styles.tabContent}>
                  <h3 style={styles.sectionTitle}>🏆 Your Milestones</h3>
                  <p style={styles.sectionText}>These are the checkpoints. Hit these, and you're on track.</p>
                  {plan.milestones.map((m,i)=>(
                    <div key={i} style={styles.milestoneBlock}><div style={styles.milestoneDay}>Day {m.day}</div><div style={styles.milestoneGoal}>{m.goal}</div></div>
                  ))}
                </div>
              )}

              <div style={styles.accountabilityFooter}>
                <h3 style={{fontSize:'1.2rem',marginBottom:'10px'}}>🤝 Your Accountability Check-Ins Start Now</h3>
                <p style={{fontSize:'0.95rem',lineHeight:'1.6',marginBottom:'15px'}}>You'll receive SMS check-ins 3× per week for the next 90 days. Every Monday, Wednesday, and Friday, we'll ask where you're at. Reply DONE, STUCK, or ALMOST. That's it.</p>
                <p style={{fontSize:'0.9rem',fontStyle:'italic',color:'rgba(255,255,255,0.7)',margin:'0 0 10px'}}>Reply STOP anytime to opt out. But we both know you're not going to do that. You've got this.</p>
                <p style={{fontSize:'0.8rem',color:'rgba(255,255,255,0.35)',margin:0}}>SMS messages sent by CKO Global LLC. Message & data rates may apply.</p>
              </div>

              <div style={{textAlign:'center',marginTop:'30px'}}>
                <button onClick={()=>{localStorage.removeItem('cmqs_state');window.location.reload();}} style={{padding:'12px 24px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:'8px',color:'rgba(255,255,255,0.6)',fontSize:'0.95rem',fontWeight:'600',cursor:'pointer'}}>
                  Start Over with New Idea
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {chatbotOpen&&<ChatbotHelper plan={plan} selectedIdea={selectedIdea} selectedPricing={selectedPricing} onClose={()=>setChatbotOpen(false)}/>}
      {enrollOpen&&<EnrollmentModal name={name} referralCode={activeReferralCode} selectedIdea={selectedIdea} selectedPricing={selectedPricing} plan={plan} onClose={()=>setEnrollOpen(false)} onSuccess={handleEnrollSuccess}/>}

      <div style={styles.footer}>
        <div style={{marginBottom:'12px'}}><strong style={{color:'#C9A84C'}}>Cash Machine QuickStart</strong></div>
        <div style={{marginBottom:'12px'}}>
          CKO Global LLC · Operated by Kelli Owens<br/>
          Email: <a href="mailto:kelli@proactively-lazy.com" style={{color:'#C9A84C',textDecoration:'none'}}>kelli@proactively-lazy.com</a><br/>
          Website: <a href="https://proactively-lazy.com" target="_blank" rel="noopener noreferrer" style={{color:'#C9A84C',textDecoration:'none'}}>proactively-lazy.com</a>
        </div>
        <div style={{fontSize:'0.8rem',color:'rgba(255,255,255,0.35)',marginBottom:'10px'}}>
          SMS messages sent by CKO Global LLC. Up to 3 messages per week. Msg &amp; data rates may apply. Reply STOP to cancel, HELP for info.
        </div>
        <div style={{fontSize:'0.85rem'}}>
          <a href="/terms" target="_blank" style={{color:'rgba(255,255,255,0.5)',textDecoration:'none',marginRight:'15px'}}>Terms of Service</a>
          <a href="/privacy" target="_blank" style={{color:'rgba(255,255,255,0.5)',textDecoration:'none'}}>Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default CashMachineQuickStart;
