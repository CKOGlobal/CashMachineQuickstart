import React from 'react';
import { PURCHASE_URL } from './access';

// Shown on paid pages when the browser has no valid access link.
export function LockedScreen({ reason }) {
  const title = reason === 'invalid' ? 'That access link isn’t valid' : reason === 'error' ? 'We couldn’t check your access' : 'Your access link unlocks this page';
  const body = reason === 'invalid'
    ? 'It may have expired or been copied incorrectly. Open the link from your enrollment email or text again.'
    : reason === 'error'
      ? 'Something went wrong on our side. Refresh the page in a minute.'
      : 'Just paid? Your personal access link is on its way to your email and phone — usually within a minute or two. Open it on any device to build your plan.';
  return (
    <div style={{ minHeight: '100vh', background: '#06091A', color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ maxWidth: '520px', width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '36px 28px', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔑</div>
        <div style={{ fontSize: '0.8rem', fontFamily: '"IBM Plex Mono", monospace', color: '#D8FF2C', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>Cash Machine QuickStart</div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: '700', margin: '0 0 12px' }}>{title}</h1>
        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.75)', lineHeight: '1.6', margin: '0 0 24px' }}>{body}</p>
        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6', margin: '0 0 24px' }}>
          Can&rsquo;t find it? Check spam, or email <a href="mailto:kelli@proactively-lazy.com" style={{ color: '#D8FF2C' }}>kelli@proactively-lazy.com</a>.
        </p>
        <a href={PURCHASE_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '12px 22px', background: 'linear-gradient(135deg, #FF5035 0%, #FF7A1A 100%)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', marginRight: '10px', marginBottom: '10px' }}>Enroll — $97</a>
        <a href="/" style={{ display: 'inline-block', padding: '12px 22px', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>Back to start</a>
      </div>
    </div>
  );
}
