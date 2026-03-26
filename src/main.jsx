import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CashMachineQuickStart from './CashMachineQuickStart';
import StuckChat from './StuckChat';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CashMachineQuickStart />} />
        <Route path="/stuck-chat" element={<StuckChat />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
