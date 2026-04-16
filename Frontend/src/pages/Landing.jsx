import React from 'react';
import { Link } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Code2,
  Zap,
  Shield,
  Brain,
  ArrowRight,
  Star,
  GitBranch,
  Sparkles,
  Command,
  Cpu,
} from 'lucide-react';
import { GitHubIcon } from '../components/common/Icons';

const features = [
  {
    icon: Brain,
    title: 'Cognitive Review',
    description: 'Deep context analysis using triple-model validation: Groq, Gemini & Mistral.',
    glow: 'group-hover:shadow-indigo-500/20'
  },
  {
    icon: Shield,
    title: 'Zero-Day Detection',
    description: 'Proactively identifies vulnerabilities before they hit production environments.',
    glow: 'group-hover:shadow-cyan-500/20'
  },
  {
    icon: Zap,
    title: 'Lightning Inference',
    description: 'Sub-second review generation using Groq LPU hardware acceleration.',
    glow: 'group-hover:shadow-pink-500/20'
  },
  {
    icon: Sparkles,
    title: 'Aesthetic Refactoring',
    description: 'Not just bugs—we suggest readability wins and modern design patterns.',
    glow: 'group-hover:shadow-purple-500/20'
  },
];

const stats = [
  { label: 'Lines Analyzed', value: '1.2M+' },
  { label: 'Bugs Caught', value: '45k' },
  { label: 'Devs Trust Us', value: '8k+' },
];

const sampleCode = `// AI Suggestion: Replace with parameterized query 
// to prevent SQL Injection
const user = await db.query(
  'SELECT * FROM users WHERE id = $1', 
  [userId]
);

export async function validateToken(token) {
  const decoded = await jwt.verify(token, process.env.SECRET);
  return decoded.role === 'admin';
}`;

function Landing() {
  return (
    <div className="min-h-screen relative overflow-hidden selection:bg-indigo-500/30">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Codion</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">Platform</a>
            <a href="#demo" className="text-sm text-slate-400 hover:text-white transition-colors">Review Focus</a>
            <a href="#pricing" className="text-sm text-slate-400 hover:text-white transition-colors">Free Forever</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Sign In</Link>
            <Link to="/login" className="btn-premium py-2.5 px-6">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-24 px-6 z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold tracking-widest text-indigo-400 uppercase mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              Upgrade to V2.5 Next-Gen Review
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] mb-8">
              Ship Faster. <br />
              <span className="text-gradient">Review Smarter.</span>
            </h1>
            
            <p className="text-xl text-slate-400 max-w-lg mb-12 leading-relaxed">
              Automate your PR cycles with enterprise-grade AI. We catch the bugs, 
              you write the future. Zero cost. Infinite scale.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link to="/login" className="btn-premium w-full sm:w-auto text-lg px-8 py-4">
                Deploy Your First Review
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <button className="btn-premium-outline w-full sm:w-auto text-lg px-8 py-4">
                Watch Demo
              </button>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/5 pt-12">
              {stats.map((s, i) => (
                <div key={i}>
                  <p className="text-2xl font-bold text-white mb-1">{s.value}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative group perspective-1000">
            <div className="relative z-20 animate-float">
              {/* IDE Window Mockup */}
              <div className="glass-card overflow-hidden shadow-2xl shadow-indigo-500/10">
                <div className="flex items-center justify-between px-5 py-3 h-12 bg-white/5 border-b border-white/5">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2">
                    <Command className="w-3 h-3" />
                    review_engine.py
                  </div>
                </div>
                <div className="p-1">
                  <SyntaxHighlighter
                    language="javascript"
                    style={atomDark}
                    customStyle={{
                      margin: 0,
                      padding: '1.5rem',
                      fontSize: '0.8rem',
                      background: 'rgba(0,0,0,0)',
                      lineHeight: '1.6'
                    }}
                    showLineNumbers
                  >
                    {sampleCode}
                  </SyntaxHighlighter>
                </div>
              </div>

              {/* Float Tags */}
              <div className="absolute -top-6 -right-6 glass-card px-4 py-3 shadow-xl flex items-center gap-3 animate-float delay-75">
                <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Security Flaw</p>
                  <p className="text-xs font-semibold text-white">SQL Injection Detected</p>
                </div>
              </div>

              <div className="absolute -bottom-10 -left-6 glass-card px-4 py-3 shadow-xl flex items-center gap-3 animate-float delay-150">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Performance</p>
                  <p className="text-xs font-semibold text-white">3.2x Faster Latency</p>
                </div>
              </div>
            </div>
            
            {/* Background Glow behind IDE */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-600/20 rounded-full blur-[80px] z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">Engineered for <span className="text-gradient">Precision</span></h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Our review engine combines the speed of LPUs with the reasoning of the world's most capable LLMs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className={`glass-card p-8 group hover:-translate-y-2 transition-all duration-500 ${f.glow}`}>
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <f.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By / Logos */}
      <section className="py-16 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
          <div className="flex items-center gap-2 font-bold text-xl"><GitHubIcon className="w-8 h-8" /> GitHub</div>
          <div className="flex items-center gap-2 font-bold text-xl"><Cpu className="w-8 h-8" /> Nvidia</div>
          <div className="flex items-center gap-2 font-bold text-xl"><GitBranch className="w-8 h-8" /> GitLab</div>
          <div className="flex items-center gap-2 font-bold text-xl font-serif">Vercel</div>
          <div className="flex items-center gap-2 font-bold text-xl italic tracking-tighter uppercase">Groq</div>
        </div>
      </section>

      {/* Rebuild CTA */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]" />
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl lg:text-6xl font-bold mb-8 capitalize">Join the future of <br /> development.</h2>
          <p className="text-slate-400 text-lg mb-12">
            Free forever for open source. Enterprise scale for everyone else. 
            Get started in seconds, stay for the quality.
          </p>
          <Link to="/login" className="btn-premium px-12 py-5 text-xl">
            Register with GitHub
            <ArrowRight className="ml-2 w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-12 px-6 border-t border-white/5 text-center text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <Code2 className="w-5 h-5 text-indigo-500" />
            <span className="font-bold text-white">Codion AI</span>
          </div>
          <p className="text-sm">© 2025 Codion Technologies Inc. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white">Twitter</a>
            <a href="#" className="hover:text-white">Discord</a>
            <a href="#" className="hover:text-white">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;