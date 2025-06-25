// src/ForgotPassword.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import axios from 'axios';
import './components/AuthPages.css';

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Back to landing page button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors z-10"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Home</span>
      </button>

      {/* Main forgot password card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo and header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-4 shadow-lg">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-600">Enter your email to receive reset instructions</p>
        </div>

        {/* Forgot password form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>{message}</span>
            </div>
          )}
          
          {serverError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm auth-input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <Send className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Back to login link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Remembered your password?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
              >
                Go back to Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
