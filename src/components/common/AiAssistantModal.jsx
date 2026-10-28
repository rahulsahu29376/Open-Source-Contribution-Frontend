import React, { useState } from 'react';
import { Sparkles, Terminal, AlertCircle, Calendar, Send, X, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { aiApi } from '../../services/api.js';
import { Button } from './Button.jsx';
import { CodeBlock } from './CodeBlock.jsx';

export const AiAssistantModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('command'); // 'command' | 'error' | 'plan'

  // Input states
  const [commandInput, setCommandInput] = useState('');
  const [errorInput, setErrorInput] = useState('');
  const [planForm, setPlanForm] = useState({
    experienceLevel: 'beginner',
    targetLanguage: 'JavaScript',
    weeklyHours: 5,
  });

  // Results & Loading
  const [loading, setLoading] = useState(false);
  const [commandResult, setCommandResult] = useState(null);
  const [errorResult, setErrorResult] = useState(null);
  const [planResult, setPlanResult] = useState(null);

  const handleExplainCommand = async (e) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    setLoading(true);
    try {
      const res = await aiApi.explainCommand(commandInput.trim());
      setCommandResult(res.data.data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleExplainError = async (e) => {
    e.preventDefault();
    if (!errorInput.trim()) return;
    setLoading(true);
    try {
      const res = await aiApi.explainError(errorInput.trim());
      setErrorResult(res.data.data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await aiApi.generateLearningPlan(planForm);
      setPlanResult(res.data.data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Learning Assistant"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold text-xs shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all group"
      >
        <Sparkles className="w-4 h-4 animate-pulse group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">AI Learning Guide</span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-surface-cardDark border border-surface-borderLight dark:border-surface-borderDark shadow-2xl z-10 overflow-hidden flex flex-col max-h-[88vh] animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-borderLight dark:border-surface-borderDark bg-surface-light/50 dark:bg-surface-dark/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-textMain-light dark:text-textMain-dark">
                    AI Learning Assistant
                  </h3>
                  <p className="text-[11px] text-textMain-mutedLight dark:text-textMain-mutedDark">
                    Safe explanations for Git commands, errors & custom plans
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-textMain-mutedLight hover:text-textMain-light dark:hover:text-textMain-dark"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-surface-borderLight dark:border-surface-borderDark px-6 gap-6 text-xs font-semibold bg-white dark:bg-surface-cardDark">
              <button
                onClick={() => setActiveTab('command')}
                className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors ${
                  activeTab === 'command'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-textMain-mutedLight dark:text-textMain-mutedDark hover:text-textMain-light dark:hover:text-textMain-dark'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                Explain Command
              </button>
              <button
                onClick={() => setActiveTab('error')}
                className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors ${
                  activeTab === 'error'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-textMain-mutedLight dark:text-textMain-mutedDark hover:text-textMain-light dark:hover:text-textMain-dark'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                Explain Error
              </button>
              <button
                onClick={() => setActiveTab('plan')}
                className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors ${
                  activeTab === 'plan'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-textMain-mutedLight dark:text-textMain-mutedDark hover:text-textMain-light dark:hover:text-textMain-dark'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                Learning Plan
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
              {/* Tab 1: Explain Command */}
              {activeTab === 'command' && (
                <div className="space-y-4">
                  <form onSubmit={handleExplainCommand} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. git switch -c, git merge, git pull, git diff"
                      value={commandInput}
                      onChange={(e) => setCommandInput(e.target.value)}
                      className="flex-1 rounded-xl border border-surface-borderLight dark:border-surface-borderDark bg-surface-light dark:bg-surface-dark px-4 py-2.5 text-xs text-textMain-light dark:text-textMain-dark focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button type="submit" size="sm" isLoading={loading} leftIcon={<Send className="w-3.5 h-3.5" />}>
                      Explain
                    </Button>
                  </form>

                  {/* Suggestion Chips */}
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[11px] text-textMain-mutedLight dark:text-textMain-mutedDark mr-1">Try:</span>
                    {['git status', 'git add', 'git commit', 'git switch', 'git merge', 'git pull'].map((cmd) => (
                      <button
                        key={cmd}
                        onClick={() => {
                          setCommandInput(cmd);
                        }}
                        className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-primary transition-colors"
                      >
                        {cmd}
                      </button>
                    ))}
                  </div>

                  {commandResult && (
                    <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-primary">
                          {commandResult.command}
                        </span>
                        <span className="text-[10px] text-textMain-mutedLight dark:text-textMain-mutedDark">
                          {commandResult.source}
                        </span>
                      </div>
                      <p className="text-xs text-textMain-light dark:text-textMain-dark font-medium leading-relaxed">
                        {commandResult.explanation}
                      </p>
                      <ul className="space-y-1.5 text-xs text-textMain-mutedLight dark:text-textMain-mutedDark list-disc pl-4">
                        {commandResult.breakdown?.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                      {commandResult.proTip && (
                        <div className="pt-2 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                          💡 <strong>Pro Tip:</strong> {commandResult.proTip}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Explain Error */}
              {activeTab === 'error' && (
                <div className="space-y-4">
                  <form onSubmit={handleExplainError} className="space-y-3">
                    <textarea
                      rows={3}
                      placeholder="Paste terminal error here (e.g., 'fatal: not a git repository' or 'Updates were rejected because the remote contains work')"
                      value={errorInput}
                      onChange={(e) => setErrorInput(e.target.value)}
                      className="w-full rounded-xl border border-surface-borderLight dark:border-surface-borderDark bg-surface-light dark:bg-surface-dark p-3 text-xs font-mono text-textMain-light dark:text-textMain-dark focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => setErrorInput('fatal: not a git repository (or any of the parent directories): .git')}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary"
                        >
                          Not a repo
                        </button>
                        <button
                          type="button"
                          onClick={() => setErrorInput('fatal: refusing to merge unrelated histories')}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary"
                        >
                          Unrelated histories
                        </button>
                      </div>
                      <Button type="submit" size="sm" isLoading={loading} leftIcon={<Send className="w-3.5 h-3.5" />}>
                        Diagnose Error
                      </Button>
                    </div>
                  </form>

                  {errorResult && (
                    <div className="p-4 rounded-xl border border-error/20 bg-error-light/20 dark:bg-error/5 space-y-3 animate-fade-in">
                      <h4 className="text-xs font-bold text-error flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" />
                        What This Error Means
                      </h4>
                      <p className="text-xs text-textMain-light dark:text-textMain-dark leading-relaxed">
                        {errorResult.meaning}
                      </p>

                      <div className="space-y-1.5 pt-1">
                        <h5 className="text-[11px] font-bold uppercase tracking-wider text-textMain-light dark:text-textMain-dark">
                          Recommended Recovery Steps:
                        </h5>
                        <ul className="space-y-1 text-xs text-textMain-mutedLight dark:text-textMain-mutedDark list-decimal pl-4">
                          {errorResult.fixSteps?.map((s, idx) => (
                            <li key={idx} className="font-mono text-[11px]">{s}</li>
                          ))}
                        </ul>
                      </div>

                      {errorResult.safeRecovery && (
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium pt-2">
                          <ShieldCheck className="w-4 h-4 shrink-0" />
                          <span>{errorResult.safeRecovery}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Learning Plan */}
              {activeTab === 'plan' && (
                <div className="space-y-4">
                  <form onSubmit={handleGeneratePlan} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-textMain-light dark:text-textMain-dark mb-1">
                        Experience Level
                      </label>
                      <select
                        value={planForm.experienceLevel}
                        onChange={(e) => setPlanForm({ ...planForm, experienceLevel: e.target.value })}
                        className="w-full rounded-xl border border-surface-borderLight dark:border-surface-borderDark bg-surface-light dark:bg-surface-dark px-3 py-2 text-xs text-textMain-light dark:text-textMain-dark focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="beginner">Beginner (New to Git)</option>
                        <option value="intermediate">Intermediate</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-textMain-light dark:text-textMain-dark mb-1">
                        Language
                      </label>
                      <select
                        value={planForm.targetLanguage}
                        onChange={(e) => setPlanForm({ ...planForm, targetLanguage: e.target.value })}
                        className="w-full rounded-xl border border-surface-borderLight dark:border-surface-borderDark bg-surface-light dark:bg-surface-dark px-3 py-2 text-xs text-textMain-light dark:text-textMain-dark focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="JavaScript">JavaScript / TypeScript</option>
                        <option value="Python">Python</option>
                        <option value="Documentation">Docs & Markdown</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-textMain-light dark:text-textMain-dark mb-1">
                        Weekly Time
                      </label>
                      <select
                        value={planForm.weeklyHours}
                        onChange={(e) => setPlanForm({ ...planForm, weeklyHours: parseInt(e.target.value, 10) })}
                        className="w-full rounded-xl border border-surface-borderLight dark:border-surface-borderDark bg-surface-light dark:bg-surface-dark px-3 py-2 text-xs text-textMain-light dark:text-textMain-dark focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value={3}>3 hours / week</option>
                        <option value={5}>5 hours / week</option>
                        <option value={10}>10 hours / week</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3 flex justify-end pt-2">
                      <Button type="submit" size="sm" isLoading={loading} leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
                        Generate 4-Week Roadmap
                      </Button>
                    </div>
                  </form>

                  {planResult && (
                    <div className="space-y-4 pt-2 animate-fade-in">
                      <h4 className="text-xs font-bold text-textMain-light dark:text-textMain-dark">
                        Your Custom 4-Week Open-Source Roadmap
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {planResult.weeks.map((w) => (
                          <div
                            key={w.week}
                            className="p-3.5 rounded-xl border border-surface-borderLight dark:border-surface-borderDark bg-surface-light/60 dark:bg-surface-dark/60 space-y-2"
                          >
                            <div className="flex items-center justify-between text-xs font-bold text-primary">
                              <span>Week {w.week}: {w.theme}</span>
                            </div>
                            <ul className="space-y-1 text-[11px] text-textMain-mutedLight dark:text-textMain-mutedDark list-disc pl-3">
                              {w.actionItems.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-surface-borderLight dark:border-surface-borderDark bg-surface-light/40 dark:bg-surface-dark/40 text-[11px] text-textMain-mutedLight dark:text-textMain-mutedDark flex items-center justify-between">
              <span>Always review commands before executing them on your machine.</span>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
