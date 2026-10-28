/**
 * Browser-Based Safe Git Engine & State Machine
 */

export class GitEngine {
  constructor(initialState = null) {
    if (initialState) {
      this.state = JSON.parse(JSON.stringify(initialState));
    } else {
      this.reset();
    }
  }

  reset() {
    this.state = {
      initialized: false,
      currentBranch: 'main',
      branches: ['main'],
      headCommitId: null,
      commits: [], // Array of { id, shortId, message, author, timestamp, parentId, branch, files: {} }
      stagingArea: {}, // filename -> content
      workingDirectory: {
        'README.md': '# My Awesome Project\n\nA simple open-source beginner project.',
        'index.js': 'console.log("Hello, Open Source Contributor!");',
        'style.css': 'body { font-family: sans-serif; }',
      },
      lastCommittedFiles: {},
      mergedBranches: [],
    };
    return this.getState();
  }

  getState() {
    return JSON.parse(JSON.stringify(this.state));
  }

  // Update working directory file
  updateFile(filename, content) {
    this.state.workingDirectory[filename] = content;
    return this.getState();
  }

  createFile(filename, content = '') {
    this.state.workingDirectory[filename] = content;
    return this.getState();
  }

  deleteFile(filename) {
    delete this.state.workingDirectory[filename];
    return this.getState();
  }

  // Execute Git Command string safely
  execute(commandStr) {
    const raw = (commandStr || '').trim();
    if (!raw) return { output: '', error: false };

    // Strip leading 'git ' or process bash-like commands
    const parts = raw.split(/\s+/);
    const base = parts[0].toLowerCase();

    if (base === 'clear') {
      return { output: '__CLEAR__', error: false };
    }

    if (base !== 'git') {
      return {
        output: `Command '${base}' not found. Try 'git --help' to see supported Git commands.`,
        error: true,
      };
    }

    const sub = parts[1]?.toLowerCase();
    const args = parts.slice(2);

    if (!sub || sub === '--help' || sub === 'help') {
      return {
        output: `Supported Simulated Git Commands:
  git init                  Initialize a new repository
  git status                Show working directory and staging status
  git add <file> | .        Stage modified or new files
  git commit -m "message"   Record changes to the repository
  git log [--oneline]       Show commit logs
  git branch [-d] [name]    List, create, or delete branches
  git switch [-c] <name>    Switch or create-and-switch branches
  git checkout [-b] <name>  Switch or create-and-switch branches
  git diff [--staged]       Show file line changes
  git merge <branch>        Merge a branch into the current branch
  clear                     Clear the terminal window`,
        error: false,
      };
    }

    if (sub === '--version') {
      return { output: 'git version 2.45.0.simulated.browser', error: false };
    }

    // Commands requiring git init
    if (!this.state.initialized && sub !== 'init') {
      return {
        output: 'fatal: not a git repository (or any of the parent directories): .git\nRun `git init` to initialize a new repository.',
        error: true,
      };
    }

    switch (sub) {
      case 'init':
        return this._cmdInit();
      case 'status':
        return this._cmdStatus();
      case 'add':
        return this._cmdAdd(args);
      case 'commit':
        return this._cmdCommit(args, raw);
      case 'log':
        return this._cmdLog(args);
      case 'branch':
        return this._cmdBranch(args);
      case 'switch':
        return this._cmdSwitch(args);
      case 'checkout':
        return this._cmdCheckout(args);
      case 'diff':
        return this._cmdDiff(args);
      case 'merge':
        return this._cmdMerge(args);
      case 'reset':
        return this._cmdReset(args);
      default:
        return {
          output: `git: '${sub}' is not a recognized command in this simulator. Try 'git --help'.`,
          error: true,
        };
    }
  }

  _cmdInit() {
    if (this.state.initialized) {
      return {
        output: `Reinitialized existing Git repository in /workspace/.git/`,
        error: false,
      };
    }
    this.state.initialized = true;
    return {
      output: `Initialized empty Git repository in /workspace/.git/\nCreated default branch: 'main'`,
      error: false,
    };
  }

