import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  Upload, 
  X, 
  Loader2, 
  Code2, 
  Sparkles, 
  Terminal, 
  ShieldCheck, 
  Zap,
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
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [diff, setDiff] = useState('');
  const [mode, setMode] = useState('upload'); // 'upload' or 'paste'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    if (mode === 'upload' && files.length === 0) return;
    if (mode === 'paste' && diff.trim().length === 0) return;

    try {
      setLoading(true);
      setError(null);
      
      let diffContent = '';

      if (mode === 'upload') {
        const fileDiffs = await Promise.all(
          files.map(async (f) => {
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                const text = e.target.result || '';
                const lines = text.split('\n');
                const diffLines = lines.map(line => `+${line}`).join('\n');
                const prDiff = `--- a/${f.name}\n+++ b/${f.name}\n@@ -0,0 +1,${lines.length} @@\n${diffLines}`;
                resolve(prDiff);
              };
              reader.readAsText(f.file);
            });
          })
        );
        diffContent = fileDiffs.join('\n\n');
      } else {
        diffContent = diff;
      }

      const response = await api.post('/api/review', {
        diff: diffContent,
        prTitle: mode === 'upload' 
          ? `Manual Upload: ${files.map(f => f.name).join(', ')}`
          : 'Unified Diff Injection',
        prDescription: mode === 'upload' 
          ? `Code review for ${files.length} manually uploaded file(s).`
          : 'Code review for pasted unified diff.',
        settings: {
          suppressInfo: false,
          suppressMinor: false,
          maxComments: 25,
          preferredProvider: 'auto',
          ignoredPatterns: []
        }
      });

      const reviewId = response.data.id;
      navigate(`/review/${reviewId}`);
    } catch (err) {
      console.error('Failed to submit code for review:', err);
      setError(err.response?.data?.error || 'Review execution failed. Please verify your payload formatting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto pb-24">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-slate-200 dark:border-[#333] pb-6">
        <div>
           <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-medium border border-slate-200 dark:border-[#333] text-black dark:text-[#ededed] mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Ready
           </div>
           <h1 className="text-3xl font-semibold text-black dark:text-[#ededed] tracking-tight mb-2">Initialize Review</h1>
           <p className="text-sm text-slate-500 dark:text-[#888]">Deploy your code to the AI audit engine for deep context verification.</p>
        </div>
        
        <div className="flex gap-2 p-1 bg-slate-50 dark:bg-[#0a0a0a] rounded-lg border border-slate-200 dark:border-[#333] h-fit">
          <button
            onClick={() => setMode('upload')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'upload'
                ? 'bg-white dark:bg-[#111] text-black dark:text-white shadow-sm border border-slate-200 dark:border-[#333]'
                : 'text-slate-500 dark:text-[#888] hover:text-black dark:hover:text-[#ededed] border border-transparent'
            }`}
          >
            File Upload
          </button>
          <button
            onClick={() => setMode('paste')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'paste'
                ? 'bg-white dark:bg-[#111] text-black dark:text-white shadow-sm border border-slate-200 dark:border-[#333]'
                : 'text-slate-500 dark:text-[#888] hover:text-black dark:hover:text-[#ededed] border border-transparent'
            }`}
          >
            Paste Diff
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-8 border border-red-200 dark:border-red-900 rounded-md text-red-600 dark:text-red-400 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-xs hover:underline">Dismiss</button>
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        
        <div className="space-y-6">
          {mode === 'upload' ? (
            <div className="space-y-6">
              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={`
                  relative cursor-pointer
                  border border-dashed rounded-lg p-16 text-center
                  transition-colors overflow-hidden bg-transparent
                  ${isDragActive
                    ? 'border-black dark:border-white bg-slate-50 dark:bg-[#111]'
                    : 'border-slate-300 dark:border-[#444] hover:border-slate-500 dark:hover:border-[#666]'
                  }
                `}
              >
                <input {...getInputProps()} />

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border border-slate-200 dark:border-[#333] flex items-center justify-center mb-6 bg-slate-50 dark:bg-[#0a0a0a]">
                     <Upload className={`w-5 h-5 ${isDragActive ? 'text-black dark:text-white' : 'text-slate-400 dark:text-[#666]'}`} />
                  </div>
                  <h3 className="text-lg font-medium text-black dark:text-[#ededed] mb-2 tracking-tight">
                    {isDragActive ? 'Drop files here' : 'Upload Source Code'}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-[#888] max-w-sm mx-auto">
                    Drag and drop your code files or entire directories. Neural engine supports 12+ major languages.
                  </p>
                </div>
              </div>

              {/* File List HUD */}
              {files.length > 0 && (
                <div className="vercel-card overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-200 dark:border-[#333] bg-slate-50 dark:bg-[#0a0a0a] flex items-center justify-between">
                     <span className="text-xs font-medium text-slate-500 dark:text-[#888] uppercase tracking-wider">Staged Files</span>
                     <span className="text-xs font-medium text-black dark:text-white">{files.length} Files</span>
                  </div>
                  <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-2 max-h-80 overflow-y-auto custom-scrollbar">
                    {files.map((f, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 px-3 py-2 bg-transparent border border-slate-200 dark:border-[#333] rounded-md group hover:border-slate-400 dark:hover:border-[#666] transition-colors"
                      >
                        <Terminal className="w-4 h-4 text-slate-400 dark:text-[#666]" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-mono text-black dark:text-[#ededed] truncate">{f.name}</p>
                          <p className="text-xs text-slate-500 dark:text-[#888] uppercase mt-0.5">{f.language} • {f.size} KB</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                          className="p-1 rounded text-slate-400 dark:text-[#666] hover:text-red-600 dark:hover:text-red-400 transition-colors"
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
            <div className="vercel-card overflow-hidden h-[500px] flex flex-col focus-within:border-slate-400 dark:focus-within:border-[#666] transition-colors">
              <div className="px-4 py-3 border-b border-slate-200 dark:border-[#333] bg-slate-50 dark:bg-[#0a0a0a] flex items-center justify-between">
                 <span className="text-xs font-medium text-slate-500 dark:text-[#888] uppercase tracking-wider">Manual Diff Injection</span>
              </div>
              <textarea
                value={diff}
                onChange={(e) => setDiff(e.target.value)}
                placeholder={`--- a/src/auth/login.js\n+++ b/src/auth/login.js\n@@ -14,7 +14,7 @@\n-  const user = db.query(\`SELECT * FROM users WHERE email = '\${email}'\`);\n+  const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);`}
                className="flex-1 w-full bg-transparent p-4 outline-none text-sm font-mono text-black dark:text-[#ededed] placeholder-slate-400 dark:placeholder-[#666] resize-none"
              />
              <div className="px-4 py-3 border-t border-slate-200 dark:border-[#333] bg-slate-50 dark:bg-[#0a0a0a] flex items-center justify-between text-xs font-mono text-slate-500 dark:text-[#888]">
                 <span>{diff.length.toLocaleString()} BYTES</span>
                 <span>UTF-8 ENCODING</span>
              </div>
            </div>
          )}
        </div>

        {/* Action / Context Sidebar */}
        <div className="space-y-6">
           <div className="vercel-card p-6">
              <h4 className="text-xs font-medium text-slate-500 dark:text-[#888] uppercase tracking-wider mb-6">Engine Parameters</h4>
              <div className="space-y-4">
                 {[
                   { icon: ShieldCheck, label: 'Security Scan', status: 'Active' },
                   { icon: Sparkles, label: 'Style Alignment', status: 'Active' },
                   { icon: Zap, label: 'Performance Latency', status: 'Active' }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-[#333] flex items-center justify-center text-slate-500 dark:text-[#888]">
                         <item.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                         <p className="text-sm font-medium text-black dark:text-[#ededed]">{item.label}</p>
                         <p className="text-[10px] text-slate-500 dark:text-[#888] font-medium uppercase mt-0.5">{item.status}</p>
                      </div>
                   </div>
                 ))}
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={loading || (mode === 'upload' ? files.length === 0 : diff.trim().length === 0)}
                className="w-full btn-primary py-2.5 mt-8 flex items-center justify-center gap-2"
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
                  </>
                )}
              </button>
           </div>
           
           <div className="vercel-card p-4 bg-slate-50 dark:bg-[#0a0a0a]">
              <p className="text-xs text-slate-500 dark:text-[#888] leading-relaxed">
                Your code is processed in volatile memory. No source is stored persistently unless you explicitly archive the review results.
              </p>
           </div>
        </div>

      </div>
    </div>
  );
}

export default UploadPage;
