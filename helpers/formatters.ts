/**
 * Sequential Thinking Formatters
 *
 * Output formatting utilities for thought display.
 * Ported from MCP server with Claude Code skill adaptations.
 */

import { ThoughtData, FormatOptions } from './types';

/**
 * Format a thought for display
 *
 * Creates a formatted output with:
 * - Emoji indicators (💭 💡 🌿 ✏️ ✅)
 * - Thought number and total
 * - Context information (revision, branch)
 * - Optional borders and styling
 *
 * @param thoughtData - The thought to format
 * @param options - Formatting options
 * @returns Formatted string for display
 */
export function formatThought(
  thoughtData: ThoughtData,
  options: FormatOptions = {}
): string {
  const {
    useEmoji = true,
    includeBorder = false,
    includeTimestamp = false,
    maxWidth = 80
  } = options;

  const {
    thoughtNumber,
    totalThoughts,
    thought,
    isRevision,
    revisesThought,
    branchFromThought,
    branchId,
    nextThoughtNeeded
  } = thoughtData;

  // Determine emoji and prefix
  let emoji = '';
  let context = '';

  if (!nextThoughtNeeded) {
    emoji = useEmoji ? '✅' : '[Complete]';
    context = '';
  } else if (isRevision) {
    emoji = useEmoji ? '✏️' : '[Revision]';
    context = revisesThought ? ` (revising thought ${revisesThought})` : '';
  } else if (branchFromThought) {
    emoji = useEmoji ? '🌿' : '[Branch]';
    context = ` (from thought ${branchFromThought}${branchId ? `, ID: ${branchId}` : ''})`;
  } else if (thoughtNumber === totalThoughts && !nextThoughtNeeded) {
    emoji = useEmoji ? '💡' : '[Insight]';
    context = '';
  } else {
    emoji = useEmoji ? '💭' : '[Thought]';
    context = '';
  }

  const header = `${emoji} Thought ${thoughtNumber}/${totalThoughts}${context}`;

  if (includeBorder) {
    const borderLength = Math.min(maxWidth, Math.max(header.length, thought.length) + 4);
    const border = '─'.repeat(borderLength);

    return `
┌${border}┐
│ ${header.padEnd(borderLength - 2)} │
├${border}┤
│ ${thought.padEnd(borderLength - 2)} │
└${border}┘`;
  }

  // Simple format without border
  let output = `${header}\n${thought}`;

  if (includeTimestamp) {
    const timestamp = new Date().toISOString();
    output += `\n[${timestamp}]`;
  }

  return output;
}

/**
 * Format thought for TodoWrite integration
 *
 * Creates a concise format suitable for TodoWrite tasks.
 *
 * @param thoughtData - The thought to format
 * @returns Formatted string for TodoWrite
 */
export function formatForTodoWrite(thoughtData: ThoughtData): string {
  const { thoughtNumber, totalThoughts, thought, branchId, isRevision } = thoughtData;

  let prefix = '';
  if (isRevision) {
    prefix = '✏️ [Revision] ';
  } else if (branchId) {
    prefix = `🌿 [Branch: ${branchId}] `;
  } else {
    prefix = '💭 ';
  }

  // Truncate thought if too long for TodoWrite
  const maxLength = 100;
  const truncatedThought = thought.length > maxLength
    ? thought.substring(0, maxLength - 3) + '...'
    : thought;

  return `${prefix}Thought ${thoughtNumber}/${totalThoughts}: ${truncatedThought}`;
}

/**
 * Format validation errors
 *
 * @param errors - Array of error messages
 * @returns Formatted error string
 */
export function formatValidationErrors(errors: string[]): string {
  if (errors.length === 0) {
    return 'No errors';
  }

  return '❌ Validation Errors:\n' + errors.map(err => `  - ${err}`).join('\n');
}

/**
 * Format session summary
 *
 * Creates a summary of the thinking session.
 *
 * @param totalThoughts - Total number of thoughts
 * @param branches - Array of branch IDs
 * @param revisions - Number of revisions
 * @returns Formatted summary string
 */
export function formatSessionSummary(
  totalThoughts: number,
  branches: string[],
  revisions: number
): string {
  const lines = [
    '📊 Session Summary',
    `Total thoughts: ${totalThoughts}`,
  ];

  if (branches.length > 0) {
    lines.push(`Branches: ${branches.length} (${branches.join(', ')})`);
  }

  if (revisions > 0) {
    lines.push(`Revisions: ${revisions}`);
  }

  return lines.join('\n');
}

/**
 * Format progress indicator
 *
 * Creates a visual progress bar.
 *
 * @param current - Current thought number
 * @param total - Total thoughts
 * @param width - Width of progress bar (default: 20)
 * @returns Formatted progress string
 */
export function formatProgress(
  current: number,
  total: number,
  width: number = 20
): string {
  const percentage = Math.round((current / total) * 100);
  const filled = Math.round((current / total) * width);
  const empty = width - filled;

  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  return `[${bar}] ${percentage}% (${current}/${total})`;
}

/**
 * Wrap text to specified width
 *
 * @param text - Text to wrap
 * @param width - Maximum width
 * @returns Wrapped text
 */
export function wrapText(text: string, width: number = 80): string {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if (currentLine.length + word.length + 1 <= width) {
      currentLine += (currentLine.length > 0 ? ' ' : '') + word;
    } else {
      if (currentLine.length > 0) {
        lines.push(currentLine);
      }
      currentLine = word;
    }
  }

  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  return lines.join('\n');
}
