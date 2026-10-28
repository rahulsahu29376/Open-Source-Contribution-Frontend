import React from 'react';
import { GitPullRequest, Heart, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';

export const ContributingPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <Badge variant="primary" size="md">Community Guidelines</Badge>
        <h1 className="text-3xl font-extrabold text-textMain-light dark:text-textMain-dark">
          Contributing to Open-Source Beginner Guide
        </h1>
        <p className="text-sm text-textMain-mutedLight dark:text-textMain-mutedDark">
          This project is itself 100% open-source! We welcome contributions to our curriculum, Git playground engine, and exercises.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <h2 className="text-base font-bold text-textMain-light dark:text-textMain-dark">
          How to Contribute
        </h2>
        <div className="space-y-3 text-xs sm:text-sm text-textMain-mutedLight dark:text-textMain-mutedDark leading-relaxed">
          <p>
            1. <strong>Find an Issue</strong>: Check our GitHub repository issues for tasks labeled <code className="text-primary font-mono font-bold">good first issue</code>.
          </p>
          <p>
            2. <strong>Fork & Clone</strong>: Fork the repository to your account, clone locally, and run <code className="text-primary font-mono">npm install</code> in both <code className="font-mono">backend</code> and <code className="font-mono">frontend</code>.
          </p>
          <p>
            3. <strong>Run Tests</strong>: Ensure backend tests pass with <code className="text-primary font-mono">npm test</code> and frontend tests with <code className="text-primary font-mono">npm test</code>.
          </p>
          <p>
            4. <strong>Submit PR</strong>: Open a clear, descriptive pull request linking the issue using <code className="text-primary font-mono">Fixes #123</code>.
          </p>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-base font-bold text-textMain-light dark:text-textMain-dark flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          Code of Conduct Pledge
        </h2>
        <p className="text-xs sm:text-sm text-textMain-mutedLight dark:text-textMain-mutedDark leading-relaxed">
          We are committed to providing a friendly, safe, and welcoming environment for all, regardless of level of experience, gender identity and expression, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, religion, or nationality.
        </p>
      </Card>
    </div>
  );
};
