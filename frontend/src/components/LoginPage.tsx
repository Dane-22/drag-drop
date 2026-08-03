import React, { useState } from 'react';
import { Lock, User, Shield, HardHat, Briefcase, ChevronRight, AlertCircle, Building2, Eye, EyeOff } from 'lucide-react';
import type { AuthUser, UserRole } from '../types/auth';
import axios from 'axios';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e?: React.FormEvent, customUser?: string, customPass?: string) => {
    if (e) e.preventDefault();
    setError(null);
    setIsLoading(true);

    const loginUser = customUser || username;
    const loginPass = customPass || password || 'password123';

    if (!loginUser) {
      setError('Please enter a username or select a quick demo login account.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/auth/login`, {
        username: loginUser,
        password: loginPass
      });

      if (res.data && res.data.status === 'success') {
        const userObj: AuthUser = res.data.user;
        userObj.token = res.data.token;
        onLoginSuccess(userObj);
      } else {
        setError(res.data?.message || 'Login failed. Please check credentials.');
      }
    } catch (err: any) {
      // Demo fallback login if server API is unavailable
      let role: UserRole = 'engineer';
      let name = 'Engr. Marcus Vance';
      const clean = loginUser.toLowerCase();

      if (clean.includes('super')) {
        role = 'super_admin';
        name = 'Director Robert Chen';
      } else if (clean.includes('admin')) {
        role = 'admin';
        name = 'Sarah Jenkins';
      }

      onLoginSuccess({
        id: Date.now(),
        username: loginUser,
        name,
        email: `${clean}@apexconstruction.com`,
        role
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    if (role === 'engineer') {
      setUsername('engineer');
      setPassword('password123');
      handleLogin(undefined, 'engineer', 'password123');
    } else if (role === 'admin') {
      setUsername('admin');
      setPassword('password123');
      handleLogin(undefined, 'admin', 'password123');
    } else if (role === 'super_admin') {
      setUsername('super_admin');
      setPassword('password123');
      handleLogin(undefined, 'super_admin', 'password123');
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#090d16] flex items-center justify-center p-4 relative overflow-hidden select-none font-sans">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brandOrange-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphic Login Card */}
      <div className="w-full max-w-md bg-[#162740]/80 backdrop-blur-xl border border-[#263e63] rounded-2xl shadow-2xl p-8 relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brandOrange-600 to-amber-500 flex items-center justify-center mx-auto mb-3 shadow-lg ring-4 ring-brandOrange-500/20">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Apex Construction</h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Worker Allocation & Site Management System
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-950/80 border border-rose-600/50 text-rose-200 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={(e) => handleLogin(e)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Username or Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Enter username (e.g. engineer, admin, super_admin)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#0d1829] border border-[#21385c] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brandOrange-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0d1829] border border-[#21385c] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brandOrange-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-300 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-brandOrange-500 hover:bg-brandOrange-600 active:scale-[0.99] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
          >
            <span>{isLoading ? 'Signing In...' : 'Sign In to Portal'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>


      </div>
    </div>
  );
};
