/**
 * TodoWrite Adapter Tests
 *
 * Tests for TodoWrite integration layer.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  TodoWriteAdapter,
  createTodoWriteAdapter,
  formatThoughtHistory
} from '../helpers/todowrite-adapter';
import type { ThoughtData } from '../helpers/types';

describe('TodoWriteAdapter', () => {
  let adapter: TodoWriteAdapter;

  beforeEach(() => {
    adapter = createTodoWriteAdapter();
  });

  describe('constructor', () => {
    it('should create adapter with default config', () => {
      const adapter = createTodoWriteAdapter();
      expect(adapter).toBeDefined();
      expect(adapter.getSessionState()).toBeDefined();
    });

    it('should create adapter with custom config', () => {
      const adapter = createTodoWriteAdapter({
        enableTracking: false,
        maxTasksInList: 10,
        autoCleanup: false
      });
      expect(adapter).toBeDefined();
    });
  });

  describe('trackThought', () => {
    it('should track basic thought', () => {
      const thought: ThoughtData = {
        thought: 'Test thought',
        thoughtNumber: 1,
        totalThoughts: 3,
        nextThoughtNeeded: true
      };

      const task = adapter.trackThought(thought);
      expect(task).toBeDefined();
      expect(task.status).toBe('in_progress');
      expect(task.content).toContain('Test thought');
      expect(task.activeForm).toContain('Thinking 1/3');
    });

    it('should track completed thought', () => {
      const thought: ThoughtData = {
        thought: 'Final thought',
        thoughtNumber: 3,
        totalThoughts: 3,
        nextThoughtNeeded: false
      };

      const task = adapter.trackThought(thought);
      expect(task.status).toBe('completed');
    });

    it('should track revision thought', () => {
      const thought: ThoughtData = {
        thought: 'Revised',
        thoughtNumber: 2,
        totalThoughts: 3,
        nextThoughtNeeded: true,
        isRevision: true,
        revisesThought: 1
      };

      const task = adapter.trackThought(thought);
      expect(task.activeForm).toContain('Revising');
    });

    it('should track branch thought', () => {
      const thought: ThoughtData = {
        thought: 'Branch',
        thoughtNumber: 2,
        totalThoughts: 3,
        nextThoughtNeeded: true,
        branchId: 'test-branch'
      };

      const task = adapter.trackThought(thought);
      expect(task.activeForm).toContain('test-branch');
    });
  });

  describe('updateState', () => {
    it('should update session state', () => {
      const thought: ThoughtData = {
        thought: 'Test',
        thoughtNumber: 1,
        totalThoughts: 3,
        nextThoughtNeeded: true
      };

      adapter.updateState(thought);

      const state = adapter.getSessionState();
      expect(state.thoughtHistory.length).toBe(1);
      expect(state.currentThought).toBe(1);
      expect(state.totalThoughts).toBe(3);
    });

    it('should track multiple thoughts', () => {
      for (let i = 1; i <= 5; i++) {
        adapter.updateState({
          thought: `Thought ${i}`,
          thoughtNumber: i,
          totalThoughts: 5,
          nextThoughtNeeded: i < 5
        });
      }

      const state = adapter.getSessionState();
      expect(state.thoughtHistory.length).toBe(5);
      expect(state.currentThought).toBe(5);
    });

    it('should track branches', () => {
      adapter.updateState({
        thought: 'Branch A',
        thoughtNumber: 1,
        totalThoughts: 2,
        nextThoughtNeeded: true,
        branchFromThought: 1,
        branchId: 'branch-a'
      });

      const state = adapter.getSessionState();
      expect(Object.keys(state.branches).length).toBe(1);
      expect(state.branches['branch-a']).toBeDefined();
    });

    it('should cleanup old tasks when enabled', () => {
      const adapter = createTodoWriteAdapter({
        autoCleanup: true,
        maxTasksInList: 5
      });

      // Add 10 thoughts
      for (let i = 1; i <= 10; i++) {
        adapter.updateState({
          thought: `Thought ${i}`,
          thoughtNumber: i,
          totalThoughts: 10,
          nextThoughtNeeded: i < 10
        });
      }

      const state = adapter.getSessionState();
      // Should keep only last 5
      expect(state.thoughtHistory.length).toBe(5);
    });
  });

  describe('generateTodoList', () => {
    it('should generate basic todo list', () => {
      const todos = adapter.generateTodoList(3);
      expect(todos.length).toBe(3);
      expect(todos.every(t => t.status === 'pending')).toBe(true);
    });

    it('should generate todo list with branches', () => {
      const todos = adapter.generateTodoList(3, ['branch-a', 'branch-b']);
      expect(todos.length).toBe(5); // 3 main + 2 branches
      expect(todos.filter(t => t.content.includes('🌿')).length).toBe(2);
    });

    it('should use custom task prefix', () => {
      const adapter = createTodoWriteAdapter({
        taskPrefix: '🎯'
      });

      const todos = adapter.generateTodoList(3);
      expect(todos[0]?.content).toContain('🎯');
    });
  });

  describe('getStats', () => {
    it('should return stats for empty session', () => {
      const stats = adapter.getStats();
      expect(stats.totalThoughts).toBe(0);
      expect(stats.completedThoughts).toBe(0);
      expect(stats.branchCount).toBe(0);
      expect(stats.revisionCount).toBe(0);
    });

    it('should calculate stats correctly', () => {
      adapter.updateState({
        thought: 'Thought 1',
        thoughtNumber: 1,
        totalThoughts: 5,
        nextThoughtNeeded: true
      });

      adapter.updateState({
        thought: 'Revision',
        thoughtNumber: 2,
        totalThoughts: 5,
        nextThoughtNeeded: true,
        isRevision: true,
        revisesThought: 1
      });

      adapter.updateState({
        thought: 'Branch',
        thoughtNumber: 3,
        totalThoughts: 5,
        nextThoughtNeeded: true,
        branchFromThought: 2,
        branchId: 'test-branch'
      });

      const stats = adapter.getStats();
      expect(stats.totalThoughts).toBe(3);
      expect(stats.completedThoughts).toBe(3);
      expect(stats.branchCount).toBe(1);
      expect(stats.revisionCount).toBe(1);
    });
  });

  describe('findThought', () => {
    it('should find existing thought', () => {
      adapter.updateState({
        thought: 'Test',
        thoughtNumber: 2,
        totalThoughts: 5,
        nextThoughtNeeded: true
      });

      const found = adapter.findThought(2);
      expect(found).toBeDefined();
      expect(found?.thought).toBe('Test');
    });

    it('should return undefined for non-existent thought', () => {
      const found = adapter.findThought(99);
      expect(found).toBeUndefined();
    });
  });

  describe('getBranchThoughts', () => {
    it('should return thoughts in branch', () => {
      adapter.updateState({
        thought: 'Branch 1',
        thoughtNumber: 1,
        totalThoughts: 2,
        nextThoughtNeeded: true,
        branchFromThought: 1,
        branchId: 'test-branch'
      });

      adapter.updateState({
        thought: 'Branch 2',
        thoughtNumber: 2,
        totalThoughts: 2,
        nextThoughtNeeded: false,
        branchFromThought: 1,
        branchId: 'test-branch'
      });

      const thoughts = adapter.getBranchThoughts('test-branch');
      expect(thoughts.length).toBe(2);
    });

    it('should return empty array for non-existent branch', () => {
      const thoughts = adapter.getBranchThoughts('non-existent');
      expect(thoughts).toEqual([]);
    });
  });

  describe('canRevise', () => {
    it('should return true for existing thought', () => {
      adapter.updateState({
        thought: 'Test',
        thoughtNumber: 1,
        totalThoughts: 3,
        nextThoughtNeeded: true
      });

      expect(adapter.canRevise(1)).toBe(true);
    });

    it('should return false for non-existent thought', () => {
      expect(adapter.canRevise(99)).toBe(false);
    });
  });

  describe('reset', () => {
    it('should reset session state', () => {
      adapter.updateState({
        thought: 'Test',
        thoughtNumber: 1,
        totalThoughts: 3,
        nextThoughtNeeded: true
      });

      adapter.reset();

      const state = adapter.getSessionState();
      expect(state.thoughtHistory).toEqual([]);
      expect(state.branches).toEqual({});
      expect(state.currentThought).toBe(0);
      expect(state.totalThoughts).toBe(0);
    });
  });

  describe('exportSession / importSession', () => {
    it('should export session to JSON', () => {
      adapter.updateState({
        thought: 'Test',
        thoughtNumber: 1,
        totalThoughts: 3,
        nextThoughtNeeded: true
      });

      const json = adapter.exportSession();
      expect(json).toBeDefined();
      expect(() => JSON.parse(json) as unknown).not.toThrow();
    });

    it('should import session from JSON', () => {
      adapter.updateState({
        thought: 'Test',
        thoughtNumber: 1,
        totalThoughts: 3,
        nextThoughtNeeded: true
      });

      const json = adapter.exportSession();
      const newAdapter = createTodoWriteAdapter();
      newAdapter.importSession(json);

      const state = newAdapter.getSessionState();
      expect(state.thoughtHistory.length).toBe(1);
    });

    it('should throw on invalid JSON', () => {
      expect(() => adapter.importSession('invalid json')).toThrow();
    });

    it('should roundtrip session data', () => {
      const adapter1 = createTodoWriteAdapter();

      adapter1.updateState({
        thought: 'Thought 1',
        thoughtNumber: 1,
        totalThoughts: 3,
        nextThoughtNeeded: true
      });

      adapter1.updateState({
        thought: 'Branch A',
        thoughtNumber: 2,
        totalThoughts: 3,
        nextThoughtNeeded: true,
        branchFromThought: 1,
        branchId: 'branch-a'
      });

      const json = adapter1.exportSession();
      const adapter2 = createTodoWriteAdapter();
      adapter2.importSession(json);

      const stats1 = adapter1.getStats();
      const stats2 = adapter2.getStats();

      expect(stats1).toEqual(stats2);
    });
  });
});

describe('formatThoughtHistory', () => {
  it('should format empty history', () => {
    const formatted = formatThoughtHistory([]);
    expect(formatted).toBe('');
  });

  it('should format single entry', () => {
    const history = [{
      thoughtNumber: 1,
      totalThoughts: 3,
      thought: 'Test thought',
      timestamp: new Date().toISOString()
    }];

    const formatted = formatThoughtHistory(history);
    expect(formatted).toContain('💭');
    expect(formatted).toContain('#1');
    expect(formatted).toContain('Test');
  });

  it('should limit entries', () => {
    const history = Array.from({ length: 20 }, (_, i) => ({
      thoughtNumber: i + 1,
      totalThoughts: 20,
      thought: `Thought ${i + 1}`,
      timestamp: new Date().toISOString()
    }));

    const formatted = formatThoughtHistory(history, 5);
    const lines = formatted.split('\n');
    expect(lines.length).toBe(5);
  });

  it('should show revision emoji', () => {
    const history = [{
      thoughtNumber: 1,
      totalThoughts: 3,
      thought: 'Revised',
      timestamp: new Date().toISOString(),
      isRevision: true,
      revisesThought: 0
    }];

    const formatted = formatThoughtHistory(history);
    expect(formatted).toContain('✏️');
  });

  it('should show branch emoji', () => {
    const history = [{
      thoughtNumber: 1,
      totalThoughts: 3,
      thought: 'Branch',
      timestamp: new Date().toISOString(),
      branchId: 'test-branch'
    }];

    const formatted = formatThoughtHistory(history);
    expect(formatted).toContain('🌿');
  });
});
