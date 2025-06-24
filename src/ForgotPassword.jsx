// src/ForgotPassword.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      await axios.post('/api/forgot-password', { email });
      setMessage('✅ Check your inbox for reset instructions.');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to send reset link.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
  {/* Parallax Gradient Background */}
  <div
    className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-600 via-blue-500 to-purple-600 animate-pulse opacity-60"
    style={{
      backgroundSize: '400% 400%',
      animation: 'gradient 15s ease infinite'
    }}
  />

  {/* Glassmorphism Forgot Password Card */}
  <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/30 p-8 rounded-2xl shadow-2xl">
    <h2 className="text-3xl font-bold text-white text-center mb-6 drop-shadow-md">
      Forgot Password
    </h2>

    {message && (
      <div className="mb-4 text-green-400 text-center font-medium">{message}</div>
    )}
    {serverError && (
      <div className="mb-4 text-red-400 text-center font-medium">{serverError}</div>
    )}

    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Your email address"
        className="w-full px-4 py-3 mb-6 rounded-lg border border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold shadow-xl transition disabled:opacity-50"
      >
        {isSubmitting ? 'Sending…' : 'Send Reset Link'}
      </button>
    </form>

    <p className="mt-4 text-center text-sm text-white/80">
      Remembered your password?{' '}
      <button
        onClick={() => navigate('/login')}
        className="text-indigo-300 hover:underline"
      >
        Go back to Login
      </button>
    </p>
  </div>

  {/* Animated Background Styling */}
  <style>{`
    @keyframes gradient {
      0% { background-position: 0% 50% }
      50% { background-position: 100% 50% }
      100% { background-position: 0% 50% }
    }
  `}</style>
</div>

  );
}
