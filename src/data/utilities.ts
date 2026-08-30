import type { EmergencyContact, Guide, ResourceLink } from '@/types/content'
import { instituteLinks } from './site'

/**
 * ── EMERGENCY CONTACTS ──────────────────────────────────────────────────────
 * `phone: null` is deliberate. No number has been guessed. Each card shows a
 * clear "number pending" state; the moment a real number is filled in it
 * becomes a one-tap `tel:` link on mobile.
 *
 * Fill in as: phone: '+9122XXXXXXXX', state: 'verified'
 */

export const emergencyContacts: EmergencyContact[] = [
  { id: 'em-ambulance', label: 'Ambulance', phone: null, detail: 'Campus medical emergency response', critical: true, state: 'placeholder' },
  { id: 'em-security', label: 'Campus Security', phone: null, detail: 'IIT Bombay Security Control Room', critical: true, state: 'placeholder' },
  { id: 'em-hospital', label: 'IITB Hospital', phone: null, detail: 'Institute Medical Centre', critical: true, state: 'placeholder' },
  { id: 'em-fire', label: 'Fire', phone: null, detail: 'Campus fire response', critical: true, state: 'placeholder' },
  { id: 'em-office', label: 'Hostel 4 Office', phone: null, detail: 'Caretaker / hostel desk', state: 'placeholder' },
  { id: 'em-warden', label: 'Warden on Call', phone: null, detail: 'For escalations outside office hours', state: 'placeholder' },
  { id: 'em-wellness', label: 'Student Wellness Centre', phone: null, detail: 'Confidential counselling support', state: 'placeholder' },
]

/**
 * ── RESOURCE LINKS ──────────────────────────────────────────────────────────
 * Institute links are verified public URLs. Hostel-specific documents are
 * placeholders until the Council shares the files.
 */
export const resourceLinks: ResourceLink[] = [
  ...instituteLinks.map((l) => ({ ...l, external: true, state: 'verified' as const })),
  /*
    Hostel documents. Each one is hidden from the page until it has a real
    destination, so add the URL and it appears; leave it and nothing shows.
      { id: 'r-rules', label: 'Hostel Rules & Code of Conduct', href: 'https://…' },
      { id: 'r-mess-rules', label: 'Mess Rules & Rebate Policy', href: 'https://…' },
      { id: 'r-room-alloc', label: 'Room Allotment Information', href: 'https://…' },
  */
]

/**
 * ── SETUP GUIDES ────────────────────────────────────────────────────────────
 * The steps describe the *procedure*. Any value shown in brackets is a
 * placeholder that must be replaced with the setting the hostel network
 * administrator actually publishes. Nothing here is guessed.
 */
export const guides: Guide[] = [
  {
    id: 'g-lan',
    title: 'LAN / Wired Internet Setup',
    summary: 'Getting the ethernet port in your room online.',
    steps: [
      { label: 'Connect', value: 'Plug the ethernet cable into the wall port and into your laptop.' },
      {
        label: 'Addressing',
        value:
          'Whether your wing runs on DHCP or fixed addresses — and the address, subnet mask and gateway if it is fixed — comes from the hostel network coordinator.',
      },
      {
        label: 'Authenticate',
        value: 'Open internet.iitb.ac.in and sign in with your LDAP credentials.',
      },
      {
        label: 'Register the device',
        value: 'A laptop the network has not seen before may need its MAC address registered once.',
      },
    ],
    footnote:
      'If the port stays dead after all that, raise a LAN ticket from the Maintenance page. Include your room number and the port label.',
    state: 'placeholder',
  },
  {
    id: 'g-wifi',
    title: 'Campus Wi-Fi',
    summary: 'Connecting to the institute wireless network from your phone or laptop.',
    steps: [
      { label: 'Username', value: 'Your LDAP ID.' },
      { label: 'Password', value: 'Your LDAP password.' },
      {
        label: 'Sign in',
        value: 'Visit internet.iitb.ac.in if the login page does not open on its own.',
      },
      {
        label: 'Not connecting',
        value: 'The hostel network coordinator can re-register a device that refuses to authenticate.',
      },
    ],
    state: 'placeholder',
  },
  {
    id: 'g-newcomer',
    title: 'New to Madhouse? Start here',
    summary: 'The five things every incoming resident asks in their first week.',
    steps: [
      { label: 'Room & keys', value: 'Collect from the hostel office; carry your institute ID.' },
      { label: 'Mess registration', value: 'Register with the mess council — see the Mess Secretary card on the About page.' },
      { label: 'Internet', value: 'Follow the LAN and Wi-Fi guides above.' },
      { label: 'Something broken', value: 'Raise a CLR ticket from the Maintenance page. Do not wait for it to get worse.' },
      { label: 'Get involved', value: 'Find your contingent — Tech, Sports, Cult or SUS — through the Council.' },
    ],
    state: 'placeholder',
  },
]

/**
 * Facts confirmed by the hostel. Nothing may be added here without a source —
 * these four are the only hostel statistics supplied in the brief.
 */
export interface HostelFact {
  id: string
  /** Animated counter value. Mutually exclusive with `text`. */
  value?: number
  /** Word-based stat rendered instead of a counter, e.g. 'LARGEST'. */
  text?: string
  suffix?: string
  label: string
  note?: string
}

export const hostelFacts: HostelFact[] = [
  { id: 'f-rooms', value: 1250, suffix: '+', label: 'Rooms', note: 'Residential capacity' },
  { id: 'f-largest', text: 'LARGEST', label: 'Hostel at IIT Bombay', note: 'By resident count' },
  { id: 'f-balcony', text: 'INDIVIDUAL', label: 'Balconies', note: 'In every room' },
  { id: 'f-one', value: 1, label: 'Madhouse', note: 'There is no second one' },
]
