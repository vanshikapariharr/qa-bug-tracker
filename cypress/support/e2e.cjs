// Require commands
require('./commands.cjs')

// Suppress uncaught exceptions from the app during tests
Cypress.on('uncaught:exception', () => false)
