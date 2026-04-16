import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, ArrowLeft, ShieldCheck, Zap, Globe } from 'lucide-react';
import { GitHubIcon } from '../components/common/Icons';

function Login() {
  const handleGitHubLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/github`;
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />

      <div className="relative w-full max-w-md animate-fade-in">
        <Link 
          to="/welcome" 
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Homepage
        </Link>

        {/* Brand Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/20">
            <Code2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Access Codion</h1>
            <p className="text-sm text-slate-500">Sign in to begin your review session</p>
          </div>
        </div>

        {/* Glassmorphism Card */}
        <div className="glass-card p-8 shadow-2xl">
          <div className="space-y-6">
            <button
              onClick={handleGitHubLogin}
              className="w-full btn-premium py-4 flex items-center justify-center gap-3 text-lg"
            >
              <GitHubIcon className="w-6 h-6" />
              Continue with GitHub
            </button>

            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-[10px] font-bold tracking-widest text-slate-600 uppercase">Enterprise Grade Security</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { icon: ShieldCheck, label: 'Secure OAuth Handshake', color: 'text-emerald-400' },
                { icon: Zap, label: 'Instant Profile Sync', color: 'text-amber-400' },
                { icon: Globe, label: 'Global Availability', color: 'text-indigo-400' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <span className="text-sm text-slate-400 font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center mt-10 text-xs text-slate-600 leading-relaxed max-w-[280px] mx-auto">
          By continuing, you agree to our 
          <a href="#" className="text-slate-400 hover:text-white mx-1">Terms of Service</a> 
          and 
          <a href="#" className="text-slate-400 hover:text-white mx-1">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}

export default Login;