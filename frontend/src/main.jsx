import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import './index.css';
import App from './App.jsx';
import Home from './pages/Home.jsx';
import Upload from './pages/Upload.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Pricing from './pages/Pricing.jsx';
import Login from './pages/Login.jsx';
import AnalysisDetail from './pages/AnalysisDetail.jsx';
import Templates from './pages/Templates.jsx';

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({ dsn: import.meta.env.VITE_SENTRY_DSN, tracesSampleRate: 0.1 });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}> 
          <Route index element={<Home />} />
          <Route path="upload" element={<Upload />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analysis/:id" element={<AnalysisDetail />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="templates" element={<Templates />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
