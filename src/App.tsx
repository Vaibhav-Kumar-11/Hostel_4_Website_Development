import { Suspense, lazy } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import Home from '@/pages/Home'

/**
 * Routing.
 *
 * A hash router, deliberately. The winning site is to be served from
 * `gymkhana.iitb.ac.in/~hostel4/` — an Apache user directory where we cannot
 * add rewrite rules. With history routing, a resident who refreshes on
 * /events would get a 404 from Apache. Hash routing makes every deep link
 * survive a refresh on that host, on GitHub Pages, and on Netlify/Vercel,
 * with no server configuration at all.
 *
 * The homepage is bundled eagerly since it is the first paint; the other six
 * pages are code-split so the initial download stays small on hostel Wi-Fi.
 */

const About = lazy(() => import('@/pages/About'))
const GC = lazy(() => import('@/pages/GC'))
const Events = lazy(() => import('@/pages/Events'))
const Life = lazy(() => import('@/pages/Life'))
const Resources = lazy(() => import('@/pages/Resources'))
const Maintenance = lazy(() => import('@/pages/Maintenance'))
const NotFound = lazy(() => import('@/pages/NotFound'))

function RouteFallback() {
  return (
    <div className="flex min-h-[70svh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-[rgb(var(--border))] border-t-madhouse-500" />
        <span className="muted font-mono text-[10px] uppercase tracking-[0.22em]">Loading</span>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="about"
            element={
              <Suspense fallback={<RouteFallback />}>
                <About />
              </Suspense>
            }
          />
          <Route
            path="gc"
            element={
              <Suspense fallback={<RouteFallback />}>
                <GC />
              </Suspense>
            }
          />
          <Route
            path="events"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Events />
              </Suspense>
            }
          />
          <Route
            path="life"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Life />
              </Suspense>
            }
          />
          <Route
            path="resources"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Resources />
              </Suspense>
            }
          />
          <Route
            path="maintenance"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Maintenance />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<RouteFallback />}>
                <NotFound />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </HashRouter>
  )
}
