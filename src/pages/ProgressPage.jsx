import React, { useState, useEffect } from 'react';
import { progressApi, contributionApi } from '../services/api.js';
import {
  Award,
  TrendingUp,
  CheckCircle2,
  Lock,
  GitPullRequest,
  ExternalLink,
  Sparkles,
  BarChart2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { ProgressBar } from '../components/common/ProgressBar.jsx';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.jsx';

export const ProgressPage = () => {
  const [achievements, setAchievements] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [achRes, contRes, sumRes] = await Promise.all([
          progressApi.getAchievements(),
          contributionApi.getContributions(),
          progressApi.getSummary(),
        ]);
        setAchievements(achRes.data.data.achievements);
        setContributions(contRes.data.data.contributions);
        setSummary(sumRes.data.data.summary);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Data for Recharts progress visualization
  const chartData = [
    { name: 'Mod 1: Intro', completed: 2, total: 2 },
    { name: 'Mod 2: Git Basics', completed: summary?.completedLessons > 2 ? 3 : 1, total: 3 },
    { name: 'Mod 3: GitHub', completed: summary?.completedLessons > 5 ? 2 : 1, total: 2 },
    { name: 'Mod 4: Branches', completed: summary?.completedLessons > 7 ? 2 : 0, total: 2 },
    { name: 'Mod 5: Issues', completed: summary?.completedLessons > 9 ? 2 : 0, total: 2 },
    { name: 'Mod 6: Forks & PRs', completed: summary?.completedLessons > 11 ? 2 : 0, total: 2 },
    { name: 'Mod 7: Recovery', completed: summary?.completedLessons > 13 ? 1 : 0, total: 1 },
  ];

  if (loading) return <div className="max-w-5xl mx-auto py-8"><LoadingSkeleton count={3} /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4 sm:py-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
          <TrendingUp className="w-4 h-4" />
          <span>My Learning Journey</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-textMain-light dark:text-textMain-dark">
          Progress & Achievements
        </h1>
        <p className="text-xs sm:text-sm text-textMain-mutedLight dark:text-textMain-mutedDark">
          Detailed metrics of your lessons, skill badges, and recorded open-source pull requests.
        </p>
      </div>

      {/* Progress Chart */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm text-textMain-light dark:text-textMain-dark">
            <BarChart2 className="w-4 h-4 text-primary" />
            <span>Curriculum Completion by Module</span>
          </div>
          <span className="text-xs font-semibold text-primary">
            {summary?.completionPercentage || 0}% Total Progress
          </span>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="completed" fill="#6366F1" radius={[6, 6, 0, 0]} name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Badges Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-textMain-light dark:text-textMain-dark flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Achievement Badges ({achievements.filter((a) => a.isEarned).length}/{achievements.length})</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((ach) => (
            <Card
              key={ach.id}
              className={`p-5 flex flex-col justify-between space-y-3 transition-all ${
                ach.isEarned
                  ? 'border-primary/40 bg-primary/5 shadow-sm'
                  : 'opacity-60 bg-surface-light/40 dark:bg-surface-cardDark/40'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      ach.isEarned
                        ? 'bg-gradient-to-tr from-primary to-secondary text-white shadow-md'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                    }`}
                  >
                    {ach.isEarned ? <Sparkles className="w-5 h-5 text-amber-300" /> : <Lock className="w-4 h-4" />}
                  </div>
                  <Badge variant={ach.isEarned ? 'success' : 'neutral'} size="sm">
                    {ach.isEarned ? 'Earned' : 'Locked'}
                  </Badge>
                </div>

                <h3 className="text-sm font-bold text-textMain-light dark:text-textMain-dark">
                  {ach.name}
                </h3>
                <p className="text-[11px] text-textMain-mutedLight dark:text-textMain-mutedDark leading-relaxed">
                  {ach.description}
                </p>
              </div>

              {ach.isEarned && (
                <div className="pt-2 border-t border-surface-borderLight dark:border-surface-borderDark text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Unlocked</span>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Contribution Tracker List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-textMain-light dark:text-textMain-dark flex items-center gap-2">
          <GitPullRequest className="w-4 h-4 text-primary" />
          <span>Tracked Open-Source Contributions ({contributions.length})</span>
        </h2>

        {contributions.length === 0 ? (
          <Card className="p-8 text-center text-xs text-textMain-mutedLight dark:text-textMain-mutedDark">
            No contributions tracked yet. Complete the <strong>First Contribution Wizard</strong> to log and monitor your first pull request!
          </Card>
        ) : (
          <div className="space-y-3">
            {contributions.map((item) => (
              <Card key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        item.status === 'merged'
                          ? 'success'
                          : item.status === 'submitted'
                          ? 'primary'
                          : 'warning'
                      }
                      size="sm"
                    >
                      {item.status.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-textMain-mutedLight dark:text-textMain-mutedDark font-mono">
                      {new Date(item.created_at || item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <a
                    href={item.pull_request_url || item.pullRequestUrl || item.repository_url || item.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-sm text-textMain-light dark:text-textMain-dark hover:text-primary transition-colors flex items-center gap-1.5"
                  >
                    {item.repository_url || item.repositoryUrl}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {item.notes && (
                    <p className="text-xs text-textMain-mutedLight dark:text-textMain-mutedDark">
                      {item.notes}
                    </p>
                  )}
                </div>

                <div className="text-xs text-textMain-mutedLight dark:text-textMain-mutedDark shrink-0">
                  <span>Tracked via PR Wizard</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
