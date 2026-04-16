import React, { useState } from 'react';
import { 
  Save, 
  Plus, 
  X, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  Bell, 
  Coffee,
  Globe,
  Lock
} from 'lucide-react';

function SettingsPage() {
  const [settings, setSettings] = useState({
    suppressInfo: false,
    suppressMinor: false,
    maxComments: 25,
    preferredProvider: 'auto',
    ignoredPatterns: ['**/*.test.js', '**/node_modules/**'],
  });

  const [saving, setSaving] = useState(false);
  const [newPattern, setNewPattern] = useState('');

  const update = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const addPattern = () => {
    if (newPattern.trim() && !settings.ignoredPatterns.includes(newPattern.trim())) {
      update('ignoredPatterns', [...settings.ignoredPatterns, newPattern.trim()]);
      setNewPattern('');
    }
  };

  const removePattern = (index) => {
    update(
      'ignoredPatterns',
      settings.ignoredPatterns.filter((_, i) => i !== index)
    );
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto animate-fade-in pb-20">
      
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Core Configuration</h1>
        <p className="text-slate-500">Tune the neural audit engine parameters and environment preferences.</p>
      </div>

      <div className="space-y-8">
        
        {/* Severity Thresholds */}
        <section className="glass-card p-8">
          <div className="flex items-center gap-3 mb-8">
             <ShieldCheck className="w-5 h-5 text-indigo-400" />
             <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Detection sensitivity</h2>
          </div>
          
          <div className="grid gap-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex-1">
                <p className="text-sm font-bold text-white mb-1">Suppress Informational Audits</p>
                <p className="text-xs text-slate-500">Ignore non-critical stylistic suggestions and architectural trivia.</p>
              </div>
              <button
                onClick={() => update('suppressInfo', !settings.suppressInfo)}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                  settings.suppressInfo ? 'bg-indigo-600 shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-slate-800'
                }`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                  settings.suppressInfo ? 'translate-x-6' : ''
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex-1">
                <p className="text-sm font-bold text-white mb-1">Restrict Minor Performance Scans</p>
                <p className="text-xs text-slate-500">Only report issues with measurable impact (&gt;5ms latency).</p>
              </div>
              <button
                onClick={() => update('suppressMinor', !settings.suppressMinor)}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                  settings.suppressMinor ? 'bg-indigo-600 shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-slate-800'
                }`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                  settings.suppressMinor ? 'translate-x-6' : ''
                }`} />
              </button>
            </div>
          </div>
        </section>

        {/* LLM Provider Selector */}
        <section className="glass-card p-8">
          <div className="flex items-center gap-3 mb-8">
             <Cpu className="w-5 h-5 text-amber-500" />
             <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Neural Inference Engine</h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['auto', 'groq', 'gemini', 'mistral'].map((provider) => (
              <button
                key={provider}
                onClick={() => update('preferredProvider', provider)}
                className={`px-4 py-3 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all border
                  ${settings.preferredProvider === provider
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg'
                    : 'bg-white/5 border-white/5 text-slate-500 hover:text-white hover:bg-white/10'
                  }`}
              >
                {provider}
              </button>
            ))}
          </div>
        </section>

        {/* Ignored Patterns Panel */}
        <section className="glass-card p-8">
          <div className="flex items-center gap-3 mb-8">
             <Lock className="w-5 h-5 text-rose-500" />
             <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Restricted File Globbing</h2>
          </div>
          
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              value={newPattern}
              onChange={(e) => setNewPattern(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addPattern()}
              placeholder="e.g. **/tests/**"
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-xs text-indigo-400 placeholder-slate-700 w-full outline-none focus:border-indigo-500/50 transition-all font-mono"
            />
            <button
              onClick={addPattern}
              className="px-4 bg-white/5 border border-white/5 text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {settings.ignoredPatterns.map((pattern, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-3 py-2 bg-slate-950/40 border border-white/5 rounded-lg group animate-fade-in"
              >
                <span className="text-[10px] font-mono text-slate-400">{pattern}</span>
                <button
                  onClick={() => removePattern(idx)}
                  className="text-slate-600 hover:text-rose-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Danger Zone / Save */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
           <div className="flex items-center gap-4 text-slate-500">
              <Globe className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Global Persistence: Syncing Enabled</span>
           </div>
           
           <button
             onClick={handleSave}
             disabled={saving}
             className="w-full sm:w-auto btn-premium px-12 py-4 text-sm font-bold shadow-indigo-500/20"
           >
             {saving ? 'Synchronizing State...' : 'Commit Changes'}
           </button>
        </div>
        
      </div>

    </div>
  );
}

export default SettingsPage;
