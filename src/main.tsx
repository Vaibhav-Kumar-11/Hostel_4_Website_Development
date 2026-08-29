import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

/**
 * Apply the saved theme before React mounts so the first paint is already in
 * the right colours — no white flash for a resident who chose dark mode.
 * (index.html runs the same check inline; this keeps the two in sync if the
 * value changed while the page was cached.)
 */
const stored = localStorage.getItem('madhouse:theme')
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches
document.documentElement.classList.toggle('dark', stored ? stored === 'dark' : !prefersLight)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
