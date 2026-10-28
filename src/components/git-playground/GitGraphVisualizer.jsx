import React from 'react';
import { GitBranch, GitCommit, Layers, FileCheck, CircleDot, CheckCircle2 } from 'lucide-react';
import { Badge } from '../common/Badge.jsx';

export const GitGraphVisualizer = ({ state }) => {
  const {
    initialized,
    currentBranch,
    branches,
    commits = [],
    stagingArea = {},
    workingDirectory = {},
    lastCommittedFiles = {},
  } = state || {};

  const stagedFiles = Object.keys(stagingArea);
  const unstagedFiles = Object.keys(workingDirectory).filter(
    (file) => workingDirectory[file] !== (stagingArea[file] || lastCommittedFiles[file])
  );

  return (
    <div className="flex flex-col h-full rounded-2xl bg-white dark:bg-surface-cardDark border border-surface-borderLight dark:border-surface-borderDark p-4 shadow-sm space-y-6 overflow-y-auto">
      {/* Status Badges Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-surface-borderLight dark:border-surface-borderDark">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-textMain-light dark:text-textMain-dark">
            Repo State
          </span>
          <Badge variant={initialized ? 'success' : 'neutral'} size="sm">
            {initialized ? 'Initialized' : 'Not Initialized'}
          </Badge>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-textMain-mutedLight dark:text-textMain-mutedDark">Branch:</span>
          <span className="font-mono font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
            {currentBranch}
          </span>
        </div>
      </div>

      {/* Commit DAG / Graph Flow */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-textMain-light dark:text-textMain-dark">
          <div className="flex items-center gap-1.5">
            <GitCommit className="w-4 h-4 text-secondary" />
            <span>Commit History ({commits.length})</span>
          </div>
          <span className="text-[11px] text-textMain-mutedLight dark:text-textMain-mutedDark">
            HEAD -&gt; {currentBranch}
          </span>
        </div>

        {commits.length === 0 ? (
          <div className="p-4 text-center rounded-xl bg-surface-light dark:bg-surface-dark border border-dashed border-surface-borderLight dark:border-surface-borderDark text-xs text-textMain-mutedLight dark:text-textMain-mutedDark">
            No commits created yet. Run <code className="text-primary font-mono font-semibold">git commit -m "..."</code> to take your first snapshot.
          </div>
        ) : (
          <div className="space-y-2 relative pl-4 border-l-2 border-primary/30 ml-2">
            {[...commits].reverse().map((commit, idx) => {
              const isHead = idx === 0;
              return (
                <div
                  key={commit.id}
                  className={`relative p-3 rounded-xl border text-xs transition-all ${
                    isHead
                      ? 'bg-primary/5 border-primary/40 shadow-xs'
                      : 'bg-surface-light dark:bg-surface-dark border-surface-borderLight dark:border-surface-borderDark'
                  }`}
                >
                  {/* Node Dot */}
                  <div
                    className={`absolute -left-[23px] top-3.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-surface-cardDark ${
                      isHead ? 'bg-primary' : 'bg-secondary'
                    }`}
                  />

                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-primary text-[11px]">
                      {commit.shortId}
                    </span>
                    <div className="flex items-center gap-1">
                      {isHead && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary text-white">
                          HEAD
                        </span>
                      )}
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-secondary/10 text-secondary">
                        {commit.branch}
                      </span>
                    </div>
                  </div>

                  <p className="font-medium text-textMain-light dark:text-textMain-dark truncate">
                    {commit.message}
                  </p>
                  <p className="text-[10px] text-textMain-mutedLight dark:text-textMain-mutedDark mt-1">
                    {commit.timestamp} • {commit.author}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Two Trees: Staging Area vs Working Directory */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {/* Staging Area */}
        <div className="p-3 rounded-xl border border-surface-borderLight dark:border-surface-borderDark bg-surface-light dark:bg-surface-dark space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <div className="flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Staging Area ({stagedFiles.length})</span>
            </div>
          </div>
          {stagedFiles.length === 0 ? (
            <p className="text-[11px] text-textMain-mutedLight dark:text-textMain-mutedDark italic">
              Empty (use `git add`)
            </p>
          ) : (
            <ul className="space-y-1">
              {stagedFiles.map((file) => (
                <li
                  key={file}
                  className="flex items-center justify-between text-[11px] font-mono px-2 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                >
                  <span>{file}</span>
                  <span className="text-[9px] uppercase">staged</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Working Directory (Modified/Untracked) */}
        <div className="p-3 rounded-xl border border-surface-borderLight dark:border-surface-borderDark bg-surface-light dark:bg-surface-dark space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
            <div className="flex items-center gap-1.5">
              <CircleDot className="w-3.5 h-3.5" />
              <span>Working Changes ({unstagedFiles.length})</span>
            </div>
          </div>
          {unstagedFiles.length === 0 ? (
            <p className="text-[11px] text-textMain-mutedLight dark:text-textMain-mutedDark italic">
              Clean working tree
            </p>
          ) : (
            <ul className="space-y-1">
              {unstagedFiles.map((file) => (
                <li
                  key={file}
                  className="flex items-center justify-between text-[11px] font-mono px-2 py-1 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold"
                >
                  <span>{file}</span>
                  <span className="text-[9px] uppercase">modified</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Branches List */}
      <div className="pt-2">
        <h4 className="text-xs font-bold text-textMain-light dark:text-textMain-dark mb-2">
          Local Branches ({branches?.length || 1})
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {branches?.map((b) => (
            <span
              key={b}
              className={`text-xs font-mono px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                b === currentBranch
                  ? 'border-primary bg-primary/10 text-primary font-bold'
                  : 'border-surface-borderLight dark:border-surface-borderDark text-textMain-mutedLight dark:text-textMain-mutedDark'
              }`}
            >
              <GitBranch className="w-3 h-3" />
              {b}
              {b === currentBranch && <span className="text-[9px] font-sans font-bold">(current)</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
