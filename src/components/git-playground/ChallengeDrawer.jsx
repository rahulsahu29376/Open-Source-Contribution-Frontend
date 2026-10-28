import React, { useState } from 'react';
import { Target, CheckCircle2, ChevronRight, HelpCircle, Award, Sparkles } from 'lucide-react';
import { Button } from '../common/Button.jsx';
import { Badge } from '../common/Badge.jsx';

export const ChallengeDrawer = ({
  challenges = [],
  activeChallengeId,
  onSelectChallenge,
  onVerifyChallenge,
  verifying = false,
  verificationResult = null,
}) => {
  const [showHint, setShowHint] = useState(false);
  const activeChallenge = challenges.find((c) => c.id === activeChallengeId) || challenges[0];

  return (
    <div className="flex flex-col h-full rounded-2xl bg-white dark:bg-surface-cardDark border border-surface-borderLight dark:border-surface-borderDark p-4 shadow-sm space-y-4 overflow-y-auto">
      {/* Title */}
      <div className="flex items-center justify-between pb-2 border-b border-surface-borderLight dark:border-surface-borderDark">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-bold text-textMain-light dark:text-textMain-dark">
            Guided Challenges
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-textMain-mutedLight dark:text-textMain-mutedDark">
          {challenges.length} exercises
        </span>
      </div>

      {/* Challenge Picker */}
      <div className="flex flex-col gap-1.5">
        {challenges.map((c, idx) => {
          const isActive = c.id === activeChallenge?.id;
          return (
            <button
              key={c.id}
              onClick={() => {
                onSelectChallenge(c.id);
                setShowHint(false);
              }}
              className={`flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-colors ${
                isActive
                  ? 'bg-primary/10 border border-primary/30 text-primary font-bold'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-textMain-mutedLight dark:text-textMain-mutedDark'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded-md bg-primary/20 text-primary flex items-center justify-center font-mono text-[10px] shrink-0 font-bold">
                  {idx + 1}
                </span>
                <span className="truncate">{c.title}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          );
        })}
      </div>

      {/* Active Challenge Detail */}
      {activeChallenge && (
        <div className="p-4 rounded-xl border border-surface-borderLight dark:border-surface-borderDark bg-surface-light dark:bg-surface-dark space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="beginner" size="sm">
              {activeChallenge.difficulty}
            </Badge>
            <span className="text-[11px] font-bold text-amber-500 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              +{activeChallenge.rewardPoints} pts
            </span>
          </div>

          <h4 className="text-xs font-bold text-textMain-light dark:text-textMain-dark">
            {activeChallenge.title}
          </h4>

          <p className="text-xs text-textMain-mutedLight dark:text-textMain-mutedDark leading-relaxed">
            {activeChallenge.description}
          </p>

          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs">
            <span className="font-bold text-primary block mb-0.5">Objective:</span>
            <span className="text-textMain-light dark:text-textMain-dark font-medium">
              {activeChallenge.goal}
            </span>
          </div>

          {/* Hint button & toggle */}
          <div>
            <button
              onClick={() => setShowHint((prev) => !prev)}
              className="text-[11px] text-textMain-mutedLight dark:text-textMain-mutedDark hover:text-primary flex items-center gap-1 font-medium"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              {showHint ? 'Hide Hint' : 'Need a hint?'}
            </button>
            {showHint && (
              <p className="mt-1.5 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-[11px] font-mono leading-relaxed">
                💡 {activeChallenge.hint}
              </p>
            )}
          </div>

          {/* Verification feedback */}
          {verificationResult && (
            <div
              className={`p-3 rounded-xl border text-xs font-medium ${
                verificationResult.passed
                  ? 'bg-success-light dark:bg-emerald-950/30 border-success/30 text-emerald-700 dark:text-emerald-400'
                  : 'bg-warning-light dark:bg-amber-950/30 border-warning/30 text-amber-700 dark:text-amber-400'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 font-bold">
                {verificationResult.passed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>Challenge Completed!</span>
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 text-warning" />
                    <span>Check Requirements</span>
                  </>
                )}
              </div>
              <p className="text-[11px] leading-relaxed">{verificationResult.message}</p>

              {verificationResult.awardedBadge && (
                <div className="mt-2 pt-2 border-t border-emerald-500/20 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Unlocked Badge: {verificationResult.awardedBadge.name}!</span>
                </div>
              )}
            </div>
          )}

          {/* Action button */}
          <Button
            onClick={() => onVerifyChallenge(activeChallenge.id)}
            isLoading={verifying}
            className="w-full"
            size="sm"
          >
            Verify My Solution
          </Button>
        </div>
      )}
    </div>
  );
};
