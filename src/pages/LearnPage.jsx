import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { lessonApi } from '../services/api.js';
import { BookOpen, CheckCircle2, Circle, ChevronRight, Terminal, Award, Clock } from 'lucide-react';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { ProgressBar } from '../components/common/ProgressBar.jsx';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.jsx';

export const LearnPage = () => {
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modRes, lesRes] = await Promise.all([
          lessonApi.getModules(),
          lessonApi.getLessons(),
        ]);
        setModules(modRes.data.data.modules);
        setLessons(lesRes.data.data.lessons);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredLessons = selectedModule === 'All'
    ? lessons
    : lessons.filter((l) => l.moduleName.toLowerCase() === selectedModule.toLowerCase());

  const completedCount = lessons.filter((l) => l.completed).length;
  const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4 sm:py-6">
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-primary via-indigo-600 to-secondary p-8 sm:p-12 text-white shadow-xl overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <Badge variant="secondary" size="md" className="bg-white/20 text-white border-white/30 backdrop-blur-md">
            Interactive Curriculum
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Open-Source Beginner Curriculum
          </h1>
          <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
            Step-by-step interactive lessons explaining Git, GitHub, remotes, branches, merge conflicts, pull requests, and open-source collaboration.
          </p>

          <div className="pt-4 max-w-md">
            <ProgressBar
              value={completedCount}
              max={lessons.length || 1}
              color="success"
              label={`Curriculum Progress (${completedCount}/${lessons.length} lessons completed)`}
            />
          </div>
        </div>

        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-10 translate-y-10">
          <Terminal className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* Module Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedModule('All')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedModule === 'All'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-white dark:bg-surface-cardDark border border-surface-borderLight dark:border-surface-borderDark text-textMain-mutedLight dark:text-textMain-mutedDark hover:text-textMain-light'
          }`}
        >
          All Modules ({lessons.length})
        </button>
        {modules.map((mod) => {
          const modLessons = lessons.filter((l) => l.moduleName === mod.title.split(': ')[1]);
          return (
            <button
              key={mod.id}
              onClick={() => setSelectedModule(mod.title.split(': ')[1])}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedModule === mod.title.split(': ')[1]
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white dark:bg-surface-cardDark border border-surface-borderLight dark:border-surface-borderDark text-textMain-mutedLight dark:text-textMain-mutedDark hover:text-textMain-light'
              }`}
            >
              {mod.title.split(': ')[1]}
            </button>
          );
        })}
      </div>

      {/* Lessons List */}
      {loading ? (
        <LoadingSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLessons.map((lesson) => (
            <Link key={lesson.id} to={`/learn/${lesson.slug}`}>
              <Card hover className="p-6 h-full flex flex-col justify-between group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                      {lesson.moduleName}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant={lesson.difficulty === 'beginner' ? 'beginner' : 'intermediate'} size="sm">
                        {lesson.difficulty}
                      </Badge>
                      {lesson.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-textMain-light dark:text-textMain-dark group-hover:text-primary transition-colors">
                    {lesson.title}
                  </h3>

                  <p className="text-xs text-textMain-mutedLight dark:text-textMain-mutedDark leading-relaxed line-clamp-2">
                    {lesson.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-surface-borderLight dark:border-surface-borderDark flex items-center justify-between text-xs text-textMain-mutedLight dark:text-textMain-mutedDark">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    10-15 mins read
                  </span>
                  <span className="text-primary font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Start Lesson <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
