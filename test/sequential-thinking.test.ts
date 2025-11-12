/**
 * Sequential Thinking Core Logic Tests
 *
 * Ported from MCP server test suite (39 test cases).
 * Tests validation, processing, branching, and edge cases.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  validateThought,
  normalizeThought,
  processThought,
  createSessionState,
  getSessionStats,
  findThought,
  getBranchThoughts,
  canReviseThought,
} from '../helpers/sequential-thinking';
import type { SessionState } from '../helpers/types';

describe('Sequential Thinking - Validation', () => {
  describe('validateThought', () => {
    it('should reject input with missing thought', () => {
      const input = {
        thoughtNumber: 1,
        totalThoughts: 3,
        nextThoughtNeeded: true,
      };

      const result = validateThought(input);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid thought: must be a non-empty string');
    });

    it('should reject input with non-string thought', () => {
      const input = {
        thought: 123,
        thoughtNumber: 1,
        totalThoughts: 3,
        nextThoughtNeeded: true,
      };

      const result = validateThought(input);
      expect(result.valid).toBe(false);
      expect(result.errors?.[0]).toContain('Invalid thought');
    });

    it('should reject empty thought string', () => {
      const input = {
        thought: '',
        thoughtNumber: 1,
        totalThoughts: 1,
        nextThoughtNeeded: false,
      };

      const result = validateThought(input);
      expect(result.valid).toBe(false);
      expect(result.errors?.[0]).toContain('Thought cannot be empty');
    });

    it('should reject input with missing thoughtNumber', () => {
      const input = {
        thought: 'Test thought',
        totalThoughts: 3,
        nextThoughtNeeded: true,
      };

      const result = validateThought(input);
      expect(result.valid).toBe(false);
      expect(result.errors?.[0]).toContain('Invalid thoughtNumber');
    });

    it('should reject input with non-number thoughtNumber', () => {
      const input = {
        thought: 'Test thought',
        thoughtNumber: '1',
        totalThoughts: 3,
        nextThoughtNeeded: true,
      };

      const result = validateThought(input);
      expect(result.valid).toBe(false);
    });

    it('should reject input with invalid thoughtNumber (< 1)', () => {
      const input = {
        thought: 'Test thought',
        thoughtNumber: 0,
        totalThoughts: 3,
        nextThoughtNeeded: true,
      };

      const result = validateThought(input);
      expect(result.valid).toBe(false);
      expect(result.errors?.[0]).toContain('must be at least 1');
    });

    it('should reject input with missing totalThoughts', () => {
      const input = {
        thought: 'Test thought',
        thoughtNumber: 1,
        nextThoughtNeeded: true,
      };

      const result = validateThought(input);
      expect(result.valid).toBe(false);
      expect(result.errors?.[0]).toContain('Invalid totalThoughts');
    });

    it('should reject input with non-number totalThoughts', () => {
      const input = {
        thought: 'Test thought',
        thoughtNumber: 1,
        totalThoughts: '3',
        nextThoughtNeeded: true,
      };

      const result = validateThought(input);
      expect(result.valid).toBe(false);
    });

    it('should reject input with missing nextThoughtNeeded', () => {
      const input = {
        thought: 'Test thought',
        thoughtNumber: 1,
        totalThoughts: 3,
      };

      const result = validateThought(input);
      expect(result.valid).toBe(false);
      expect(result.errors?.[0]).toContain('Invalid nextThoughtNeeded');
    });

    it('should reject input with non-boolean nextThoughtNeeded', () => {
      const input = {
        thought: 'Test thought',
        thoughtNumber: 1,
        totalThoughts: 3,
        nextThoughtNeeded: 'true',
      };

      const result = validateThought(input);
      expect(result.valid).toBe(false);
    });

    it('should warn if isRevision without revisesThought', () => {
      const input = {
        thought: 'Test thought',
        thoughtNumber: 1,
        totalThoughts: 3,
        nextThoughtNeeded: true,
        isRevision: true,
      };

      const result = validateThought(input);
      expect(result.valid).toBe(true);
      expect(result.warnings).toBeDefined();
      expect(result.warnings?.[0]).toContain('revisesThought is not specified');
    });

    it('should warn if branchFromThought without branchId', () => {
      const input = {
        thought: 'Test thought',
        thoughtNumber: 2,
        totalThoughts: 3,
        nextThoughtNeeded: true,
        branchFromThought: 1,
      };

      const result = validateThought(input);
      expect(result.valid).toBe(true);
      expect(result.warnings).toBeDefined();
      expect(result.warnings?.[0]).toContain('branchId is missing');
    });

    it('should warn if thoughtNumber exceeds totalThoughts', () => {
      const input = {
        thought: 'Test thought',
        thoughtNumber: 5,
        totalThoughts: 3,
        nextThoughtNeeded: true,
      };

      const result = validateThought(input);
      expect(result.valid).toBe(true);
      expect(result.warnings).toBeDefined();
      expect(result.warnings?.[0]).toContain('exceeds totalThoughts');
    });
  });

  describe('normalizeThought', () => {
    it('should normalize valid input', () => {
      const input = {
        thought: 'Test thought',
        thoughtNumber: 1,
        totalThoughts: 3,
        nextThoughtNeeded: true,
      };

      const normalized = normalizeThought(input);
      expect(normalized.thought).toBe('Test thought');
      expect(normalized.thoughtNumber).toBe(1);
      expect(normalized.totalThoughts).toBe(3);
      expect(normalized.nextThoughtNeeded).toBe(true);
    });

    it('should auto-adjust totalThoughts if thoughtNumber exceeds it', () => {
      const input = {
        thought: 'Thought 5',
        thoughtNumber: 5,
        totalThoughts: 3,
        nextThoughtNeeded: true,
      };

      const normalized = normalizeThought(input);
      expect(normalized.totalThoughts).toBe(5);
    });

    it('should throw on invalid input', () => {
      const input = {
        thoughtNumber: 1,
        totalThoughts: 3,
        nextThoughtNeeded: true,
      };

      expect(() => normalizeThought(input)).toThrow();
    });
  });
});

describe('Sequential Thinking - Processing', () => {
  let sessionState: SessionState;

  beforeEach(() => {
    sessionState = createSessionState();
  });

  describe('processThought - basic', () => {
    it('should process valid basic thought', () => {
      const input = {
        thought: 'This is my first thought',
        thoughtNumber: 1,
        totalThoughts: 3,
        nextThoughtNeeded: true,
      };

      const result = processThought(input, { sessionState });
      expect(result.success).toBe(true);
      expect(result.thoughtNumber).toBe(1);
      expect(result.totalThoughts).toBe(3);
      expect(result.nextThoughtNeeded).toBe(true);
      expect(result.thoughtHistoryLength).toBe(1);
    });

    it('should process thought with optional fields', () => {
      const input = {
        thought: 'Revising my earlier idea',
        thoughtNumber: 2,
        totalThoughts: 3,
        nextThoughtNeeded: true,
        isRevision: true,
        revisesThought: 1,
        needsMoreThoughts: false,
      };

      const result = processThought(input, { sessionState });
      expect(result.success).toBe(true);
      expect(result.thoughtNumber).toBe(2);
    });

    it('should track multiple thoughts in history', () => {
      const input1 = {
        thought: 'First thought',
        thoughtNumber: 1,
        totalThoughts: 3,
        nextThoughtNeeded: true,
      };

      const input2 = {
        thought: 'Second thought',
        thoughtNumber: 2,
        totalThoughts: 3,
        nextThoughtNeeded: true,
      };

      const input3 = {
        thought: 'Final thought',
        thoughtNumber: 3,
        totalThoughts: 3,
        nextThoughtNeeded: false,
      };

      processThought(input1, { sessionState });
      processThought(input2, { sessionState });
      const result = processThought(input3, { sessionState });

      expect(result.thoughtHistoryLength).toBe(3);
      expect(result.nextThoughtNeeded).toBe(false);
    });

    it('should generate formatted output by default', () => {
      const input = {
        thought: 'Test thought',
        thoughtNumber: 1,
        totalThoughts: 1,
        nextThoughtNeeded: false,
      };

      const result = processThought(input);
      expect(result.success).toBe(true);
      expect(result.formattedOutput).toBeDefined();
      expect(result.formattedOutput).toContain('Test thought');
    });

    it('should skip formatting when disabled', () => {
      const input = {
        thought: 'Test thought',
        thoughtNumber: 1,
        totalThoughts: 1,
        nextThoughtNeeded: false,
      };

      const result = processThought(input, { disableFormatting: true });
      expect(result.success).toBe(true);
      expect(result.formattedOutput).toBeUndefined();
    });

    it('should handle very long thought strings', () => {
      const input = {
        thought: 'a'.repeat(10000),
        thoughtNumber: 1,
        totalThoughts: 1,
        nextThoughtNeeded: false,
      };

      const result = processThought(input);
      expect(result.success).toBe(true);
    });
  });

  describe('processThought - branching', () => {
    it('should track branches correctly', () => {
      const input1 = {
        thought: 'Main thought',
        thoughtNumber: 1,
        totalThoughts: 3,
        nextThoughtNeeded: true,
      };

      const input2 = {
        thought: 'Branch A thought',
        thoughtNumber: 2,
        totalThoughts: 3,
        nextThoughtNeeded: true,
        branchFromThought: 1,
        branchId: 'branch-a',
      };

      const input3 = {
        thought: 'Branch B thought',
        thoughtNumber: 2,
        totalThoughts: 3,
        nextThoughtNeeded: false,
        branchFromThought: 1,
        branchId: 'branch-b',
      };

      processThought(input1, { sessionState });
      processThought(input2, { sessionState });
      const result = processThought(input3, { sessionState });

      expect(result.branches).toContain('branch-a');
      expect(result.branches).toContain('branch-b');
      expect(result.branches?.length ?? 0).toBe(2);
      expect(result.thoughtHistoryLength).toBe(3);
    });

    it('should allow multiple thoughts in same branch', () => {
      const input1 = {
        thought: 'Branch thought 1',
        thoughtNumber: 1,
        totalThoughts: 2,
        nextThoughtNeeded: true,
        branchFromThought: 1,
        branchId: 'branch-a',
      };

      const input2 = {
        thought: 'Branch thought 2',
        thoughtNumber: 2,
        totalThoughts: 2,
        nextThoughtNeeded: false,
        branchFromThought: 1,
        branchId: 'branch-a',
      };

      processThought(input1, { sessionState });
      const result = processThought(input2, { sessionState });

      expect(result.branches).toContain('branch-a');
      expect(result.branches?.length ?? 0).toBe(1);
    });
  });

  describe('processThought - error handling', () => {
    it('should return error for invalid input', () => {
      const input = {
        thought: 'Test',
        thoughtNumber: 1,
        totalThoughts: 1,
        // missing nextThoughtNeeded
      };

      const result = processThought(input);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('nextThoughtNeeded');
    });

    it('should handle non-object input gracefully', () => {
      const result = processThought('not an object');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});

describe('Sequential Thinking - Session Management', () => {
  let sessionState: SessionState;

  beforeEach(() => {
    sessionState = createSessionState();
  });

  describe('createSessionState', () => {
    it('should create empty session state', () => {
      const state = createSessionState();
      expect(state.thoughtHistory).toEqual([]);
      expect(state.branches).toEqual({});
      expect(state.currentThought).toBe(0);
      expect(state.totalThoughts).toBe(0);
    });
  });

  describe('getSessionStats', () => {
    it('should return correct stats for empty session', () => {
      const stats = getSessionStats(sessionState);
      expect(stats.totalThoughts).toBe(0);
      expect(stats.branchCount).toBe(0);
      expect(stats.revisionCount).toBe(0);
      expect(stats.completionRate).toBe(0);
    });

    it('should calculate stats correctly', () => {
      processThought(
        {
          thought: 'Thought 1',
          thoughtNumber: 1,
          totalThoughts: 5,
          nextThoughtNeeded: true,
        },
        { sessionState }
      );

      processThought(
        {
          thought: 'Thought 2 (revision)',
          thoughtNumber: 2,
          totalThoughts: 5,
          nextThoughtNeeded: true,
          isRevision: true,
          revisesThought: 1,
        },
        { sessionState }
      );

      processThought(
        {
          thought: 'Branch A',
          thoughtNumber: 3,
          totalThoughts: 5,
          nextThoughtNeeded: true,
          branchFromThought: 2,
          branchId: 'branch-a',
        },
        { sessionState }
      );

      const stats = getSessionStats(sessionState);
      expect(stats.totalThoughts).toBe(3);
      expect(stats.branchCount).toBe(1);
      expect(stats.revisionCount).toBe(1);
      expect(stats.completionRate).toBe(60); // 3/5 = 60%
    });
  });

  describe('findThought', () => {
    it('should find thought by number', () => {
      processThought(
        {
          thought: 'Test thought',
          thoughtNumber: 2,
          totalThoughts: 5,
          nextThoughtNeeded: true,
        },
        { sessionState }
      );

      const found = findThought(sessionState, 2);
      expect(found).toBeDefined();
      expect(found?.thought).toBe('Test thought');
    });

    it('should return undefined for non-existent thought', () => {
      const found = findThought(sessionState, 99);
      expect(found).toBeUndefined();
    });
  });

  describe('getBranchThoughts', () => {
    it('should return thoughts in branch', () => {
      processThought(
        {
          thought: 'Branch thought 1',
          thoughtNumber: 1,
          totalThoughts: 2,
          nextThoughtNeeded: true,
          branchFromThought: 1,
          branchId: 'test-branch',
        },
        { sessionState }
      );

      processThought(
        {
          thought: 'Branch thought 2',
          thoughtNumber: 2,
          totalThoughts: 2,
          nextThoughtNeeded: false,
          branchFromThought: 1,
          branchId: 'test-branch',
        },
        { sessionState }
      );

      const branchThoughts = getBranchThoughts(sessionState, 'test-branch');
      expect(branchThoughts.length).toBe(2);
    });

    it('should return empty array for non-existent branch', () => {
      const branchThoughts = getBranchThoughts(sessionState, 'non-existent');
      expect(branchThoughts).toEqual([]);
    });
  });

  describe('canReviseThought', () => {
    it('should return true for existing thought', () => {
      processThought(
        {
          thought: 'Test thought',
          thoughtNumber: 1,
          totalThoughts: 3,
          nextThoughtNeeded: true,
        },
        { sessionState }
      );

      expect(canReviseThought(sessionState, 1)).toBe(true);
    });

    it('should return false for non-existent thought', () => {
      expect(canReviseThought(sessionState, 99)).toBe(false);
    });
  });
});

describe('Sequential Thinking - Edge Cases', () => {
  it('should handle thoughtNumber = 1, totalThoughts = 1', () => {
    const input = {
      thought: 'Only thought',
      thoughtNumber: 1,
      totalThoughts: 1,
      nextThoughtNeeded: false,
    };

    const result = processThought(input);
    expect(result.success).toBe(true);
    expect(result.thoughtNumber).toBe(1);
    expect(result.totalThoughts).toBe(1);
  });

  it('should handle nextThoughtNeeded = false', () => {
    const input = {
      thought: 'Final thought',
      thoughtNumber: 3,
      totalThoughts: 3,
      nextThoughtNeeded: false,
    };

    const result = processThought(input);
    expect(result.success).toBe(true);
    expect(result.nextThoughtNeeded).toBe(false);
  });
});
