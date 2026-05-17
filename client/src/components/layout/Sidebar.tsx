import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { getInitials } from '../../utils/helpers';
import {
  HiOutlineViewGrid,
  HiOutlineUsers,
  HiOutlineLogout,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineMenu,
  HiOutlineX,
} from 'react-icons/hi';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: HiOutlineViewGrid },
    { path: '/leads', label: 'Leads', icon: HiOutlineUsers },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-surface-200 dark:border-surface-700/50">
        <Link to="/dashboard" className="flex items-center gap-3" onClick={() => setIsMobileOpen(false)}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25">
            <span className="text-white font-bold text-sm">SL</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-surface-900 dark:text-white leading-tight">Smart Leads</h1>
            <p className="text-[10px] font-medium text-surface-400 dark:text-surface-500 uppercase tracking-wider">Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 shadow-sm'
                  : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800/50 hover:text-surface-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-primary-600 dark:text-primary-400' : ''}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-surface-200 dark:border-surface-700/50 space-y-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800/50 transition-all duration-200"
          id="theme-toggle"
        >
          {isDark ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-100 dark:bg-surface-800/50">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user ? getInitials(user.name) : '??'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-[11px] text-surface-500 dark:text-surface-400 capitalize">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
            title="Logout"
            id="logout-button"
          >
            <HiOutlineLogout className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white dark:bg-surface-800 shadow-lg border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300"
        id="mobile-menu-toggle"
      >
        <HiOutlineMenu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700/50 transform transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setIsMobileOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-white"
        >
          <HiOutlineX className="w-5 h-5" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700/50 z-30">
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
