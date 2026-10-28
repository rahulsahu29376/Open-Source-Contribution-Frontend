import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookmarkApi } from '../services/api.js';
import { Bookmark, Trash2, ExternalLink, BookOpen, AlertCircle } from 'lucide-react';
import { Card } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { useToast } from '../context/ToastContext.jsx';

export const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await bookmarkApi.getBookmarks();
        setBookmarks(res.data.data.bookmarks);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await bookmarkApi.deleteBookmark(id);
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
      showSuccess('Bookmark removed.');
    } catch {
      showError('Failed to remove bookmark.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-textMain-light dark:text-textMain-dark">
          Saved Bookmarks
        </h1>
        <p className="text-xs sm:text-sm text-textMain-mutedLight dark:text-textMain-mutedDark">
          Quickly access lessons, guides, and good-first-issues you flagged for later review.
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} />
      ) : bookmarks.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No bookmarks saved"
          description="You haven't bookmarked any lessons or issues yet. Click the bookmark icon while browsing to save items here."
        />
      ) : (
        <div className="space-y-3">
          {bookmarks.map((b) => (
            <Card key={b.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="sm">
                    {b.resourceType || b.resource_type}
                  </Badge>
                  <span className="text-[11px] text-textMain-mutedLight dark:text-textMain-mutedDark">
                    {new Date(b.createdAt || b.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-textMain-light dark:text-textMain-dark truncate">
                  {b.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {b.metadata?.slug && (
                  <Link to={`/learn/${b.metadata.slug}`}>
                    <Button size="sm" variant="outline">
                      View Lesson
                    </Button>
                  </Link>
                )}

                {b.metadata?.url && (
                  <a href={b.metadata.url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                      Open
                    </Button>
                  </a>
                )}

                <button
                  onClick={() => handleDelete(b.id)}
                  className="p-2 rounded-lg text-textMain-mutedLight hover:text-error hover:bg-error/10 transition-colors"
                  title="Remove bookmark"
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
