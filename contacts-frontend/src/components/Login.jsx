import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/contacts');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6] p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] p-10 border border-gray-100">
        <div className="mb-10 text-center">
          <div className="w-12 h-12 bg-black rounded-xl mx-auto mb-6 flex items-center justify-center">
            <span className="text-white font-bold text-xl">i</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-500 text-sm">Please enter your details to sign in</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all text-sm font-medium"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all text-sm font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white font-semibold py-3.5 rounded-xl hover:bg-gray-900 transform transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
          >
            Sign in
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>


      </div>
    </div>
  );
};

export default Login;
