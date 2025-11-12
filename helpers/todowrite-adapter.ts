/**
 * TodoWrite Adapter
 *
 * Integration layer between sequential thinking and Claude's TodoWrite tool.
 * Replaces in-memory state management from MCP server with persistent TodoWrite.
 */

import {
  ThoughtData,
  ThoughtHistoryEntry,
  SessionState,
  TodoTask
} from './types';
import { formatForTodoWrite } from './formatters';

/**
 * TodoWrite integration configuration
 */
export interface TodoWriteConfig {
  enableTracking: boolean;
  maxTasksInList: number;
  autoCleanup: boolean;
  taskPrefix: string;
}

const DEFAULT_CONFIG: TodoWriteConfig = {
  enableTracking: true,
  maxTasksInList: 20,
  autoCleanup: true,
  taskPrefix: '💭'
};

/**
 * TodoWrite adapter class
 *
 * Manages integration with Claude's TodoWrite tool for persistent state.
 */
export class TodoWriteAdapter {
  private config: TodoWriteConfig;
  private sessionState: SessionState;

  constructor(config: Partial<TodoWriteConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.sessionState = {
      thoughtHistory: [],
      branches: {},
      currentThought: 0,
      totalThoughts: 0
    };
  }

  /**
   * Track a thought as a TodoWrite task
   *
   * Creates or updates a task in the todo list for the current thought.
   *
   * @param thoughtData - Thought to track
   * @returns Task representation
   */
  public trackThought(thoughtData: ThoughtData): TodoTask {
    if (!this.config.enableTracking) {
      return this.createDummyTask(thoughtData);
    }

    const status = thoughtData.nextThoughtNeeded ? 'in_progress' : 'completed';
    const content = formatForTodoWrite(thoughtData);
    const activeForm = this.getActiveForm(thoughtData);

    return {
      content,
      status,
      activeForm
    };
  }

  /**
   * Convert thought to active form text
   *
   * @param thoughtData - Thought data
   * @returns Active form string for TodoWrite
   */
  private getActiveForm(thoughtData: ThoughtData): string {
    const { thoughtNumber, totalThoughts, branchId, isRevision } = thoughtData;

    let prefix = '';
    if (isRevision) {
      prefix = 'Revising ';
    } else if (branchId) {
      prefix = `Exploring branch ${branchId} - `;
    }

    return `${prefix}Thinking ${thoughtNumber}/${totalThoughts}`;
  }

  /**
   * Create a dummy task (when tracking disabled)
   *
   * @param thoughtData - Thought data
   * @returns Dummy task
   */
  private createDummyTask(thoughtData: ThoughtData): TodoTask {
    return {
      content: formatForTodoWrite(thoughtData),
      status: 'completed',
      activeForm: 'Processing'
    };
  }

  /**
   * Update session state
   *
   * Adds thought to internal session state.
   *
   * @param thoughtData - Thought to add
   */
  public updateState(thoughtData: ThoughtData): void {
    const entry: ThoughtHistoryEntry = {
      thoughtNumber: thoughtData.thoughtNumber,
      totalThoughts: thoughtData.totalThoughts,
      thought: thoughtData.thought,
      timestamp: new Date().toISOString(),
      isRevision: thoughtData.isRevision,
      revisesThought: thoughtData.revisesThought,
      branchId: thoughtData.branchId,
      branchFromThought: thoughtData.branchFromThought
    };

    this.sessionState.thoughtHistory.push(entry);
    this.sessionState.currentThought = thoughtData.thoughtNumber;
    this.sessionState.totalThoughts = thoughtData.totalThoughts;

    // Track branches
    if (thoughtData.branchFromThought && thoughtData.branchId) {
      if (!this.sessionState.branches[thoughtData.branchId]) {
        this.sessionState.branches[thoughtData.branchId] = {
          id: thoughtData.branchId,
          fromThought: thoughtData.branchFromThought,
          thoughts: []
        };
      }
      this.sessionState.branches[thoughtData.branchId].thoughts.push(entry);
    }

    // Auto-cleanup if enabled
    if (this.config.autoCleanup) {
      this.cleanupOldTasks();
    }
  }

  /**
   * Clean up old completed tasks
   *
   * Keeps only the most recent tasks up to maxTasksInList.
   */
  private cleanupOldTasks(): void {
    const { maxTasksInList } = this.config;
    const history = this.sessionState.thoughtHistory;

    if (history.length > maxTasksInList) {
      const toRemove = history.length - maxTasksInList;
      this.sessionState.thoughtHistory = history.slice(toRemove);
    }
  }

