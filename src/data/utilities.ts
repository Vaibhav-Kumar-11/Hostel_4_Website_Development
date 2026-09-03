import type { EmergencyContact, Guide, ResourceLink } from '@/types/content'
import { instituteLinks } from './site'

/**
 * -- EMERGENCY CONTACTS ------------------------------------------------------
 * Confirmed by the Hostel 4 Council. These six are the full list; do not add a
 * seventh without a source.
 *
 * The numbers are campus extensions, dialled as-is from any intercom or
 * landline inside IIT Bombay. They carry `internal: true` so the page can say
 * so, because four digits typed into a mobile off campus will not connect and
 * an emergency is the wrong moment to discover that.
 *
 * `critical: true` gives a contact red styling and puts it in the short list
 * shown on the homepage and the Maintenance page.
 */

export const emergencyContacts: EmergencyContact[] = [
  { id: 'em-ambulance', label: 'Ambulance', phone: '1101', internal: true, detail: 'Campus medical emergency response', critical: true, state: 'verified' },
  { id: 'em-qrt', label: 'Quick Response Team', phone: '1126', internal: true, detail: 'First responders for any campus emergency', critical: true, state: 'verified' },
  { id: 'em-fire', label: 'Fire', phone: '1196', internal: true, detail: 'Campus fire response', critical: true, state: 'verified' },
  { id: 'em-desk', label: 'Hostel 4 Main Desk', phone: '2604', internal: true, detail: 'The hostel front desk', state: 'verified' },
  { id: 'em-hall-manager', label: 'Hall Manager', phone: '2704', internal: true, detail: 'Hostel administration and escalations', state: 'verified' },
  { id: 'em-wellness', label: 'Student Wellness Centre', phone: '9075', internal: true, detail: 'Confidential counselling support', state: 'verified' },
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
