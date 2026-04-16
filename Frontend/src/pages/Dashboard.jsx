import React from 'react';
import { FileSearch, TrendingUp, Shield, Zap, ArrowUpRight, Code2, Clock, Upload } from 'lucide-react';
import { GitHubIcon } from '../components/common/Icons';
import { Link } from 'react-router-dom';

const mockReviews = [
  {
    id: '1',
    repo: 'vysakhhh/codion-frontend',
    title: 'Finalize Tailwind migration',
    score: 92,
    critical: 0,
    major: 1,
    minor: 4,
    info: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    repo: 'vysakhhh/api-core',
    title: 'Optimize vector search performance',
    score: 68,
    critical: 1,
    major: 2,
    minor: 5,
    info: 8,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    repo: 'vysakhhh/db-migrations',
    title: 'Add RLS policies for reviews',
    score: 85,
    critical: 0,
    major: 0,
    minor: 2,
    info: 5,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

function ScoreIndicator({ score }) {
  const isGood = score >= 80;
  const isMid = score >= 60;
  
  const colorClass = isGood ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 
                     isMid ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 
                     'text-rose-400 bg-rose-500/10 border-rose-500/20';

  return (
    <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl border ${colorClass} shadow-lg transition-all group-hover:scale-110`}>
      <span className="text-xl font-bold">{score}</span>
      <span className="text-[8px] font-bold tracking-widest uppercase opacity-60">Score</span>
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <Link to={`/review/${review.id}`} className="block group">
      <div className="glass-card p-6 h-full flex flex-col relative overflow-hidden group-hover:border-indigo-500/50 group-hover:bg-white/[0.04]">
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors" />
        
        <div className="flex items-start justify-between mb-6">
          <ScoreIndicator score={review.score} />
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-slate-500">
               <Clock className="w-3 h-3" />
               {new Date(review.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <GitHubIcon className="w-3 h-3 text-slate-500" />
            <span className="text-[10px] font-mono text-slate-400 tracking-tight uppercase">{review.repo}</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-4 line-clamp-1 group-hover:text-indigo-400 transition-colors">
            {review.title}
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {review.critical > 0 && (
              <span className="badge-premium border-rose-500/20 text-rose-400 bg-rose-500/5">{review.critical} Critical</span>
            )}
            <span className="badge-premium border-indigo-500/20 text-indigo-400 bg-indigo-500/5">{review.major + review.minor} Issues</span>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
           <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             AI Analyzed
           </span>
           <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
      </div>
    </Link>
  );
}

function StatBox({ icon: Icon, label, value, color }) {
  return (
    <div className="glass-card p-6 flex items-center gap-6 group">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-12 ${color} bg-opacity-10 border border-opacity-20 ${color.replace('text-', 'border-')}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <h4 className="text-3xl font-bold text-white mb-0.5">{value}</h4>
        <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">{label}</p>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase mb-4 tracking-widest">
              <Zap className="w-3 h-3" /> System Operational
           </div>
           <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Engineer Overview</h1>
           <p className="text-slate-500 max-w-xl">Intelligent code analysis for your latest repository changes.</p>
        </div>
        <Link to="/upload" className="btn-premium px-8 py-3.5 shadow-indigo-500/20">
          <Upload className="w-4 h-4 mr-2" />
          New Review Request
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <StatBox icon={FileSearch} label="Review Sessions" value={mockReviews.length} color="text-indigo-400" />
        <StatBox icon={TrendingUp} label="Quality Average" value="82%" color="text-emerald-400" />
        <StatBox icon={Shield} label="Security Risks" value="01" color="text-rose-400" />
        <StatBox icon={Code2} label="Commits Scanned" value="124" color="text-purple-400" />
      </div>

      {/* Content Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
           <h2 className="text-xl font-bold text-white">Live Insights</h2>
           <div className="h-px w-32 bg-white/5 hidden md:block" />
        </div>
        <Link to="/reviews" className="text-xs font-bold text-indigo-400 hover:text-white transition-colors uppercase tracking-widest">View Archieve →</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Empty State Redesign (just in case) */}
      {mockReviews.length === 0 && (
        <div className="glass-card py-32 text-center border-dashed border-white/10">
          <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FileSearch className="w-10 h-10 text-slate-700" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No Active Context</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-8">Your review history is empty. Submit a PR or upload code to start the AI evaluation engine.</p>
          <Link to="/upload" className="btn-premium px-10">Start First Scan</Link>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
