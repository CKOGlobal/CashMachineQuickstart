import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CashMachineQuickStart from './CashMachineQuickStart';
import StuckChat from './StuckChat';
import CMQSOptIn from './CMQSOptIn';
import Privacy from './Privacy';
import Terms from './Terms';
import AccessLanding from './AccessLanding';
import { LockedScreen } from './LockedScreen';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CashMachineQuickStart />} />
        <Route path="/stuck-chat" element={<StuckChat />} />
        <Route path="/cmqs-opt-in" element={<CMQSOptIn />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/access" element={<AccessLanding />} />
        <Route path="/login" element={<LockedScreen />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
