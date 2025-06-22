// src/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    // Placeholder for registration API
    // On success, redirect to login
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Create Account</h2>

        <input value={first} onChange={e => setFirst(e.target.value)} required placeholder="First Name"
          className="w-full px-4 py-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        <input value={last} onChange={e => setLast(e.target.value)} required placeholder="Last Name"
          className="w-full px-4 py-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="Email"
          className="w-full px-4 py-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" required placeholder="Password"
          className="w-full px-4 py-3 border rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-400" />

        <button type="submit"
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-md hover:from-indigo-600 hover:to-blue-600 transition">
          Register
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button type="button"
            onClick={() => navigate('/login')}
            className="text-indigo-500 hover:underline focus:outline-none">
            Login
          </button>
        </p>
      </form>
    </div>
  );
}
