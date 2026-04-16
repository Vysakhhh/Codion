import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileSearch,
  FolderGit2,
  Settings,
  Upload,
  Code2,
  X,
  Sparkles,
  Command,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/reviews', icon: FileSearch, label: 'Reviews' },
  { to: '/upload', icon: Upload, label: 'Code Upload' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile backdrop with heavy blur */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-slate-900/60 backdrop-blur-2xl border-r border-white/5
          flex flex-col
          transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand/Logo Section */}
        <div className="flex items-center justify-between h-20 px-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Codion
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `nav-link-premium ${isActive ? 'nav-link-active' : ''}`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Plan / User Section */}
        <div className="p-4 mx-4 mb-6 rounded-2xl bg-white/[0.03] border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-xs font-bold text-white">U</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">Vysakh</p>
              <p className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase">Free Tier</p>
            </div>
          </div>
          
          <div className="bg-slate-950/50 rounded-lg p-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span className="text-[10px] font-bold text-slate-400">10 / 10 Left</span>
            </div>
            <div className="h-1 w-12 bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full w-full bg-indigo-500" />
            </div>
          </div>
        </div>

        {/* Bottom shortcuts */}
        <div className="px-6 py-4 flex items-center gap-4 text-slate-500 border-t border-white/5">
           <button className="hover:text-white transition-colors"><Command className="w-4 h-4" /></button>
           <button className="hover:text-white transition-colors text-xs font-mono font-bold">V2.5.0</button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
