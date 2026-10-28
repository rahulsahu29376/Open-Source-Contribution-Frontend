import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  GitPullRequest,
  Sun,
  Moon,
  Menu,
  X,
  Compass,
  Terminal,
  Search,
  Award,
  BookOpen,
  User,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { Button } from '../common/Button.jsx';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const navLinks = [
    { label: 'Learn', to: '/learn', icon: BookOpen },
    { label: 'Playground', to: '/playground', icon: Terminal },
    { label: 'Quizzes', to: '/quizzes', icon: Award },
    { label: 'Explore', to: '/explore', icon: Search },
    { label: 'First PR Wizard', to: '/first-contribution', icon: GitPullRequest },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <nav className="sticky top-0 z-40 border-b border-surface-borderLight dark:border-surface-borderDark bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              <GitPullRequest className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                OpenSource
              </span>
              <span className="text-xs font-semibold ml-1 px-1.5 py-0.5 rounded-md bg-primary/10 text-primary">
                Beginner
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    active
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-textMain-mutedLight dark:text-textMain-mutedDark hover:text-textMain-light dark:hover:text-textMain-dark hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
              className="p-2 rounded-xl text-textMain-mutedLight dark:text-textMain-mutedDark hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Auth Actions */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-surface-borderLight dark:border-surface-borderDark hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary text-white font-bold text-xs flex items-center justify-center">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold text-textMain-light dark:text-textMain-dark max-w-[100px] truncate">
                    {user?.fullName}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-surface-cardDark border border-surface-borderLight dark:border-surface-borderDark shadow-xl py-2 z-50 animate-fade-in"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-surface-borderLight dark:border-surface-borderDark">
                      <p className="text-xs font-bold text-textMain-light dark:text-textMain-dark truncate">
                        {user?.fullName}
                      </p>
                      <p className="text-[11px] text-textMain-mutedLight dark:text-textMain-mutedDark truncate">
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-textMain-light dark:text-textMain-dark hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <LayoutDashboard className="w-4 h-4 text-primary" />
                      Dashboard
                    </Link>

                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-textMain-light dark:text-textMain-dark hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <User className="w-4 h-4 text-primary" />
                      Profile & Badges
                    </Link>

                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-error hover:bg-error/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-xl text-textMain-mutedLight dark:text-textMain-mutedDark hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 space-y-2 border-t border-surface-borderLight dark:border-surface-borderDark bg-white dark:bg-surface-dark">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-textMain-light dark:text-textMain-dark hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <link.icon className="w-5 h-5 text-primary" />
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <>
              <div className="pt-2 border-t border-surface-borderLight dark:border-surface-borderDark" />
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-textMain-light dark:text-textMain-dark hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <LayoutDashboard className="w-5 h-5 text-primary" />
                My Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-textMain-light dark:text-textMain-dark hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <User className="w-5 h-5 text-primary" />
                Profile Settings
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
