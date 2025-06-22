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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Forgot Password</h2>

        {message && <div className="mb-4 text-green-600 text-center">{message}</div>}
        {serverError && <div className="mb-4 text-red-500 text-center">{serverError}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Your email address"
            className="w-full px-4 py-3 border rounded-md mb-6"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium rounded-md hover:from-indigo-600 hover:to-blue-600 transition"
          >
            {isSubmitting ? 'Sending…' : 'Send Reset Link'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Remembered your password?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-indigo-500 hover:underline focus:outline-none"
          >
            Go back to Login
          </button>
        </p>
      </div>
    </div>
  );
}
