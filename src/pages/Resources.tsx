import { useState } from 'react'
import { BookOpen, ChevronDown, ExternalLink, Images, Link2 } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import Gallery from '@/components/resources/Gallery'
import BookingModule from '@/components/resources/BookingModule'
import EmergencyContacts from '@/components/resources/EmergencyContacts'
import { Reveal, Section, SectionHeading } from '@/components/ui/primitives'
import { guides, resourceLinks } from '@/data/utilities'
import { photos } from '@/data/gallery'
import { media, site } from '@/data/site'
import { usePageMeta } from '@/lib/meta'
import { cn } from '@/lib/utils'

/**
 * RESOURCES — the utility drawer: photo roll, bookings, setup guides,
 * important links and emergency contacts.
 *
 * The gallery lives here rather than in the main navigation, per the brief.
 */
export default function Resources() {
  usePageMeta({
    title: `Resources — ${site.name}`,
    description:
      'The Madhouse photo roll, room and equipment bookings, LAN and Wi-Fi setup guides, important institute links and emergency contacts for Hostel 4, IIT Bombay.',
  })

  return (
    <>
      <PageHeader
        eyebrow="Everything else you need"
        title="Resources"
        image={media.indoorSports}
        description="Photographs, bookings, setup guides and the numbers worth having saved."
      >
        <nav className="flex flex-wrap gap-2" aria-label="Jump to section">
          {[
            { label: 'Photo roll', to: '#gallery' },
            { label: 'Bookings', to: '#bookings' },
            { label: 'Guides', to: '#guides' },
            { label: 'Links', to: '#links' },
            { label: 'Emergency', to: '#emergency' },
          ].map((s) => (
            <a
              key={s.to}
              href={s.to}
              className="chip border-white/25 text-ink-100 hover:border-madhouse-500 hover:text-madhouse-500"
            >
              {s.label}
            </a>
          ))}
        </nav>
      </PageHeader>

      {/* ── Photo roll ── */}
      <Section id="gallery" className="scroll-mt-24">
        <SectionHeading
          eyebrow={`${photos.length} photograph${photos.length === 1 ? '' : 's'}`}
          title={
            <>
              Madhouse <span className="text-madhouse-500">photo roll</span>
            </>
          }
          description="GC, sports, tech, cult, festivals and the ordinary days in between. Click any photo to open the viewer — arrow keys and swipe both work."
        />
        <Gallery />

      </Section>

      {/* ── Bookings ── */}
      <Section id="bookings" tone="sunken" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Rooms & equipment"
          title="Book a space or kit"
          description="Music room, dance room, common room, indoor sports room — plus the sports gear, instruments and tech the council lends out."
        />
        <BookingModule />
      </Section>

      {/* ── Guides ── */}
      <Section id="guides" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Setup & how-to"
          title="Useful information"
          description="The things every resident ends up asking someone in the corridor about."
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {guides.map((guide, i) => (
            <Reveal key={guide.id} delay={i}>
              <GuideCard guide={guide} defaultOpen={i === 0} />
            </Reveal>
          ))}
        </div>

      </Section>

      {/* ── Links ── */}
      <Section id="links" tone="sunken" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Bookmarks"
          title="Important links"
          description="Institute portals, hostel documents and everything worth having one tap away."
        />
        {/* A link without a destination yet is left out rather than shown dead. */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {resourceLinks
            .filter((link) => link.href && link.href !== '#')
            .map((link, i) => (
              <Reveal key={link.id} delay={i}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="card card-hover group flex h-full items-center gap-4 p-5"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[rgb(var(--surface-sunken))] text-madhouse-500">
                    <Link2 size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{link.label}</span>
                    {link.description && (
                      <span className="muted mt-0.5 block text-xs">{link.description}</span>
                    )}
                  </span>
                  <ExternalLink
                    size={14}
                    className="muted shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              </Reveal>
            ))}
        </div>
      </Section>

      {/* ── Emergency ── */}
      <Section id="emergency" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Save these now, not later"
          title={
            <>
              Emergency <span className="text-madhouse-500">contacts</span>
            </>
          }
          description="On a phone, tap a number to call it."
        />
        <EmergencyContacts />
      </Section>

      {/* ── Footer note ── */}
      <Section size="sm" tone="dark">
        <div className="flex flex-col items-center gap-4 text-center">
          <Images size={24} className="text-madhouse-500" />
          <h2 className="max-w-xl text-2xl font-bold uppercase tracking-tight text-ink-50 sm:text-3xl">
            Got photos the site should have?
          </h2>
          <p className="muted max-w-lg text-sm leading-relaxed text-ink-300">
            GC nights, Valfi, festival setups, wing photos from years ago — send them to the Web
            Representative. The photo roll is meant to keep growing.
          </p>
        </div>
      </Section>
    </>
  )
}

/* ── Guide accordion ─────────────────────────────────────────────────────── */

function GuideCard({
  guide,
  defaultOpen,
}: {
  guide: (typeof guides)[number]
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(!!defaultOpen)

  return (
    <article className="card overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-start gap-4 p-6 text-left"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-madhouse-500/12 text-madhouse-500">
          <BookOpen size={17} />
        </span>
        <span className="flex-1">
          <span className="block text-lg font-bold uppercase leading-tight tracking-tight">
            {guide.title}
          </span>
          <span className="muted mt-1.5 block text-sm leading-relaxed">{guide.summary}</span>
        </span>
        <ChevronDown
          size={18}
          className={cn(
            'muted mt-1 shrink-0 transition-transform duration-300 ease-smooth',
            open && 'rotate-180',
          )}
        />
      </button>

      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-400 ease-smooth',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <dl className="border-t px-6 py-5">
            {guide.steps.map((step, i) => (
              <div
                key={step.label}
                className="flex flex-col gap-1 border-b py-3 last:border-0 sm:flex-row sm:gap-6"
              >
                <dt className="muted flex shrink-0 items-baseline gap-2.5 font-mono text-[10px] uppercase tracking-wider sm:w-36">
                  <span className="text-madhouse-500">{String(i + 1).padStart(2, '0')}</span>
                  {step.label}
                </dt>
                <dd className="flex-1 text-sm leading-relaxed">{step.value}</dd>
              </div>
            ))}
          </dl>
          {guide.footnote && (
            <p className="muted border-t px-6 py-4 text-xs leading-relaxed">{guide.footnote}</p>
          )}
        </div>
      </div>
    </article>
  )
}
