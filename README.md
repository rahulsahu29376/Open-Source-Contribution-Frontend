# Open-Source-Contribution-Frontend

> Interactive educational client for the Open-Source Beginner Guide platform. Built with React 18, Vite, Tailwind CSS, Lucide Icons, and Recharts.

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)](https://open-source-contribution-frontend-3enf-8kbp54lo5-sitaram4.vercel.app)
[![Backend Status](https://img.shields.io/badge/Backend-Render-brightgreen?logo=render)](https://open-source-contribution-backend.onrender.com)

- 🌐 **Live Frontend Application**: [https://open-source-contribution-frontend-3enf-8kbp54lo5-sitaram4.vercel.app](https://open-source-contribution-frontend-3enf-8kbp54lo5-sitaram4.vercel.app)
- 🚀 **Connected Live Backend API**: [https://open-source-contribution-backend.onrender.com](https://open-source-contribution-backend.onrender.com)

---

## 🌟 Features Included

- **Interactive In-Browser Git Simulator**: A custom JavaScript state machine modeling working directories, staging areas, commit trees, and branches with terminal emulation and live multi-tab file editing.
- **Guided Git Challenges**: 4 interactive levels with live automated state validation and badge unlocks.
- **7-Module Interactive Curriculum**: Deep, beginner-accessible lessons on Git, GitHub, remotes, branches, merge conflicts, pull requests, and recovery.
- **Knowledge Assessments & Quizzes**: Multiple question formats (Multiple Choice, True/False, and Order Sequence) with instant feedback and scoring.
- **GitHub Project Explorer**: Real-time discovery of public repositories and issues labeled `good-first-issue` and `help-wanted`.
- **First Contribution Wizard**: 10-step interactive workflow guiding newcomers from language selection to crafting and logging pull requests.
- **Gamified Progress Dashboard**: Visual progress bars, Recharts analytics, and achievement badges.
- **AI Learning Assistant Modal**: Explains Git commands, diagnoses terminal errors, and generates customized 4-week learning plans.

---

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS & CSS Design Tokens (Custom dark/light mode)
- **Routing**: React Router v6
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Micro-Interactions**: Canvas-Confetti
- **HTTP Client**: Axios with JWT Interceptors
- **Testing**: Vitest & React Testing Library

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```
Default configuration:
```env
VITE_API_BASE_URL=/api
VITE_SUPABASE_URL=https://wmdybpwsornoveowiraz.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_fd1hERq6NAMfR2Mxk-ACAQ_lK_X0hEd
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Run Automated Tests
```bash
npm test
```

### 5. Build for Production
```bash
npm run build
```

---

## 📄 License
MIT License.
