import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  FileCode,
  Terminal,
  Activity,
  ShieldAlert,
  Fingerprint,
} from 'lucide-react';

/* ── Mock Data ────────────────────────────────────── */
const mockReview = {
  id: '1',
  title: 'Finalize Tailwind migration',
  score: 92,
  summary: 'Codebase architecture exhibits high cohesion. Security audit found zero critical vulnerabilities. Style consistency matched 98% of project patterns. Minor performance optimization suggested for the responsive utility mapper.',
  provider: 'Groq + Gemini',
  positives: [
    'Optimized atomic CSS distribution across layouts',
    'Component isolation follows strict SOLID principles',
    'Responsive breakpoints handle 320px to 4k resolutions',
  ],
  missedTestCases: [
    'Hydration mismatch edge case for nested glassmorphism',
  ],
  files: [
    {
      filePath: 'src/layouts/AppShell.jsx',
      status: 'clean',
      comments: [],
    },
    {
      filePath: 'src/components/common/Icons.jsx',
      status: 'clean',
      comments: [],
    },
    {
      filePath: 'src/styles/design-tokens.css',
      status: 'warning',
      comments: [
        {
          id: 'c1',
          lineStart: 42,
          lineEnd: 45,
          severity: 'MINOR',
          category: 'performance',
          title: 'Unoptimized backdrop filter intensity',
          body: 'Heavy blur values (>40px) can cause significant repaint lag on mobile GPUs. Consider capping at 20px for non-modal elements.',
          suggestion: 'Reduce blur-xl to blur-md or custom variable.',
          suggestedCode: `.glass-layer {\n  backdrop-filter: blur(20px);\n}`,
        },
      ],
    },
  ],
};

/* ── Modern Score Ring ───────────────────────────── */
function ScoreRing({ score }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 80 ? 'stroke-emerald-400' :
    score >= 60 ? 'stroke-amber-400' :
    'stroke-rose-400';

  return (
    <div className="relative inline-flex items-center justify-center p-4 rounded-3xl bg-white/[0.02] border border-white/5 shadow-inner">
      <svg width="140" height="140" className="transform -rotate-90 filter drop-shadow-[0_0_12px_rgba(99,102,241,0.2)]">
        <circle
          cx="70" cy="70" r={radius}
          stroke="currentColor"
          className="text-white/5"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx="70" cy="70" r={radius}
          className={`${color} transition-all duration-1000 ease-out`}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black text-white tracking-tighter">{score}</span>
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Quality</span>
      </div>
    </div>
  );
}

