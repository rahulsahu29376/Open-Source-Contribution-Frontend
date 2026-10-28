import React, { useState } from 'react';
import {
  GitPullRequest,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Code2,
  FolderGit2,
  FileText,
  Terminal,
  Sparkles,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '../components/common/Button.jsx';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { CodeBlock } from '../components/common/CodeBlock.jsx';
import { ProgressBar } from '../components/common/ProgressBar.jsx';
import { contributionApi, progressApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import confetti from 'canvas-confetti';

const STEPS = [
  { id: 1, title: 'Choose Your Skill' },
  { id: 2, title: 'Pick a Project' },
  { id: 3, title: 'Understand the Issue' },
  { id: 4, title: 'Prepare Environment' },
  { id: 5, title: 'Create Feature Branch' },
  { id: 6, title: 'Make Your Edit' },
  { id: 7, title: 'Test & Review Diff' },
  { id: 8, title: 'Commit & Push' },
  { id: 9, title: 'Draft Pull Request' },
  { id: 10, title: 'Log & Track PR' },
];

export const FirstContributionWizardPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSkill, setSelectedSkill] = useState('Documentation');
  const [selectedRepo, setSelectedRepo] = useState('firstcontributions/first-contributions');
  const [branchName, setBranchName] = useState('docs/update-guide');
  const [contributionUrl, setContributionUrl] = useState('');
  const [contributionStatus, setContributionStatus] = useState('submitted');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(false);

  const { isAuthenticated } = useAuth();
  const { showSuccess, showInfo, showError } = useToast();

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 10));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showInfo('Please log in to save your contribution to your dashboard.');
    }

    setSaving(true);
    try {
      if (isAuthenticated) {
        await contributionApi.logContribution({
          repositoryUrl: `https://github.com/${selectedRepo}`,
          pullRequestUrl: contributionUrl || null,
          status: contributionStatus,
          notes: notes || `First contribution via ${selectedSkill} track`,
        });

        const res = await progressApi.completeWizard();
        if (res.data.data.awardedBadge) {
          showSuccess(`Achievement Unlocked: ${res.data.data.awardedBadge.name}!`);
        }
      }

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });

      setCompleted(true);
      showSuccess('First Contribution Journey completed!');
    } catch {
      showError('Failed to record contribution.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
          <GitPullRequest className="w-4 h-4" />
          <span>Interactive Walkthrough</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-textMain-light dark:text-textMain-dark">
          First Contribution Wizard
        </h1>
        <p className="text-xs sm:text-sm text-textMain-mutedLight dark:text-textMain-mutedDark">
          A guided 10-step workflow taking you from choosing your language to opening and tracking your real-world PR.
        </p>

        {/* Step Progress Bar */}
        <div className="pt-2">
          <ProgressBar
            value={currentStep}
            max={10}
            label={`Step ${currentStep} of 10: ${STEPS[currentStep - 1].title}`}
          />
        </div>
      </div>

      {/* Step Container */}
      <Card className="p-6 sm:p-8 space-y-6">
        {/* Step 1: Choose Skill */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-textMain-light dark:text-textMain-dark">
              Step 1: Choose Your Preferred Contribution Track
            </h2>
            <p className="text-xs sm:text-sm text-textMain-mutedLight dark:text-textMain-mutedDark leading-relaxed">
              Open source is not just for backend architects. Documentation fixes, tests, translations, and CSS accessibility fixes are some of the most welcomed contributions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { name: 'Documentation', desc: 'Fix typos, clarify tutorials, update stale links.', badge: 'Most Welcomed' },
                { name: 'JavaScript / React', desc: 'UI bug fixes, accessibility aria-labels, components.', badge: 'Popular' },
                { name: 'Python', desc: 'CLI enhancements, test fixtures, data cleaning.', badge: 'Popular' },
                { name: 'HTML / CSS', desc: 'Responsive media queries, color contrast fixes.', badge: 'Accessible' },
                { name: 'Testing / QA', desc: 'Add missing test cases, mock edge-cases.', badge: 'High Value' },
                { name: 'Accessibility (a11y)', desc: 'Screen reader labels, keyboard navigation focus.', badge: 'Critical' },
              ].map((skill) => (
                <button
                  key={skill.name}
                  onClick={() => setSelectedSkill(skill.name)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedSkill === skill.name
                      ? 'border-primary bg-primary/10 shadow-sm'
                      : 'border-surface-borderLight dark:border-surface-borderDark hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-textMain-light dark:text-textMain-dark">
                      {skill.name}
                    </span>
                    <Badge variant={selectedSkill === skill.name ? 'primary' : 'neutral'} size="sm">
                      {skill.badge}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-textMain-mutedLight dark:text-textMain-mutedDark">
                    {skill.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Pick Project */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-textMain-light dark:text-textMain-dark">
              Step 2: Select a Beginner-Friendly Project
            </h2>
            <p className="text-xs sm:text-sm text-textMain-mutedLight dark:text-textMain-mutedDark">
              We selected top open-source projects designed specifically to welcome your first pull request in <strong>{selectedSkill}</strong>:
            </p>

            <div className="space-y-2.5">
              {[
                { repo: 'firstcontributions/first-contributions', desc: 'The #1 sandbox repository created for people opening their very first GitHub PR.', stars: '44k' },
                { repo: 'freeCodeCamp/freeCodeCamp', desc: 'Huge educational community with well-tagged good-first-issues and thorough docs.', stars: '395k' },
                { repo: 'public-apis/public-apis', desc: 'Curated list of public APIs. Great for adding new APIs, validating links, and documentation.', stars: '318k' },
              ].map((item) => (
                <button
                  key={item.repo}
                  onClick={() => setSelectedRepo(item.repo)}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                    selectedRepo === item.repo
                      ? 'border-primary bg-primary/10 shadow-sm'
                      : 'border-surface-borderLight dark:border-surface-borderDark hover:border-primary/40'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold font-mono text-primary">{item.repo}</span>
                    <p className="text-[11px] text-textMain-mutedLight dark:text-textMain-mutedDark mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-amber-500 shrink-0 ml-3">
                    ★ {item.stars}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Understand the Issue */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-textMain-light dark:text-textMain-dark">
              Step 3: Understand the Issue & Etiquette
            </h2>
            <p className="text-xs sm:text-sm text-textMain-mutedLight dark:text-textMain-mutedDark leading-relaxed">
              Before touching any code, review the repository’s <code className="text-primary font-mono font-bold">CONTRIBUTING.md</code> and leave a polite comment on the issue.
            </p>

            <div className="p-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-surface-borderLight dark:border-surface-borderDark space-y-2 text-xs">
              <span className="font-bold text-textMain-light dark:text-textMain-dark block">
                Polite Comment Template to Copy:
              </span>
              <p className="font-mono text-[11px] p-3 rounded-lg bg-white dark:bg-surface-cardDark border border-surface-borderLight dark:border-surface-borderDark text-textMain-light dark:text-textMain-dark">
                "Hello @maintainers! I am a beginner looking to make my first contribution. I noticed this issue is still open and would love to work on it. My planned approach is to fix the typo in docs/README.md. Could I be assigned?"
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Wait for maintainer acknowledgment on complex tasks before writing code.</span>
            </div>
          </div>
        )}

        {/* Step 4: Prepare Environment */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-textMain-light dark:text-textMain-dark">
              Step 4: Fork and Clone the Repository
            </h2>
            <p className="text-xs sm:text-sm text-textMain-mutedLight dark:text-textMain-mutedDark leading-relaxed">
              1. Click the <strong>Fork</strong> button on GitHub to create a copy under your account.<br />
              2. Run these commands in your local terminal:
            </p>

            <CodeBlock
              language="bash"
              code={`# 1. Clone your personal fork (replace <your-username>)
git clone https://github.com/<your-username>/${selectedRepo.split('/')[1]}.git

# 2. Enter the cloned repository
cd ${selectedRepo.split('/')[1]}

# 3. Add upstream remote pointing to the original project
git remote add upstream https://github.com/${selectedRepo}.git

# 4. Verify remotes
git remote -v`}
            />
          </div>
        )}

        {/* Step 5: Create Branch */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-textMain-light dark:text-textMain-dark">
              Step 5: Create a Dedicated Feature Branch
            </h2>
            <p className="text-xs sm:text-sm text-textMain-mutedLight dark:text-textMain-mutedDark leading-relaxed">
              Never make changes directly on <code className="text-primary font-mono">main</code>. Always isolate your contribution on a feature branch.
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-textMain-light dark:text-textMain-dark">
                Your Branch Name:
              </label>
              <input
                type="text"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-surface-borderLight dark:border-surface-borderDark bg-surface-light dark:bg-surface-dark text-textMain-light dark:text-textMain-dark focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <CodeBlock
              language="bash"
              code={`# Create and switch to your feature branch
git switch -c ${branchName || 'docs/my-first-fix'}

# Verify you are on the branch
git branch`}
            />
          </div>
        )}

        {/* Step 6: Make Change */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-textMain-light dark:text-textMain-dark">
              Step 6: Make a Small, Meaningful Change
            </h2>
            <p className="text-xs sm:text-sm text-textMain-mutedLight dark:text-textMain-mutedDark leading-relaxed">
              Open the project in VS Code or your editor. Make your targeted modification without touching unrelated files or formatting the entire repository.
            </p>

            <CodeBlock
              language="diff"
              code={`--- a/README.md
+++ b/README.md
@@ -14,3 +14,3 @@
-This project requires Node.js v16 or older.
+This project requires Node.js v18 or newer.`}
              title="Example Diff Inspection"
            />
          </div>
        )}

        {/* Step 7: Test and Review */}
        {currentStep === 7 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-textMain-light dark:text-textMain-dark">
              Step 7: Pre-Commit Quality & Safety Checklist
            </h2>
            <p className="text-xs sm:text-sm text-textMain-mutedLight dark:text-textMain-mutedDark">
              Run this self-review before committing:
            </p>

            <div className="space-y-2.5">
              {[
                'I ran `git diff` and verified that only the intended lines were changed.',
                'I did not commit secrets, API keys, or `.env` files.',
                'I ran the test suite (`npm test` or `pytest`) and all existing tests pass.',
                'I followed the repository code formatting guidelines.',
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-surface-borderLight dark:border-surface-borderDark bg-surface-light dark:bg-surface-dark flex items-center gap-3 text-xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-textMain-light dark:text-textMain-dark font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 8: Commit and Push */}
        {currentStep === 8 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-textMain-light dark:text-textMain-dark">
              Step 8: Stage, Commit, and Push to Your Fork
            </h2>
            <p className="text-xs sm:text-sm text-textMain-mutedLight dark:text-textMain-mutedDark leading-relaxed">
              Craft a clear conventional commit message and push the branch to your fork:
            </p>

            <CodeBlock
              language="bash"
              code={`# 1. Stage the modified file
git add README.md

# 2. Commit with conventional prefix (docs, fix, feat)
git commit -m "docs: update Node.js requirement to v18+"

# 3. Push branch to your GitHub fork
git push -u origin ${branchName || 'docs/my-first-fix'}`}
            />
          </div>
        )}

        {/* Step 9: Open PR */}
        {currentStep === 9 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-textMain-light dark:text-textMain-dark">
              Step 9: Open Your Pull Request on GitHub
            </h2>
            <p className="text-xs sm:text-sm text-textMain-mutedLight dark:text-textMain-mutedDark leading-relaxed">
              Navigate to GitHub. You will see a banner: <strong>"Compare & pull request"</strong>. Use this structured template for your description:
            </p>

            <CodeBlock
              language="markdown"
              code={`## Description
Updates the Node.js requirement mentioned in README.md to reflect current LTS versions.

## Related Issue
Fixes #42

## Testing Done
- [x] Verified link in documentation renders correctly.
- [x] Tested build locally.`}
              title="Pull Request Description Template"
            />
          </div>
        )}

        {/* Step 10: Track PR */}
        {currentStep === 10 && (
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            <h2 className="text-lg font-bold text-textMain-light dark:text-textMain-dark">
              Step 10: Log & Track Your Contribution
            </h2>
            <p className="text-xs sm:text-sm text-textMain-mutedLight dark:text-textMain-mutedDark leading-relaxed">
              Enter your pull request URL to track its review lifecycle on your dashboard and claim your <strong>Pull Request Apprentice</strong> achievement badge!
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-textMain-light dark:text-textMain-dark mb-1">
                  GitHub Pull Request URL (or repository URL):
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/firstcontributions/first-contributions/pull/1234"
                  value={contributionUrl}
                  onChange={(e) => setContributionUrl(e.target.value)}
                  className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-surface-borderLight dark:border-surface-borderDark bg-surface-light dark:bg-surface-dark text-textMain-light dark:text-textMain-dark focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-textMain-light dark:text-textMain-dark mb-1">
                    Current Status:
                  </label>
                  <select
                    value={contributionStatus}
                    onChange={(e) => setContributionStatus(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-surface-borderLight dark:border-surface-borderDark bg-surface-light dark:bg-surface-dark text-textMain-light dark:text-textMain-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="planned">Planned (Getting ready)</option>
                    <option value="in_progress">In Progress (Writing code)</option>
                    <option value="submitted">Submitted (Under review)</option>
                    <option value="merged">Merged 🎉</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-textMain-light dark:text-textMain-dark mb-1">
                    Notes / Description:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fixed typos in getting started docs"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-surface-borderLight dark:border-surface-borderDark bg-surface-light dark:bg-surface-dark text-textMain-light dark:text-textMain-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" isLoading={saving} leftIcon={<Sparkles className="w-4 h-4 text-amber-400" />}>
                Complete Wizard & Claim Badge
              </Button>
            </div>
          </form>
        )}

        {/* Wizard Navigation Controls */}
        <div className="pt-6 border-t border-surface-borderLight dark:border-surface-borderDark flex items-center justify-between">
          <Button
            onClick={handlePrev}
            disabled={currentStep === 1}
            variant="outline"
            size="sm"
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Previous
          </Button>

          {currentStep < 10 && (
            <Button onClick={handleNext} size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
              Continue to Step {currentStep + 1}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
