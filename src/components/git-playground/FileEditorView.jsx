import React, { useState } from 'react';
import { FileCode, Plus, Save, Trash2, FileText } from 'lucide-react';
import { Button } from '../common/Button.jsx';

export const FileEditorView = ({ files = {}, onSaveFile, onCreateFile, onDeleteFile }) => {
  const fileKeys = Object.keys(files);
  const [activeFile, setActiveFile] = useState(fileKeys[0] || 'README.md');
  const [content, setContent] = useState(files[activeFile] || '');
  const [isModified, setIsModified] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);

  const handleSelectFile = (name) => {
    setActiveFile(name);
    setContent(files[name] || '');
    setIsModified(false);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setIsModified(true);
  };

  const handleSave = () => {
    onSaveFile(activeFile, content);
    setIsModified(false);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const name = newFileName.trim();
    if (name && !files[name]) {
      onCreateFile(name, '');
      setActiveFile(name);
      setContent('');
      setIsModified(false);
      setNewFileName('');
      setShowNewModal(false);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl bg-white dark:bg-surface-cardDark border border-surface-borderLight dark:border-surface-borderDark shadow-sm overflow-hidden">
      {/* Tab Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-surface-light dark:bg-surface-dark border-b border-surface-borderLight dark:border-surface-borderDark overflow-x-auto">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {fileKeys.map((name) => (
            <button
              key={name}
              onClick={() => handleSelectFile(name)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                activeFile === name
                  ? 'bg-white dark:bg-surface-cardDark text-primary font-bold shadow-xs'
                  : 'text-textMain-mutedLight dark:text-textMain-mutedDark hover:text-textMain-light dark:hover:text-textMain-dark'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{name}</span>
              {activeFile === name && isModified && (
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              )}
            </button>
          ))}
          <button
            onClick={() => setShowNewModal(true)}
            className="p-1 rounded-md text-textMain-mutedLight dark:text-textMain-mutedDark hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Create new file"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Save button */}
        <div className="flex items-center gap-2 pl-2">
          {isModified && (
            <Button onClick={handleSave} size="sm" variant="success" leftIcon={<Save className="w-3.5 h-3.5" />}>
              Save File
            </Button>
          )}
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 relative p-4 bg-white dark:bg-surface-cardDark">
        <textarea
          value={content}
          onChange={handleContentChange}
          spellCheck={false}
          className="w-full h-full resize-none font-mono text-xs sm:text-sm bg-transparent border-none text-textMain-light dark:text-textMain-dark focus:outline-none leading-relaxed"
          placeholder="Edit file contents here... Hit 'Save File' or changes will remain in buffer."
        />
      </div>

      {/* New File Modal */}
      {showNewModal && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-20">
          <form
            onSubmit={handleCreate}
            className="bg-white dark:bg-surface-cardDark p-4 rounded-xl shadow-xl border border-surface-borderLight dark:border-surface-borderDark w-full max-w-xs space-y-3"
          >
            <h4 className="text-xs font-bold text-textMain-light dark:text-textMain-dark">New File</h4>
            <input
              type="text"
              placeholder="e.g. CONTRIBUTING.md"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              autoFocus
              className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-surface-borderLight dark:border-surface-borderDark bg-surface-light dark:bg-surface-dark text-textMain-light dark:text-textMain-dark focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => setShowNewModal(false)}>
                Cancel
              </Button>
              <Button size="sm" type="submit">
                Create
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
