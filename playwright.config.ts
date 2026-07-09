import * as dotenv from 'dotenv';
import { defineConfig, devices } from '@playwright/test';
import { PORTALS } from './e2e/config/portals';

// ── Load the correct .env file based on the TEST_ENV environment variable ──
// Defaults to 'qa' if TEST_ENV is not set. Supported values: 'qa', 'uat', 'ppr'.
// Each value maps to a corresponding .env.<ENV> file (e.g. .env.qa, .env.uat).
const ENV = (process.env.TEST_ENV as 'qa' | 'uat' | 'ppr') ?? 'qa';
dotenv.config({ path: `.env.${ENV}` });

// ── Projects ──────────────────────────────────────────────────────
const projects = Object.values(PORTALS).map((portal) => ({
  name: portal.name,
  use: {
    ...devices['Desktop Chrome'],
    ...(process.env.CI ? {} : { channel: 'chrome' }),
    baseURL: portal.baseURL[ENV],
  },
}));

export default defineConfig({
  testDir: './e2e/features',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  projects,
});