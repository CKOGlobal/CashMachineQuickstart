import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { captureTokenFromUrl, verifyAccess } from './access';
import { LockedScreen } from './LockedScreen';

// /access?t=<token> — the personal link emailed/texted after purchase.
export default function AccessLanding() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    const token = captureTokenFromUrl();
    verifyAccess(token).then(r => {
      if (r.valid) navigate('/cmqs-opt-in', { replace: true });
      else setStatus(r.error ? 'error' : 'invalid');
    });
  }, [navigate]);

  if (status === 'checking') {
    return (
      <div style={{ minHeight: '100vh', background: '#06091A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        Unlocking your program...
      </div>
    );
  }
  return <LockedScreen reason={status} />;
}
