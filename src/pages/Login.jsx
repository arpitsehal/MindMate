import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Optional: Capture intended destination (if you're using protected routes)
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login({ email, password });
      
      // Store token based on remember me preference
      if (remember) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      } else {
        sessionStorage.setItem('authToken', response.token);
        sessionStorage.setItem('user', JSON.stringify(response.user));
      }

      // Navigate to Dashboard
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="relative min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
  {/* Parallax Gradient Background */}
  <div
    className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-700 via-blue-500 to-purple-500 animate-pulse opacity-60"
    style={{
      backgroundSize: '400% 400%',
      animation: 'gradient 15s ease infinite'
    }}
  />

  {/* Glassy Login Card */}
  <form
    onSubmit={handleSubmit}
    className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/30 p-8 rounded-2xl shadow-2xl"
  >
    <h2 className="text-3xl font-bold text-white text-center mb-6 drop-shadow-md">Sign In</h2>

    {error && (
      <div className="mb-4 p-3 bg-red-200/60 text-red-800 rounded-md shadow">
        {error}
      </div>
    )}

    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={e => setEmail(e.target.value)}
      required
      disabled={loading}
      className="w-full px-4 py-3 mb-4 rounded-lg border border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400"
    />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={e => setPassword(e.target.value)}
      required
      disabled={loading}
      className="w-full px-4 py-3 mb-4 rounded-lg border border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400"
    />

    <div className="flex justify-between items-center mb-4 text-sm text-white/80">
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          checked={remember}
          onChange={e => setRemember(e.target.checked)}
          disabled={loading}
          className="form-checkbox text-indigo-500 bg-transparent"
        />
        <span className="ml-2">Remember me</span>
      </label>
      <button
        type="button"
        onClick={() => navigate('/forgot-password')}
        className="hover:underline text-indigo-300"
      >
        Forgot password?
      </button>
    </div>

    <button
      type="submit"
      disabled={loading}
      className="w-full py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold shadow-xl transition disabled:opacity-50"
    >
      {loading ? 'Signing in...' : 'Login'}
    </button>

    <p className="mt-4 text-center text-white/80">
      Don’t have an account?{' '}
      <button
        type="button"
        onClick={() => navigate('/register')}
        className="text-indigo-300 hover:underline"
      >
        Sign Up
      </button>
    </p>
  </form>

  {/* Animated background styling */}
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
