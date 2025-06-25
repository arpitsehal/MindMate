import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import './index.css';
import App from '../src/App.js'; // your dashboard
import Login from '../src/pages/Login.jsx';
import Register from '../src/pages/Register.jsx';
import ForgotPassword from './ForgotPassword.jsx';
import MindMateLanding from './components/MindMateLanding.jsx';

// PrivateRoute component
function PrivateRoute({ children }) {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  return token ? children : <Navigate to="/login" replace />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Root shows the landing page */}
        <Route path="/" element={<MindMateLanding />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected dashboard route */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <App />
          </PrivateRoute>
        } />

        {/* Catch-all: redirect invalid URLs to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
