import type { CouncilMember } from '@/types/content'

/**
 * ── COUNCIL & ADMINISTRATION ────────────────────────────────────────────────
 * Roles are real; NAMES ARE DELIBERATELY EMPTY.
 *
 * No name, photo, phone number or email has been invented. Each card renders a
 * clean "awaiting details" state until the Council supplies the real values.
 *
 * To fill a card in:
 *   name:        'Full Name'
 *   affiliation: 'Third Year • Computer Science'
 *   bio:         one or two sentences
 *   email/phone: shown as tap-to-contact buttons; leave null to hide
 *   photo:       'images/council/<file>.jpg'  (drop the file in /public/images/council)
 *   state:       'verified'  ← flips the card out of placeholder styling
 */

export const council: CouncilMember[] = [
  {
    id: 'c-warden',
    role: 'Warden',
    group: 'Administration',
    name: null, affiliation: null, bio: null, email: null, phone: null, photo: null,
    state: 'placeholder',
  },
  {
    id: 'c-assoc-warden',
    role: 'Associate Warden',
    group: 'Administration',
    name: null, affiliation: null, bio: null, email: null, phone: null, photo: null,
    state: 'placeholder',
  },
  {
    id: 'c-office',
    role: 'Hostel Office / Caretaker',
    group: 'Administration',
    name: null, affiliation: null, bio: null, email: null, phone: null, photo: null,
    state: 'placeholder',
  },
  {
    id: 'c-gsec',
    role: 'General Secretary',
    group: 'Council',
    name: null, affiliation: null, bio: null, email: null, phone: null, photo: null,
    state: 'placeholder',
  },
  {
    id: 'c-tech',
    role: 'Technical Secretary',
    group: 'Council',
    name: null, affiliation: null, bio: null, email: null, phone: null, photo: null,
    state: 'placeholder',
  },
  {
    id: 'c-sports',
    role: 'Sports Secretary',
    group: 'Council',
    name: null, affiliation: null, bio: null, email: null, phone: null, photo: null,
    state: 'placeholder',
  },
  {
    id: 'c-cult',
    role: 'Cultural Secretary',
    group: 'Council',
    name: null, affiliation: null, bio: null, email: null, phone: null, photo: null,
    state: 'placeholder',
  },
  {
    id: 'c-sus',
    role: 'Sustainability Secretary',
    group: 'Council',
    name: null, affiliation: null, bio: null, email: null, phone: null, photo: null,
    state: 'placeholder',
  },
  {
    id: 'c-maint',
    role: 'Maintenance Representative',
    group: 'Council',
    name: null, affiliation: null, bio: null, email: null, phone: null, photo: null,
    state: 'placeholder',
  },
  {
    id: 'c-web',
    role: 'Web / Media Representative',
    group: 'Council',
    name: null, affiliation: null, bio: null, email: null, phone: null, photo: null,
    state: 'placeholder',
  },
  {
    id: 'c-mess',
    role: 'Mess Secretary',
    group: 'Council',
    name: null, affiliation: null, bio: null, email: null, phone: null, photo: null,
    state: 'placeholder',
  },
]
