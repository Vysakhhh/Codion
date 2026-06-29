import React, { useState } from 'react';
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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/reviews', icon: FileSearch, label: 'Reviews' },
  { to: '/repositories', icon: FolderGit2, label: 'Repositories' },
  { to: '/upload', icon: Upload, label: 'Code Upload' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

function Sidebar({ isOpen, onClose, collapsed, onToggleCollapse }) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          ${collapsed ? 'w-[60px]' : 'w-56'}
          bg-white dark:bg-black border-r border-slate-200 dark:border-[#333]
          flex flex-col
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand / Logo — exactly h-14 to match Topbar */}
        <div className="flex items-center h-14 px-4 border-b border-slate-200 dark:border-[#333] flex-shrink-0 relative">
          {/* Logo icon — always visible */}
          <div className="w-7 h-7 bg-black dark:bg-white rounded-md flex items-center justify-center flex-shrink-0">
            <Code2 className="w-4 h-4 text-white dark:text-black" />
          </div>

          {/* Brand name — hidden when collapsed */}
          {!collapsed && (
            <span className="ml-3 text-base font-bold text-black dark:text-white tracking-tight whitespace-nowrap overflow-hidden">
              Codion
            </span>
          )}

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden ml-auto p-1.5 rounded text-slate-400 hover:bg-slate-100 dark:hover:bg-[#111] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Desktop collapse toggle — sits on the border edge */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white dark:bg-black border border-slate-200 dark:border-[#333] items-center justify-center text-slate-400 dark:text-[#666] hover:text-black dark:hover:text-white hover:border-slate-400 dark:hover:border-[#555] transition-all shadow-sm z-10"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-2.5 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                  collapsed ? 'justify-center' : ''
                } ${
                  isActive
                    ? 'bg-slate-100 dark:bg-[#111] text-black dark:text-[#ededed]'
                    : 'text-slate-500 dark:text-[#888] hover:text-black dark:hover:text-[#ededed] hover:bg-slate-50 dark:hover:bg-[#0a0a0a]'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User / Plan Section */}
        {!collapsed ? (
          <div className="p-3 mx-3 mb-3 rounded-lg bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-[#333]">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-full bg-black dark:bg-white flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-semibold text-white dark:text-black">V</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-black dark:text-white truncate leading-none mb-0.5">Vysakh</p>
                <p className="text-[11px] text-slate-500 dark:text-[#888]">Hobby Plan</p>
              </div>
            </div>
            <div className="bg-white dark:bg-[#111] rounded p-2 border border-slate-100 dark:border-[#333] flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-black dark:text-white flex-shrink-0" />
                <span className="text-[11px] font-medium text-slate-500 dark:text-[#888]">10 / 10 Left</span>
              </div>
              <div className="h-1 w-12 bg-slate-200 dark:bg-[#333] rounded-full overflow-hidden">
                <div className="h-full w-full bg-black dark:bg-white" />
              </div>
            </div>
          </div>
        ) : (
          /* Collapsed: just show the avatar */
          <div className="flex justify-center pb-3">
            <div className="w-7 h-7 rounded-full bg-black dark:bg-white flex items-center justify-center">
              <span className="text-xs font-semibold text-white dark:text-black">V</span>
            </div>
          </div>
        )}

        {/* Bottom bar */}
        <div className={`px-3 py-3 flex items-center gap-3 text-slate-400 dark:text-[#666] border-t border-slate-200 dark:border-[#333] ${collapsed ? 'justify-center' : ''}`}>
          <button className="hover:text-black dark:hover:text-white transition-colors p-1">
            <Command className="w-3.5 h-3.5" />
          </button>
          {!collapsed && (
            <span className="text-[11px] font-mono text-slate-400 dark:text-[#666]">v3.0.0</span>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
