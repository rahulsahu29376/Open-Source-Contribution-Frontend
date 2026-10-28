import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizApi } from '../services/api.js';
import { Award, HelpCircle, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.jsx';

export const QuizzesPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await quizApi.getQuizzes();
        setQuizzes(res.data.data.quizzes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4 sm:py-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>Knowledge Check</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-textMain-light dark:text-textMain-dark">
          Open-Source Assessments & Quizzes
        </h1>
        <p className="text-xs sm:text-sm text-textMain-mutedLight dark:text-textMain-mutedDark max-w-2xl leading-relaxed">
          Validate your understanding of Git fundamentals, branching strategies, etiquette, and pull request workflows.
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizzes.map((quiz, idx) => (
            <Card key={quiz.id} hover className="p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" size="sm">
                    {quiz.moduleName}
                  </Badge>
                  <span className="text-xs font-bold text-amber-500">
                    {quiz.totalPoints} pts
                  </span>
                </div>

                <h3 className="text-base font-bold text-textMain-light dark:text-textMain-dark">
                  {quiz.title}
                </h3>

                <p className="text-xs text-textMain-mutedLight dark:text-textMain-mutedDark leading-relaxed">
                  {quiz.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-surface-borderLight dark:border-surface-borderDark flex items-center justify-between text-xs">
                <span className="text-textMain-mutedLight dark:text-textMain-mutedDark flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  {quiz.questionCount} Questions
                </span>
                <Link to={`/quizzes/${quiz.id}`}>
                  <Button size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Start Assessment
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
