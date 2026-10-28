import React, { useState, useEffect } from 'react';
import { githubApi, projectApi, bookmarkApi } from '../services/api.js';
import {
  Search,
  Star,
  GitFork,
  ExternalLink,
  Bookmark,
  FolderGit2,
  AlertCircle,
  Tag,
  Check,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/common/Button.jsx';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export const ExplorePage = () => {
  const [activeTab, setActiveTab] = useState('repositories'); // 'repositories' | 'issues'
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('');
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState([]);
  const [issues, setIssues] = useState([]);
  const [notice, setNotice] = useState(null);

  const [savedRepoIds, setSavedRepoIds] = useState(new Set());
  const [bookmarkedIssueIds, setBookmarkedIssueIds] = useState(new Set());

  const { isAuthenticated } = useAuth();
  const { showSuccess, showInfo, showError } = useToast();

  const fetchRepositories = async (q = query, lang = language) => {
    setLoading(true);
    try {
      const res = await githubApi.getRepositories({ q: q || undefined, language: lang || undefined });
      setRepos(res.data.data.items || []);
      setNotice(res.data.data.notice || null);
    } catch {
      showError('Failed to fetch repositories.');
    } finally {
      setLoading(false);
    }
  };

  const fetchIssues = async (q = query, lang = language) => {
    setLoading(true);
    try {
      const res = await githubApi.getIssues({ q: q || undefined, language: lang || undefined });
      setIssues(res.data.data.items || []);
      setNotice(res.data.data.notice || null);
    } catch {
      showError('Failed to fetch issues.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'repositories') {
      fetchRepositories();
    } else {
      fetchIssues();
    }
  }, [activeTab, language]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'repositories') {
      fetchRepositories(query, language);
    } else {
      fetchIssues(query, language);
    }
  };

  const handleSaveProject = async (repo) => {
    if (!isAuthenticated) {
      showInfo('Please log in to save projects to your dashboard.');
      return;
    }
    try {
      await projectApi.saveProject({
        repositoryFullName: repo.fullName,
        repositoryUrl: repo.htmlUrl,
        notes: repo.description,
        metadata: { stars: repo.stars, language: repo.language },
      });
      setSavedRepoIds((prev) => new Set([...prev, repo.id]));
      showSuccess(`Saved ${repo.name} to your dashboard!`);
    } catch {
      showError('Failed to save project.');
    }
  };

  const handleBookmarkIssue = async (issue) => {
    if (!isAuthenticated) {
      showInfo('Please log in to bookmark issues.');
      return;
    }
    try {
      const res = await bookmarkApi.createBookmark({
        resourceType: 'issue',
        resourceId: String(issue.id),
        title: issue.title,
        metadata: { url: issue.htmlUrl, repo: issue.repositoryFullName },
      });
      setBookmarkedIssueIds((prev) => new Set([...prev, issue.id]));
      showSuccess('Bookmarked issue!');

      if (res.data.data.awardedBadge) {
        showSuccess(`Achievement Unlocked: ${res.data.data.awardedBadge.name}!`);
      }
    } catch {
      showError('Failed to bookmark issue.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4 sm:py-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
          <Search className="w-4 h-4" />
          <span>Real-World Discovery</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-textMain-light dark:text-textMain-dark">
          GitHub Project & Issue Explorer
        </h1>
        <p className="text-xs sm:text-sm text-textMain-mutedLight dark:text-textMain-mutedDark max-w-2xl leading-relaxed">
          Discover verified beginner-friendly repositories and active <code className="text-primary font-mono font-semibold">good-first-issue</code> tasks sourced live from the GitHub REST API.
        </p>
      </div>

      {/* Tabs & Search Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Main Tab Toggle */}
          <div className="flex rounded-xl border border-surface-borderLight dark:border-surface-borderDark bg-white dark:bg-surface-cardDark p-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('repositories')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'repositories' ? 'bg-primary text-white shadow-xs' : 'text-textMain-mutedLight dark:text-textMain-mutedDark'
              }`}
            >
              Repositories
            </button>
            <button
              onClick={() => setActiveTab('issues')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'issues' ? 'bg-primary text-white shadow-xs' : 'text-textMain-mutedLight dark:text-textMain-mutedDark'
              }`}
            >
              Good First Issues
            </button>
          </div>

          {/* Language Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-textMain-mutedLight dark:text-textMain-mutedDark shrink-0">
              Language:
            </span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-xl border border-surface-borderLight dark:border-surface-borderDark bg-white dark:bg-surface-cardDark text-textMain-light dark:text-textMain-dark text-xs px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Languages</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="html">HTML / CSS</option>
              <option value="markdown">Markdown / Docs</option>
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-textMain-mutedLight dark:text-textMain-mutedDark absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder={activeTab === 'repositories' ? 'Search beginner repos (e.g. react, beginner, tutorial)...' : 'Search issues (e.g. typo, aria-label, docs)...'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-borderLight dark:border-surface-borderDark bg-white dark:bg-surface-cardDark text-xs text-textMain-light dark:text-textMain-dark focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button type="submit" size="sm" isLoading={loading}>
            Search
          </Button>
        </form>
      </div>

      {/* Notice Banner (if fallback active) */}
      {notice && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Results Container */}
      {loading ? (
        <LoadingSkeleton count={3} />
      ) : activeTab === 'repositories' ? (
        /* Repository Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {repos.map((repo) => {
            const isSaved = savedRepoIds.has(repo.id);
            return (
              <Card key={repo.id} hover className="p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {repo.owner?.avatarUrl ? (
                        <img
                          src={repo.owner.avatarUrl}
                          alt={repo.owner.login}
                          className="w-9 h-9 rounded-xl border border-surface-borderLight dark:border-surface-borderDark object-cover"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          {repo.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <a
                          href={repo.htmlUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-sm text-textMain-light dark:text-textMain-dark hover:text-primary transition-colors flex items-center gap-1.5"
                        >
                          {repo.fullName}
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <span className="text-[11px] text-textMain-mutedLight dark:text-textMain-mutedDark">
                          License: {repo.license}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleSaveProject(repo)}
                      variant={isSaved ? 'success' : 'outline'}
                      size="sm"
                      leftIcon={isSaved ? <Check className="w-3.5 h-3.5" /> : <FolderGit2 className="w-3.5 h-3.5" />}
                    >
                      {isSaved ? 'Saved' : 'Save'}
                    </Button>
                  </div>

                  <p className="text-xs text-textMain-mutedLight dark:text-textMain-mutedDark leading-relaxed line-clamp-2">
                    {repo.description || 'No description provided.'}
                  </p>

                  {/* Topics */}
                  {repo.topics && repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {repo.topics.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Stats */}
                <div className="pt-4 border-t border-surface-borderLight dark:border-surface-borderDark flex items-center justify-between text-xs text-textMain-mutedLight dark:text-textMain-mutedDark">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 font-semibold">
                      <Star className="w-3.5 h-3.5 text-amber-500" />
                      {repo.stars?.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3.5 h-3.5" />
                      {repo.forks?.toLocaleString()}
                    </span>
                  </div>

                  {repo.language && (
                    <Badge variant="beginner" size="sm">
                      {repo.language}
                    </Badge>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Issue Cards */
        <div className="space-y-3">
          {issues.map((issue) => {
            const isBookmarked = bookmarkedIssueIds.has(issue.id);
            return (
              <Card key={issue.id} hover className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-primary font-bold">
                      {issue.repositoryFullName} #{issue.number}
                    </span>
                    <span className="text-[10px] text-textMain-mutedLight dark:text-textMain-mutedDark">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <a
                    href={issue.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-sm text-textMain-light dark:text-textMain-dark hover:text-primary transition-colors flex items-center gap-1.5"
                  >
                    {issue.title}
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>

                  {/* Labels */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {issue.labels?.map((label) => (
                      <span
                        key={label.name}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-primary/20 bg-primary/5 text-primary"
                      >
                        {label.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    onClick={() => handleBookmarkIssue(issue)}
                    variant={isBookmarked ? 'success' : 'outline'}
                    size="sm"
                    leftIcon={<Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />}
                  >
                    {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                  </Button>

                  <a href={issue.htmlUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="ghost">
                      View on GitHub
                    </Button>
                  </a>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
