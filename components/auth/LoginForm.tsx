import React, { useState } from 'react';
import { Play, Mail, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      login(email);
      setIsLoading(false);
      if (onLogin) onLogin();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Play className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dubai AI Rentals
          </h1>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <Sparkles size={16} className="text-indigo-600" />
            Video-first property discovery powered by AI
          </p>
        </div>

        {/* Features */}
        <div className="mb-8 space-y-3">
          <div className="flex items-center text-sm text-gray-700">
            <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
            <span>Chat with AI about any property</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
            <span>Browse Dubai's finest rentals</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
            <span>Get instant property insights</span>
          </div>
        </div>

        {/* Login Form */}
        <div onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                required
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading || !email}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Continue with Email'
            )}
          </button>
        </div>

        {/* Demo Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            🎭 Demo mode - Use any email to continue
          </p>
        </div>

        {/* Quick Access */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center mb-3">Quick access for demo:</p>
          <div className="flex gap-2">
            <button
              onClick={() => setEmail('demo@dubai.com')}
              className="flex-1 text-xs py-2 px-3 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
            >
              Demo User
            </button>
            <button
              onClick={() => setEmail('expat@test.com')}
              className="flex-1 text-xs py-2 px-3 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
            >
              Expat User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;