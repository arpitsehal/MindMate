// src/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, User, Mail, Lock, Eye, EyeOff, ArrowLeft, Users } from 'lucide-react';
import { authAPI } from '../services/api';
import '../components/AuthPages.css';

export default function Register() {
  const navigate = useNavigate();
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userData = {
        first_name: first,
        last_name: last,
        email,
        password
      };

      const response = await authAPI.register(userData);
      
      // Store token and user data
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      // Show success message and redirect to login
      alert('Registration successful! Please login with your credentials.');
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
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

      {/* Main registration card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo and header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-4 shadow-lg">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join MindMate</h1>
          <p className="text-gray-600">Start your mental wellness journey today</p>
        </div>

        {/* Registration form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Name fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    value={first}
                    onChange={e => setFirst(e.target.value)}
                    required
                    placeholder="First name"
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm auth-input"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    value={last}
                    onChange={e => setLast(e.target.value)}
                    required
                    placeholder="Last name"
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm auth-input"
                  />
                </div>
              </div>
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  type="email"
                  required
                  placeholder="Enter your email"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm auth-input"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Create a password"
                  disabled={loading}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm auth-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <Users className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
