import axios from 'axios';

// Determine the correct API base URL
const isLocal = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '0.0.0.0');

// Live backend deployed on Render
const LIVE_BACKEND_URL = 'https://open-source-contribution-backend.onrender.com/api';

let selectedBaseUrl = '/api';
if (typeof window !== 'undefined' && !isLocal) {
  // If deployed (e.g. Vercel, Render), always target the live backend unless a custom HTTP URL was supplied
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  selectedBaseUrl = (envUrl && envUrl.startsWith('http')) ? envUrl : LIVE_BACKEND_URL;
} else {
  selectedBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
}

const cleanBaseUrl = selectedBaseUrl.replace(/\/+$/, '');
const normalizedBaseUrl = (cleanBaseUrl.startsWith('http') && !cleanBaseUrl.endsWith('/api'))
  ? `${cleanBaseUrl}/api`
  : cleanBaseUrl;

const api = axios.create({
  baseURL: normalizedBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-clear on failed login requests
      if (!error.config.url.includes('/auth/login') && !error.config.url.includes('/auth/register')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.patch('/auth/profile', data),
  changePassword: (data) => api.post('/auth/change-password', data),
};

export const lessonApi = {
  getModules: () => api.get('/lessons/modules'),
  getLessons: (params) => api.get('/lessons', { params }),
  getLessonBySlug: (slug) => api.get(`/lessons/${slug}`),
  markComplete: (id) => api.post(`/lessons/${id}/complete`),
};

export const quizApi = {
  getQuizzes: () => api.get('/quizzes'),
  getQuizById: (id) => api.get(`/quizzes/${id}`),
  submitAttempt: (id, answers) => api.post(`/quizzes/${id}/attempts`, { answers }),
  getAttempts: (id) => api.get(`/quizzes/${id}/attempts`),
};

export const playgroundApi = {
  getChallenges: () => api.get('/playground/challenges'),
  getChallengeById: (id) => api.get(`/playground/challenges/${id}`),
  attemptChallenge: (id, data) => api.post(`/playground/challenges/${id}/attempt`, data),
};

export const githubApi = {
  getRepositories: (params) => api.get('/github/repositories', { params }),
  getIssues: (params) => api.get('/github/issues', { params }),
  getContributingGuide: (owner, repo) => api.get(`/github/repositories/${owner}/${repo}/contributing`),
};

export const bookmarkApi = {
  getBookmarks: () => api.get('/bookmarks'),
  createBookmark: (data) => api.post('/bookmarks', data),
  deleteBookmark: (id) => api.delete(`/bookmarks/${id}`),
};

export const projectApi = {
  getSavedProjects: () => api.get('/projects/saved'),
  saveProject: (data) => api.post('/projects/saved', data),
  deleteSavedProject: (id) => api.delete(`/projects/saved/${id}`),
};

export const contributionApi = {
  getContributions: () => api.get('/contributions'),
  logContribution: (data) => api.post('/contributions', data),
  updateContribution: (id, data) => api.patch(`/contributions/${id}`, data),
  deleteContribution: (id) => api.delete(`/contributions/${id}`),
};

export const progressApi = {
  getAchievements: () => api.get('/progress/achievements'),
  getSummary: () => api.get('/progress/summary'),
  getActivity: () => api.get('/progress/activity'),
  completeWizard: () => api.post('/progress/wizard-complete'),
};

export const aiApi = {
  explainCommand: (command, context) => api.post('/ai/explain-command', { command, context }),
  explainError: (errorMessage, context) => api.post('/ai/explain-error', { errorMessage, context }),
  generateLearningPlan: (data) => api.post('/ai/learning-plan', data),
};

export default api;
