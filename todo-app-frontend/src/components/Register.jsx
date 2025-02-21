import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axios-config';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await axios.post('/api/auth/register', { username, password });
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left Side - Register */}
      <div className="w-1/2 flex flex-col items-center justify-center p-12 bg-gray-200">
        <div className="w-full max-w-md space-y-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-12 text-center">Sign Up</h1>
          <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                    placeholder="Email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-white border border-gray-200 rounded-xl text-gray-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out hover:bg-gray-50"
              >
                Sign Up
              </button>
            </form>
          </div>
          <Link
            to="/login"
            className="block w-full py-3 px-4 bg-white border border-gray-200 rounded-xl text-center text-gray-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out hover:bg-gray-50 mt-4"
          >
            Back to Login
          </Link>
        </div>
      </div>
      
      {/* Right Side - Preview */}
      <div className="w-1/2 bg-white p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">To-Do List</h2>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center shadow-sm"
              />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <div className="w-32 h-8 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

