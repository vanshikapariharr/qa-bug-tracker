// Custom command: fill and submit the bug form
Cypress.Commands.add('submitBugForm', ({ title, description, status, priority, environment, assignee } = {}) => {
  if (title       !== undefined) cy.get('[data-cy="input-title"]').clear().type(title)
  if (description !== undefined) cy.get('[data-cy="input-description"]').clear().type(description)
  if (status      !== undefined) cy.get('[data-cy="input-status"]').select(status)
  if (priority    !== undefined) cy.get('[data-cy="input-priority"]').select(priority)
  if (environment !== undefined) cy.get('[data-cy="input-environment"]').select(environment)
  if (assignee    !== undefined) cy.get('[data-cy="input-assignee"]').clear().type(assignee)
  cy.get('[data-cy="submit-btn"]').click()
})

// Custom command: reset localStorage before each test
Cypress.Commands.add('resetStorage', () => {
  cy.clearLocalStorage()
})

// Custom command: navigate to new bug form
Cypress.Commands.add('goToNewBug', () => {
  cy.visit('/bugs/new')
})
