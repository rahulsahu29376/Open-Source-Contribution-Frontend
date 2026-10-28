import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { GitPullRequest, Mail, Lock, User, Github, ArrowRight } from 'lucide-react';
import { Card } from '../components/common/Card.jsx';
import { Input } from '../components/common/Input.jsx';
import { Button } from '../components/common/Button.jsx';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    githubUsername: '',
    experienceLevel: 'beginner',
    preferredLanguages: 'JavaScript, Python',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const langs = formData.preferredLanguages
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        githubUsername: formData.githubUsername || undefined,
        experienceLevel: formData.experienceLevel,
        preferredLanguages: langs,
      });

      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center mx-auto shadow-md">
            <GitPullRequest className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-textMain-light dark:text-textMain-dark">
            Join Open-Source Beginner Guide
          </h1>
          <p className="text-xs text-textMain-mutedLight dark:text-textMain-mutedDark">
            Track your curriculum progress, practice in sandbox, and earn contribution badges
          </p>
        </div>

        <Card className="p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-error-light dark:bg-error/10 border border-error/30 text-error text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              icon={User}
              placeholder="Alex Rivera"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />

            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              helperText="Must be at least 8 characters long"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="GitHub Username (Optional)"
                icon={Github}
                placeholder="e.g. torvalds"
                value={formData.githubUsername}
                onChange={(e) => setFormData({ ...formData, githubUsername: e.target.value })}
              />

              <div>
                <label className="block text-xs font-semibold text-textMain-light dark:text-textMain-dark mb-1.5">
                  Experience Level
                </label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                  className="w-full rounded-xl border border-surface-borderLight dark:border-surface-borderDark bg-white dark:bg-surface-cardDark text-textMain-light dark:text-textMain-dark text-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="beginner">Beginner (Learning to code)</option>
                  <option value="intermediate">Intermediate (Built a few apps)</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <Input
              label="Preferred Programming Languages"
              placeholder="e.g. JavaScript, Python, HTML/CSS"
              value={formData.preferredLanguages}
              onChange={(e) => setFormData({ ...formData, preferredLanguages: e.target.value })}
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Create Free Account
            </Button>
          </form>

          <div className="text-center text-xs text-textMain-mutedLight dark:text-textMain-mutedDark pt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Sign in here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
