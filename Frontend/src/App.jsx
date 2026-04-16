import React, { useState } from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ReviewDetail from './pages/ReviewDetail';
import UploadPage from './pages/UploadPage';
import SettingsPage from './pages/SettingsPage';
import Login from './pages/Login';

function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 font-sans">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
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
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
