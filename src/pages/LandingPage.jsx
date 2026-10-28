import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GitPullRequest,
  Terminal,
  BookOpen,
  Award,
  Search,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Code2,
  Users,
  Compass,
  FileCode,
} from 'lucide-react';
import { Button } from '../components/common/Button.jsx';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';

export const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: 'Do I need to be an expert developer to contribute to open source?',
      a: 'Absolutely not! In fact, most first-time contributors start with documentation, typo fixes, fixing broken links, or translating text. Open-source maintainers actively welcome newcomers who take time to follow repository contribution rules.',
    },
    {
      q: 'Do I have to install Git on my computer to start learning?',
      a: 'No. Our interactive Git Playground runs completely inside your web browser. You can practice staging, committing, branching, and merging safely without touching your local command prompt.',
    },
    {
      q: 'What is the difference between Git and GitHub?',
      a: 'Git is the local version control command-line program that tracks file history on your computer. GitHub is a cloud hosting platform that stores your Git repositories online and provides collaboration features like Issues and Pull Requests.',
    },
    {
      q: 'How does this guide help me find suitable projects?',
      a: 'Our built-in GitHub Project Explorer queries the official GitHub API in real time, filtering specifically for repositories that tag beginner-friendly issues like "good first issue", "help wanted", or "documentation".',
    },
    {
      q: 'Is Open-Source Beginner Guide free to use?',
      a: 'Yes, 100% free and open-source. There are no paywalls, hidden subscriptions, or locked features.',
    },
  ];

  return (
    <div className="space-y-24 py-8 sm:py-16 overflow-hidden">
      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <Badge variant="primary" size="md" className="gap-2">
              <Compass className="w-3.5 h-3.5" />
              For Students, Self-Taught & Aspiring Engineers
            </Badge>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-textMain-light dark:text-textMain-dark leading-[1.15]">
              Your First Open-Source Contribution Starts Here.
            </h1>

            <p className="text-base sm:text-lg text-textMain-mutedLight dark:text-textMain-mutedDark max-w-xl leading-relaxed">
              Learn Git, explore real projects, practise developer workflows, and take your first steps into open source with a guide designed for beginners.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/learn">
                <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Start Learning
                </Button>
              </Link>
              <Link to="/explore">
                <Button variant="outline" size="lg" leftIcon={<Search className="w-4 h-4" />}>
                  Explore Projects
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-4 text-xs text-textMain-mutedLight dark:text-textMain-mutedDark">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                No local Git install required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Browser sandbox included
              </span>
            </div>
          </div>

          {/* Hero Visual Card / Simulator Preview */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-gradient-to-tr from-[#0F172A] to-[#1E293B] border border-slate-800 p-6 shadow-2xl text-slate-100 font-mono space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="ml-2 font-sans font-bold text-slate-200">Contribution Workflow</span>
                </div>
                <Badge variant="beginner" size="sm">Active Branch</Badge>
              </div>

              {/* Terminal Flow Demonstration */}
              <div className="space-y-3 text-xs leading-relaxed">
                <div>
                  <span className="text-emerald-400 font-bold">$ git clone</span> https://github.com/my-fork/project.git
                  <p className="text-slate-400 text-[11px]">Cloning into 'project'... done.</p>
                </div>
                <div>
                  <span className="text-emerald-400 font-bold">$ git switch -c</span> docs/fix-readme
                  <p className="text-slate-400 text-[11px]">Switched to a new branch 'docs/fix-readme'</p>
                </div>
                <div>
                  <span className="text-emerald-400 font-bold">$ git commit -m</span> "docs: improve getting started guide"
                  <p className="text-slate-400 text-[11px]">[docs/fix-readme 8a4c1f2] 1 file changed, 4 insertions(+)</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/20 border border-primary/40 text-primary-light flex items-center gap-2 text-xs font-sans font-semibold">
                  <GitPullRequest className="w-4 h-4 shrink-0 text-primary" />
                  <span>Pull Request ready to review on GitHub!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <Badge variant="secondary" size="md">Step-by-Step Pathway</Badge>
          <h2 className="text-3xl font-extrabold text-textMain-light dark:text-textMain-dark">
            How You Go from Zero to First Pull Request
          </h2>
          <p className="text-xs sm:text-sm text-textMain-mutedLight dark:text-textMain-mutedDark">
            A structured, non-intimidating journey structured around real engineering practices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Learn the Concepts',
              desc: 'Understand repositories, commits, remotes, branches, and licensing through clear lessons.',
              icon: BookOpen,
            },
            {
              step: '02',
              title: 'Practice Safely',
              desc: 'Execute real Git commands and edit files in our in-browser simulator without breaking anything.',
              icon: Terminal,
            },
            {
              step: '03',
              title: 'Discover Real Issues',
              desc: 'Filter live repositories on GitHub for "good first issue" labels matching your preferred language.',
              icon: Search,
            },
            {
              step: '04',
              title: 'Ship Your Contribution',
              desc: 'Follow the 10-step wizard to fork, branch, test, open your PR, and track its review status.',
              icon: GitPullRequest,
            },
          ].map((item) => (
            <Card key={item.step} hover className="p-6 space-y-4">
              <span className="text-3xl font-black text-primary/20 font-mono block">
                {item.step}
              </span>
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-textMain-light dark:text-textMain-dark">
                {item.title}
              </h3>
              <p className="text-xs text-textMain-mutedLight dark:text-textMain-mutedDark leading-relaxed">
                {item.desc}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. Git & GitHub Fundamentals Curriculum Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <Badge variant="primary" size="md">Core Curriculum</Badge>
            <h2 className="text-3xl font-extrabold text-textMain-light dark:text-textMain-dark">
              7 Structured Modules Built Specifically for Beginners
            </h2>
            <p className="text-xs sm:text-sm text-textMain-mutedLight dark:text-textMain-mutedDark leading-relaxed">
              Every lesson explains technical vocabulary in accessible language, demonstrates realistic commands, provides expected outputs, and explains common mistakes before you make them.
            </p>

            <div className="space-y-3 pt-2">
              {[
                'Module 1: What is Open Source & Reading Repositories',
                'Module 2: Git Fundamentals & Staging Mechanics',
                'Module 3: GitHub Basics & Remote Remotes',
                'Module 4: Branches & Conflict Resolution',
                'Module 5: Issues, Bug Reports & Etiquette',
                'Module 6: Complete Fork & PR Workflow',
                'Module 7: Troubleshooting, Detached HEAD & Recovery',
              ].map((m, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs font-semibold text-textMain-light dark:text-textMain-dark">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>{m}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link to="/learn">
                <Button size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Explore Full Curriculum
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-6 space-y-3">
              <BookOpen className="w-6 h-6 text-primary" />
              <h4 className="font-bold text-sm text-textMain-light dark:text-textMain-dark">Clear Explanations</h4>
              <p className="text-xs text-textMain-mutedLight dark:text-textMain-mutedDark leading-relaxed">
                No unexplained jargon. Key terms are defined with plain-English analogies.
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <Terminal className="w-6 h-6 text-secondary" />
              <h4 className="font-bold text-sm text-textMain-light dark:text-textMain-dark">Browser Terminal</h4>
              <p className="text-xs text-textMain-mutedLight dark:text-textMain-mutedDark leading-relaxed">
                Test commands in real time with an interactive command history and state inspector.
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <Award className="w-6 h-6 text-amber-500" />
              <h4 className="font-bold text-sm text-textMain-light dark:text-textMain-dark">Quizzes & Feedback</h4>
              <p className="text-xs text-textMain-mutedLight dark:text-textMain-mutedDark leading-relaxed">
                Instant grading and detailed rationales for every correct and incorrect answer.
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <Users className="w-6 h-6 text-emerald-500" />
              <h4 className="font-bold text-sm text-textMain-light dark:text-textMain-dark">Real Repositories</h4>
              <p className="text-xs text-textMain-mutedLight dark:text-textMain-mutedDark leading-relaxed">
                Direct links to active open-source projects actively looking for beginner help.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="neutral" size="md">FAQ</Badge>
          <h2 className="text-3xl font-extrabold text-textMain-light dark:text-textMain-dark">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-textMain-mutedLight dark:text-textMain-mutedDark">
            Everything you need to know about starting your open-source journey.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <Card
              key={idx}
              className="overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-textMain-light dark:text-textMain-dark"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 text-textMain-mutedLight ${
                    openFaq === idx ? 'rotate-180 text-primary' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-xs text-textMain-mutedLight dark:text-textMain-mutedDark leading-relaxed border-t border-surface-borderLight dark:border-surface-borderDark">
                  {faq.a}
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* 5. Bottom Call to Action */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-primary via-indigo-600 to-secondary p-8 sm:p-12 text-center text-white shadow-2xl space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Make Your First Pull Request?
          </h2>
          <p className="text-white/80 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Join thousands of developers taking their first steps in open-source. Create an account to track your progress and earn badges, or start browsing immediately.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-slate-100 shadow-md">
                Create Free Account
              </Button>
            </Link>
            <Link to="/playground">
              <Button variant="ghost" size="lg" className="text-white hover:bg-white/10">
                Launch Git Playground
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
