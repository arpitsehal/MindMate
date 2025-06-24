// src/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
  {/* Parallax Gradient Background */}
  <div
    className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-600 via-blue-500 to-purple-600 animate-pulse opacity-60"
    style={{
      backgroundSize: '400% 400%',
      animation: 'gradient 15s ease infinite'
    }}
  />

  {/* Glassmorphic Registration Form */}
  <form
    onSubmit={handleSubmit}
    className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/30 p-8 rounded-2xl shadow-2xl"
  >
    <h2 className="text-3xl font-bold text-white text-center mb-6 drop-shadow-md">Create Account</h2>

    {error && (
      <div className="mb-4 p-3 bg-red-200/60 text-red-800 rounded-md shadow">
        {error}
      </div>
    )}

    <input
      value={first}
      onChange={e => setFirst(e.target.value)}
      required
      placeholder="First Name"
      disabled={loading}
      className="w-full px-4 py-3 mb-4 rounded-lg border border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400"
    />
    <input
      value={last}
      onChange={e => setLast(e.target.value)}
      required
      placeholder="Last Name"
      disabled={loading}
      className="w-full px-4 py-3 mb-4 rounded-lg border border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400"
    />
    <input
      value={email}
      onChange={e => setEmail(e.target.value)}
      type="email"
      required
      placeholder="Email"
      disabled={loading}
      className="w-full px-4 py-3 mb-4 rounded-lg border border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400"
    />
    <input
      value={password}
      onChange={e => setPassword(e.target.value)}
      type="password"
      required
      placeholder="Password"
      disabled={loading}
      className="w-full px-4 py-3 mb-6 rounded-lg border border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400"
    />

    <button
      type="submit"
      disabled={loading}
      className="w-full py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold shadow-xl transition disabled:opacity-50"
    >
      {loading ? 'Creating Account...' : 'Register'}
    </button>

    <p className="mt-4 text-center text-white/80 text-sm">
      Already have an account?{' '}
      <button
        type="button"
        onClick={() => navigate('/login')}
        className="text-indigo-300 hover:underline"
      >
        Login
      </button>
    </p>
  </form>

  {/* Background animation */}
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
