/**
 * Sequential Thinking Helper Types
 *
 * Type definitions for the sequential thinking skill.
 * Ported from MCP server implementation.
 */

/**
 * Core thought data structure
 *
 * Required fields:
 * - thought: The content of the current thinking step
 * - thoughtNumber: Current step number (1-indexed)
 * - totalThoughts: Estimated total number of steps
 * - nextThoughtNeeded: Whether another thought step is required
 *
 * Optional fields for advanced features:
 * - isRevision: Marks this as a revision of previous thinking
 * - revisesThought: Which thought number is being revised
 * - branchFromThought: Branching point thought number
 * - branchId: Identifier for the current branch
 * - needsMoreThoughts: Request to extend thinking beyond original estimate
 */
export interface ThoughtData {
  thought: string;
  thoughtNumber: number;
  totalThoughts: number;
  nextThoughtNeeded: boolean;

  // Optional: Revision support
  isRevision?: boolean;
  revisesThought?: number;

  // Optional: Branching support
  branchFromThought?: number;
  branchId?: string;

  // Optional: Dynamic thought count
  needsMoreThoughts?: boolean;
}

/**
 * Validation result structure
 */
export interface ValidationResult {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}

/**
 * Thought history entry for TodoWrite integration
 */
export interface ThoughtHistoryEntry {
  thoughtNumber: number;
  totalThoughts: number;
  thought: string;
  timestamp: string;
  isRevision?: boolean;
  revisesThought?: number;
  branchId?: string;
  branchFromThought?: number;
}

/**
 * Branch tracking for TodoWrite integration
 */
export interface BranchInfo {
  id: string;
  fromThought: number;
  thoughts: ThoughtHistoryEntry[];
}

/**
 * Session state for TodoWrite integration
 */
export interface SessionState {
  thoughtHistory: ThoughtHistoryEntry[];
  branches: Record<string, BranchInfo>;
  currentThought: number;
  totalThoughts: number;
}

/**
 * Processing result
 */
export interface ProcessingResult {
  success: boolean;
  thoughtNumber: number;
  totalThoughts: number;
  nextThoughtNeeded: boolean;
  branches?: string[];
  thoughtHistoryLength?: number;
  error?: string;
  formattedOutput?: string;
}

/**
 * Formatting options
 */
export interface FormatOptions {
  useEmoji?: boolean;
  useColors?: boolean;
  includeTimestamp?: boolean;
  includeBorder?: boolean;
  maxWidth?: number;
}

/**
 * TodoWrite task structure
 */
export interface TodoTask {
  content: string;
  status: 'pending' | 'in_progress' | 'completed';
  activeForm: string;
}
