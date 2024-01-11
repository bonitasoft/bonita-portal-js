const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:9002',
    specPattern: 'test/specs/**/*.e2e.js',
    fixturesFolder: 'test/fixtures',
    screenshotsFolder: 'target/cypress/screenshots',
    videosFolder: 'target/cypress/videos',
    viewportWidth: 1920,
    viewportHeight: 1080,
    retries : 3
  }
});
