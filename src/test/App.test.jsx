import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage.jsx';
import { ThemeProvider } from '../context/ThemeContext.jsx';
import { ToastProvider } from '../context/ToastContext.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';

describe('Frontend Rendering Tests', () => {
  it('renders Landing Page Hero headline correctly', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <LandingPage />
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    const headline = screen.getByText(/Your First Open-Source Contribution Starts Here/i);
    expect(headline).toBeInTheDocument();
  });

  it('renders CTA buttons on Landing Page', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <LandingPage />
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    const startBtn = screen.getByRole('button', { name: /^Start Learning$/i });
    expect(startBtn).toBeInTheDocument();

    const exploreBtn = screen.getByRole('button', { name: /^Explore Projects$/i });
    expect(exploreBtn).toBeInTheDocument();
  });
});
