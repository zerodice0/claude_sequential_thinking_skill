/**
 * Vitest Configuration
 *
 * Test configuration for the sequential thinking skill helpers.
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Test environment
    environment: 'node',

    // Include patterns
    include: ['test/**/*.test.ts'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.test.ts',
        '**/*.config.ts',
        '**/index.ts' // Entry point, mostly re-exports
      ],
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80
    },

    // Globals
    globals: true,

    // Timeout
    testTimeout: 10000,

    // Reporter
    reporter: ['verbose']
  },

  // Resolve configuration
  resolve: {
    alias: {
      '@': '/helpers'
    }
  }
});
