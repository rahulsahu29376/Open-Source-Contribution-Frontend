import React from 'react';
import { Compass, GitPullRequest, Heart, Shield, Code, Users } from 'lucide-react';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';

export const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-10">
      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <Badge variant="primary" size="md">About the Platform</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-textMain-light dark:text-textMain-dark">
          Empowering Every Developer to Contribute
        </h1>
        <p className="text-sm text-textMain-mutedLight dark:text-textMain-mutedDark leading-relaxed">
          Open-Source Beginner Guide was created to solve one of the biggest paradoxes in programming: open-source projects desperately need contributors, while millions of new developers are eager to help but feel intimidated.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-textMain-light dark:text-textMain-dark">
            Zero Gatekeeping
          </h3>
          <p className="text-xs text-textMain-mutedLight dark:text-textMain-mutedDark leading-relaxed">
            Every technical term is explained from scratch. We believe typos, translations, and documentation fixes are just as valuable as writing complex compilers.
          </p>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-textMain-light dark:text-textMain-dark">
            Safe Sandbox
          </h3>
          <p className="text-xs text-textMain-mutedLight dark:text-textMain-mutedDark leading-relaxed">
            Our interactive browser simulator gives students the freedom to experiment with Git commands, stage files, and resolve merge conflicts with zero fear of breaking anything.
          </p>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-textMain-light dark:text-textMain-dark">
            Real Impact
          </h3>
          <p className="text-xs text-textMain-mutedLight dark:text-textMain-mutedDark leading-relaxed">
            We connect directly to the GitHub REST API to surface genuine, active issues that real project maintainers are waiting for help with right now.
          </p>
        </Card>
      </div>
    </div>
  );
};
