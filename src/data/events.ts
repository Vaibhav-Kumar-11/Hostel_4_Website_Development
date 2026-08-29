import type { HostelEvent } from '@/types/content'

/**
 * ── EVENTS ──────────────────────────────────────────────────────────────────
 * PLACEHOLDER SCHEDULE. Structure is real; the specific events are samples.
 *
 * To add an event: copy an entry, set a unique `id`, use ISO `date`
 * ('YYYY-MM-DD') and 24-hour `startTime` / `endTime`. A `poster` path is
 * relative to /public. `registrationUrl` renders a Register button.
 * Anything dated in the past automatically moves to the Past Events archive —
 * you never have to move entries by hand.
 */

export const events: HostelEvent[] = [
  {
    id: 'e-001',
    title: 'Inter-Wing Basketball League',
    date: '2026-09-04',
    startTime: '17:30',
    endTime: '20:00',
    venue: 'Hostel 4 Basketball Court',
    category: 'Sports',
    description:
      'Wings face off across a week-long league. Sign up as a wing; substitutes allowed. Winners take the internal Sports rolling trophy.',
    state: 'placeholder',
  },
  {
    id: 'e-002',
    title: 'Madhouse Open Mic',
    date: '2026-09-07',
    startTime: '21:00',
    endTime: '23:30',
    venue: 'Ground Floor Common Room',
    category: 'Cult',
    description:
      'Music, poetry, stand-up, or whatever you have been practising at 2 a.m. in the corridor. Sign-ups at the door.',
    state: 'placeholder',
  },
  {
    id: 'e-003',
    title: 'Hostel Hack Night',
    date: '2026-09-13',
    startTime: '20:00',
    endTime: '06:00',
    venue: 'Reading Room, Level 1',
    category: 'Tech',
    description:
      'An overnight build sprint. Bring a laptop and an idea; the mess sends up chai at midnight. Teams of up to three.',
    state: 'placeholder',
  },
  {
    id: 'e-004',
    title: 'Sustainability Drive — E-Waste Collection',
    date: '2026-09-18',
    startTime: '10:00',
    endTime: '18:00',
    venue: 'Hostel 4 Lobby',
    category: 'SUS',
    description:
      'Drop off dead chargers, cables, batteries and old electronics. Collected material goes to the institute e-waste partner.',
    state: 'placeholder',
  },
  {
    id: 'e-005',
    title: 'Freshers Welcome Night',
    date: '2026-09-26',
    startTime: '19:00',
    endTime: '23:00',
    venue: 'Hostel 4 Quadrangle',
    category: 'Hostel',
    description:
      'The first-year batch meets the Madhouse properly. Performances, food stalls and the traditional wing march.',
    state: 'placeholder',
  },
  {
    id: 'e-006',
    title: 'Ganesh Chaturthi Celebration',
    date: '2026-08-25',
    startTime: '18:00',
    endTime: '22:00',
    venue: 'Hostel 4 Quadrangle',
    category: 'Festivals',
    description:
      'Aarti, decorations and prasad, organised by the hostel festival committee.',
    state: 'placeholder',
  },
  {
    id: 'e-007',
    title: 'GC Football — Quarter Final',
    date: '2026-08-16',
    startTime: '16:00',
    endTime: '18:00',
    venue: 'Institute Football Ground',
    category: 'Sports',
    description:
      'Madhouse in the General Championship football quarter-final. Turnout in hostel colours encouraged.',
    state: 'placeholder',
  },
  {
    id: 'e-008',
    title: 'Valfi — Farewell for the Graduating Batch',
    date: '2026-07-12',
    startTime: '19:30',
    endTime: '23:59',
    venue: 'Hostel 4 Quadrangle',
    category: 'Hostel',
    description:
      'The Madhouse send-off: speeches, the wall of memories, and the last mess dinner together.',
    state: 'placeholder',
  },
  {
    id: 'e-009',
    title: 'Wing Wars — Quiz Edition',
    date: '2026-07-02',
    startTime: '20:30',
    endTime: '22:30',
    venue: 'Reading Room, Level 1',
    category: 'Social',
    description:
      'Six rounds, one wing standing. General knowledge, campus trivia and a surprise audio round.',
    state: 'placeholder',
  },
]
