import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout.jsx';
import { DashboardLayout } from './layouts/DashboardLayout.jsx';

// Pages
import { LandingPage } from './pages/LandingPage.jsx';
import { LearnPage } from './pages/LearnPage.jsx';
import { LessonDetailPage } from './pages/LessonDetailPage.jsx';
import { GitPlaygroundPage } from './pages/GitPlaygroundPage.jsx';
import { QuizzesPage } from './pages/QuizzesPage.jsx';
import { QuizDetailPage } from './pages/QuizDetailPage.jsx';
import { ExplorePage } from './pages/ExplorePage.jsx';
import { FirstContributionWizardPage } from './pages/FirstContributionWizardPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { ProgressPage } from './pages/ProgressPage.jsx';
import { BookmarksPage } from './pages/BookmarksPage.jsx';
import { SavedProjectsPage } from './pages/SavedProjectsPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { SettingsPage } from './pages/SettingsPage.jsx';
import { AboutPage } from './pages/AboutPage.jsx';
import { ContributingPage } from './pages/ContributingPage.jsx';
import { PrivacyPage } from './pages/PrivacyPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <Routes>
      {/* Public Pages with Main Layout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="learn" element={<LearnPage />} />
        <Route path="learn/:slug" element={<LessonDetailPage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="explore/issues" element={<ExplorePage />} />
        <Route path="playground" element={<div className="p-4 sm:p-6 lg:p-8"><GitPlaygroundPage /></div>} />
        <Route path="quizzes" element={<div className="p-4 sm:p-6"><QuizzesPage /></div>} />
        <Route path="quizzes/:id" element={<div className="p-4 sm:p-6"><QuizDetailPage /></div>} />
        <Route path="first-contribution" element={<div className="p-4 sm:p-6"><FirstContributionWizardPage /></div>} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contributing" element={<ContributingPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Authenticated Workspace Pages with Sidebar & Dashboard Layout */}
      <Route element={<DashboardLayout />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="progress" element={<ProgressPage />} />
        <Route path="bookmarks" element={<BookmarksPage />} />
        <Route path="saved-projects" element={<SavedProjectsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