  _cmdStatus() {
    const currentBranch = this.state.currentBranch;
    const stagedFiles = Object.keys(this.state.stagingArea);
    const untrackedOrModified = [];

    for (const [filename, content] of Object.entries(this.state.workingDirectory)) {
      const lastCommitted = this.state.lastCommittedFiles[filename];
      const staged = this.state.stagingArea[filename];

      if (staged !== undefined) {
        // Already in staging, check if working copy has further unstaged changes
        if (content !== staged) {
          untrackedOrModified.push({ filename, type: 'modified (not staged)' });
        }
      } else if (lastCommitted === undefined) {
        untrackedOrModified.push({ filename, type: 'untracked' });
      } else if (lastCommitted !== content) {
        untrackedOrModified.push({ filename, type: 'modified' });
      }
    }

    let out = `On branch ${currentBranch}\n`;

    if (this.state.commits.length === 0) {
      out += `No commits yet\n\n`;
    }

    if (stagedFiles.length > 0) {
      out += `Changes to be committed:\n  (use "git restore --staged <file>..." to unstage)\n`;
      for (const f of stagedFiles) {
        out += `\t\x1b[32mnew/modified: ${f}\x1b[0m\n`;
      }
      out += `\n`;
    }

    if (untrackedOrModified.length > 0) {
      const untracked = untrackedOrModified.filter((x) => x.type === 'untracked');
      const modified = untrackedOrModified.filter((x) => x.type.includes('modified'));

      if (modified.length > 0) {
        out += `Changes not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n`;
        for (const m of modified) {
          out += `\t\x1b[31mmodified: ${m.filename}\x1b[0m\n`;
        }
        out += `\n`;
      }

      if (untracked.length > 0) {
        out += `Untracked files:\n  (use "git add <file>..." to include in what will be committed)\n`;
        for (const u of untracked) {
          out += `\t\x1b[31m${u.filename}\x1b[0m\n`;
        }
        out += `\n`;
      }
    }

    if (stagedFiles.length === 0 && untrackedOrModified.length === 0) {
      out += `nothing to commit, working tree clean`;
    }

    return { output: out, error: false };
  }

  _cmdAdd(args) {
    if (!args[0]) {
      return { output: 'Nothing specified, nothing added.\nMaybe you wanted to say `git add .`?', error: true };
    }

    const target = args[0];
    if (target === '.' || target === '-A' || target === '--all') {
      for (const [file, content] of Object.entries(this.state.workingDirectory)) {
        this.state.stagingArea[file] = content;
      }
      return { output: 'Staged all changes in working directory.', error: false };
    }

    if (this.state.workingDirectory[target] !== undefined) {
      this.state.stagingArea[target] = this.state.workingDirectory[target];
      return { output: `Staged: ${target}`, error: false };
    }

    return { output: `fatal: pathspec '${target}' did not match any files`, error: true };
  }

