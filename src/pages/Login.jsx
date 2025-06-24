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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
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
          className="w-full px-4 py-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          disabled={loading}
          className="w-full px-4 py-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100"
        />

        <div className="flex items-center justify-between mb-6">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              disabled={loading}
              className="form-checkbox h-4 w-4 text-indigo-600"
            />
            <span className="ml-2 text-gray-600">Remember me</span>
          </label>

          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            disabled={loading}
            className="text-sm text-indigo-500 hover:underline disabled:opacity-50"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium rounded-md hover:from-indigo-600 hover:to-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/register')}
            disabled={loading}
            className="text-indigo-500 hover:underline disabled:opacity-50"
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
}
