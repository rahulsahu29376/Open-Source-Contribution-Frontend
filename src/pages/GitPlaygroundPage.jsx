import React, { useState, useEffect, useMemo } from 'react';
import { GitEngine } from '../utils/gitEngine.js';
import { TerminalView } from '../components/git-playground/TerminalView.jsx';
import { FileEditorView } from '../components/git-playground/FileEditorView.jsx';
import { GitGraphVisualizer } from '../components/git-playground/GitGraphVisualizer.jsx';
import { ChallengeDrawer } from '../components/git-playground/ChallengeDrawer.jsx';
import { playgroundApi } from '../services/api.js';
import { Button } from '../components/common/Button.jsx';
import { RotateCcw, Terminal, FileCode, GitFork, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '../context/ToastContext.jsx';

export const GitPlaygroundPage = () => {
  const engine = useMemo(() => new GitEngine(), []);
  const [repoState, setRepoState] = useState(() => engine.getState());
  const [terminalHistory, setTerminalHistory] = useState([
    {
      command: 'git status',
      output: 'fatal: not a git repository (or any of the parent directories): .git\nRun `git init` to initialize a new repository.',
      error: true,
    },
  ]);

  // Layout View Tabs on small/medium screens
  const [activeTab, setActiveTab] = useState('terminal'); // 'terminal' | 'editor' | 'graph'

  // Challenges
  const [challenges, setChallenges] = useState([]);
  const [activeChallengeId, setActiveChallengeId] = useState('ch-1');
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const { showSuccess, showInfo } = useToast();

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await playgroundApi.getChallenges();
        setChallenges(res.data.data.challenges);
      } catch {
        // Fallback
      }
    };
    fetchChallenges();
  }, []);

  const handleExecuteCommand = (cmd) => {
    const res = engine.execute(cmd);
    setRepoState(engine.getState());

    if (res.output === '__CLEAR__') {
      setTerminalHistory([]);
      return;
    }

    setTerminalHistory((prev) => [
      ...prev,
      {
        command: cmd,
        output: res.output,
        error: res.error,
      },
    ]);
  };

  const handleSaveFile = (filename, content) => {
    engine.updateFile(filename, content);
    setRepoState(engine.getState());
    showSuccess(`Saved ${filename} to working directory.`);
  };

  const handleCreateFile = (filename, content) => {
    engine.createFile(filename, content);
    setRepoState(engine.getState());
    showSuccess(`Created ${filename}.`);
  };

  const handleReset = () => {
    engine.reset();
    setRepoState(engine.getState());
    setTerminalHistory([
      {
        command: 'system reset',
        output: 'Simulated Git workspace reset to initial clean state.',
        error: false,
      },
    ]);
    setVerificationResult(null);
    showInfo('Simulated repository reset.');
  };

  const handleVerifyChallenge = async (challengeId) => {
    setVerifying(true);
    try {
      const res = await playgroundApi.attemptChallenge(challengeId, {
        finalRepoState: repoState,
      });

      setVerificationResult(res.data.data);

      if (res.data.data.passed) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
        });
        showSuccess('Challenge passed!');
      }
    } catch {
      // Fallback local check
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-borderLight dark:border-surface-borderDark">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-textMain-light dark:text-textMain-dark">
            Interactive Git Playground
          </h1>
          <p className="text-xs sm:text-sm text-textMain-mutedLight dark:text-textMain-mutedDark mt-1">
            Safe, in-browser Git simulator. Practice commands, stage files, resolve branches, and earn badges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset Sandbox
          </Button>
        </div>
      </div>

      {/* Screen Size Switcher for Mobile & Tablet */}
      <div className="flex lg:hidden rounded-xl border border-surface-borderLight dark:border-surface-borderDark bg-white dark:bg-surface-cardDark p-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('terminal')}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'terminal' ? 'bg-primary text-white' : 'text-textMain-mutedLight dark:text-textMain-mutedDark'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          Terminal
        </button>
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'editor' ? 'bg-primary text-white' : 'text-textMain-mutedLight dark:text-textMain-mutedDark'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          Editor
        </button>
        <button
          onClick={() => setActiveTab('graph')}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'graph' ? 'bg-primary text-white' : 'text-textMain-mutedLight dark:text-textMain-mutedDark'
          }`}
        >
          <GitFork className="w-3.5 h-3.5" />
          Graph
        </button>
      </div>

      {/* 3-Column Studio Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[720px]">
        {/* Column 1: Terminal & File Editor (6 cols on large screens) */}
        <div
          className={`lg:col-span-6 flex flex-col gap-4 h-full ${
            activeTab !== 'terminal' && activeTab !== 'editor' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <div className="flex-1 min-h-[340px]">
            <TerminalView
              history={terminalHistory}
              onExecute={handleExecuteCommand}
              currentBranch={repoState.currentBranch}
            />
          </div>
          <div className="h-[320px]">
            <FileEditorView
              files={repoState.workingDirectory}
              onSaveFile={handleSaveFile}
              onCreateFile={handleCreateFile}
            />
          </div>
        </div>

        {/* Column 2: Git Graph Visualizer (3 cols on large screens) */}
        <div
          className={`lg:col-span-3 h-full ${
            activeTab !== 'graph' ? 'hidden lg:block' : 'block'
          }`}
        >
          <GitGraphVisualizer state={repoState} />
        </div>

        {/* Column 3: Guided Challenges (3 cols on large screens) */}
        <div className="lg:col-span-3 h-full">
          <ChallengeDrawer
            challenges={challenges}
            activeChallengeId={activeChallengeId}
            onSelectChallenge={setActiveChallengeId}
            onVerifyChallenge={handleVerifyChallenge}
            verifying={verifying}
            verificationResult={verificationResult}
          />
        </div>
      </div>
    </div>
  );
};
