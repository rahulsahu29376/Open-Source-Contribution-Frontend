import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Terminal,
  Award,
  Search,
  GitPullRequest,
  TrendingUp,
  Bookmark,
  FolderGit2,
  User,
  Settings,
  Sparkles,
} from 'lucide-react';

export const Sidebar = () => {
  const mainLinks = [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Learn Git', to: '/learn', icon: BookOpen },
    { label: 'Git Playground', to: '/playground', icon: Terminal, badge: 'Interactive' },
    { label: 'Quizzes', to: '/quizzes', icon: Award },
    { label: 'Explore Projects', to: '/explore', icon: Search },
    { label: 'First Contribution', to: '/first-contribution', icon: GitPullRequest, badge: 'Wizard' },
    { label: 'My Progress', to: '/progress', icon: TrendingUp },
  ];

  const userLinks = [
    { label: 'Bookmarks', to: '/bookmarks', icon: Bookmark },
    { label: 'Saved Projects', to: '/saved-projects', icon: FolderGit2 },
    { label: 'Profile', to: '/profile', icon: User },
    { label: 'Settings', to: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block border-r border-surface-borderLight dark:border-surface-borderDark bg-white dark:bg-surface-cardDark min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Main Learning Hub */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-textMain-mutedLight dark:text-textMain-mutedDark">
            Learning Portal
          </div>
          <div className="space-y-1">
            {mainLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-primary text-white shadow-sm shadow-primary/30'
                      : 'text-textMain-mutedLight dark:text-textMain-mutedDark hover:text-textMain-light dark:hover:text-textMain-dark hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-white/20 text-current">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* User Workspace */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-textMain-mutedLight dark:text-textMain-mutedDark">
            My Workspace
          </div>
          <div className="space-y-1">
            {userLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-primary text-white shadow-sm shadow-primary/30'
                      : 'text-textMain-mutedLight dark:text-textMain-mutedDark hover:text-textMain-light dark:hover:text-textMain-dark hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* Motivation Callout */}
      <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-transparent border border-primary/20 text-xs">
        <div className="flex items-center gap-2 text-primary font-bold mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Need Guidance?</span>
        </div>
        <p className="text-[11px] text-textMain-mutedLight dark:text-textMain-mutedDark mb-3 leading-relaxed">
          Open the AI Assistant anytime to explain Git errors or craft an action plan.
        </p>
      </div>
    </aside>
  );
};
