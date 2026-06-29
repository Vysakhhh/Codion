import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, ArrowLeft, ShieldCheck, Zap, Globe } from 'lucide-react';
import { GitHubIcon } from '../components/common/Icons';

function Login() {
  const handleGitHubLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/github`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-6">

      <div className="w-full max-w-sm">
        <Link
          to="/welcome"
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-[#888] hover:text-black dark:hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Homepage
        </Link>

        {/* Brand Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-10 h-10 bg-black dark:bg-white rounded-md flex items-center justify-center">
            <Code2 className="w-5 h-5 text-white dark:text-black" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-black dark:text-[#ededed] tracking-tight">Access Codion</h1>
            <p className="text-sm text-slate-500 dark:text-[#888]">Sign in to begin your review session</p>
          </div>
        </div>

        {/* Card */}
        <div className="vercel-card p-8">
          <div className="space-y-6">
            <button
              onClick={handleGitHubLogin}
              className="w-full btn-primary py-3 flex items-center justify-center gap-3 text-sm"
            >
              <GitHubIcon className="w-5 h-5" />
              Continue with GitHub
            </button>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-200 dark:bg-[#333]" />
              <span className="text-[10px] font-medium tracking-widest text-slate-400 dark:text-[#666] uppercase">Enterprise Grade</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-[#333]" />
            </div>

            <div className="space-y-2">
              {[
                { icon: ShieldCheck, label: 'Secure OAuth Handshake', color: 'text-green-500' },
                { icon: Zap, label: 'Instant Profile Sync', color: 'text-amber-500' },
                { icon: Globe, label: 'Global Availability', color: 'text-black dark:text-white' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-md bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-[#333]">
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-sm text-slate-600 dark:text-[#a1a1aa]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-xs text-slate-400 dark:text-[#666] leading-relaxed max-w-[280px] mx-auto">
          By continuing, you agree to our{' '}
          <a href="#" className="text-black dark:text-white hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-black dark:text-white hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}

export default Login;