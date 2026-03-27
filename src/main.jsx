import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CashMachineQuickstart from './CashMachineQuickstart';
import StuckChat from './StuckChat';
import CMQSOptIn from './CMQSOptIn';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CashMachineQuickstart />} />
        <Route path="/stuck-chat" element={<StuckChat />} />
        <Route path="/cmqs-opt-in" element={<CMQSOptIn />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