/* ── File Selector ───────────────────────────────── */
function FileTree({ files, activeFile, onSelect }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 px-3 mb-4">
         <Terminal className="w-3.5 h-3.5 text-indigo-400" />
         <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Repository Context</span>
      </div>
      {files.map((file) => (
        <button
          key={file.filePath}
          onClick={() => onSelect(file.filePath)}
          className={`w-full group flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 border
            ${activeFile === file.filePath
              ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-100 shadow-[0_0_20px_rgba(99,102,241,0.05)]'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${
            file.status === 'critical' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' :
            file.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
          }`} />
          <span className="font-mono text-xs truncate flex-1 text-left">{file.filePath}</span>
          {file.comments.length > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/5 text-slate-500 border border-white/5">
              {file.comments.length}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Comment Card ───────────────────────────────── */
function InlineComment({ comment }) {
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const styles = {
    CRITICAL: { icon: ShieldAlert, border: 'border-rose-500/30', bg: 'bg-rose-500/5', color: 'text-rose-400' },
    MAJOR: { icon: Activity, border: 'border-amber-500/30', bg: 'bg-amber-500/5', color: 'text-amber-400' },
    MINOR: { icon: Fingerprint, border: 'border-indigo-500/30', bg: 'bg-indigo-500/5', color: 'text-indigo-400' },
    INFO: { icon: CheckCircle2, border: 'border-emerald-500/30', bg: 'bg-emerald-500/5', color: 'text-emerald-400' },
  };

  const currentStyle = styles[comment.severity] || styles.INFO;
  const Icon = currentStyle.icon;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(comment.suggestedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`glow-border ${currentStyle.border} group transition-all duration-500`}>
      <div className={`p-4 flex items-start gap-4 ${currentStyle.bg}`}>
        <div className={`p-2 rounded-xl bg-slate-950/50 border border-white/5 ${currentStyle.color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${currentStyle.color}`}>
              {comment.severity} Fault
            </span>
            <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
              Line {comment.lineStart}-{comment.lineEnd}
            </span>
          </div>
          <h4 className="text-white font-bold mb-3">{comment.title}</h4>
          <p className="text-sm text-slate-400 leading-relaxed mb-6">{comment.body}</p>

          {comment.suggestedCode && (
             <div className="glass-card bg-slate-950/40 border-white/5 p-0 overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02]">
                   <span className="text-[10px] font-bold text-indigo-400/80 uppercase tracking-widest">Optimized Implementation</span>
                   <button onClick={handleCopy} className="text-slate-500 hover:text-white transition-colors flex items-center gap-2">
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span className="text-[10px] font-bold">{copied ? 'Synced' : 'Clone'}</span>
                   </button>
                </div>
                <SyntaxHighlighter
                  language="javascript"
                  style={atomDark}
                  customStyle={{ margin: 0, padding: '1.25rem', fontSize: '0.8rem', background: 'transparent' }}
                >
                  {comment.suggestedCode}
                </SyntaxHighlighter>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Page Layout ────────────────────────────────── */
function ReviewDetail() {
  const { id } = useParams();
  const [activeFile, setActiveFile] = useState(mockReview.files[0].filePath);
  
  const activeFileData = mockReview.files.find(f => f.filePath === activeFile);

  return (
    <div className="p-8 max-w-[1400px] mx-auto animate-fade-in pb-20">
      
      {/* Upper Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-6">
          <Link to="/" className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500/40 transition-all">
             <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
             <h1 className="text-3xl font-bold text-white tracking-tight mb-1">{mockReview.title}</h1>
             <p className="text-xs text-slate-500 font-medium">Audit Session <span className="text-indigo-400 font-mono">#{id.padStart(6, '0')}</span> • Neural Core Verification</p>
          </div>
        </div>
        
        <div className="flex gap-3">
           <button className="btn-premium-outline py-2.5 px-6 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" /> View Source
           </button>
           <button className="btn-premium py-2.5 px-6 shadow-indigo-600/30">
              Approve Review
           </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[340px_1fr] gap-8 items-start">
        
        {/* Sidebar Panel */}
        <div className="space-y-6 lg:sticky lg:top-28">
           <div className="glass-card p-8 flex flex-col items-center">
              <ScoreRing score={mockReview.score} />
              <div className="mt-8 pt-8 border-t border-white/5 w-full space-y-4">
                 <div className="flex justify-between items-center px-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Model Output</span>
                    <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">JSON-V2</span>
                 </div>
                 <div className="text-xs text-slate-400 leading-relaxed text-center italic bg-slate-950/20 rounded-xl p-4">
                    "{mockReview.summary}"
                 </div>
              </div>
           </div>

           <div className="glass-card p-6">
              <FileTree 
                files={mockReview.files} 
                activeFile={activeFile} 
                onSelect={setActiveFile} 
              />
           </div>

           {/* Quick Insights */}
           <div className="glass-card p-6">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 px-1 flex items-center gap-2">
                 <Activity className="w-3.5 h-3.5" /> Performance Gains
              </h3>
              <div className="space-y-4">
                 {mockReview.positives.slice(0, 2).map((p, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                       <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                       <span className="text-xs text-emerald-200/70 font-medium leading-relaxed">{p}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Audit Content Area */}
        <div className="space-y-8">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500 text-indigo-400">
                    <FileCode className="w-4 h-4" />
                 </div>
                 <h2 className="text-lg font-bold text-slate-200 font-mono tracking-tight">{activeFile}</h2>
              </div>
              <div className="h-px bg-white/5 flex-1 mx-8 hidden xl:block" />
              <div className="flex items-center gap-4">
                 <span className="text-[10px] font-bold text-slate-500 uppercase">Detection Sensitivity: <span className="text-slate-300">High</span></span>
              </div>
           </div>

           {activeFileData.comments.length > 0 ? (
              <div className="space-y-6">
                 {activeFileData.comments.map(c => (
                    <InlineComment key={c.id} comment={c} />
                 ))}
              </div>
           ) : (
              <div className="glass-card border-dashed py-32 text-center bg-transparent">
                 <div className="w-20 h-20 bg-emerald-500/5 rounded-3xl border border-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-2">Zero Faults Detected</h3>
                 <p className="text-slate-500 max-w-sm mx-auto">This module meets all specified architecture standards and security protocols. No optimizations required.</p>
              </div>
           )}
        </div>

      </div>
    </div>
  );
}

export default ReviewDetail;
