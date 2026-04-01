#  QA Bug Tracker

A professional dark-themed bug tracking app built with React, React Router, and Context API. Built as a portfolio project for SDET/QA engineer roles.

## Tech Stack

- **React 18** + **Vite**
- **React Router v6** — multi-page navigation
- **Context API + useReducer** — global state management
- **localStorage** — data persistence across sessions
- **Cypress** — 20 E2E tests covering real user flows

## Features

- 📋 List all bugs with status/priority badges
- 🔍 Search + filter by status, priority
- ➕ Create bugs with full form validation
- ✏️ Edit existing bugs
- 🗑️ Delete bugs with confirmation
- 📊 Live stats strip (total, open, in-progress, critical)
- 💾 Persists data in localStorage

## Getting Started

```bash
npm install
npm run dev
```

## Running Tests

```bash
# Open Cypress GUI
npm run cypress:open

# Run headless
npm run cypress:run
```

## Deploy to Netlify

Push to GitHub, connect repo in Netlify. The `netlify.toml` handles SPA routing automatically.
