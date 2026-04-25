import { defineConfig, devices } from '@playwright/test';

/**
 * OmniLingo E2E Test Configuration
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  // Max time per test (includes retries)
  timeout: 60_000,
  // Max per assertion
  expect: { timeout: 10_000 },

  // Fail the build if any test is focused/skipped accidentally
  forbidOnly: !!process.env.CI,

  // Retry once on CI, never locally
  retries: process.env.CI ? 1 : 0,

  // One worker on CI (sequential), unlimited locally
  workers: process.env.CI ? 1 : undefined,

  // Reporter: dot locally, GitHub-native in CI
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'on-failure' }]],

  use: {
    // Base URL from env, defaults to local Next.js dev server
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    // Record video on failure only
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',

    // Trace on first retry
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // Auto-start the Next.js dev server for local runs
  webServer: process.env.CI
    ? undefined
    : {
        command: 'pnpm -F my-project dev',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