  /**
   * Get current session state
   *
   * @returns Current session state
   */
  public getSessionState(): SessionState {
    return this.sessionState;
  }

  /**
   * Reset session state
   */
  public reset(): void {
    this.sessionState = {
      thoughtHistory: [],
      branches: {},
      currentThought: 0,
      totalThoughts: 0
    };
  }

  /**
   * Generate todos for Claude's TodoWrite tool
   *
   * Creates a complete todo list based on thinking plan.
   *
   * @param totalThoughts - Total number of planned thoughts
   * @param branchIds - Optional branch identifiers
   * @returns Array of TodoTask objects
   */
  public generateTodoList(
    totalThoughts: number,
    branchIds?: string[]
  ): TodoTask[] {
    const tasks: TodoTask[] = [];

    // Main thinking sequence
    for (let i = 1; i <= totalThoughts; i++) {
      tasks.push({
        content: `${this.config.taskPrefix} Thought ${i}/${totalThoughts}`,
        status: 'pending',
        activeForm: `Thinking step ${i}`
      });
    }

    // Branch tasks if specified
    if (branchIds && branchIds.length > 0) {
      for (const branchId of branchIds) {
        tasks.push({
          content: `🌿 Explore branch: ${branchId}`,
          status: 'pending',
          activeForm: `Exploring ${branchId}`
        });
      }
    }

    return tasks;
  }

  /**
   * Get session statistics
   *
   * @returns Statistics about current session
   */
  public getStats(): {
    totalThoughts: number;
    completedThoughts: number;
    branchCount: number;
    revisionCount: number;
  } {
    const history = this.sessionState.thoughtHistory;
    const completedThoughts = this.sessionState.currentThought;
    const branchCount = Object.keys(this.sessionState.branches).length;
    const revisionCount = history.filter(t => t.isRevision).length;

    return {
      totalThoughts: history.length,
      completedThoughts,
      branchCount,
      revisionCount
    };
  }

  /**
   * Find thought by number
   *
   * @param thoughtNumber - Thought number to find
   * @returns Thought entry or undefined
   */
  public findThought(thoughtNumber: number): ThoughtHistoryEntry | undefined {
    return this.sessionState.thoughtHistory.find(
      t => t.thoughtNumber === thoughtNumber
    );
  }

  /**
   * Get branch thoughts
   *
   * @param branchId - Branch identifier
   * @returns Array of thoughts in branch
   */
  public getBranchThoughts(branchId: string): ThoughtHistoryEntry[] {
    return this.sessionState.branches[branchId]?.thoughts || [];
  }

  /**
   * Check if can revise a thought
   *
   * @param thoughtNumber - Thought number to check
   * @returns True if thought exists and can be revised
   */
  public canRevise(thoughtNumber: number): boolean {
    return this.findThought(thoughtNumber) !== undefined;
  }

  /**
   * Export session to JSON
   *
   * @returns JSON string of session state
   */
  public exportSession(): string {
    return JSON.stringify(this.sessionState, null, 2);
  }

  /**
   * Import session from JSON
   *
   * @param json - JSON string to import
   */
  public importSession(json: string): void {
    try {
      this.sessionState = JSON.parse(json);
    } catch (error) {
      throw new Error(
        `Failed to import session: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}

/**
 * Create a new TodoWrite adapter
 *
 * @param config - Optional configuration
 * @returns New adapter instance
 */
export function createTodoWriteAdapter(
  config?: Partial<TodoWriteConfig>
): TodoWriteAdapter {
  return new TodoWriteAdapter(config);
}

/**
 * Helper: Format thought history for display
 *
 * @param history - Thought history entries
 * @param maxEntries - Maximum entries to show
 * @returns Formatted string
 */
export function formatThoughtHistory(
  history: ThoughtHistoryEntry[],
  maxEntries: number = 10
): string {
  const entries = history.slice(-maxEntries);
  const lines = entries.map(entry => {
    const emoji = entry.isRevision ? '✏️' : entry.branchId ? '🌿' : '💭';
    return `${emoji} #${entry.thoughtNumber}: ${entry.thought.substring(0, 50)}...`;
  });

  return lines.join('\n');
}
