import { describe, it, expect } from 'vitest';
import { GitEngine } from '../utils/gitEngine.js';

describe('Git Engine Simulator State Machine', () => {
  it('should initialize with default uninitialized state', () => {
    const engine = new GitEngine();
    const state = engine.getState();
    expect(state.initialized).toBe(false);
    expect(state.currentBranch).toBe('main');
  });

  it('should require git init before running git status or git add', () => {
    const engine = new GitEngine();
    const res = engine.execute('git status');
    expect(res.error).toBe(true);
    expect(res.output).toContain('fatal: not a git repository');
  });

  it('should transition to initialized when git init is executed', () => {
    const engine = new GitEngine();
    const res = engine.execute('git init');
    expect(res.error).toBe(false);
    expect(engine.getState().initialized).toBe(true);
  });

  it('should stage files with git add . and commit them with git commit -m', () => {
    const engine = new GitEngine();
    engine.execute('git init');
    const addRes = engine.execute('git add .');
    expect(addRes.error).toBe(false);

    const commitRes = engine.execute('git commit -m "initial commit"');
    expect(commitRes.error).toBe(false);
    expect(engine.getState().commits.length).toBe(1);
    expect(engine.getState().commits[0].message).toBe('initial commit');
  });

  it('should create and switch to feature branches with git switch -c', () => {
    const engine = new GitEngine();
    engine.execute('git init');
    const branchRes = engine.execute('git switch -c feat/test-branch');
    expect(branchRes.error).toBe(false);
    expect(engine.getState().currentBranch).toBe('feat/test-branch');
    expect(engine.getState().branches).toContain('feat/test-branch');
  });

  it('should support safe fast-forward merge', () => {
    const engine = new GitEngine();
    engine.execute('git init');
    engine.execute('git switch -c feat/my-feature');
    engine.execute('git switch main');
    const mergeRes = engine.execute('git merge feat/my-feature');
    expect(mergeRes.error).toBe(false);
    expect(engine.getState().mergedBranches).toContain('feat/my-feature');
  });
});
