import React from 'react';
import { Menu, Bell, Search, Command } from 'lucide-react';
import { GitHubIcon } from '../common/Icons';

function Topbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 h-14 flex items-center justify-between px-6 border-b border-slate-200 dark:border-[#333] bg-white dark:bg-black">
      {/* Search / Context Area */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md border border-slate-200 dark:border-[#333] text-slate-500 dark:text-[#888] hover:text-black dark:hover:text-white transition-all"
          aria-label="Open menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-md bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-[#333] w-full max-w-sm group focus-within:border-black dark:focus-within:border-[#666] transition-all">
          <Search className="w-3.5 h-3.5 text-slate-400 dark:text-[#666]" />
          <input
            type="text"
            placeholder="Search reviews or repos..."
            className="bg-transparent border-none outline-none text-sm text-black dark:text-[#ededed] placeholder-slate-400 dark:placeholder-[#555] w-full"
          />
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-slate-200 dark:border-[#333]">
            <Command className="w-2.5 h-2.5 text-slate-400 dark:text-[#666]" />
            <span className="text-[10px] font-medium text-slate-400 dark:text-[#666]">K</span>
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1 bg-slate-50 dark:bg-[#0a0a0a] rounded-md p-1 border border-slate-200 dark:border-[#333]">
          <button className="px-3 py-1 rounded text-[10px] font-semibold tracking-widest uppercase text-white dark:text-black bg-black dark:bg-white transition-colors">Mainnet</button>
          <button className="px-3 py-1 rounded text-[10px] font-semibold tracking-widest uppercase text-slate-500 dark:text-[#888] hover:text-black dark:hover:text-white transition-colors">Staging</button>
        </div>

        <div className="w-px h-5 bg-slate-200 dark:bg-[#333]" />

        <button className="relative p-2 rounded-md text-slate-500 dark:text-[#888] hover:text-black dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#111] transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-black dark:bg-white rounded-full" />
        </button>

        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-md text-slate-500 dark:text-[#888] hover:text-black dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#111] transition-all flex items-center justify-center"
          aria-label="GitHub"
        >
          <GitHubIcon className="w-4 h-4" />
        </a>

        <div className="w-8 h-8 rounded-full bg-black dark:bg-white border border-slate-200 dark:border-[#333] flex items-center justify-center cursor-pointer overflow-hidden hover:opacity-80 transition-opacity">
          <img src="https://ui-avatars.com/api/?name=V&background=000000&color=fff&size=32" alt="avatar" className="w-full h-full object-cover" />
        </div>
      </div>
    </header>
  );
}

export default Topbar;
