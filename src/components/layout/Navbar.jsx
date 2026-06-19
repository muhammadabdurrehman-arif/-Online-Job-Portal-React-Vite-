import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { Briefcase, Sun, Moon, Bell, Mail, LogOut, Menu, X, User } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  const notifRef = useRef(null);
  const userRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Handle outside clicks
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifDropdown(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Close menus on page change
  useEffect(() => {
    setIsOpen(false);
    setShowNotifDropdown(false);
    setShowUserDropdown(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const renderNavLinks = () => {
    if (!user) {
      return (
        <>
          <Link to="/jobs" className="nav-link">Search Jobs</Link>
          <Link to="/login" className="nav-link font-medium text-brand-600 dark:text-brand-400">Login</Link>
          <Link to="/signup" className="btn-primary py-1.5 px-4 text-sm">Register</Link>
        </>
      );
    }

    if (user.role === 'seeker') {
      return (
        <>
          <Link to="/seeker/dashboard" className={`nav-link ${location.pathname.includes('/seeker/dashboard') ? 'nav-active' : ''}`}>Dashboard</Link>
          <Link to="/jobs" className={`nav-link ${location.pathname === '/jobs' ? 'nav-active' : ''}`}>Find Jobs</Link>
          <Link to="/seeker/applications" className={`nav-link ${location.pathname.includes('/seeker/applications') ? 'nav-active' : ''}`}>Tracker</Link>
          <Link to="/seeker/resume-builder" className={`nav-link ${location.pathname.includes('/seeker/resume-builder') ? 'nav-active' : ''}`}>Resume Builder</Link>
          <Link to="/seeker/quizzes" className={`nav-link ${location.pathname.includes('/seeker/quizzes') ? 'nav-active' : ''}`}>Assessments</Link>
          <Link to="/seeker/interview-prep" className={`nav-link ${location.pathname.includes('/seeker/interview-prep') ? 'nav-active' : ''}`}>Interview Prep</Link>
        </>
      );
    }

    if (user.role === 'employer') {
      return (
        <>
          <Link to="/employer/dashboard" className={`nav-link ${location.pathname.includes('/employer/dashboard') ? 'nav-active' : ''}`}>Dashboard</Link>
          <Link to="/employer/post-job" className={`nav-link ${location.pathname.includes('/employer/post-job') ? 'nav-active' : ''}`}>Post Job</Link>
          <Link to="/employer/applicants" className={`nav-link ${location.pathname.includes('/employer/applicants') ? 'nav-active' : ''}`}>ATS (Applicants)</Link>
        </>
      );
    }

    if (user.role === 'admin') {
      return (
        <>
          <Link to="/admin/dashboard" className={`nav-link ${location.pathname.includes('/admin/dashboard') ? 'nav-active' : ''}`}>Analytics</Link>
          <Link to="/admin/users" className={`nav-link ${location.pathname.includes('/admin/users') ? 'nav-active' : ''}`}>Manage Users</Link>
          <Link to="/admin/jobs" className={`nav-link ${location.pathname.includes('/admin/jobs') ? 'nav-active' : ''}`}>Manage Jobs</Link>
        </>
      );
    }

    return null;
  };

  return (
    <nav className="sticky top-0 z-40 w-full glass-card border-b border-slate-200/80 dark:border-slate-800/85">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-brand-600 to-blue-500 text-white shadow-md group-hover:scale-105 transition-transform">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-600 via-blue-600 to-indigo-600 dark:from-brand-400 dark:via-blue-400 dark:to-indigo-400">
                CareerConnect
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {renderNavLinks()}
          </div>

          {/* Utility Tools */}
          <div className="hidden md:flex items-center gap-4">
            {/* Email Simulator */}
            <Link
              to="/email-simulation"
              title="Email Simulation Center"
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Mail className="h-5 w-5" />
            </Link>

            {/* Dark Mode Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* In-app Notification Panel */}
            {user && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                  className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {showNotifDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden">
                    <NotificationCenter onClose={() => setShowNotifDropdown(false)} />
                  </div>
                )}
              </div>
            )}

            {/* User Profile Menu */}
            {user && (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="h-7 w-7 rounded-lg bg-brand-500 text-white flex items-center justify-center font-bold text-sm uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold max-w-[90px] truncate">{user.name}</span>
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden py-1">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Logged in as</p>
                      <p className="text-xs font-bold text-brand-600 dark:text-brand-400 capitalize mt-0.5">{user.role}</p>
                    </div>
                    {user.role === 'seeker' && (
                      <Link to="/seeker/profile" className="dropdown-item">View Profile</Link>
                    )}
                    {user.role === 'employer' && (
                      <Link to="/employer/profile" className="dropdown-item">Company Profile</Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="dropdown-item w-full text-left text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggler */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden glass-card border-t border-slate-200/80 dark:border-slate-800/80 px-4 pt-2 pb-4 space-y-2">
          {user && (
            <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl mb-2">
              <p className="font-bold text-sm">{user.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role}</p>
            </div>
          )}
          
          <div className="flex flex-col gap-1">
            {renderNavLinks()}
            <Link to="/email-simulation" className="nav-link flex items-center gap-2 py-2">
              <Mail className="h-4 w-4" />
              Email Simulation Center
            </Link>
            {user && (
              <button
                onClick={handleLogout}
                className="w-full text-left text-rose-600 nav-link flex items-center gap-2 py-2 mt-2 border-t border-slate-100 dark:border-slate-800"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
