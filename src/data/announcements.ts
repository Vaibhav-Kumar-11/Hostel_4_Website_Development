import type { Announcement } from '@/types/content'

/**
 * ── ANNOUNCEMENTS ───────────────────────────────────────────────────────────
 * PLACEHOLDER FEED. Every item below is a formatting sample so the Council can
 * see what each priority level looks like — replace with real notices.
 *
 * To add a notice: copy any object, give it a unique `id`, set `date` to the
 * ISO day it was issued, and pick a `priority`:
 *   'urgent'    → red, always surfaces on the homepage ticker
 *   'important' → amber
 *   'general'   → neutral
 * `pinned: true` keeps an item at the top of the Events → Announcements feed.
 * `expiresOn` hides it from "current" feeds after that date (it stays in the archive).
 */

export const announcements: Announcement[] = [
  {
    id: 'a-001',
    title: 'Hostel General Body Meeting — attendance mandatory',
    date: '2026-08-28',
    priority: 'urgent',
    body:
      'All residents are required to attend the General Body Meeting in the ground-floor common room. Budget allocation, GC planning and mess feedback are on the agenda.',
    pinned: true,
    state: 'placeholder',
  },
  {
    id: 'a-002',
    title: 'Wing-wise LAN maintenance window',
    date: '2026-08-26',
    priority: 'important',
    body:
      'Network cabling work will take wings A and B offline for a short window. Wi-Fi in the reading room stays up throughout.',
    link: { label: 'LAN setup guide', href: '#/resources' },
    state: 'placeholder',
  },
  {
    id: 'a-003',
    title: 'Gym timings extended on weekends',
    date: '2026-08-22',
    priority: 'general',
    body:
      'The hostel gym will stay open later on Saturdays and Sundays. Please re-rack your weights and carry your own towel.',
    state: 'placeholder',
  },
  {
    id: 'a-004',
    title: 'Mess feedback form is open',
    date: '2026-08-19',
    priority: 'general',
    body:
      'Share what is working and what is not on the current menu. Feedback is reviewed by the mess council every fortnight.',
    state: 'placeholder',
  },
  {
    id: 'a-005',
    title: 'Room cleaning schedule revised',
    date: '2026-08-14',
    priority: 'important',
    body:
      'The housekeeping rotation has been updated. Wing-wise timings are posted on each floor noticeboard.',
    state: 'placeholder',
  },
]
