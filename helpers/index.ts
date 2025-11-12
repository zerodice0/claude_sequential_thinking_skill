/**
 * Sequential Thinking Helpers - Main Entry Point
 *
 * TypeScript helper library for the sequential-thinking Claude Code skill.
 *
 * Usage:
 * ```typescript
 * import {
 *   validateThought,
 *   processThought,
 *   formatThought,
 *   createTodoWriteAdapter
 * } from './helpers';
 *
 * // Example 1: Simple validation
 * const result = validateThought({
 *   thought: "Analyzing the problem",
 *   thoughtNumber: 1,
 *   totalThoughts: 5,
 *   nextThoughtNeeded: true
 * });
 *
 * if (result.valid) {
 *   console.log("Valid thought!");
 * }
 *
 * // Example 2: Process with TodoWrite integration
 * const adapter = createTodoWriteAdapter();
 * const processing = processThought(thoughtData, {
 *   sessionState: adapter.getSessionState()
 * });
 *
 * if (processing.success) {
 *   console.log(processing.formattedOutput);
 * }
 * ```
 */

// Type exports
export type {
  ThoughtData,
  ValidationResult,
  ProcessingResult,
  ThoughtHistoryEntry,
  BranchInfo,
  SessionState,
  FormatOptions,
  TodoTask
} from './types';

// Core logic exports
export {
  validateThought,
  normalizeThought,
  processThought,
  createSessionState,
  getSessionStats,
  findThought,
  getBranchThoughts,
  canReviseThought
} from './sequential-thinking';

// Formatter exports
export {
  formatThought,
  formatForTodoWrite,
  formatValidationErrors,
  formatSessionSummary,
  formatProgress,
  wrapText
} from './formatters';

// TodoWrite adapter exports
export {
  TodoWriteAdapter,
  createTodoWriteAdapter,
  formatThoughtHistory
} from './todowrite-adapter';
export type { TodoWriteConfig } from './todowrite-adapter';

/**
 * Quick start helper
 *
 * Creates a complete setup for sequential thinking with TodoWrite integration.
 *
 * @returns Object with all necessary functions and adapter
 */
export function createSequentialThinking() {
  const adapter = createTodoWriteAdapter();

  return {
    // Adapter instance
    adapter,

    // Process a thought
    processThought: (input: unknown) => {
      const result = processThought(input, {
        sessionState: adapter.getSessionState()
      });

      if (result.success) {
        // Update adapter state
        const thoughtData = normalizeThought(input);
        adapter.updateState(thoughtData);

        // Track in TodoWrite
        adapter.trackThought(thoughtData);
      }

      return result;
    },

    // Get session stats
    getStats: () => adapter.getStats(),

    // Reset session
    reset: () => adapter.reset(),

    // Export/import session
    exportSession: () => adapter.exportSession(),
    importSession: (json: string) => adapter.importSession(json)
  };
}

/**
 * Helper for creating initial thought
 *
 * @param thought - Thought content
 * @param totalThoughts - Total planned thoughts
 * @returns ThoughtData object
 */
export function createInitialThought(
  thought: string,
  totalThoughts: number
): ThoughtData {
  return {
    thought,
    thoughtNumber: 1,
    totalThoughts,
    nextThoughtNeeded: true
  };
}

/**
 * Helper for creating branch thought
 *
 * @param thought - Thought content
 * @param thoughtNumber - Current thought number
 * @param totalThoughts - Total planned thoughts
 * @param branchId - Branch identifier
 * @param branchFromThought - Parent thought number
 * @returns ThoughtData object
 */
export function createBranchThought(
  thought: string,
  thoughtNumber: number,
  totalThoughts: number,
  branchId: string,
  branchFromThought: number
): ThoughtData {
  return {
    thought,
    thoughtNumber,
    totalThoughts,
    nextThoughtNeeded: true,
    branchId,
    branchFromThought
  };
}

/**
 * Helper for creating revision thought
 *
 * @param thought - Thought content
 * @param thoughtNumber - Current thought number
 * @param totalThoughts - Total planned thoughts
 * @param revisesThought - Thought number being revised
 * @returns ThoughtData object
 */
export function createRevisionThought(
  thought: string,
  thoughtNumber: number,
  totalThoughts: number,
  revisesThought: number
): ThoughtData {
  return {
    thought,
    thoughtNumber,
    totalThoughts,
    nextThoughtNeeded: true,
    isRevision: true,
    revisesThought
  };
}

/**
 * Helper for creating final thought
 *
 * @param thought - Thought content
 * @param thoughtNumber - Current thought number
 * @param totalThoughts - Total thoughts
 * @returns ThoughtData object
 */
export function createFinalThought(
  thought: string,
  thoughtNumber: number,
  totalThoughts: number
): ThoughtData {
  return {
    thought,
    thoughtNumber,
    totalThoughts,
    nextThoughtNeeded: false
  };
}

// Import statements for type checking
import {
  validateThought,
  normalizeThought,
  processThought
} from './sequential-thinking';
import type { ThoughtData } from './types';
import { createTodoWriteAdapter } from './todowrite-adapter';
