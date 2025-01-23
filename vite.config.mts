/// <reference types="vitest" />

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    fileParallelism : false,
    isolate: false,
    /* for example, use global to avoid globals imports (describe, test, expect): */
    // globals: true,
  },
})