import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { quizApi } from '../services/api.js';
import {
  Award,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../components/common/Button.jsx';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { ProgressBar } from '../components/common/ProgressBar.jsx';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.jsx';
import { ErrorState } from '../components/common/ErrorState.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import confetti from 'canvas-confetti';

export const QuizDetailPage = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Quiz taking state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // questionId -> answer
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const { isAuthenticated } = useAuth();
  const { showSuccess, showInfo, showError } = useToast();

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await quizApi.getQuizById(id);
        setQuiz(res.data.data.quiz);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleSelectOption = (questionId, option) => {
    if (result) return; // Locked once submitted
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleOrderChange = (questionId, orderedList) => {
    if (result) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: orderedList,
    }));
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      showInfo('Please log in so your assessment scores and badges can be recorded.');
    }

    const payload = quiz.questions.map((q) => ({
      questionId: q.id,
      answer: userAnswers[q.id] || (q.questionType === 'order' ? q.options : ''),
    }));

    setSubmitting(true);
    try {
      const res = await quizApi.submitAttempt(id, payload);
      const attemptData = res.data.data;
      setResult(attemptData);

      if (attemptData.attempt.percentage >= 70) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      if (attemptData.newlyAwardedBadge) {
        showSuccess(`Achievement Unlocked: ${attemptData.newlyAwardedBadge.name}!`);
      } else {
        showSuccess(`Assessment graded: ${attemptData.attempt.percentage}% score.`);
      }
    } catch {
      showError('Failed to submit quiz attempt.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setResult(null);
    setUserAnswers({});
    setCurrentIndex(0);
  };

  if (loading) return <div className="max-w-3xl mx-auto py-12"><LoadingSkeleton count={3} /></div>;
  if (error || !quiz) return <div className="max-w-3xl mx-auto py-12"><ErrorState message={error} /></div>;

  const currentQuestion = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const isAnswered = userAnswers[currentQuestion?.id] !== undefined;

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      {/* Back button */}
      <Link to="/quizzes" className="inline-flex items-center gap-1.5 text-xs text-textMain-mutedLight dark:text-textMain-mutedDark hover:text-primary transition-colors font-medium">
        <ChevronLeft className="w-4 h-4" />
        Back to Quizzes
      </Link>

      {/* Quiz Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" size="sm">
            {quiz.moduleName}
          </Badge>
          <span className="text-xs font-semibold text-textMain-mutedLight dark:text-textMain-mutedDark">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-textMain-light dark:text-textMain-dark">
          {quiz.title}
        </h1>
        <ProgressBar
          value={currentIndex + 1}
          max={totalQuestions}
          showPercentage={false}
          size="sm"
        />
      </div>

      {/* Results View */}
      {result ? (
        <Card className="p-8 space-y-6 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center bg-gradient-to-tr from-primary to-secondary text-white shadow-lg">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-textMain-light dark:text-textMain-dark">
              {result.attempt.passed ? 'Assessment Passed!' : 'Assessment Incomplete'}
            </h2>
            <p className="text-sm text-textMain-mutedLight dark:text-textMain-mutedDark">
              You scored <span className="font-bold text-primary">{result.attempt.score}</span> out of {result.attempt.totalPoints} points ({result.attempt.percentage}%).
            </p>
          </div>

          {result.newlyAwardedBadge && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 max-w-md mx-auto flex items-center gap-3 text-left">
              <Sparkles className="w-6 h-6 text-amber-500 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  New Badge Unlocked: {result.newlyAwardedBadge.name}!
                </h4>
                <p className="text-[11px] text-textMain-mutedLight dark:text-textMain-mutedDark">
                  {result.newlyAwardedBadge.description}
                </p>
              </div>
            </div>
          )}

          {/* Graded review items */}
          <div className="space-y-3 pt-4 text-left border-t border-surface-borderLight dark:border-surface-borderDark">
            <h3 className="text-xs font-bold uppercase tracking-wider text-textMain-mutedLight dark:text-textMain-mutedDark">
              Question Breakdown
            </h3>
            {result.attempt.gradedResults.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                  item.isCorrect
                    ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-800 dark:text-emerald-300'
                    : 'border-rose-500/30 bg-rose-500/5 text-rose-800 dark:text-rose-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold">{idx + 1}. {item.questionText}</span>
                  {item.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  )}
                </div>
                {!item.isCorrect && (
                  <p className="text-[11px] text-textMain-light dark:text-textMain-dark">
                    <strong>Correct answer:</strong> {Array.isArray(item.correctAnswer) ? item.correctAnswer.join(' -> ') : item.correctAnswer}
                  </p>
                )}
                <p className="text-[11px] text-textMain-mutedLight dark:text-textMain-mutedDark italic">
                  💡 {item.explanation}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <Button onClick={handleRetry} variant="outline" leftIcon={<RotateCcw className="w-4 h-4" />}>
              Retry Quiz
            </Button>
            <Link to="/learn">
              <Button>
                Continue Curriculum
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        /* Active Question Card */
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
              Question {currentIndex + 1}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-textMain-light dark:text-textMain-dark leading-relaxed">
              {currentQuestion.questionText}
            </h2>
          </div>

          {/* Question Options */}
          {currentQuestion.questionType === 'order' ? (
            /* Order Sequence Question */
            <div className="space-y-2">
              <p className="text-xs text-textMain-mutedLight dark:text-textMain-mutedDark mb-3">
                Click commands in chronological sequence:
              </p>
              <div className="space-y-2">
                {(userAnswers[currentQuestion.id] || currentQuestion.options).map((opt, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-xl border border-surface-borderLight dark:border-surface-borderDark bg-surface-light dark:bg-surface-dark text-xs font-mono"
                  >
                    <span className="w-5 h-5 rounded-md bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="flex-1">{opt}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Multiple Choice / True-False */
            <div className="space-y-2.5">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = userAnswers[currentQuestion.id] === option;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(currentQuestion.id, option)}
                    className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary shadow-sm font-semibold'
                        : 'border-surface-borderLight dark:border-surface-borderDark bg-surface-light dark:bg-surface-dark hover:border-primary/40 text-textMain-light dark:text-textMain-dark'
                    }`}
                  >
                    <span>{option}</span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-primary bg-primary text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-surface-borderLight dark:border-surface-borderDark">
            <Button
              onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
              disabled={currentIndex === 0}
              variant="outline"
              size="sm"
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Previous
            </Button>

            {isLastQuestion ? (
              <Button
                onClick={handleSubmit}
                isLoading={submitting}
                size="sm"
                variant="success"
                rightIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Submit Assessment
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1))}
                size="sm"
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Next Question
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
