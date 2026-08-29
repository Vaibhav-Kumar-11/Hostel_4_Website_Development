import { useState } from 'react'
import { ExternalLink, MapPin, Navigation } from 'lucide-react'
import { location } from '@/data/site'
import { Reveal, Section, SectionHeading } from '@/components/ui/primitives'

/**
 * FIND MADHOUSE.
 *
 * An OpenStreetMap embed rather than a Google Maps iframe: no API key to
 * expire, no third-party cookie dropped on a resident who only wanted
 * directions, and it renders reliably on the campus network. The "Get
 * directions" button still hands off to Google Maps, which is what people
 * actually navigate with.
 *
 * The iframe only loads after the visitor asks for it — the map is a heavy
 * third-party request and most people scrolling past do not need it.
 */
export default function LocationSection() {
  const [mapLoaded, setMapLoaded] = useState(false)

  return (
    <Section id="location">
      <SectionHeading
        eyebrow="Getting here"
        title={
          <>
            Find <span className="text-madhouse-500">Madhouse</span>
          </>
        }
        description="On the eastern side of the IIT Bombay campus in Powai. If you are coming from the Main Gate, keep going past the hostels until the building stops looking like it ends."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
        <Reveal>
          <div className="card flex h-full flex-col p-7">
            <MapPin className="text-madhouse-500" size={26} />
            <h3 className="mt-5 text-2xl font-bold uppercase leading-tight tracking-tight">
              {location.label}
            </h3>
            <p className="muted mt-3 text-sm leading-relaxed">{location.address}</p>

            <dl className="muted mt-6 space-y-2 border-t pt-5 font-mono text-xs">
              <div className="flex justify-between gap-4">
                <dt>Latitude</dt>
                <dd className="tabular-nums">{location.lat.toFixed(4)}° N</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Longitude</dt>
                <dd className="tabular-nums">{location.lng.toFixed(4)}° E</dd>
              </div>
            </dl>

            <div className="mt-auto flex flex-wrap gap-3 pt-7">
              <a
                href={location.directionsUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-primary"
              >
                <Navigation size={15} /> Get directions
              </a>
              <a
                href={location.osmUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-ghost"
              >
                Open map <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={1}>
          <div className="card relative h-[22rem] overflow-hidden lg:h-full">
            {mapLoaded ? (
              <iframe
                title={`Map showing ${location.label}`}
                src={location.embedUrl}
                loading="lazy"
                className="h-full w-full border-0 grayscale-[0.15] dark:invert dark:hue-rotate-180"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <button
                onClick={() => setMapLoaded(true)}
                className="group flex h-full w-full flex-col items-center justify-center gap-4 bg-[rgb(var(--surface-sunken))] p-8 text-center transition-colors hover:bg-[rgb(var(--surface-raised))]"
              >
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-madhouse-500/12 text-madhouse-500 transition-transform duration-300 group-hover:scale-110">
                  <MapPin size={22} />
                </span>
                <span className="text-lg font-bold uppercase tracking-tight">Load the map</span>
                <span className="muted max-w-xs text-xs leading-relaxed">
                  The interactive map is loaded on request so the page stays fast for everyone who
                  only came for the mess menu.
                </span>
              </button>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
