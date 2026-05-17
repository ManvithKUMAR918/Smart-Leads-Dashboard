import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './Sidebar';
import SearchInput from '../ui/SearchInput';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { getInitials } from '../../utils/helpers';
import { Moon, Sun, Bell } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/leads': 'Lead Management',
  '/settings': 'Settings',
};

const DashboardLayout = () => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [globalSearch, setGlobalSearch] = useState('');

  const currentTitle = Object.entries(pageTitles).find(([path]) =>
    location.pathname.startsWith(path)
  )?.[1] ?? 'Dashboard';

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#050505]">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
            background: isDark ? '#18181b' : '#ffffff',
            color: isDark ? '#f4f4f5' : '#18181b',
            border: `1px solid ${isDark ? '#27272a' : '#e4e4e7'}`,
          },
        }}
      />

      <Sidebar />

      {/* ── Main Content Area ─────────────────────────────── */}
      {/* dashboard-main CSS class applies margin-left:260px at ≥1024px (defined in index.css) */}
      <main className="dashboard-main flex flex-col min-h-screen">
        {/* ── Top Header Bar ────────────────────────────── */}
        <header className="sticky top-0 z-20 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border-b border-zinc-200/80 dark:border-zinc-800/60">
          <div className="flex items-center justify-between h-20 px-6 sm:px-8 lg:px-10">
            {/* Left: Page Title (hidden on mobile, hamburger is there) */}
            <h2 className="hidden lg:block text-lg font-semibold text-zinc-900 dark:text-white tracking-tight">
              {currentTitle}
            </h2>

            {/* Spacer for mobile (hamburger occupies the left) */}
            <div className="lg:hidden w-12" />

            {/* Center/Right: Search + Controls */}
            <div className="flex items-center gap-3 flex-1 lg:flex-none lg:ml-auto">
              {/* Global Search */}
              <div className="flex-1 max-w-xs lg:max-w-sm">
                <SearchInput
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch((e.target as HTMLInputElement).value)}
                  placeholder="Search anything..."
                  id="global-search"
                />
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all duration-200"
                id="header-theme-toggle"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
              </button>

              {/* Notifications */}
              <button
                className="relative p-2 rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all duration-200"
                id="notifications-btn"
              >
                <Bell className="w-[18px] h-[18px]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-white dark:ring-zinc-950" />
              </button>

              {/* User Avatar */}
              <div
                className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-[11px] font-bold cursor-pointer shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-shadow duration-300"
                title={user?.name}
                id="header-user-avatar"
              >
                {user ? getInitials(user.name) : '??'}
              </div>
            </div>
          </div>
        </header>

        {/* ── Page Content ──────────────────────────────── */}
        <div className="flex-1 p-6 sm:p-8 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
