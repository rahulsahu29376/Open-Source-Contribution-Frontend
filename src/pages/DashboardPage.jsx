import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { progressApi, lessonApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  BookOpen,
  Terminal,
  Award,
  GitPullRequest,
  Flame,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  FolderGit2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Card } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { ProgressBar } from '../components/common/ProgressBar.jsx';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.jsx';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [nextLesson, setNextLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [sumRes, lesRes] = await Promise.all([
          progressApi.getSummary(),
          lessonApi.getLessons(),
        ]);
        setSummary(sumRes.data.data.summary);

        const allLessons = lesRes.data.data.lessons;
        const incomplete = allLessons.find((l) => !l.completed);
        setNextLesson(incomplete || allLessons[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="max-w-6xl mx-auto py-8"><LoadingSkeleton count={3} /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4 sm:py-6">
      {/* Welcome Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-primary via-indigo-600 to-secondary p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md">
              {user?.experienceLevel || 'Beginner'} Developer
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-black/20 px-2.5 py-1 rounded-full">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>{summary?.streakDays || 1} Day Streak</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.fullName}! 👋
          </h1>
          <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
            Ready to take the next step toward your first open-source contribution? Check your progress, practice commands, or jump back into lessons below.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            {nextLesson && (
              <Link to={`/learn/${nextLesson.slug}`}>
                <Button size="sm" className="bg-white text-primary hover:bg-slate-100 shadow-md">
                  Continue Learning: {nextLesson.title}
                </Button>
              </Link>
            )}
            <Link to="/playground">
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                Open Git Playground
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
          <GitPullRequest className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-textMain-mutedLight dark:text-textMain-mutedDark">
            <span>Lessons Completed</span>
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-black text-textMain-light dark:text-textMain-dark">
            {summary?.completedLessons || 0} / {summary?.totalLessons || 14}
          </div>
          <ProgressBar value={summary?.completedLessons || 0} max={summary?.totalLessons || 14} showPercentage={false} size="sm" />
        </Card>

        <Card className="p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-textMain-mutedLight dark:text-textMain-mutedDark">
            <span>Badges Earned</span>
            <Award className="w-4 h-4 text-secondary" />
          </div>
          <div className="text-2xl font-black text-textMain-light dark:text-textMain-dark">
            {summary?.earnedAchievements?.length || 0} / {summary?.totalAchievements || 8}
          </div>
          <p className="text-[11px] text-textMain-mutedLight dark:text-textMain-mutedDark">
            Keep practicing to unlock all 8
          </p>
        </Card>

        <Card className="p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-textMain-mutedLight dark:text-textMain-mutedDark">
            <span>Contributions</span>
            <GitPullRequest className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-textMain-light dark:text-textMain-dark">
            {summary?.contributionsCount || 0}
          </div>
          <p className="text-[11px] text-textMain-mutedLight dark:text-textMain-mutedDark">
            Tracked in First PR Wizard
          </p>
        </Card>

        <Card className="p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-textMain-mutedLight dark:text-textMain-mutedDark">
            <span>Saved Bookmarks</span>
            <Bookmark className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-textMain-light dark:text-textMain-dark">
            {summary?.bookmarksCount || 0}
          </div>
          <p className="text-[11px] text-textMain-mutedLight dark:text-textMain-mutedDark">
            Issues & learning resources
          </p>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recommended Next Step & Quick Practice */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recommended Lesson Card */}
          {nextLesson && (
            <Card hover className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="primary" size="sm">
                  Recommended Next Lesson
                </Badge>
                <span className="text-xs text-textMain-mutedLight dark:text-textMain-mutedDark">
                  {nextLesson.moduleName}
                </span>
              </div>

              <h3 className="text-lg font-bold text-textMain-light dark:text-textMain-dark">
                {nextLesson.title}
              </h3>

              <p className="text-xs text-textMain-mutedLight dark:text-textMain-mutedDark leading-relaxed">
                {nextLesson.description}
              </p>

              <div className="pt-2 flex justify-end">
                <Link to={`/learn/${nextLesson.slug}`}>
                  <Button size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Start This Lesson
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {/* Quick Practice Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/playground">
              <Card hover className="p-4 space-y-2 h-full">
                <Terminal className="w-6 h-6 text-primary" />
                <h4 className="text-xs font-bold text-textMain-light dark:text-textMain-dark">
                  Git Playground
                </h4>
                <p className="text-[11px] text-textMain-mutedLight dark:text-textMain-mutedDark">
                  Practice commands, staging, commits, and branches in-browser.
                </p>
              </Card>
            </Link>

            <Link to="/explore">
              <Card hover className="p-4 space-y-2 h-full">
                <FolderGit2 className="w-6 h-6 text-secondary" />
                <h4 className="text-xs font-bold text-textMain-light dark:text-textMain-dark">
                  Explore Repos
                </h4>
                <p className="text-[11px] text-textMain-mutedLight dark:text-textMain-mutedDark">
                  Search live GitHub repositories with good-first-issue labels.
                </p>
              </Card>
            </Link>

            <Link to="/first-contribution">
              <Card hover className="p-4 space-y-2 h-full">
                <GitPullRequest className="w-6 h-6 text-emerald-500" />
                <h4 className="text-xs font-bold text-textMain-light dark:text-textMain-dark">
                  PR Wizard
                </h4>
                <p className="text-[11px] text-textMain-mutedLight dark:text-textMain-mutedDark">
                  Follow the 10-step guided first contribution walkthrough.
                </p>
              </Card>
            </Link>
          </div>
        </div>

        {/* Right Col: Badges & Recent Activity */}
        <div className="space-y-6">
          {/* Recent Badges Showcase */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-textMain-light dark:text-textMain-dark">
                Earned Badges
              </h3>
              <Link to="/progress" className="text-xs font-semibold text-primary hover:underline">
                View All
              </Link>
            </div>

            {summary?.earnedAchievements?.length === 0 ? (
              <p className="text-xs text-textMain-mutedLight dark:text-textMain-mutedDark italic">
                No badges earned yet. Complete lessons or Playground challenges to unlock badges!
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {summary?.earnedAchievements?.slice(0, 4).map((badge) => (
                  <div
                    key={badge.id}
                    className="p-3 rounded-xl border border-primary/20 bg-primary/5 flex items-center gap-2.5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-xs text-textMain-light dark:text-textMain-dark block truncate">
                        {badge.name}
                      </span>
                      <span className="text-[10px] text-textMain-mutedLight dark:text-textMain-mutedDark">
                        Unlocked
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Activity Feed */}
          <Card className="p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-textMain-light dark:text-textMain-dark">
              Recent Activity
            </h3>
            {summary?.recentActivities?.length === 0 ? (
              <p className="text-xs text-textMain-mutedLight dark:text-textMain-mutedDark italic">
                No recorded activity yet.
              </p>
            ) : (
              <div className="space-y-2.5">
                {summary?.recentActivities?.map((act) => (
                  <div key={act.id} className="flex items-start gap-2.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-textMain-light dark:text-textMain-dark">
                        {act.activityType.replace('_', ' ').toUpperCase()}
                      </p>
                      <p className="text-[10px] text-textMain-mutedLight dark:text-textMain-mutedDark">
                        {new Date(act.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
