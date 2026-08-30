import { ArrowRight } from 'lucide-react'
import { activeAnnouncements, upcomingEvents } from '@/lib/schedule'
import { AnnouncementCard, EventCard } from '@/components/events/Cards'
import { ActionLink, EmptyState, Reveal, Section, SectionHeading } from '@/components/ui/primitives'

/**
 * WHAT'S HAPPENING — announcements and events, side by side.
 *
 * Notices are the narrow, frequently-scanned column; events get the wider
 * grid because they carry more detail. Both link through to the full Events
 * page rather than duplicating its filters here.
 */
export default function WhatsHappening() {
  const notices = activeAnnouncements(4)
  const events = upcomingEvents(4)

  return (
    <Section id="happening" size="lg">
      <SectionHeading
        eyebrow="Notice board & calendar"
        title={
          <>
            What&apos;s <span className="text-madhouse-500">happening</span>
          </>
        }
        description="Everything the Council has put out this week, and everything on the calendar next."
        action={
          <ActionLink to="/events" variant="ghost">
            All events & notices <ArrowRight size={15} />
          </ActionLink>
        }
      />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_1.35fr] lg:gap-12">
        {/* Announcements */}
        <div>
          <div className="mb-5 flex items-baseline justify-between">
            <h3 className="text-sm font-bold uppercase tracking-[0.16em]">
              Important announcements
            </h3>
            <ActionLink to="/events?tab=announcements" variant="text" className="text-xs">
              View all
            </ActionLink>
          </div>

          {notices.length ? (
            <div className="space-y-3">
              {notices.map((item, i) => (
                <Reveal key={item.id} delay={i}>
                  <AnnouncementCard item={item} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No active notices"
              description="When the Council posts something, it lands here and on the homepage ticker."
            />
          )}
        </div>

        {/* Events */}
        <div>
          <div className="mb-5 flex items-baseline justify-between">
            <h3 className="text-sm font-bold uppercase tracking-[0.16em]">Upcoming events</h3>
            <ActionLink to="/events" variant="text" className="text-xs">
              View all
            </ActionLink>
          </div>

          {events.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {events.map((event, i) => (
                <Reveal key={event.id} delay={i}>
                  <EventCard event={event} compact />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Calendar is clear"
              description="Nothing on the calendar right now. Check back soon."
            />
          )}
        </div>
      </div>
    </Section>
  )
}
