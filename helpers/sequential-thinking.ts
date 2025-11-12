/**
 * Sequential Thinking Core Logic
 *
 * Main processing logic for the sequential thinking skill.
 * Ported from MCP server with TodoWrite integration.
 */

import {
  ThoughtData,
  ValidationResult,
  ProcessingResult,
  ThoughtHistoryEntry,
  SessionState
} from './types';
import { formatThought, formatValidationErrors } from './formatters';

/**
 * Validate thought data
 *
 * Ensures all required fields are present and valid.
 *
 * @param input - Raw input data
 * @returns Validation result with errors if invalid
 */
export function validateThought(input: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (typeof input !== 'object' || input === null) {
    return {
      valid: false,
      errors: ['Input must be a non-null object']
    };
  }

  const data = input as Record<string, unknown>;

  // Required fields validation
  if (typeof data.thought !== 'string') {
    errors.push('Invalid thought: must be a non-empty string');
  } else if (data.thought.length === 0) {
    errors.push('Thought cannot be empty');
  }

  if (typeof data.thoughtNumber !== 'number') {
    errors.push('Invalid thoughtNumber: must be a number');
  } else if (data.thoughtNumber < 1) {
    errors.push('thoughtNumber must be at least 1');
  }

  if (typeof data.totalThoughts !== 'number') {
    errors.push('Invalid totalThoughts: must be a number');
  } else if (data.totalThoughts < 1) {
    errors.push('totalThoughts must be at least 1');
  }

  if (typeof data.nextThoughtNeeded !== 'boolean') {
    errors.push('Invalid nextThoughtNeeded: must be a boolean');
  }

  // Warnings for optional fields
  if (data.isRevision && !data.revisesThought) {
    warnings.push('isRevision is true but revisesThought is not specified');
  }

  if (data.branchFromThought && !data.branchId) {
    warnings.push('branchFromThought is specified but branchId is missing');
  }

  if (data.thoughtNumber && data.totalThoughts) {
    const thoughtNum = data.thoughtNumber as number;
    const totalNum = data.totalThoughts as number;

    if (thoughtNum > totalNum && !data.needsMoreThoughts) {
      warnings.push(`thoughtNumber (${thoughtNum}) exceeds totalThoughts (${totalNum}). Consider setting needsMoreThoughts=true`);
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    warnings: warnings.length > 0 ? warnings : undefined
  };
}

/**
 * Normalize thought data
 *
 * Converts unknown input to validated ThoughtData.
 *
 * @param input - Raw input data
 * @returns Normalized ThoughtData
 * @throws Error if validation fails
 */
export function normalizeThought(input: unknown): ThoughtData {
  const validation = validateThought(input);

  if (!validation.valid) {
    const errorMsg = validation.errors
      ? formatValidationErrors(validation.errors)
      : 'Unknown validation error';
    throw new Error(errorMsg);
  }

  const data = input as Record<string, unknown>;

  // Auto-adjust totalThoughts if thoughtNumber exceeds it
  let totalThoughts = data.totalThoughts as number;
  const thoughtNumber = data.thoughtNumber as number;

  if (thoughtNumber > totalThoughts) {
    totalThoughts = thoughtNumber;
  }

  return {
    thought: data.thought as string,
    thoughtNumber,
    totalThoughts,
    nextThoughtNeeded: data.nextThoughtNeeded as boolean,
    isRevision: data.isRevision as boolean | undefined,
    revisesThought: data.revisesThought as number | undefined,
    branchFromThought: data.branchFromThought as number | undefined,
    branchId: data.branchId as string | undefined,
    needsMoreThoughts: data.needsMoreThoughts as boolean | undefined
  };
}

/**
 * Process a thought
 *
 * Main processing function that validates, normalizes, and formats a thought.
 *
 * @param input - Raw thought data
 * @param options - Processing options
 * @returns Processing result
 */
export function processThought(
  input: unknown,
  options: { disableFormatting?: boolean; sessionState?: SessionState } = {}
): ProcessingResult {
  try {
    // Validate and normalize
    const thoughtData = normalizeThought(input);

    // Format output (unless disabled)
    const formattedOutput = options.disableFormatting
      ? undefined
      : formatThought(thoughtData, { useEmoji: true, includeBorder: false });

    // Update session state if provided
    if (options.sessionState) {
      updateSessionState(options.sessionState, thoughtData);
    }

    return {
      success: true,
      thoughtNumber: thoughtData.thoughtNumber,
      totalThoughts: thoughtData.totalThoughts,
      nextThoughtNeeded: thoughtData.nextThoughtNeeded,
      branches: options.sessionState
        ? Object.keys(options.sessionState.branches)
        : undefined,
      thoughtHistoryLength: options.sessionState
        ? options.sessionState.thoughtHistory.length
        : undefined,
      formattedOutput
    };
  } catch (error) {
    return {
      success: false,
      thoughtNumber: 0,
      totalThoughts: 0,
      nextThoughtNeeded: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Update session state with new thought
 *
 * Internal helper for maintaining session state.
 *
 * @param state - Session state to update
 * @param thought - New thought to add
 */
function updateSessionState(state: SessionState, thought: ThoughtData): void {
  const entry: ThoughtHistoryEntry = {
    thoughtNumber: thought.thoughtNumber,
    totalThoughts: thought.totalThoughts,
    thought: thought.thought,
    timestamp: new Date().toISOString(),
    isRevision: thought.isRevision,
    revisesThought: thought.revisesThought,
    branchId: thought.branchId,
    branchFromThought: thought.branchFromThought
  };

  state.thoughtHistory.push(entry);
  state.currentThought = thought.thoughtNumber;
  state.totalThoughts = thought.totalThoughts;

  // Track branches
  if (thought.branchFromThought && thought.branchId) {
    if (!state.branches[thought.branchId]) {
      state.branches[thought.branchId] = {
        id: thought.branchId,
        fromThought: thought.branchFromThought,
        thoughts: []
      };
    }
    if (state.branches[thought.branchId]) {
      state.branches[thought.branchId].thoughts.push(entry);
    }
  }
}

/**
 * Create initial session state
 *
 * @returns New empty session state
 */
export function createSessionState(): SessionState {
  return {
    thoughtHistory: [],
    branches: {},
    currentThought: 0,
    totalThoughts: 0
  };
}

/**
 * Get session statistics
 *
 * @param state - Session state
 * @returns Statistics object
 */
export function getSessionStats(state: SessionState): {
  totalThoughts: number;
  branchCount: number;
  revisionCount: number;
  completionRate: number;
} {
  const revisionCount = state.thoughtHistory.filter(t => t.isRevision).length;
  const completionRate = state.totalThoughts > 0
    ? (state.currentThought / state.totalThoughts) * 100
    : 0;

  return {
    totalThoughts: state.thoughtHistory.length,
    branchCount: Object.keys(state.branches).length,
    revisionCount,
    completionRate: Math.round(completionRate)
  };
}

/**
 * Find thought by number
 *
 * @param state - Session state
 * @param thoughtNumber - Thought number to find
 * @returns Thought entry or undefined
 */
export function findThought(
  state: SessionState,
  thoughtNumber: number
): ThoughtHistoryEntry | undefined {
  return state.thoughtHistory.find(t => t.thoughtNumber === thoughtNumber);
}

/**
 * Get thoughts in branch
 *
 * @param state - Session state
 * @param branchId - Branch ID
 * @returns Array of thoughts in branch
 */
export function getBranchThoughts(
  state: SessionState,
  branchId: string
): ThoughtHistoryEntry[] {
  return state.branches[branchId]?.thoughts || [];
}

/**
 * Check if thought can be revised
 *
 * @param state - Session state
 * @param thoughtNumber - Thought number to check
 * @returns True if thought exists and can be revised
 */
export function canReviseThought(
  state: SessionState,
  thoughtNumber: number
): boolean {
  return findThought(state, thoughtNumber) !== undefined;
}
