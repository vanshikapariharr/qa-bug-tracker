import { createContext, useContext, useReducer, useEffect } from 'react'

// ── Initial seed data so the app isn't empty on first load ──
const SEED_BUGS = [
  {
    id: '1',
    title: 'Login button unresponsive on Safari 16',
    description: 'Users on Safari 16.x report that clicking the login button does nothing. Console shows a TypeError related to optional chaining. Affects ~12% of our user base.',
    status: 'open',
    priority: 'critical',
    environment: 'Production',
    assignee: 'Sarah Chen',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: '2',
    title: 'Search results pagination breaks after filter reset',
    description: 'When a user applies a filter, browses to page 3, then resets filters, the pagination stays on page 3 but shows results as if on page 1.',
    status: 'in-progress',
    priority: 'high',
    environment: 'Staging',
    assignee: 'Marcus Webb',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: '3',
    title: 'Avatar upload silently fails for PNG > 2MB',
    description: 'Profile avatar uploads fail without any error message when the file exceeds 2MB. The UI shows a success spinner then reverts to the old image.',
    status: 'resolved',
    priority: 'medium',
    environment: 'Production',
    assignee: 'Priya Nair',
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: '4',
    title: 'Tooltip z-index overlaps modal overlay',
    description: 'Tooltips inside modal dialogs render above the modal backdrop, causing visual glitches. Reproducible on Chrome and Firefox.',
    status: 'open',
    priority: 'low',
    environment: 'Development',
    assignee: '',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: '5',
    title: 'Export CSV truncates rows beyond 1000 entries',
    description: 'The "Export to CSV" feature silently truncates data at 1000 rows. No warning is shown to the user. Business reports are missing data.',
    status: 'in-progress',
    priority: 'high',
    environment: 'Production',
    assignee: 'Sarah Chen',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 0.5).toISOString(),
  },
]

// ── Reducer: handles all state transitions ──
function bugReducer(state, action) {
  switch (action.type) {
    case 'ADD_BUG': {
      const newBug = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      return { ...state, bugs: [newBug, ...state.bugs] }
    }
    case 'UPDATE_BUG': {
      return {
        ...state,
        bugs: state.bugs.map(bug =>
          bug.id === action.payload.id
            ? { ...bug, ...action.payload, updatedAt: new Date().toISOString() }
            : bug
        ),
      }
    }
    case 'DELETE_BUG': {
      return { ...state, bugs: state.bugs.filter(bug => bug.id !== action.payload) }
    }
    case 'SET_FILTER': {
      return { ...state, filters: { ...state.filters, ...action.payload } }
    }
    case 'RESET_FILTERS': {
      return { ...state, filters: initialState.filters }
    }
    default:
      return state
  }
}

const initialState = {
  bugs: SEED_BUGS,
  filters: {
    status: 'all',
    priority: 'all',
    search: '',
  },
}

// ── Load from localStorage (or fall back to seed data) ──
function loadState() {
  try {
    const saved = localStorage.getItem('qa-bug-tracker')
    if (saved) return JSON.parse(saved)
  } catch {}
  return initialState
}

// ── Context & hook ──
const BugContext = createContext(null)

export function BugProvider({ children }) {
  const [state, dispatch] = useReducer(bugReducer, null, loadState)

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('qa-bug-tracker', JSON.stringify(state))
  }, [state])

  // Derived: filtered bugs (computed on every render, no extra state)
  const filteredBugs = state.bugs.filter(bug => {
    const matchStatus   = state.filters.status   === 'all' || bug.status   === state.filters.status
    const matchPriority = state.filters.priority === 'all' || bug.priority === state.filters.priority
    const matchSearch   = bug.title.toLowerCase().includes(state.filters.search.toLowerCase()) ||
                          bug.description.toLowerCase().includes(state.filters.search.toLowerCase())
    return matchStatus && matchPriority && matchSearch
  })

  // Stats for the header banner
  const stats = {
    total:      state.bugs.length,
    open:       state.bugs.filter(b => b.status === 'open').length,
    inProgress: state.bugs.filter(b => b.status === 'in-progress').length,
    resolved:   state.bugs.filter(b => b.status === 'resolved').length,
    closed:     state.bugs.filter(b => b.status === 'closed').length,
    critical:   state.bugs.filter(b => b.priority === 'critical').length,
  }

  const value = {
    bugs:         state.bugs,
    filteredBugs,
    filters:      state.filters,
    stats,
    addBug:    payload  => dispatch({ type: 'ADD_BUG',     payload }),
    updateBug: payload  => dispatch({ type: 'UPDATE_BUG',  payload }),
    deleteBug: id       => dispatch({ type: 'DELETE_BUG',  payload: id }),
    setFilter: payload  => dispatch({ type: 'SET_FILTER',  payload }),
    resetFilters:  ()   => dispatch({ type: 'RESET_FILTERS' }),
  }

  return <BugContext.Provider value={value}>{children}</BugContext.Provider>
}

// Custom hook — always use this instead of useContext(BugContext) directly
export function useBugs() {
  const ctx = useContext(BugContext)
  if (!ctx) throw new Error('useBugs must be used inside <BugProvider>')
  return ctx
}
