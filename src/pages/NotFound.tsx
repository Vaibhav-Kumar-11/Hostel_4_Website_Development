import { Link } from 'react-router-dom'
import { navigation, site } from '@/data/site'
import { usePageMeta } from '@/lib/meta'

export default function NotFound() {
  usePageMeta({ title: `Page not found — ${site.name}` })

  return (
    <section className="flex min-h-[80svh] items-center py-32">
      <div className="shell text-center">
        <p className="eyebrow mb-6 justify-center">Error 404</p>

        <h1 className="text-display-lg font-bold uppercase leading-none">
          <span className="outline-type">LOST</span>
        </h1>

        <p className="muted mx-auto mt-8 max-w-md text-base leading-relaxed">
          Easy to do in a building this size. That page does not exist — try one of these instead.
        </p>

        <nav className="mt-10 flex flex-wrap justify-center gap-2" aria-label="Site sections">
          {navigation.map((item) => (
            <Link key={item.to} to={item.to} className="chip px-4 py-2 hover:border-madhouse-500">
              {item.label}
            </Link>
          ))}
        </nav>

        <Link to="/" className="btn btn-primary mt-10">
          Back to Madhouse
        </Link>
      </div>
    </section>
  )
}
