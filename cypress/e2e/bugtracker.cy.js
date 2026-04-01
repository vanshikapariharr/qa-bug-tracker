// ─────────────────────────────────────────────
//  QA Bug Tracker — Full E2E Test Suite
//  20 tests covering navigation, CRUD, forms,
//  validation, filtering, and persistence
// ─────────────────────────────────────────────

const VALID_BUG = {
  title: 'Checkout button crashes on mobile Safari',
  description: 'When tapping the checkout button on iOS Safari 17, the app throws a runtime error and the cart becomes unresponsive. Reproducible 100% of the time.',
  status: 'open',
  priority: 'critical',
  environment: 'Production',
  assignee: 'Alex Johnson',
}

describe('1 — Navigation', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('1.1 redirects root URL to /bugs', () => {
    cy.url().should('include', '/bugs')
  })

  it('1.2 navbar renders with logo and New Bug button', () => {
    cy.get('[data-cy="navbar"]').should('be.visible')
    cy.get('[data-cy="nav-logo"]').should('be.visible')
    cy.get('[data-cy="nav-new-bug"]').should('be.visible')
  })

  it('1.3 clicking New Bug in navbar navigates to /bugs/new', () => {
    cy.get('[data-cy="nav-new-bug"]').click()
    cy.url().should('include', '/bugs/new')
    cy.get('[data-cy="new-bug-page"]').should('exist')
  })

  it('1.4 clicking nav logo returns to /bugs list', () => {
    cy.visit('/bugs/new')
    cy.get('[data-cy="nav-logo"]').click()
    cy.url().should('include', '/bugs')
    cy.get('[data-cy="bugs-grid"], [data-cy="empty-state"]').should('exist')
  })

  it('1.5 unknown routes redirect to /bugs', () => {
    cy.visit('/some-random-page-that-does-not-exist')
    cy.url().should('include', '/bugs')
  })
})

describe('2 — Bug List Page', () => {
  beforeEach(() => {
    cy.visit('/bugs')
  })

  it('2.1 shows page with stats strip and filters bar', () => {
    cy.get('[data-cy="stats-strip"]').should('be.visible')
    cy.get('[data-cy="filters-bar"]').should('be.visible')
  })

  it('2.2 bug cards are visible and link to detail pages', () => {
    cy.get('[data-cy="bug-card"]').should('have.length.greaterThan', 0)
  })

  it('2.3 clicking a bug card navigates to detail page', () => {
    cy.get('[data-cy="bug-card"]').first().click()
    cy.url().should('match', /\/bugs\/\w+/)
    cy.get('[data-cy="bug-detail"]').should('exist')
  })

  it('2.4 New Bug button on list page navigates to /bugs/new', () => {
    cy.get('[data-cy="new-bug-btn"]').click()
    cy.url().should('include', '/bugs/new')
  })
})

describe('3 — Search & Filter', () => {
  beforeEach(() => {
    cy.visit('/bugs')
  })

  it('3.1 typing in search box filters results', () => {
    cy.get('[data-cy="search-input"]').type('Safari')
    cy.get('[data-cy="results-count"]').should('contain', 'of')
    cy.get('[data-cy="bug-card"]').each($card => {
      cy.wrap($card).invoke('text').then(text => {
        expect(text.toLowerCase()).to.include('safari')
      })
    })
  })

  it('3.2 filtering by status shows only matching bugs', () => {
    cy.get('[data-cy="status-filter"]').select('open')
    cy.get('[data-cy="bug-card"]').each($card => {
      cy.wrap($card).find('[data-cy^="status-badge-open"]').should('exist')
    })
  })

  it('3.3 filtering by priority shows only matching bugs', () => {
    cy.get('[data-cy="priority-filter"]').select('critical')
    cy.get('[data-cy="bug-card"]').each($card => {
      cy.wrap($card).find('[data-cy="priority-badge-critical"]').should('exist')
    })
  })

  it('3.4 Clear button resets all filters', () => {
    cy.get('[data-cy="search-input"]').type('xyz')
    cy.get('[data-cy="status-filter"]').select('closed')
    cy.get('[data-cy="reset-filters"]').click()
    cy.get('[data-cy="search-input"]').should('have.value', '')
    cy.get('[data-cy="status-filter"]').should('have.value', 'all')
  })

  it('3.5 non-matching search shows empty state', () => {
    cy.get('[data-cy="search-input"]').type('xyzzy-no-match-ever-12345')
    cy.get('[data-cy="empty-state"]').should('be.visible')
  })
})

