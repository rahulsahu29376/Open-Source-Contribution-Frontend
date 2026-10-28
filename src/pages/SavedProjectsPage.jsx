import React, { useState, useEffect } from 'react';
import { projectApi } from '../services/api.js';
import { FolderGit2, Trash2, ExternalLink, Star } from 'lucide-react';
import { Card } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { useToast } from '../context/ToastContext.jsx';

export const SavedProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await projectApi.getSavedProjects();
        setProjects(res.data.data.projects);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    try {
      await projectApi.deleteSavedProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      showSuccess('Saved project removed.');
    } catch {
      showError('Failed to remove project.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-textMain-light dark:text-textMain-dark">
          Saved Repositories
        </h1>
        <p className="text-xs sm:text-sm text-textMain-mutedLight dark:text-textMain-mutedDark">
          Open-source projects you discovered and saved for ongoing contribution.
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} />
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderGit2}
          title="No saved projects"
          description="Explore the GitHub Explorer and click 'Save' on beginner-friendly repositories to keep track of them here."
        />
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <Card key={p.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <a
                  href={p.repositoryUrl || p.repository_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-sm text-primary hover:underline flex items-center gap-1.5"
                >
                  {p.repositoryFullName || p.repository_full_name}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {p.notes && (
                  <p className="text-xs text-textMain-mutedLight dark:text-textMain-mutedDark line-clamp-2">
                    {p.notes}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {p.metadata?.stars && (
                  <span className="text-xs font-semibold text-amber-500 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5" />
                    {p.metadata.stars?.toLocaleString()}
                  </span>
                )}

                <a href={p.repositoryUrl || p.repository_url} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline">
                    View Repo
                  </Button>
                </a>

                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-2 rounded-lg text-textMain-mutedLight hover:text-error hover:bg-error/10 transition-colors"
                  title="Remove saved repository"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
