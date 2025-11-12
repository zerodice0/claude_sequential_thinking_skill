/**
 * Formatters Tests
 *
 * Tests for output formatting utilities.
 */

import { describe, it, expect } from 'vitest';
import {
  formatThought,
  formatForTodoWrite,
  formatValidationErrors,
  formatSessionSummary,
  formatProgress,
  wrapText,
} from '../helpers/formatters';
import type { ThoughtData } from '../helpers/types';

describe('Formatters', () => {
  describe('formatThought', () => {
    it('should format basic thought', () => {
      const thought: ThoughtData = {
        thought: 'Test thought',
        thoughtNumber: 1,
        totalThoughts: 3,
        nextThoughtNeeded: true,
      };

      const formatted = formatThought(thought);
      expect(formatted).toContain('💭');
      expect(formatted).toContain('1/3');
      expect(formatted).toContain('Test thought');
    });

    it('should format revision thought', () => {
      const thought: ThoughtData = {
        thought: 'Revised thought',
        thoughtNumber: 2,
        totalThoughts: 3,
        nextThoughtNeeded: true,
        isRevision: true,
        revisesThought: 1,
      };

      const formatted = formatThought(thought);
      expect(formatted).toContain('✏️');
      expect(formatted).toContain('revising thought 1');
    });

    it('should format branch thought', () => {
      const thought: ThoughtData = {
        thought: 'Branch thought',
        thoughtNumber: 2,
        totalThoughts: 3,
        nextThoughtNeeded: true,
        branchFromThought: 1,
        branchId: 'branch-a',
      };

      const formatted = formatThought(thought);
      expect(formatted).toContain('🌿');
      expect(formatted).toContain('branch-a');
    });

    it('should format final thought', () => {
      const thought: ThoughtData = {
        thought: 'Final thought',
        thoughtNumber: 3,
        totalThoughts: 3,
        nextThoughtNeeded: false,
      };

      const formatted = formatThought(thought);
      expect(formatted).toContain('✅');
    });

    it('should format with borders when enabled', () => {
      const thought: ThoughtData = {
        thought: 'Test',
        thoughtNumber: 1,
        totalThoughts: 1,
        nextThoughtNeeded: false,
      };

      const formatted = formatThought(thought, { includeBorder: true });
      expect(formatted).toContain('┌');
      expect(formatted).toContain('│');
      expect(formatted).toContain('└');
    });

    it('should disable emojis when requested', () => {
      const thought: ThoughtData = {
        thought: 'Test',
        thoughtNumber: 1,
        totalThoughts: 1,
        nextThoughtNeeded: false,
      };

      const formatted = formatThought(thought, { useEmoji: false });
      expect(formatted).not.toContain('💭');
      expect(formatted).toContain('[Complete]');
    });
  });

  describe('formatForTodoWrite', () => {
    it('should format basic thought for TodoWrite', () => {
      const thought: ThoughtData = {
        thought: 'Test thought for todo',
        thoughtNumber: 1,
        totalThoughts: 3,
        nextThoughtNeeded: true,
      };

      const formatted = formatForTodoWrite(thought);
      expect(formatted).toContain('💭');
      expect(formatted).toContain('Thought 1/3');
      expect(formatted).toContain('Test thought');
    });

    it('should truncate long thoughts', () => {
      const thought: ThoughtData = {
        thought: 'a'.repeat(200),
        thoughtNumber: 1,
        totalThoughts: 1,
        nextThoughtNeeded: false,
      };

      const formatted = formatForTodoWrite(thought);
      expect(formatted.length).toBeLessThan(150);
      expect(formatted).toContain('...');
    });

    it('should format revision for TodoWrite', () => {
      const thought: ThoughtData = {
        thought: 'Revised',
        thoughtNumber: 2,
        totalThoughts: 3,
        nextThoughtNeeded: true,
        isRevision: true,
        revisesThought: 1,
      };

      const formatted = formatForTodoWrite(thought);
      expect(formatted).toContain('✏️');
      expect(formatted).toContain('[Revision]');
    });

    it('should format branch for TodoWrite', () => {
      const thought: ThoughtData = {
        thought: 'Branch',
        thoughtNumber: 2,
        totalThoughts: 3,
        nextThoughtNeeded: true,
        branchId: 'test-branch',
      };

      const formatted = formatForTodoWrite(thought);
      expect(formatted).toContain('🌿');
      expect(formatted).toContain('test-branch');
    });
  });

  describe('formatValidationErrors', () => {
    it('should format empty errors', () => {
      const formatted = formatValidationErrors([]);
      expect(formatted).toBe('No errors');
    });

    it('should format single error', () => {
      const formatted = formatValidationErrors(['Error 1']);
      expect(formatted).toContain('❌');
      expect(formatted).toContain('Error 1');
    });

    it('should format multiple errors', () => {
      const formatted = formatValidationErrors(['Error 1', 'Error 2', 'Error 3']);
      expect(formatted).toContain('Error 1');
      expect(formatted).toContain('Error 2');
      expect(formatted).toContain('Error 3');
    });
  });

  describe('formatSessionSummary', () => {
    it('should format basic summary', () => {
      const formatted = formatSessionSummary(5, [], 0);
      expect(formatted).toContain('📊');
      expect(formatted).toContain('Total thoughts: 5');
    });

    it('should include branches', () => {
      const formatted = formatSessionSummary(5, ['branch-a', 'branch-b'], 0);
      expect(formatted).toContain('Branches: 2');
      expect(formatted).toContain('branch-a');
      expect(formatted).toContain('branch-b');
    });

    it('should include revisions', () => {
      const formatted = formatSessionSummary(5, [], 2);
      expect(formatted).toContain('Revisions: 2');
    });

    it('should include all information', () => {
      const formatted = formatSessionSummary(10, ['a', 'b', 'c'], 3);
      expect(formatted).toContain('Total thoughts: 10');
      expect(formatted).toContain('Branches: 3');
      expect(formatted).toContain('Revisions: 3');
    });
  });

  describe('formatProgress', () => {
    it('should format 0% progress', () => {
      const formatted = formatProgress(0, 10);
      expect(formatted).toContain('[');
      expect(formatted).toContain(']');
      expect(formatted).toContain('0%');
      expect(formatted).toContain('(0/10)');
    });

    it('should format 50% progress', () => {
      const formatted = formatProgress(5, 10);
      expect(formatted).toContain('50%');
      expect(formatted).toContain('(5/10)');
      expect(formatted).toContain('█');
      expect(formatted).toContain('░');
    });

    it('should format 100% progress', () => {
      const formatted = formatProgress(10, 10);
      expect(formatted).toContain('100%');
      expect(formatted).toContain('(10/10)');
    });

    it('should handle custom width', () => {
      const formatted = formatProgress(5, 10, 40);
      // Should be longer with more characters
      expect(formatted.length).toBeGreaterThan(20);
    });
  });

  describe('wrapText', () => {
    it('should not wrap short text', () => {
      const text = 'Short text';
      const wrapped = wrapText(text, 80);
      expect(wrapped).toBe(text);
    });

    it('should wrap long text', () => {
      const text =
        'This is a very long text that should be wrapped to fit within the specified width limit';
      const wrapped = wrapText(text, 20);
      const lines = wrapped.split('\n');
      expect(lines.length).toBeGreaterThan(1);
      expect(lines.every(line => line.length <= 20)).toBe(true);
    });

    it('should handle text with multiple words', () => {
      const text = 'word1 word2 word3 word4 word5';
      const wrapped = wrapText(text, 15);
      const lines = wrapped.split('\n');
      expect(lines.length).toBeGreaterThan(1);
    });

    it('should handle single long word', () => {
      const text = 'a'.repeat(100);
      const wrapped = wrapText(text, 20);
      // Single long word should not be split
      expect(wrapped).toBe(text);
    });

    it('should handle empty text', () => {
      const wrapped = wrapText('', 80);
      expect(wrapped).toBe('');
    });
  });
});