  _cmdCommit(args, rawCommand) {
    if (Object.keys(this.state.stagingArea).length === 0) {
      return {
        output: 'On branch ' + this.state.currentBranch + '\nnothing to commit, working tree clean (run `git add <file>` first)',
        error: true,
      };
    }

    // Extract message from -m "message"
    const mMatch = rawCommand.match(/-m\s+["']([^"']+)["']/);
    let message = mMatch ? mMatch[1] : null;

    if (!message) {
      // Check if user passed -m message without quotes
      const mIndex = args.indexOf('-m');
      if (mIndex !== -1 && args[mIndex + 1]) {
        message = args.slice(mIndex + 1).join(' ').replace(/^["']|["']$/g, '');
      }
    }

    if (!message) {
      return {
        output: 'error: switch `m` requires a value\nUsage: git commit -m "your message here"',
        error: true,
      };
    }

    const commitId = 'c' + (this.state.commits.length + 1) + '-' + Math.random().toString(36).substring(2, 8);
    const shortId = commitId.substring(0, 7);

    // Snapshot current committed files
    const snapshotFiles = {
      ...this.state.lastCommittedFiles,
      ...this.state.stagingArea,
    };

    const newCommit = {
      id: commitId,
      shortId,
      message,
      author: 'Learner <learner@example.com>',
      timestamp: new Date().toLocaleTimeString(),
      parentId: this.state.headCommitId,
      branch: this.state.currentBranch,
      files: snapshotFiles,
      fileCount: Object.keys(this.state.stagingArea).length,
    };

    this.state.commits.push(newCommit);
    this.state.headCommitId = commitId;
    this.state.lastCommittedFiles = snapshotFiles;
    this.state.stagingArea = {};

    return {
      output: `[${this.state.currentBranch} ${shortId}] ${message}\n ${newCommit.fileCount} file(s) changed, staged changes snapshot recorded.`,
      error: false,
    };
  }

  _cmdLog(args) {
    if (this.state.commits.length === 0) {
      return { output: 'fatal: your current branch does not have any commits yet', error: true };
    }

    const oneline = args.includes('--oneline');
    // Filter commits on current branch lineage
    const branchCommits = [...this.state.commits].reverse();

    if (oneline) {
      const lines = branchCommits.map((c, idx) => {
        const headMarker = idx === 0 ? ` (HEAD -> ${this.state.currentBranch})` : '';
        return `${c.shortId}${headMarker} ${c.message}`;
      });
      return { output: lines.join('\n'), error: false };
    }

    const blocks = branchCommits.map((c, idx) => {
      const headMarker = idx === 0 ? ` (HEAD -> ${this.state.currentBranch})` : '';
      return `commit ${c.id}${headMarker}\nAuthor: ${c.author}\nDate:   ${c.timestamp}\n\n    ${c.message}\n`;
    });

    return { output: blocks.join('\n'), error: false };
  }

  _cmdBranch(args) {
    if (!args[0]) {
      // List branches
      const lines = this.state.branches.map((b) => {
        return b === this.state.currentBranch ? `* \x1b[32m${b}\x1b[0m` : `  ${b}`;
      });
      return { output: lines.join('\n'), error: false };
    }

    if (args[0] === '-d' || args[0] === '--delete') {
      const target = args[1];
      if (!target) return { output: 'fatal: branch name required', error: true };
      if (target === this.state.currentBranch) {
        return { output: `error: Cannot delete branch '${target}' checked out at current directory.`, error: true };
      }
      if (!this.state.branches.includes(target)) {
        return { output: `error: branch '${target}' not found.`, error: true };
      }
      this.state.branches = this.state.branches.filter((b) => b !== target);
      return { output: `Deleted branch ${target}.`, error: false };
    }

    // Create new branch
    const newBranch = args[0];
    if (this.state.branches.includes(newBranch)) {
      return { output: `fatal: a branch named '${newBranch}' already exists`, error: true };
    }

    this.state.branches.push(newBranch);
    return { output: `Created branch '${newBranch}'`, error: false };
  }

  _cmdSwitch(args) {
    if (!args[0]) return { output: 'fatal: missing branch operand', error: true };

    if (args[0] === '-c' || args[0] === '--create') {
      const branchName = args[1];
      if (!branchName) return { output: 'fatal: missing branch name', error: true };
      if (this.state.branches.includes(branchName)) {
        return { output: `fatal: a branch named '${branchName}' already exists`, error: true };
      }
      this.state.branches.push(branchName);
      this.state.currentBranch = branchName;
      return { output: `Switched to a new branch '${branchName}'`, error: false };
    }

    const branchName = args[0];
    if (!this.state.branches.includes(branchName)) {
      return { output: `fatal: invalid reference: ${branchName}`, error: true };
    }

    this.state.currentBranch = branchName;
    return { output: `Switched to branch '${branchName}'`, error: false };
  }

  _cmdCheckout(args) {
    if (args[0] === '-b') {
      return this._cmdSwitch(['-c', args[1]]);
    }
    return this._cmdSwitch(args);
  }

  _cmdDiff(args) {
    const staged = args.includes('--staged') || args.includes('--cached');
    let out = '';

    if (staged) {
      for (const [file, content] of Object.entries(this.state.stagingArea)) {
        const prev = this.state.lastCommittedFiles[file] || '';
        out += `diff --git a/${file} b/${file}\n--- a/${file}\n+++ b/${file}\n`;
        const prevLines = prev.split('\n');
        const nextLines = content.split('\n');
        for (const l of nextLines) {
          if (!prevLines.includes(l)) {
            out += `\x1b[32m+ ${l}\x1b[0m\n`;
          }
        }
      }
    } else {
      for (const [file, content] of Object.entries(this.state.workingDirectory)) {
        const stagedOrCommitted = this.state.stagingArea[file] || this.state.lastCommittedFiles[file] || '';
        if (stagedOrCommitted !== content) {
          out += `diff --git a/${file} b/${file}\n--- a/${file}\n+++ b/${file}\n`;
          out += `\x1b[32m+ ${content.slice(0, 100)}\x1b[0m\n`;
        }
      }
    }

    return { output: out || 'No diff detected.', error: false };
  }

  _cmdMerge(args) {
    const sourceBranch = args[0];
    if (!sourceBranch) return { output: 'fatal: missing branch to merge', error: true };
    if (!this.state.branches.includes(sourceBranch)) {
      return { output: `merge: ${sourceBranch} - not something we can merge`, error: true };
    }
    if (sourceBranch === this.state.currentBranch) {
      return { output: 'Already up to date.', error: false };
    }

    if (!this.state.mergedBranches.includes(sourceBranch)) {
      this.state.mergedBranches.push(sourceBranch);
    }

    return {
      output: `Updating HEAD...\nFast-forward merge of branch '${sourceBranch}' into '${this.state.currentBranch}' completed.\nWorking tree clean.`,
      error: false,
    };
  }

  _cmdReset(args) {
    if (args[0] === '--soft' || args[0] === 'HEAD~1') {
      return { output: 'HEAD is now at previous commit. Staged changes preserved.', error: false };
    }
    this.state.stagingArea = {};
    return { output: 'Unstaged all changes. Working directory preserved.', error: false };
  }
}
