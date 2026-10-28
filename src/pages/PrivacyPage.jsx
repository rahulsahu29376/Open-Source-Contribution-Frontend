import React from 'react';
import { ShieldCheck, Lock, Eye, Database } from 'lucide-react';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';

export const PrivacyPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <Badge variant="primary" size="md">Privacy Notice</Badge>
        <h1 className="text-3xl font-extrabold text-textMain-light dark:text-textMain-dark">
          Privacy Policy & Data Handling
        </h1>
        <p className="text-sm text-textMain-mutedLight dark:text-textMain-mutedDark">
          Clear, honest disclosure of what data we collect, why we collect it, and how your privacy is protected.
        </p>
      </div>

      <div className="space-y-4 text-xs sm:text-sm text-textMain-mutedLight dark:text-textMain-mutedDark leading-relaxed">
        <Card className="p-6 space-y-3">
          <h3 className="font-bold text-base text-textMain-light dark:text-textMain-dark flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            1. User Authentication & Password Security
          </h3>
          <p>
            When you register, your password is encrypted using <strong>bcrypt</strong> with an industry-standard work factor of 12. We never store, log, or have access to plaintext passwords. Session tokens are signed using JWTs.
          </p>
        </Card>

        <Card className="p-6 space-y-3">
          <h3 className="font-bold text-base text-textMain-light dark:text-textMain-dark flex items-center gap-2">
            <Database className="w-4 h-4 text-secondary" />
            2. Progress & Activity Data
          </h3>
          <p>
            We save your completed lessons, quiz scores, bookmarked repositories, and logged pull requests solely to compute your personal learning statistics and award badges. We do not sell or share this data with third parties.
          </p>
        </Card>

        <Card className="p-6 space-y-3">
          <h3 className="font-bold text-base text-textMain-light dark:text-textMain-dark flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-500" />
            3. AI Learning Assistant Inputs
          </h3>
          <p>
            Questions submitted to the AI Learning Assistant are used only to generate instant educational explanations. Never submit private API keys, passwords, or company proprietary source code to the assistant.
          </p>
        </Card>
      </div>
    </div>
  );
};
