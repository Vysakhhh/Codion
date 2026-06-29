import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
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
  Loader2,
  AlertCircle
} from 'lucide-react';

/* ── Modern Score Ring ───────────────────────────── */
function ScoreRing({ score }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 80 ? 'stroke-green-500' :
    score >= 60 ? 'stroke-amber-500' :
    'stroke-red-500';

  return (
    <div className="relative inline-flex items-center justify-center p-4 rounded-full bg-transparent">
      <svg width="140" height="140" className="transform -rotate-90">
        <circle
          cx="70" cy="70" r={radius}
          stroke="currentColor"
          className="text-slate-200 dark:text-[#333]"
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx="70" cy="70" r={radius}
          className={`${color} transition-all duration-1000 ease-out`}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-semibold text-black dark:text-[#ededed] tracking-tight">{score}</span>
        <span className="text-[10px] font-medium text-slate-500 dark:text-[#888] uppercase tracking-wider mt-1">Quality</span>
      </div>
    </div>
  );
}

/* ── File Selector ───────────────────────────────── */
function FileTree({ files, activeFile, onSelect }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 px-3 mb-4">
         <Terminal className="w-4 h-4 text-black dark:text-white" />
         <span className="text-[11px] font-medium text-slate-500 dark:text-[#888] uppercase tracking-wider">Repository Context</span>
      </div>
      {files.map((file) => (
        <button
          key={file.filePath}
          onClick={() => onSelect(file.filePath)}
          className={`w-full group flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors border
            ${activeFile === file.filePath
              ? 'bg-slate-100 dark:bg-[#111] border-slate-200 dark:border-[#333] text-black dark:text-white'
              : 'border-transparent text-slate-500 dark:text-[#888] hover:text-black dark:hover:text-[#ededed] hover:bg-slate-50 dark:hover:bg-[#0a0a0a]'
            }`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${
            file.status === 'critical' ? 'bg-red-500' :
            file.status === 'warning' ? 'bg-amber-500' : 'bg-green-500'
          }`} />
          <span className="font-mono text-[13px] truncate flex-1 text-left">{file.filePath}</span>
          {file.commentsCount > 0 && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white dark:bg-[#0a0a0a] text-slate-500 border border-slate-200 dark:border-[#333]">
              {file.commentsCount}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Comment Card ───────────────────────────────── */
function InlineComment({ comment }) {
  const [copied, setCopied] = useState(false);

  const styles = {
    CRITICAL: { icon: ShieldAlert, border: 'border-red-200 dark:border-red-900/50', bg: 'bg-red-50/50 dark:bg-[#111]', color: 'text-red-600 dark:text-red-500', iconBg: 'bg-red-100 dark:bg-red-900/30' },
    MAJOR: { icon: Activity, border: 'border-amber-200 dark:border-amber-900/50', bg: 'bg-amber-50/50 dark:bg-[#111]', color: 'text-amber-600 dark:text-amber-500', iconBg: 'bg-amber-100 dark:bg-amber-900/30' },
    MINOR: { icon: Fingerprint, border: 'border-blue-200 dark:border-blue-900/50', bg: 'bg-blue-50/50 dark:bg-[#111]', color: 'text-blue-600 dark:text-blue-500', iconBg: 'bg-blue-100 dark:bg-blue-900/30' },
    INFO: { icon: CheckCircle2, border: 'border-green-200 dark:border-green-900/50', bg: 'bg-green-50/50 dark:bg-[#111]', color: 'text-green-600 dark:text-green-500', iconBg: 'bg-green-100 dark:bg-green-900/30' },
  };

  const severity = (comment.severity || 'INFO').toUpperCase();
  const currentStyle = styles[severity] || styles.INFO;
  const Icon = currentStyle.icon;

  const suggestedCode = comment.suggested_code || comment.suggestedCode;
  const suggestion = comment.suggestion || comment.suggestionText;
  const lineStart = comment.line_start || comment.lineStart;
  const lineEnd = comment.line_end || comment.lineEnd;

  const handleCopy = async () => {
    if (suggestedCode) {
      await navigator.clipboard.writeText(suggestedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`vercel-card my-4 ${currentStyle.border} ${currentStyle.bg}`}>
      <div className={`p-5 flex items-start gap-4`}>
        <div className={`p-2 rounded-full ${currentStyle.iconBg} ${currentStyle.color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] font-medium uppercase tracking-wider ${currentStyle.color}`}>
              {severity}
            </span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-[#888] bg-white dark:bg-[#0a0a0a] px-2 py-0.5 rounded-full border border-slate-200 dark:border-[#333]">
              L{lineStart}{lineEnd && lineEnd !== lineStart ? `-${lineEnd}` : ''}
            </span>
          </div>
          <h4 className="text-black dark:text-[#ededed] font-medium mb-2">{comment.title}</h4>
          <p className="text-sm text-slate-600 dark:text-[#a1a1aa] leading-relaxed mb-4">{comment.body}</p>
          
          {suggestion && (
            <div className="p-3 bg-white dark:bg-[#0a0a0a] rounded-md border border-slate-200 dark:border-[#333] text-sm text-slate-600 dark:text-[#a1a1aa] leading-relaxed mb-4 italic">
              {suggestion}
            </div>
          )}

          {suggestedCode && (
             <div className="border border-slate-200 dark:border-[#333] rounded-md bg-[#fafafa] dark:bg-[#000] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-[#333] bg-[#f5f5f5] dark:bg-[#111]">
                   <span className="text-[10px] font-medium text-slate-500 dark:text-[#888] uppercase tracking-wider">Suggested Fix</span>
                   <button onClick={handleCopy} className="text-slate-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1.5">
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[10px] font-medium">{copied ? 'Copied' : 'Copy'}</span>
                   </button>
                </div>
                <SyntaxHighlighter
                  language="javascript"
                  style={atomDark}
                  customStyle={{ margin: 0, padding: '1rem', fontSize: '13px', background: 'transparent' }}
                >
                  {suggestedCode}
                </SyntaxHighlighter>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Unified Diff Viewer with Inline Comments ── */
function DiffViewer({ file, comments }) {
  if (!file.chunks || file.chunks.length === 0) {
    return (
      <div className="vercel-card p-16 text-center text-slate-500 dark:text-[#888]">
        No code changes recorded.
      </div>
    );
  }

  return (
    <div className="vercel-card overflow-hidden bg-white dark:bg-[#000]">
      {file.chunks.map((chunk, chunkIdx) => (
        <div key={chunkIdx} className="border-b border-slate-200 dark:border-[#333] last:border-b-0">
          
          {/* Chunk Header */}
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#111] text-[11px] font-mono text-slate-500 dark:text-[#888] border-b border-slate-200 dark:border-[#333] select-none">
            {chunk.content || `@@ -${chunk.oldStart},${chunk.oldLines} +${chunk.newStart},${chunk.newLines} @@`}
          </div>
          
          {/* Code Lines */}
          <div className="font-mono text-[13px] overflow-x-auto">
            {chunk.changes.map((change, changeIdx) => {
              const isAdd = change.type === 'add';
              const isDel = change.type === 'del';
              
              const lineBg = isAdd ? 'bg-green-500/10 dark:bg-green-500/10' :
                             isDel ? 'bg-red-500/10 dark:bg-red-500/10' :
                             'bg-transparent hover:bg-slate-50 dark:hover:bg-[#111]';
                             
              const textCol = isAdd ? 'text-green-700 dark:text-green-400' :
                              isDel ? 'text-red-700 dark:text-red-400' :
                              'text-slate-700 dark:text-[#a1a1aa]';
                             
              const sign = isAdd ? '+' : isDel ? '-' : ' ';
              const lineNum = isDel ? change.ln : change.ln2;

              // Find comments anchored strictly to this line number (new file line)
              const lineComments = !isDel && lineNum
                ? comments.filter(c => {
                    const lineStart = c.line_start || c.lineStart;
                    const lineEnd = c.line_end || c.lineEnd;
                    return lineStart <= lineNum && lineEnd >= lineNum;
                  })
                : [];

              return (
                <div key={changeIdx} className="flex flex-col">
                  {/* Line rendering */}
                  <div className={`flex items-start py-0.5 transition-colors ${lineBg}`}>
                    {/* Line numbers column */}
                    <div className="w-12 text-right pr-4 text-[11px] text-slate-400 dark:text-[#666] select-none border-r border-slate-200 dark:border-[#333] flex-shrink-0 font-mono pt-[1px]">
                      {lineNum || ''}
                    </div>
                    
                    {/* Content prefix sign */}
                    <div className={`w-8 text-center text-[12px] select-none flex-shrink-0 font-mono pt-[1px] ${textCol}`}>
                      {sign}
                    </div>
                    
                    {/* Code text */}
                    <div className={`px-2 whitespace-pre font-mono text-[13px] flex-1 ${textCol}`}>
                      {change.content}
                    </div>
                  </div>

                  {/* Render any inline comments for this line */}
                  {lineComments.length > 0 && (
                    <div className="px-6 py-4 bg-slate-50 dark:bg-[#0a0a0a] border-y border-slate-200 dark:border-[#333]">
                      {lineComments.map((comment) => (
                        <InlineComment key={comment.id} comment={comment} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Page Layout ────────────────────────────────── */
function ReviewDetail() {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFile, setActiveFile] = useState('');

  useEffect(() => {
    async function loadReview() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/api/review/${id}`);
        setReview(res.data);
        
        // Select first parsed file as default
        const parsed = res.data.parsedDiff || [];
        if (parsed.length > 0) {
          setActiveFile(parsed[0].to || parsed[0].from);
        }
      } catch (err) {
        console.error('Failed to load review:', err);
        setError(err.response?.data?.error || 'Failed to fetch review details.');
      } finally {
        setLoading(false);
      }
    }
    loadReview();
  }, [id]);

  // Map backend parsedDiff files and comments to structured file tree list
  const structuredFiles = useMemo(() => {
    if (!review || !review.parsedDiff) return [];
    
    return review.parsedDiff.map(file => {
      const filePath = file.to || file.from;
      const fileComments = (review.comments || []).filter(c => c.file_path === filePath);
      
      // Calculate status badge based on highest severity
      let status = 'clean';
      if (fileComments.some(c => c.severity === 'CRITICAL' || c.severity === 'MAJOR')) {
        status = 'critical';
      } else if (fileComments.length > 0) {
        status = 'warning';
      }

      return {
        filePath,
        status,
        commentsCount: fileComments.length,
        fileRaw: file,
        comments: fileComments
      };
    });
  }, [review]);

  // Find currently selected file data
  const activeFileData = useMemo(() => {
    return structuredFiles.find(f => f.filePath === activeFile);
  }, [structuredFiles, activeFile]);

  // Aggregate stats
  const positives = useMemo(() => {
    if (!review || !review.summary) return [];
    // Split positives or fallback
    return review.positives || [];
  }, [review]);

  if (loading) {
    return (
      <div className="py-32 text-center h-screen flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-black dark:text-white animate-spin mb-4" />
        <p className="text-slate-500 dark:text-[#888] font-medium">Loading audit...</p>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="py-32 max-w-md mx-auto text-center h-screen flex flex-col items-center justify-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-6" />
        <h2 className="text-2xl font-semibold text-black dark:text-[#ededed] tracking-tight mb-2">Audit Unavailable</h2>
        <p className="text-slate-500 dark:text-[#888] mb-8">{error || 'The requested review session is not accessible.'}</p>
        <Link to="/" className="btn-primary px-8">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto pb-24">
      
      {/* Upper Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-200 dark:border-[#333] pb-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="w-10 h-10 vercel-card rounded-md flex items-center justify-center text-slate-500 hover:text-black dark:hover:text-white transition-colors">
             <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
             <h1 className="text-2xl font-semibold text-black dark:text-[#ededed] tracking-tight mb-1">{review.title || 'Code Scan'}</h1>
             <p className="text-xs text-slate-500 dark:text-[#888] font-medium">Audit Session <span className="font-mono text-slate-700 dark:text-slate-400">#{review.id.substring(0, 8).toUpperCase()}</span></p>
          </div>
        </div>
        
        <div className="flex gap-3">
           <Link to="/repositories" className="btn-outline">
              <ExternalLink className="w-4 h-4 mr-2" /> Connected
           </Link>
           <Link to="/" className="btn-primary">
              Approve
           </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-8 items-start">
        
        {/* Sidebar Panel */}
        <div className="space-y-6 lg:sticky lg:top-8">
           <div className="vercel-card p-6 flex flex-col items-center">
              <ScoreRing score={review.score} />
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-[#333] w-full space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-[#888] uppercase tracking-wider">Engine</span>
                    <span className="text-[10px] font-medium text-black dark:text-white bg-slate-100 dark:bg-[#111] px-2 py-0.5 rounded-full border border-slate-200 dark:border-[#333] uppercase tracking-wider">
                      {review.provider_used || 'Hybrid'}
                    </span>
                 </div>
                 <div className="text-sm text-slate-600 dark:text-[#a1a1aa] leading-relaxed italic bg-slate-50 dark:bg-[#0a0a0a] rounded-md p-4 border border-slate-200 dark:border-[#333]">
                    "{review.summary}"
                 </div>
              </div>
           </div>

           <div className="vercel-card p-4">
              <FileTree 
                files={structuredFiles} 
                activeFile={activeFile} 
                onSelect={setActiveFile} 
              />
           </div>

           {/* Quick Insights (Positives) */}
           {positives.length > 0 && (
             <div className="vercel-card p-6">
                <h3 className="text-[11px] font-medium text-slate-500 dark:text-[#888] uppercase tracking-wider mb-4 flex items-center gap-2">
                   <Activity className="w-4 h-4 text-green-500" /> Strengths
                </h3>
                <div className="space-y-3">
                   {positives.map((p, i) => (
                      <div key={i} className="flex gap-3 p-3 rounded-md bg-transparent border border-green-200 dark:border-green-900/30">
                         <Check className="w-4 h-4 text-green-600 dark:text-green-500 flex-shrink-0" />
                         <span className="text-xs font-medium text-slate-700 dark:text-[#ededed] leading-relaxed">{p}</span>
                      </div>
                   ))}
                </div>
             </div>
           )}
        </div>

        {/* Audit Content Area */}
        <div className="space-y-6">
           <div className="flex items-center justify-between pl-2">
              <div className="flex items-center gap-3 min-w-0">
                 <div className="w-8 h-8 rounded-md bg-slate-100 dark:bg-[#111] border border-slate-200 dark:border-[#333] flex items-center justify-center text-slate-500 dark:text-[#888] flex-shrink-0">
                    <FileCode className="w-4 h-4" />
                 </div>
                 <h2 className="text-lg font-medium text-black dark:text-[#ededed] font-mono tracking-tight truncate">{activeFile}</h2>
              </div>
           </div>

           {activeFileData ? (
             <DiffViewer 
               file={activeFileData.fileRaw} 
               comments={activeFileData.comments} 
             />
           ) : (
             <div className="vercel-card border-dashed py-32 text-center">
                <div className="w-12 h-12 border border-slate-200 dark:border-[#333] rounded-full flex items-center justify-center mx-auto mb-6 bg-slate-50 dark:bg-[#0a0a0a]">
                   <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="text-lg font-medium text-black dark:text-[#ededed] tracking-tight mb-2">Zero Faults Detected</h3>
                <p className="text-sm text-slate-500 dark:text-[#888] max-w-sm mx-auto">This module meets all specified architecture standards and security protocols. No optimizations required.</p>
             </div>
           )}
        </div>

      </div>
    </div>
  );
}

export default ReviewDetail;
