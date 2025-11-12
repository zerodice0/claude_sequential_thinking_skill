/**
 * Integration Tests
 *
 * End-to-end tests for the complete sequential thinking workflow.
 */

import { describe, it, expect, beforeEach as _beforeEach } from 'vitest';
import {
  createSequentialThinking,
  createInitialThought,
  createBranchThought,
  createRevisionThought,
  createFinalThought
} from '../helpers';

describe('Integration Tests', () => {
  describe('Basic workflow', () => {
    it('should handle complete thinking session', () => {
      const thinking = createSequentialThinking();

      // Initial thought
      let result = thinking.processThought(
        createInitialThought('Analyzing the problem', 5)
      );
      expect(result.success).toBe(true);
      expect(result.thoughtNumber).toBe(1);

      // Middle thoughts
      result = thinking.processThought({
        thought: 'Identifying constraints',
        thoughtNumber: 2,
        totalThoughts: 5,
        nextThoughtNeeded: true
      });
      expect(result.success).toBe(true);

      result = thinking.processThought({
        thought: 'Exploring solutions',
        thoughtNumber: 3,
        totalThoughts: 5,
        nextThoughtNeeded: true
      });
      expect(result.success).toBe(true);

      result = thinking.processThought({
        thought: 'Evaluating trade-offs',
        thoughtNumber: 4,
        totalThoughts: 5,
        nextThoughtNeeded: true
      });
      expect(result.success).toBe(true);

      // Final thought
      result = thinking.processThought(
        createFinalThought('Recommendation', 5, 5)
      );
      expect(result.success).toBe(true);
      expect(result.nextThoughtNeeded).toBe(false);

      // Check stats
      const stats = thinking.getStats();
      expect(stats.totalThoughts).toBe(5);
      expect(stats.completedThoughts).toBe(5);
    });
  });

  describe('Branching workflow', () => {
    it('should handle branching and merging', () => {
      const thinking = createSequentialThinking();

      // Main thought
      let result = thinking.processThought(
        createInitialThought('Main analysis', 10)
      );
      expect(result.success).toBe(true);

      // Branch A
      result = thinking.processThought(
        createBranchThought('Exploring Option A', 2, 10, 'option-a', 1)
      );
      expect(result.success).toBe(true);
      expect(result.branches).toContain('option-a');

      result = thinking.processThought({
        thought: 'Option A benefits',
        thoughtNumber: 3,
        totalThoughts: 10,
        nextThoughtNeeded: true,
        branchId: 'option-a',
        branchFromThought: 1
      });
      expect(result.success).toBe(true);

      // Branch B
      result = thinking.processThought(
        createBranchThought('Exploring Option B', 4, 10, 'option-b', 1)
      );
      expect(result.success).toBe(true);
      expect(result.branches).toContain('option-b');

      result = thinking.processThought({
        thought: 'Option B benefits',
        thoughtNumber: 5,
        totalThoughts: 10,
        nextThoughtNeeded: true,
        branchId: 'option-b',
        branchFromThought: 1
      });
      expect(result.success).toBe(true);

      // Comparison
      result = thinking.processThought({
        thought: 'Comparing options',
        thoughtNumber: 6,
        totalThoughts: 10,
        nextThoughtNeeded: true
      });
      expect(result.success).toBe(true);

      // Final
      result = thinking.processThought(
        createFinalThought('Selected Option A', 10, 10)
      );
      expect(result.success).toBe(true);

      const stats = thinking.getStats();
      expect(stats.branchCount).toBe(2);
    });

    it('should track branch thoughts separately', () => {
      const thinking = createSequentialThinking();

      thinking.processThought(createInitialThought('Main', 5));

      thinking.processThought(
        createBranchThought('Branch A1', 2, 5, 'branch-a', 1)
      );

      thinking.processThought({
        thought: 'Branch A2',
        thoughtNumber: 3,
        totalThoughts: 5,
        nextThoughtNeeded: true,
        branchId: 'branch-a',
        branchFromThought: 1
      });

      const branchThoughts = thinking.adapter.getBranchThoughts('branch-a');
      expect(branchThoughts.length).toBe(2);
    });
  });

  describe('Revision workflow', () => {
    it('should handle thought revisions', () => {
      const thinking = createSequentialThinking();

      // Initial thoughts
      thinking.processThought(createInitialThought('First analysis', 5));

      thinking.processThought({
        thought: 'Initial conclusion',
        thoughtNumber: 2,
        totalThoughts: 5,
        nextThoughtNeeded: true
      });

      // Revise second thought
      const result = thinking.processThought(
        createRevisionThought('Corrected conclusion', 3, 5, 2)
      );

      expect(result.success).toBe(true);

      const stats = thinking.getStats();
      expect(stats.revisionCount).toBe(1);
      expect(thinking.adapter.canRevise(2)).toBe(true);
    });

    it('should allow multiple revisions', () => {
      const thinking = createSequentialThinking();

      thinking.processThought(createInitialThought('Original', 5));

      thinking.processThought(
        createRevisionThought('First revision', 2, 5, 1)
      );

      thinking.processThought(
        createRevisionThought('Second revision', 3, 5, 1)
      );

      const stats = thinking.getStats();
      expect(stats.revisionCount).toBe(2);
    });
  });

  describe('Dynamic thought adjustment', () => {
    it('should handle extending thought count', () => {
      const thinking = createSequentialThinking();

      thinking.processThought(createInitialThought('Start', 3));

      thinking.processThought({
        thought: 'Need more steps',
        thoughtNumber: 2,
        totalThoughts: 3,
        nextThoughtNeeded: true,
        needsMoreThoughts: true
      });

      // Extend to 5 thoughts
      thinking.processThought({
        thought: 'Additional step',
        thoughtNumber: 3,
        totalThoughts: 5,
        nextThoughtNeeded: true
      });

      thinking.processThought({
        thought: 'Another step',
        thoughtNumber: 4,
        totalThoughts: 5,
        nextThoughtNeeded: true
      });

      const result = thinking.processThought(
        createFinalThought('Final', 5, 5)
      );

      expect(result.success).toBe(true);
      expect(result.totalThoughts).toBe(5);
    });
  });

  describe('Complex scenario', () => {
    it('should handle mixed workflow with branches and revisions', () => {
      const thinking = createSequentialThinking();

      // Initial analysis
      thinking.processThought(createInitialThought('Problem analysis', 15));

      // Requirements gathering
      thinking.processThought({
        thought: 'Requirements gathering',
        thoughtNumber: 2,
        totalThoughts: 15,
        nextThoughtNeeded: true
      });

      // Branch A: Technical approach
      thinking.processThought(
        createBranchThought('Technical approach A', 3, 15, 'tech-a', 2)
      );

      thinking.processThought({
        thought: 'Architecture for A',
        thoughtNumber: 4,
        totalThoughts: 15,
        nextThoughtNeeded: true,
        branchId: 'tech-a',
        branchFromThought: 2
      });

      // Branch B: Alternative approach
      thinking.processThought(
        createBranchThought('Technical approach B', 5, 15, 'tech-b', 2)
      );

      thinking.processThought({
        thought: 'Architecture for B',
        thoughtNumber: 6,
        totalThoughts: 15,
        nextThoughtNeeded: true,
        branchId: 'tech-b',
        branchFromThought: 2
      });

      // Comparison
      thinking.processThought({
        thought: 'Comparing approaches',
        thoughtNumber: 7,
        totalThoughts: 15,
        nextThoughtNeeded: true
      });

      // Revise comparison with new insights
      thinking.processThought(
        createRevisionThought('Updated comparison', 8, 15, 7)
      );

      // Continue with selected approach
      thinking.processThought({
        thought: 'Selected approach A',
        thoughtNumber: 9,
        totalThoughts: 15,
        nextThoughtNeeded: true
      });

      // Implementation details
      thinking.processThought({
        thought: 'Implementation plan',
        thoughtNumber: 10,
        totalThoughts: 15,
        nextThoughtNeeded: true
      });

      // Final recommendation
      thinking.processThought(
        createFinalThought('Final recommendation', 15, 15)
      );

      const stats = thinking.getStats();
      expect(stats.totalThoughts).toBeGreaterThanOrEqual(10);
      expect(stats.branchCount).toBe(2);
      expect(stats.revisionCount).toBe(1);
    });
  });

  describe('Session management', () => {
    it('should export and import session', () => {
      const thinking1 = createSequentialThinking();

      thinking1.processThought(createInitialThought('Test 1', 3));
      thinking1.processThought({
        thought: 'Test 2',
        thoughtNumber: 2,
        totalThoughts: 3,
        nextThoughtNeeded: true
      });

      const exported = thinking1.exportSession();
      expect(exported).toBeDefined();

      const thinking2 = createSequentialThinking();
      thinking2.importSession(exported);

      const stats1 = thinking1.getStats();
      const stats2 = thinking2.getStats();

      expect(stats1).toEqual(stats2);
    });

    it('should reset session', () => {
      const thinking = createSequentialThinking();

      thinking.processThought(createInitialThought('Test', 3));
      thinking.processThought({
        thought: 'Test 2',
        thoughtNumber: 2,
        totalThoughts: 3,
        nextThoughtNeeded: false
      });

      let stats = thinking.getStats();
      expect(stats.totalThoughts).toBe(2);

      thinking.reset();

      stats = thinking.getStats();
      expect(stats.totalThoughts).toBe(0);
      expect(stats.branchCount).toBe(0);
      expect(stats.revisionCount).toBe(0);
    });
  });

  describe('Error recovery', () => {
    it('should continue after processing error', () => {
      const thinking = createSequentialThinking();

      // Valid thought
      let result = thinking.processThought(createInitialThought('Valid', 3));
      expect(result.success).toBe(true);

      // Invalid thought
      result = thinking.processThought({ invalid: 'data' });
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();

      // Continue with valid thought
      result = thinking.processThought({
        thought: 'Continue',
        thoughtNumber: 2,
        totalThoughts: 3,
        nextThoughtNeeded: false
      });
      expect(result.success).toBe(true);

      // Session should still have valid thoughts
      const stats = thinking.getStats();
      expect(stats.totalThoughts).toBe(2);
    });
  });
});
