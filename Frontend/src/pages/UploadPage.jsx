import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  File, 
  X, 
  Loader2, 
  Code2, 
  Sparkles, 
  Terminal, 
  ShieldCheck, 
  Zap,
  ArrowRight
} from 'lucide-react';

const ACCEPTED_EXTENSIONS = {
  'text/javascript': ['.js', '.jsx'],
  'text/typescript': ['.ts', '.tsx'],
  'text/x-python': ['.py'],
  'text/x-go': ['.go'],
  'text/x-java': ['.java'],
  'text/x-rust': ['.rs'],
  'text/x-c': ['.c', '.cpp', '.h', '.hpp'],
};

const LANG_MAP = {
  js: 'JavaScript', jsx: 'React JSX', ts: 'TypeScript', tsx: 'React TSX',
  py: 'Python', go: 'Go', java: 'Java', rs: 'Rust',
  c: 'C', cpp: 'C++', h: 'C Header', hpp: 'C++ Header',
};

function getLanguage(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  return LANG_MAP[ext] || 'Unknown';
}

function UploadPage() {
  const [files, setFiles] = useState([]);
  const [diff, setDiff] = useState('');
  const [mode, setMode] = useState('upload'); // 'upload' or 'paste'
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      name: file.name,
      language: getLanguage(file.name),
      size: (file.size / 1024).toFixed(1),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_EXTENSIONS,
    multiple: true,
  });

  const handleSubmit = async () => {
    setLoading(true);
    // TODO: Wire to POST /api/review in Phase 4
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase mb-4 tracking-widest">
              <Zap className="w-3 h-3" /> Ready for Analysis
           </div>
           <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Initialize Review</h1>
           <p className="text-slate-500">Deploy your code to the AI audit engine for deep context verification.</p>
        </div>
        
        <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5 h-fit">
          <button
            onClick={() => setMode('upload')}
            className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${
              mode === 'upload'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            File Repository
          </button>
          <button
            onClick={() => setMode('paste')}
            className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${
              mode === 'paste'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Paste Unified Diff
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        
        <div className="space-y-6">
          {mode === 'upload' ? (
            <div className="space-y-6">
              {/* Premium Dropzone */}
              <div
                {...getRootProps()}
                className={`
                  relative group cursor-pointer
                  border-2 border-dashed rounded-3xl p-16 text-center
                  transition-all duration-500 ease-out overflow-hidden
                  ${isDragActive
                    ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                  }
                `}
              >
                <input {...getInputProps()} />
                
                {/* Scanning Animation */}
                {isDragActive && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,1)] animate-scan" />
                  </div>
                )}

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <Upload className={`w-10 h-10 ${isDragActive ? 'text-indigo-400' : 'text-slate-600'}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {isDragActive ? 'Detected System Payload' : 'Upload Production Source'}
                  </h3>
                  <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Drag and drop your code files or entire directories. Neural engine supports 12+ major languages.
                  </p>
                </div>
              </div>

              {/* File List HUD */}
              {files.length > 0 && (
                <div className="glass-card overflow-hidden">
                  <div className="px-6 py-3 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Staged for Audit</span>
                     <span className="text-[10px] font-bold text-indigo-400">{files.length} Files</span>
                  </div>
                  <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-2 max-h-80 overflow-y-auto custom-scrollbar">
                    {files.map((f, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl group hover:border-indigo-500/30 transition-all"
                      >
                        <Terminal className="w-4 h-4 text-indigo-400/60" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-mono text-slate-200 truncate">{f.name}</p>
                          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">{f.language} • {f.size} KB</p>
                        </div>
                        <button
                          onClick={() => removeFile(idx)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-rose-500 hover:bg-rose-500/5 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Paste Diff HUD */
            <div className="glass-card overflow-hidden h-[500px] flex flex-col focus-within:border-indigo-500/50 transition-colors">
              <div className="px-6 py-3 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Manual Diff Injection</span>
                 <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-rose-500/40" />
                    <div className="w-2 h-2 rounded-full bg-amber-500/40" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500/40" />
                 </div>
              </div>
              <textarea
                value={diff}
                onChange={(e) => setDiff(e.target.value)}
                placeholder={`--- a/src/auth/login.js\n+++ b/src/auth/login.js\n@@ -14,7 +14,7 @@\n-  const user = db.query(\`SELECT * FROM users WHERE email = '\${email}'\`);\n+  const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);`}
                className="flex-1 w-full bg-transparent p-6 outline-none text-sm font-mono text-indigo-100 placeholder-slate-700 resize-none selection:bg-indigo-500/30"
              />
              <div className="px-6 py-3 border-t border-white/5 bg-white/[0.01] flex items-center justify-between text-[10px] font-mono text-slate-600">
                 <span>{diff.length.toLocaleString()} BYTES</span>
                 <span>UTF-8 ENCODING</span>
              </div>
            </div>
          )}
        </div>

        {/* Action / Context Sidebar */}
        <div className="space-y-6">
           <div className="glass-card p-6">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 px-1">Engine Parameters</h4>
              <div className="space-y-4">
                 {[
                   { icon: ShieldCheck, label: 'Security Scan', status: 'Active' },
                   { icon: Sparkles, label: 'Style Alignment', status: 'Active' },
                   { icon: Zap, label: 'Performance Latency', status: 'Active' }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 text-slate-400">
                         <item.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                         <p className="text-[11px] font-bold text-slate-300">{item.label}</p>
                         <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">{item.status}</p>
                      </div>
                   </div>
                 ))}
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={loading || (mode === 'upload' ? files.length === 0 : diff.trim().length === 0)}
                className="w-full btn-premium py-4 mt-8 flex items-center justify-center gap-3 text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing Payload...
                  </>
                ) : (
                  <>
                    <Code2 className="w-4 h-4" />
                    Inject Code
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
           </div>
           
           <div className="glass-card p-6">
              <p className="text-[10px] text-slate-500 leading-relaxed italic">
                * Note: Your code is processed in volatile memory. No source is stored persistently unless you explicitly archive the review results.
              </p>
           </div>
        </div>

      </div>
    </div>
  );
}

export default UploadPage;
