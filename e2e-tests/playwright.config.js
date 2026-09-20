// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: 1, // sequential -- tests share the same backend data
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,

  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Playwright starts both the backend and frontend before the test run
  // and shuts them down after -- no need to run them manually first.
  webServer: [
    {
      command: 'mvn spring-boot:run',
      cwd: '../backend',
      url: 'http://localhost:8080/api/items',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000, // Spring Boot cold start can take a while, especially the first run
    },
    {
      command: 'npm run dev',
      cwd: '../frontend',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 30 * 1000,
    },
  ],
});
