import React, { useState } from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ReviewDetail from './pages/ReviewDetail';
import UploadPage from './pages/UploadPage';
import SettingsPage from './pages/SettingsPage';
import Repositories from './pages/Repositories';
import Login from './pages/Login';

function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-white dark:bg-black text-black dark:text-[#ededed] font-sans overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Public routes — no sidebar */}
      <Route path="/welcome" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      {/* App routes — with sidebar shell */}
      <Route element={<AppShell />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/review/:id" element={<ReviewDetail />} />
        <Route path="/reviews" element={<Dashboard />} />
        <Route path="/repositories" element={<Repositories />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
