import type { Amenity } from '@/types/content'
import { media } from './site'

/**
 * ── FACILITIES ──────────────────────────────────────────────────────────────
 * Photographs are real Hostel 4 images. Floors, timings and capacities are
 * PLACEHOLDERS (`null` renders as "to be confirmed" rather than a guess).
 *
 * `bookable: true` adds the space to the equipment/room booking module on the
 * Resources page.
 */

export const amenities: Amenity[] = [
  {
    id: 'reading-room',
    name: 'Reading Room',
    tagline: 'Where the night before an endsem actually happens',
    description:
      'A large silent study floor with individual desks, partitions and power at every seat. Glass on three sides, so it stays bright through the day and quiet through the night.',
    photo: media.readingRoom,
    location: null,
    timings: null,
    capacity: null,
    bookable: false,
    state: 'placeholder',
  },
  {
    id: 'gym',
    name: 'Gym',
    tagline: 'Full-floor strength and cardio setup',
    description:
      'Air-conditioned gym with plate-loaded machines, free weights, cardio equipment and a mirrored lifting area. One of the better-equipped hostel gyms on campus.',
    photo: media.gym,
    location: null,
    timings: null,
    capacity: null,
    bookable: false,
    state: 'placeholder',
  },
  {
    id: 'indoor-sports',
    name: 'Indoor Sports Room',
    tagline: 'Carrom, chess, table tennis, foosball',
    description:
      'The room that never really empties. Carrom boards, chess sets, a foosball table and table tennis — first come, first served, and the queue is part of the experience.',
    photo: media.indoorSports,
    location: null,
    timings: null,
    capacity: null,
    bookable: true,
    state: 'placeholder',
  },
  {
    id: 'music-room',
    name: 'Music Room',
    tagline: 'Amps on, door closed, nobody complains',
    description:
      'A dedicated practice space for the hostel music contingent — the room that turns into the Cult GC war room every season.',
    photo: null as unknown as string,
    location: null,
    timings: null,
    capacity: null,
    bookable: true,
    state: 'placeholder',
  },
  {
    id: 'dance-room',
    name: 'Dance Room',
    tagline: 'Mirrors, floor space, and 2 a.m. rehearsals',
    description:
      'Mirrored practice room used by the hostel dance contingent through the cultural season.',
    photo: null as unknown as string,
    location: null,
    timings: null,
    capacity: null,
    bookable: true,
    state: 'placeholder',
  },
  {
    id: 'common-room',
    name: 'Common Room',
    tagline: 'Match nights, GC screenings, general chaos',
    description:
      'The hostel living room — large screen for match nights and GC finals, seating for a crowd, and the venue for most impromptu gatherings.',
    photo: null as unknown as string,
    location: null,
    timings: null,
    capacity: null,
    bookable: true,
    state: 'placeholder',
  },
  {
    id: 'laundry',
    name: 'Laundry',
    tagline: 'The eternal queue',
    description:
      'On-site laundry facility for residents.',
    photo: null as unknown as string,
    location: null,
    timings: null,
    capacity: null,
    bookable: false,
    state: 'placeholder',
  },
  {
    id: 'lobby',
    name: 'Lobby & Quadrangle',
    tagline: 'Every Madhouse story starts here',
    description:
      'The entrance lobby and the open quadrangle it opens onto — notice boards, the parcel desk, and the space that turns into a stage every festival.',
    photo: media.pathway,
    location: null,
    timings: null,
    capacity: null,
    bookable: false,
    state: 'placeholder',
  },
]

/** Loose equipment residents can reserve, alongside the bookable rooms. */
export const bookableEquipment = [
  { id: 'eq-football', name: 'Football', category: 'Sports Gear' },
  { id: 'eq-basketball', name: 'Basketball', category: 'Sports Gear' },
  { id: 'eq-cricket-kit', name: 'Cricket Kit', category: 'Sports Gear' },
  { id: 'eq-badminton', name: 'Badminton Rackets + Shuttles', category: 'Sports Gear' },
  { id: 'eq-tt', name: 'Table Tennis Rackets', category: 'Sports Gear' },
  { id: 'eq-guitar', name: 'Acoustic Guitar', category: 'Music Equipment' },
  { id: 'eq-cajon', name: 'Cajon', category: 'Music Equipment' },
  { id: 'eq-keyboard', name: 'Keyboard', category: 'Music Equipment' },
  { id: 'eq-speaker', name: 'PA Speaker + Mic', category: 'Music Equipment' },
  { id: 'eq-projector', name: 'Projector', category: 'Tech Equipment' },
  { id: 'eq-extension', name: 'Extension Boards', category: 'Tech Equipment' },
  { id: 'eq-camera', name: 'DSLR + Tripod', category: 'Tech Equipment' },
]
