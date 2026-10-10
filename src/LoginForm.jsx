import React, { useState } from 'react';

// Buyer login: emails a one-tap login link to the address used at checkout.
export function LoginForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'sending', message: '' });
    try {
      const res = await fetch('/api/cmqs-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Try again.');
      setStatus({ state: 'sent', message: data.message });
    } catch (err) {
      setStatus({ state: 'error', message: err.message });
    }
  };

  if (status.state === 'sent') {
    return (
      <div style={{ padding: '16px', background: 'rgba(62,207,171,0.1)', border: '1px solid rgba(62,207,171,0.3)', borderRadius: '10px', color: '#3ECFAB', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
        📧 {status.message}
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ marginBottom: '24px', textAlign: 'left' }}>
      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: 'rgba(255,255,255,0.9)', marginBottom: '8px' }}>Already purchased? Log in with your checkout email</label>
      <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com"
        style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', fontSize: '1rem', marginBottom: '10px', outline: 'none' }} />
      <button type="submit" disabled={status.state === 'sending'}
        style={{ width: '100%', padding: '12px', background: '#D8FF2C', color: '#06091A', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '1rem', cursor: status.state === 'sending' ? 'not-allowed' : 'pointer', opacity: status.state === 'sending' ? 0.6 : 1 }}>
        {status.state === 'sending' ? 'Checking your purchase...' : 'Email me my login link'}
      </button>
      {status.state === 'error' && <p style={{ color: '#F06292', fontSize: '0.85rem', margin: '8px 0 0' }}>{status.message}</p>}
    </form>
  );
}
