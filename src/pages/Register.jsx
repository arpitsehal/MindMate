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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Create Account</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <input 
          value={first} 
          onChange={e => setFirst(e.target.value)} 
          required 
          placeholder="First Name"
          disabled={loading}
          className="w-full px-4 py-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100" 
        />
        <input 
          value={last} 
          onChange={e => setLast(e.target.value)} 
          required 
          placeholder="Last Name"
          disabled={loading}
          className="w-full px-4 py-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100" 
        />
        <input 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          type="email" 
          required 
          placeholder="Email"
          disabled={loading}
          className="w-full px-4 py-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100" 
        />
        <input 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          type="password" 
          required 
          placeholder="Password"
          disabled={loading}
          className="w-full px-4 py-3 border rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100" 
        />

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-md hover:from-indigo-600 hover:to-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? 'Creating Account...' : 'Register'}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button 
            type="button"
            onClick={() => navigate('/login')}
            disabled={loading}
            className="text-indigo-500 hover:underline focus:outline-none disabled:opacity-50">
            Login
          </button>
        </p>
      </form>
    </div>
  );
}
