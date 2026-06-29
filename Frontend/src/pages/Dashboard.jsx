import React, { useState, useEffect } from 'react';
import { FileSearch, TrendingUp, Shield, Zap, ArrowUpRight, Code2, Clock, Upload, Loader2 } from 'lucide-react';
import { GitHubIcon } from '../components/common/Icons';
import { Link } from 'react-router-dom';
import api from '../services/api';

function ScoreIndicator({ score }) {
  const isGood = score >= 80;
  const isMid = score >= 60;
  
  const colorClass = isGood ? 'text-green-600 dark:text-green-500 border-green-200 dark:border-green-500/30' : 
                     isMid ? 'text-amber-600 dark:text-amber-500 border-amber-200 dark:border-amber-500/30' : 
                     'text-red-600 dark:text-red-500 border-red-200 dark:border-red-500/30';

  return (
    <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-full border ${colorClass} bg-transparent`}>
      <span className="text-sm font-semibold tracking-tight">{score}</span>
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <Link to={`/review/${review.id}`} className="block group">
      <div className="vercel-card p-6 h-full flex flex-col relative group-hover:border-black dark:group-hover:border-white transition-colors duration-300">
        
        <div className="flex items-start justify-between mb-6">
          <ScoreIndicator score={review.score} />
          <div className="flex flex-col items-end">
             <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#888]">
               <Clock className="w-3 h-3" />
               {new Date(review.createdAt || review.created_at).toLocaleDateString()}
             </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <GitHubIcon className="w-3.5 h-3.5 text-slate-400 dark:text-[#666]" />
            <span className="text-xs font-mono text-slate-500 dark:text-[#888] truncate">
              {review.provider_used === 'gemini' || review.provider_used === 'groq' || review.provider_used === 'mistral' ? 'GitHub PR' : review.provider_used || 'Repository'}
            </span>
          </div>
          <h3 className="text-lg font-medium text-black dark:text-[#ededed] mb-4 line-clamp-1 group-hover:underline">
            {review.title}
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {review.score < 75 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 bg-transparent">Needs Work</span>
            )}
            {review.score >= 75 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium border border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-400 bg-transparent">Approved</span>
            )}
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-[#333] flex items-center justify-between">
           <span className="text-[11px] text-slate-500 dark:text-[#888] flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
             Analyzed
           </span>
           <ArrowUpRight className="w-4 h-4 text-slate-400 dark:text-[#666] group-hover:text-black dark:group-hover:text-white transition-colors" />
        </div>
      </div>
    </Link>
  );
}

function StatBox({ icon: Icon, label, value }) {
  return (
    <div className="vercel-card p-6 flex flex-col justify-between h-32">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-slate-500 dark:text-[#888]">{label}</h4>
        <Icon className="w-4 h-4 text-slate-400 dark:text-[#666]" />
      </div>
      <div>
        <h3 className="text-3xl font-semibold text-black dark:text-[#ededed] tracking-tight">{value}</h3>
      </div>
    </div>
  );
}

function Dashboard() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadReviews() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/api/review');
        setReviews(res.data.reviews || []);
      } catch (err) {
        console.error('Failed to load reviews history:', err);
        setError(err.response?.data?.error || 'Could not fetch review history.');
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, []);

  const totalReviews = reviews.length;
  const avgScore = totalReviews > 0
    ? Math.round(reviews.reduce((acc, r) => acc + r.score, 0) / totalReviews)
    : 0;
  const criticalRisks = reviews.filter(r => r.score < 75).length;
  const totalScans = reviews.length; 

  return (
    <div className="p-8 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-200 dark:border-[#333]">
        <div>
           <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-medium border border-slate-200 dark:border-[#333] text-black dark:text-[#ededed] mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Operational
           </div>
           <h1 className="text-3xl font-semibold text-black dark:text-[#ededed] tracking-tight mb-2">Projects</h1>
           <p className="text-sm text-slate-500 dark:text-[#888]">Monitor and analyze your repository code reviews.</p>
        </div>
        <Link to="/upload" className="btn-primary">
          <Upload className="w-4 h-4 mr-2" />
          New Review
        </Link>
      </div>

      {error && (
        <div className="p-4 mb-8 border border-red-200 dark:border-red-900 rounded-md text-red-600 dark:text-red-400 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-xs hover:underline">Dismiss</button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatBox icon={FileSearch} label="Review Sessions" value={totalReviews} />
        <StatBox icon={TrendingUp} label="Quality Average" value={totalReviews > 0 ? `${avgScore}%` : 'N/A'} />
        <StatBox icon={Shield} label="Security Risks" value={criticalRisks} />
        <StatBox icon={Code2} label="Commits Scanned" value={totalScans} />
      </div>

      {/* Content Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium text-black dark:text-[#ededed] tracking-tight">Recent Activity</h2>
      </div>

      {loading ? (
        <div className="py-32 text-center vercel-card">
          <Loader2 className="w-6 h-6 text-black dark:text-white animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-500 dark:text-[#888]">Fetching projects...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="vercel-card py-32 text-center border-dashed">
          <div className="w-12 h-12 border border-slate-200 dark:border-[#333] rounded-full flex items-center justify-center mx-auto mb-6">
            <FileSearch className="w-5 h-5 text-slate-400 dark:text-[#666]" />
          </div>
          <h3 className="text-lg font-medium text-black dark:text-[#ededed] mb-2">No Active Context</h3>
          <p className="text-sm text-slate-500 dark:text-[#888] max-w-sm mx-auto mb-8">Your review history is empty. Submit a PR or upload code to start the AI evaluation engine.</p>
          <Link to="/upload" className="btn-primary">Start First Scan</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
