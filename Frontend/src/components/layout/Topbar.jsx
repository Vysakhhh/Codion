import React from 'react';
import { Menu, Bell, Search, Command } from 'lucide-react';
import { GitHubIcon } from '../common/Icons';

function Topbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 h-20 flex items-center justify-between px-6 border-b border-white/5 bg-slate-950/40 backdrop-blur-xl">
      {/* Search / Context Area */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all shadow-lg"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/5 w-full max-w-sm group focus-within:border-indigo-500/50 transition-all">
          <Search className="w-4 h-4 text-slate-500 group-focus-within:text-indigo-400" />
          <input 
            type="text" 
            placeholder="Search reviews or repos..." 
            className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-500 w-full"
          />
          <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10">
             <Command className="w-3 h-3 text-slate-500" />
             <span className="text-[10px] font-bold text-slate-500">K</span>
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/5">
           <button className="px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase text-white bg-indigo-600 shadow-lg">Mainnet</button>
           <button className="px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase text-slate-500 hover:text-slate-300 transition-colors">Staging</button>
        </div>

        <div className="w-px h-6 bg-white/10" />

        <button className="relative p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-950 group-hover:animate-ping" />
        </button>

        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all flex items-center justify-center"
          aria-label="GitHub"
        >
          <GitHubIcon className="w-5 h-5" />
        </a>

        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 border border-white/10 flex items-center justify-center cursor-pointer shadow-lg hover:ring-2 hover:ring-indigo-500/50 transition-all overflow-hidden">
          <img src="https://ui-avatars.com/api/?name=Vysakh&background=6366f1&color=fff" alt="avatar" />
        </div>
      </div>
    </header>
  );
}

export default Topbar;
