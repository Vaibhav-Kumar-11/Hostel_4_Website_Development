import type { LegacyEntry, Photo } from '@/types/content'
import { media } from './site'

/**
 * ── PHOTO ROLL ──────────────────────────────────────────────────────────────
 * Only genuine Hostel 4 photographs are listed. No stock photography is used
 * anywhere on this site.
 *
 * To add photos:
 *   1. Drop files into /public/images/gallery/
 *   2. Add an entry below with a unique `id`, the `src` path, a `caption`,
 *      a `category` and (optionally) a `ratio` — width ÷ height. The ratio
 *      keeps the masonry grid from jumping while images load.
 */

export const photos: Photo[] = [
  {
    id: 'p-001',
    src: media.hero,
    caption: 'Madhouse after dark — a thousand windows, none of them asleep',
    category: 'Hostel Life',
    ratio: 4 / 3,
    state: 'verified',
  },
  {
    id: 'p-002',
    src: media.pathway,
    caption: 'The walk in, past the trees and the bike racks',
    category: 'Hostel Life',
    ratio: 4 / 3,
    state: 'verified',
  },
  {
    id: 'p-003',
    src: media.readingRoom,
    caption: 'Reading room, well past midnight',
    category: 'Hostel Life',
    ratio: 4 / 3,
    state: 'verified',
  },
  {
    id: 'p-004',
    src: media.gym,
    caption: 'The gym floor',
    category: 'Sports',
    ratio: 4 / 3,
    state: 'verified',
  },
  {
    id: 'p-005',
    src: media.indoorSports,
    caption: 'Carrom, chess and foosball — the indoor sports room',
    category: 'Sports',
    ratio: 4 / 3,
    state: 'verified',
  },
]

/**
 * ── LEGACY TIMELINE ─────────────────────────────────────────────────────────
 * INTENTIONALLY EMPTY. No hostel history, founding year or GC victory has been
 * invented. The page renders a designed empty state and a contribution prompt
 * until the Council and alumni supply real milestones.
 *
 * Add entries as: { id, year, title, description, photo?, state: 'verified' }
 */
export const legacy: LegacyEntry[] = []
