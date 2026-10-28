import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { lessonApi, bookmarkApi } from '../services/api.js';
import {
  CheckCircle2,
  Circle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  AlertTriangle,
  Lightbulb,
  Terminal,
  HelpCircle,
} from 'lucide-react';
import { Button } from '../components/common/Button.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { CodeBlock } from '../components/common/CodeBlock.jsx';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.jsx';
import { ErrorState } from '../components/common/ErrorState.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import confetti from 'canvas-confetti';

export const LessonDetailPage = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completing, setCompleting] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const { showSuccess, showError, showInfo } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await lessonApi.getLessonBySlug(slug);
        setData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [slug]);

  const handleMarkComplete = async () => {
    if (!isAuthenticated) {
      showInfo('Please log in to track and save your progress.');
      return;
    }
    setCompleting(true);
    try {
      const res = await lessonApi.markComplete(data.lesson.id);
      setData((prev) => ({
        ...prev,
        lesson: { ...prev.lesson, completed: true },
      }));

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });

      showSuccess('Lesson completed! Progress saved.');

      if (res.data.data.newlyAwardedBadge) {
        showSuccess(`Achievement Unlocked: ${res.data.data.newlyAwardedBadge.name}!`);
      }
    } catch {
      showError('Failed to record completion.');
    } finally {
      setCompleting(false);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      showInfo('Please log in to bookmark lessons.');
      return;
    }
    try {
      await bookmarkApi.createBookmark({
        resourceType: 'lesson',
        resourceId: data.lesson.id,
        title: data.lesson.title,
        metadata: { slug: data.lesson.slug, module: data.lesson.moduleName },
      });
      setBookmarked(true);
      showSuccess('Lesson saved to your bookmarks.');
    } catch {
      showError('Failed to bookmark lesson.');
    }
  };

  if (loading) return <div className="max-w-4xl mx-auto py-12"><LoadingSkeleton count={3} /></div>;
  if (error || !data) return <div className="max-w-4xl mx-auto py-12"><ErrorState message={error} /></div>;

  const { lesson, prevLesson, nextLesson } = data;
  const content = lesson.content || {};

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      {/* Breadcrumb & Navigation Top */}
      <div className="flex items-center justify-between text-xs text-textMain-mutedLight dark:text-textMain-mutedDark">
        <Link to="/learn" className="flex items-center gap-1.5 hover:text-primary transition-colors font-medium">
          <ChevronLeft className="w-4 h-4" />
          Back to Curriculum
        </Link>
        <span className="font-semibold text-primary">{lesson.moduleName}</span>
      </div>

      {/* Lesson Header */}
      <div className="space-y-4 pb-6 border-b border-surface-borderLight dark:border-surface-borderDark">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge variant={lesson.difficulty === 'beginner' ? 'beginner' : 'intermediate'}>
              {lesson.difficulty}
            </Badge>
            <span className="text-xs text-textMain-mutedLight dark:text-textMain-mutedDark">
              Module {lesson.orderIndex}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleBookmark}
              variant="outline"
              size="sm"
              leftIcon={<Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-primary text-primary' : ''}`} />}
            >
              {bookmarked ? 'Saved' : 'Bookmark'}
            </Button>

            <Button
              onClick={handleMarkComplete}
              variant={lesson.completed ? 'success' : 'primary'}
              size="sm"
              isLoading={completing}
              leftIcon={lesson.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
            >
              {lesson.completed ? 'Completed' : 'Mark as Done'}
            </Button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-textMain-light dark:text-textMain-dark">
          {lesson.title}
        </h1>
        <p className="text-sm text-textMain-mutedLight dark:text-textMain-mutedDark leading-relaxed">
          {lesson.description}
        </p>
      </div>

      {/* Learning Objective Card */}
      {content.learningObjective && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/10 to-transparent border border-primary/20 space-y-1.5">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
            <Lightbulb className="w-4 h-4" />
            <span>Learning Objective</span>
          </div>
          <p className="text-xs sm:text-sm text-textMain-light dark:text-textMain-dark font-medium leading-relaxed">
            {content.learningObjective}
          </p>
        </div>
      )}

      {/* Main Explanation Body */}
      {content.explanation && (
        <div className="space-y-4 text-xs sm:text-sm text-textMain-light dark:text-textMain-dark leading-relaxed whitespace-pre-line">
          {content.explanation}
        </div>
      )}

      {/* Key Terms */}
      {content.keyTerms && content.keyTerms.length > 0 && (
        <div className="space-y-3 pt-4">
          <h3 className="text-sm font-bold text-textMain-light dark:text-textMain-dark">
            Key Technical Terms
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {content.keyTerms.map((term, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-surface-borderLight dark:border-surface-borderDark bg-surface-light dark:bg-surface-cardDark space-y-1"
              >
                <span className="text-xs font-bold text-primary">{term.term}</span>
                <p className="text-[11px] text-textMain-mutedLight dark:text-textMain-mutedDark leading-relaxed">
                  {term.definition}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Code / Command Example */}
      {content.codeExample && (
        <div className="space-y-3 pt-4">
          <h3 className="text-sm font-bold text-textMain-light dark:text-textMain-dark flex items-center gap-2">
            <Terminal className="w-4 h-4 text-primary" />
            Realistic Command Example
          </h3>
          <CodeBlock
            code={content.codeExample.code}
            language={content.codeExample.language || 'bash'}
            title="Terminal Command Execution"
          />
          {content.codeExample.explanation && (
            <p className="text-xs text-textMain-mutedLight dark:text-textMain-mutedDark italic">
              ℹ️ {content.codeExample.explanation}
            </p>
          )}
        </div>
      )}

      {/* Common Mistakes */}
      {content.commonMistakes && content.commonMistakes.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
            <AlertTriangle className="w-4 h-4" />
            <span>Common Beginner Pitfalls to Avoid</span>
          </div>
          <ul className="space-y-1.5 text-xs text-textMain-light dark:text-textMain-dark list-disc pl-4">
            {content.commonMistakes.map((mistake, idx) => (
              <li key={idx} className="leading-relaxed">{mistake}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Practice Exercise */}
      {content.exercise && (
        <div className="p-5 rounded-2xl border border-surface-borderLight dark:border-surface-borderDark bg-surface-light dark:bg-surface-dark space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
            Quick Practice Exercise
          </h3>
          <p className="text-xs sm:text-sm text-textMain-light dark:text-textMain-dark font-medium leading-relaxed">
            {content.exercise.prompt}
          </p>

          <div>
            <button
              onClick={() => setShowHint((prev) => !prev)}
              className="text-xs text-textMain-mutedLight dark:text-textMain-mutedDark hover:text-primary flex items-center gap-1 font-semibold"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              {showHint ? 'Hide Answer / Hint' : 'Reveal Answer / Hint'}
            </button>
            {showHint && (
              <p className="mt-2 p-3 rounded-xl bg-white dark:bg-surface-cardDark border border-surface-borderLight dark:border-surface-borderDark text-xs font-mono text-primary">
                👉 {content.exercise.hint}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Bottom Previous / Next Navigation */}
      <div className="pt-8 border-t border-surface-borderLight dark:border-surface-borderDark flex items-center justify-between gap-4">
        {prevLesson ? (
          <Link to={`/learn/${prevLesson.slug}`}>
            <Button variant="outline" size="sm" leftIcon={<ChevronLeft className="w-4 h-4" />}>
              <span className="hidden sm:inline">Previous: </span>
              <span className="max-w-[140px] truncate">{prevLesson.title}</span>
            </Button>
          </Link>
        ) : <div />}

        {nextLesson ? (
          <Link to={`/learn/${nextLesson.slug}`}>
            <Button size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
              <span className="hidden sm:inline">Next: </span>
              <span className="max-w-[140px] truncate">{nextLesson.title}</span>
            </Button>
          </Link>
        ) : (
          <Link to="/quizzes">
            <Button size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
              Take Module Quiz
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
