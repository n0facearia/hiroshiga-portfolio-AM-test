import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.test.ts', '**/*.test.tsx'],
    exclude: ['node_modules', '.next'],
    setupFiles: [],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary'],
      include: [
        'server/routes/*.ts',
        'server/db.ts',
        'server/schema.ts',
        'lib/*.ts',
      ],
      exclude: [
        'node_modules',
        '**/*.test.ts',
        'lib/fallback-data.ts',
        'lib/animations.ts',
        'server/db.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
    },
  },
})
