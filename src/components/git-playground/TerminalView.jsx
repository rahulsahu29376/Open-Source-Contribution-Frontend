import React, { useState, useRef, useEffect } from 'react';
import { Terminal, CornerDownLeft, Sparkles } from 'lucide-react';

export const TerminalView = ({ onExecute, history = [], currentBranch = 'main' }) => {
  const [input, setInput] = useState('');
  const [cmdIndex, setCmdIndex] = useState(-1);
  const [cmdHistory, setCmdHistory] = useState([]);
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = input.trim();
      if (trimmed) {
        setCmdHistory((prev) => [...prev, trimmed]);
        setCmdIndex(-1);
        onExecute(trimmed);
        setInput('');
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = cmdIndex === -1 ? cmdHistory.length - 1 : Math.max(cmdIndex - 1, 0);
      setCmdIndex(nextIdx);
      setInput(cmdHistory[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdIndex === -1) return;
      const nextIdx = cmdIndex + 1;
      if (nextIdx >= cmdHistory.length) {
        setCmdIndex(-1);
        setInput('');
      } else {
        setCmdIndex(nextIdx);
        setInput(cmdHistory[nextIdx]);
      }
    }
  };

  // Convert ANSI escape codes to basic styled spans
  const formatAnsi = (text) => {
    if (!text) return '';
    return text
      .replace(/\x1b\[32m/g, '<span class="text-emerald-400">')
      .replace(/\x1b\[31m/g, '<span class="text-rose-400">')
      .replace(/\x1b\[33m/g, '<span class="text-amber-400">')
      .replace(/\x1b\[0m/g, '</span>');
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex flex-col h-full rounded-2xl bg-[#090D16] border border-slate-800 text-slate-100 font-mono shadow-xl overflow-hidden cursor-text"
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0D1322] border-b border-slate-800/80 text-xs text-slate-400 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="font-semibold text-slate-300 ml-2">bash / simulated-git-cli</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span>Branch: <span className="text-primary font-bold">{currentBranch}</span></span>
        </div>
      </div>

      {/* Terminal Output Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2 text-xs leading-relaxed">
        <div className="text-slate-500 mb-2">
          Welcome to the Safe Interactive Git Terminal. Try <code className="text-slate-300">git status</code> or <code className="text-slate-300">git --help</code>.
        </div>

        {history.map((entry, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center gap-2 text-primary">
              <span className="text-emerald-400 font-bold">learner@guide:~/workspace</span>
              <span className="text-slate-400">({currentBranch})</span>
              <span className="text-slate-200">$ {entry.command}</span>
            </div>
            {entry.output && (
              <pre
                className={`pl-4 whitespace-pre-wrap ${entry.error ? 'text-rose-400' : 'text-slate-300'}`}
                dangerouslySetInnerHTML={{ __html: formatAnsi(entry.output) }}
              />
            )}
          </div>
        ))}

        <div ref={terminalEndRef} />
      </div>

      {/* Input Prompt */}
      <div className="p-3 bg-[#0D1322] border-t border-slate-800/80 flex items-center gap-2 text-xs">
        <span className="text-emerald-400 font-bold shrink-0">workspace</span>
        <span className="text-slate-400 shrink-0">({currentBranch}) $</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck={false}
          autoComplete="off"
          className="flex-1 bg-transparent border-none text-slate-100 focus:outline-none font-mono text-xs"
          placeholder="type git command here..."
        />
        <button
          onClick={() => {
            if (input.trim()) {
              setCmdHistory((prev) => [...prev, input.trim()]);
              onExecute(input.trim());
              setInput('');
            }
          }}
          className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
