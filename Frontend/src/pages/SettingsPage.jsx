import React, { useState } from 'react';
import {
  Save,
  Plus,
  X,
  Cpu,
  ShieldCheck,
  Activity,
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
  const [saved, setSaved] = useState(false);
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
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000); }, 1000);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto pb-24">

      {/* Header */}
      <div className="mb-10 pb-6 border-b border-slate-200 dark:border-[#333]">
        <h1 className="text-3xl font-semibold text-black dark:text-[#ededed] tracking-tight mb-2">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-[#888]">Configure the AI audit engine parameters and environment preferences.</p>
      </div>

      <div className="space-y-6">

        {/* Detection Sensitivity */}
        <section className="vercel-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="w-4 h-4 text-slate-500 dark:text-[#888]" />
            <h2 className="text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-[#888]">Detection Sensitivity</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-[#333]">
              <div className="flex-1 pr-8">
                <p className="text-sm font-medium text-black dark:text-[#ededed] mb-1">Suppress Informational Audits</p>
                <p className="text-xs text-slate-500 dark:text-[#888]">Ignore non-critical stylistic suggestions and architectural trivia.</p>
              </div>
              <button
                onClick={() => update('suppressInfo', !settings.suppressInfo)}
                className={`relative w-10 h-5 rounded-full transition-all duration-200 flex-shrink-0 ${
                  settings.suppressInfo ? 'bg-black dark:bg-white' : 'bg-slate-200 dark:bg-[#333]'
                }`}
              >
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white dark:bg-black transition-transform duration-200 ${
                  settings.suppressInfo ? 'translate-x-5' : ''
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between py-4">
              <div className="flex-1 pr-8">
                <p className="text-sm font-medium text-black dark:text-[#ededed] mb-1">Suppress Minor Performance Scans</p>
                <p className="text-xs text-slate-500 dark:text-[#888]">Only report issues with measurable impact (&gt;5ms latency).</p>
              </div>
              <button
                onClick={() => update('suppressMinor', !settings.suppressMinor)}
                className={`relative w-10 h-5 rounded-full transition-all duration-200 flex-shrink-0 ${
                  settings.suppressMinor ? 'bg-black dark:bg-white' : 'bg-slate-200 dark:bg-[#333]'
                }`}
              >
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white dark:bg-black transition-transform duration-200 ${
                  settings.suppressMinor ? 'translate-x-5' : ''
                }`} />
              </button>
            </div>
          </div>
        </section>

        {/* AI Provider Selector */}
        <section className="vercel-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Cpu className="w-4 h-4 text-slate-500 dark:text-[#888]" />
            <h2 className="text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-[#888]">AI Inference Engine</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['auto', 'groq', 'gemini', 'mistral'].map((provider) => (
              <button
                key={provider}
                onClick={() => update('preferredProvider', provider)}
                className={`px-4 py-2.5 rounded-md text-[10px] font-medium tracking-widest uppercase transition-all border ${
                  settings.preferredProvider === provider
                    ? 'bg-black dark:bg-white border-black dark:border-white text-white dark:text-black'
                    : 'bg-transparent border-slate-200 dark:border-[#333] text-slate-500 dark:text-[#888] hover:border-slate-400 dark:hover:border-[#555] hover:text-black dark:hover:text-white'
                }`}
              >
                {provider}
              </button>
            ))}
          </div>
        </section>

        {/* Ignored Patterns */}
        <section className="vercel-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-4 h-4 text-slate-500 dark:text-[#888]" />
            <h2 className="text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-[#888]">Ignored File Patterns</h2>
          </div>

          <div className="flex gap-2 mb-5">
            <input
              type="text"
              value={newPattern}
              onChange={(e) => setNewPattern(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addPattern()}
              placeholder="e.g. **/tests/**"
              className="flex-1 px-3 py-2 rounded-md bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-[#333] text-xs text-black dark:text-[#ededed] placeholder-slate-400 dark:placeholder-[#555] outline-none focus:border-black dark:focus:border-[#666] transition-all font-mono"
            />
            <button
              onClick={addPattern}
              className="px-3 py-2 border border-slate-200 dark:border-[#333] rounded-md text-slate-500 dark:text-[#888] hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {settings.ignoredPatterns.map((pattern, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-[#333] rounded-md"
              >
                <span className="text-[11px] font-mono text-slate-600 dark:text-[#a1a1aa]">{pattern}</span>
                <button
                  onClick={() => removePattern(idx)}
                  className="text-slate-400 dark:text-[#666] hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3 text-slate-400 dark:text-[#666]">
            <Globe className="w-4 h-4" />
            <span className="text-[11px] font-medium uppercase tracking-wider">Global Persistence Enabled</span>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto btn-primary px-10 py-2.5"
          >
            {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>

      </div>
    </div>
  );
}

export default SettingsPage;
