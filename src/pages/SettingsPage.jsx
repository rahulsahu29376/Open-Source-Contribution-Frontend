import React from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Settings, Sun, Moon, Bell, Shield, Download, Trash2 } from 'lucide-react';
import { Card } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';
import { useToast } from '../context/ToastContext.jsx';

export const SettingsPage = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { showSuccess, showInfo } = useToast();

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(user, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `open-source-guide-profile-${user?.id || 'export'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showSuccess('Exported your account learning data.');
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-textMain-light dark:text-textMain-dark">
          Platform Preferences
        </h1>
        <p className="text-xs sm:text-sm text-textMain-mutedLight dark:text-textMain-mutedDark">
          Configure interface appearance, notification preferences, and learning data.
        </p>
      </div>

      <div className="space-y-4">
        {/* Appearance Card */}
        <Card className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-textMain-light dark:text-textMain-dark flex items-center gap-2">
              {isDark ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-amber-500" />}
              Color Theme
            </h3>
            <p className="text-xs text-textMain-mutedLight dark:text-textMain-mutedDark">
              Toggle between sleek developer dark mode and crisp high-contrast light mode.
            </p>
          </div>

          <Button onClick={toggleTheme} variant="outline" size="sm">
            {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </Button>
        </Card>

        {/* Data Export Card */}
        <Card className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-textMain-light dark:text-textMain-dark flex items-center gap-2">
              <Download className="w-4 h-4 text-secondary" />
              Download My Learning Data
            </h3>
            <p className="text-xs text-textMain-mutedLight dark:text-textMain-mutedDark">
              Export your completed modules, recorded PR links, and earned badges as JSON.
            </p>
          </div>

          <Button onClick={handleExportData} variant="outline" size="sm">
            Export JSON
          </Button>
        </Card>
      </div>
    </div>
  );
};
