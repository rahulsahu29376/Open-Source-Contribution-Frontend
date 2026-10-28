import React from 'react';
import { Link } from 'react-router-dom';
import { GitPullRequest, Github, Heart, Shield, BookOpen } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-surface-borderLight dark:border-surface-borderDark bg-white dark:bg-surface-cardDark text-textMain-light dark:text-textMain-dark transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white">
                <GitPullRequest className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight">OpenSource Guide</span>
            </div>
            <p className="text-xs text-textMain-mutedLight dark:text-textMain-mutedDark leading-relaxed">
              An interactive, beginner-friendly platform designed to help new programmers understand Git, collaborate with confidence, and make their first pull request.
            </p>
          </div>

          {/* Curriculum */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-textMain-light dark:text-textMain-dark">
              Curriculum
            </h4>
            <ul className="space-y-2 text-xs text-textMain-mutedLight dark:text-textMain-mutedDark">
              <li><Link to="/learn" className="hover:text-primary transition-colors">What is Open Source?</Link></li>
              <li><Link to="/learn" className="hover:text-primary transition-colors">Git Fundamentals</Link></li>
              <li><Link to="/learn" className="hover:text-primary transition-colors">Branches & Merging</Link></li>
              <li><Link to="/learn" className="hover:text-primary transition-colors">Fork & PR Lifecycle</Link></li>
              <li><Link to="/learn" className="hover:text-primary transition-colors">Troubleshooting & Recovery</Link></li>
            </ul>
          </div>

          {/* Interactive Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-textMain-light dark:text-textMain-dark">
              Interactive Tools
            </h4>
            <ul className="space-y-2 text-xs text-textMain-mutedLight dark:text-textMain-mutedDark">
              <li><Link to="/playground" className="hover:text-primary transition-colors">Git Browser Simulator</Link></li>
              <li><Link to="/quizzes" className="hover:text-primary transition-colors">Skill Assessments</Link></li>
              <li><Link to="/explore" className="hover:text-primary transition-colors">Good First Issues Explorer</Link></li>
              <li><Link to="/first-contribution" className="hover:text-primary transition-colors">10-Step Contribution Wizard</Link></li>
              <li><Link to="/progress" className="hover:text-primary transition-colors">Achievement Badges</Link></li>
            </ul>
          </div>

          {/* Open Source Standards & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-textMain-light dark:text-textMain-dark">
              Standards & Community
            </h4>
            <ul className="space-y-2 text-xs text-textMain-mutedLight dark:text-textMain-mutedDark">
              <li><Link to="/about" className="hover:text-primary transition-colors">About the Project</Link></li>
              <li><Link to="/contributing" className="hover:text-primary transition-colors">Contribution Guidelines</Link></li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" />
                  GitHub Repository
                </a>
              </li>
              <li className="text-[11px] text-textMain-mutedLight dark:text-textMain-mutedDark pt-2">
                Distributed under the permissive MIT Open Source License. Built for students & learners.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-surface-borderLight dark:border-surface-borderDark flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-textMain-mutedLight dark:text-textMain-mutedDark">
          <p>© {new Date().getFullYear()} Open-Source Beginner Guide. Free, open-source, and community-driven.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Notice</Link>
            <Link to="/contributing" className="hover:text-primary transition-colors">Code of Conduct</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
