import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { User, Github, Award, Lock, Save, Sparkles } from 'lucide-react';
import { Card } from '../components/common/Card.jsx';
import { Input } from '../components/common/Input.jsx';
import { Button } from '../components/common/Button.jsx';
import { Badge } from '../components/common/Badge.jsx';

export const ProfilePage = () => {
  const { user, updateProfile, changePassword } = useAuth();

  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    githubUsername: user?.githubUsername || '',
    experienceLevel: user?.experienceLevel || 'beginner',
    preferredLanguages: user?.preferredLanguages?.join(', ') || 'JavaScript, Python',
    bio: user?.bio || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const langs = form.preferredLanguages
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await updateProfile({
        fullName: form.fullName,
        githubUsername: form.githubUsername,
        experienceLevel: form.experienceLevel,
        preferredLanguages: langs,
        bio: form.bio,
      });
    } catch {
      // Handled in context
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    setChangingPass(true);
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      // Handled in context
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-textMain-light dark:text-textMain-dark">
          Profile & Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-textMain-mutedLight dark:text-textMain-mutedDark">
          Manage your personal developer profile, track preferences, and security settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card Overview */}
        <Card className="p-6 flex flex-col items-center text-center space-y-4 h-fit md:col-span-1">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-primary to-secondary text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            {user?.fullName?.charAt(0) || 'U'}
          </div>

          <div>
            <h2 className="text-base font-bold text-textMain-light dark:text-textMain-dark">
              {user?.fullName}
            </h2>
            <p className="text-xs text-textMain-mutedLight dark:text-textMain-mutedDark truncate">
              {user?.email}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 justify-center">
            <Badge variant="primary" size="sm">
              {user?.experienceLevel || 'Beginner'}
            </Badge>
            <Badge variant="secondary" size="sm">
              Member
            </Badge>
          </div>

          {user?.githubUsername && (
            <a
              href={`https://github.com/${user.githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-primary hover:underline flex items-center gap-1.5 pt-2"
            >
              <Github className="w-4 h-4" />
              @{user.githubUsername}
            </a>
          )}
        </Card>

        {/* Edit Profile Form */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-textMain-light dark:text-textMain-dark flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Personal Information
            </h3>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  required
                />
                <Input
                  label="GitHub Username"
                  icon={Github}
                  placeholder="e.g. torvalds"
                  value={form.githubUsername}
                  onChange={(e) => setForm({ ...form, githubUsername: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-textMain-light dark:text-textMain-dark mb-1.5">
                    Experience Level
                  </label>
                  <select
                    value={form.experienceLevel}
                    onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
                    className="w-full rounded-xl border border-surface-borderLight dark:border-surface-borderDark bg-white dark:bg-surface-cardDark text-textMain-light dark:text-textMain-dark text-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="beginner">Beginner (Learning Basics)</option>
                    <option value="intermediate">Intermediate (Built Projects)</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <Input
                  label="Preferred Languages (comma separated)"
                  placeholder="e.g. JavaScript, Python, Go"
                  value={form.preferredLanguages}
                  onChange={(e) => setForm({ ...form, preferredLanguages: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-textMain-light dark:text-textMain-dark mb-1.5">
                  Bio
                </label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="A few words about your developer journey..."
                  className="w-full rounded-xl border border-surface-borderLight dark:border-surface-borderDark bg-white dark:bg-surface-cardDark text-textMain-light dark:text-textMain-dark text-sm p-3 focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" isLoading={savingProfile} leftIcon={<Save className="w-3.5 h-3.5" />}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>

          {/* Change Password Card */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-textMain-light dark:text-textMain-dark flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              Security & Password
            </h3>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="New Password"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  helperText="Minimum 8 characters"
                  required
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="outline" isLoading={changingPass}>
                  Update Password
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