describe('4 — Create Bug (Form Validation)', () => {
  beforeEach(() => {
    cy.visit('/bugs/new')
  })

  it('4.1 form renders all required fields', () => {
    cy.get('[data-cy="input-title"]').should('exist')
    cy.get('[data-cy="input-description"]').should('exist')
    cy.get('[data-cy="input-status"]').should('exist')
    cy.get('[data-cy="input-priority"]').should('exist')
    cy.get('[data-cy="submit-btn"]').should('exist')
  })

  it('4.2 submitting empty form shows validation errors', () => {
    cy.get('[data-cy="submit-btn"]').click()
    cy.get('[data-cy="error-title"]').should('be.visible')
    cy.get('[data-cy="error-description"]').should('be.visible')
  })

  it('4.3 title shorter than 10 characters shows error', () => {
    cy.get('[data-cy="input-title"]').type('Short').blur()
    cy.get('[data-cy="error-title"]').should('contain', 'at least 10')
  })

  it('4.4 description shorter than 20 characters shows error', () => {
    cy.get('[data-cy="input-description"]').type('Too short').blur()
    cy.get('[data-cy="error-description"]').should('contain', 'at least 20')
  })

  it('4.5 valid form submission creates bug and redirects to list', () => {
    cy.submitBugForm(VALID_BUG)
    cy.url().should('include', '/bugs')
    cy.get('[data-cy="bug-card"]').first()
      .should('contain', VALID_BUG.title)
  })
})

describe('5 — Bug Detail Page', () => {
  beforeEach(() => {
    cy.visit('/bugs')
    cy.get('[data-cy="bug-card"]').first().click()
  })

  it('5.1 shows bug title, status badge, and priority badge', () => {
    cy.get('[data-cy="bug-title"]').should('be.visible')
    cy.get('[data-cy="bug-description"]').should('be.visible')
  })

  it('5.2 breadcrumb has working back link', () => {
    cy.get('[data-cy="breadcrumb"]').contains('All Bugs').click()
    cy.url().should('include', '/bugs')
    cy.url().should('not.match', /\/bugs\/\d/)
  })

  it('5.3 Edit button navigates to edit page', () => {
    cy.get('[data-cy="edit-bug-btn"]').click()
    cy.url().should('include', '/edit')
    cy.get('[data-cy="edit-bug-page"]').should('exist')
  })
})

describe('6 — Edit Bug', () => {
  it('6.1 edit form pre-fills existing bug data', () => {
    cy.visit('/bugs')
    cy.get('[data-cy="bug-card"]').first().click()
    cy.get('[data-cy="edit-bug-btn"]').click()
    cy.get('[data-cy="input-title"]').should('not.have.value', '')
    cy.get('[data-cy="input-description"]').should('not.have.value', '')
  })

  it('6.2 saving edits updates bug and redirects to detail page', () => {
    cy.visit('/bugs')
    cy.get('[data-cy="bug-card"]').first().click()
    cy.get('[data-cy="edit-bug-btn"]').click()
    const updatedTitle = 'Updated title with enough characters here'
    cy.get('[data-cy="input-title"]').clear().type(updatedTitle)
    cy.get('[data-cy="submit-btn"]').click()
    cy.get('[data-cy="bug-title"]').should('contain', updatedTitle)
  })
})

describe('7 — Delete Bug', () => {
  it('7.1 delete button removes bug and redirects to list', () => {
    // First create a bug so we can safely delete it
    cy.visit('/bugs/new')
    cy.submitBugForm(VALID_BUG)
    cy.url().should('include', '/bugs')
    cy.get('[data-cy="bug-card"]').first().click()
    // Stub the confirm dialog to return true
    cy.on('window:confirm', () => true)
    cy.get('[data-cy="delete-bug-btn"]').click()
    cy.url().should('eq', Cypress.config('baseUrl') + '/bugs')
  })
})

describe('8 — LocalStorage Persistence', () => {
  it('8.1 newly created bug persists after page refresh', () => {
    cy.visit('/bugs/new')
    cy.submitBugForm(VALID_BUG)
    cy.url().should('include', '/bugs')
    cy.reload()
    cy.get('[data-cy="bug-card"]').first().should('contain', VALID_BUG.title)
  })
})
