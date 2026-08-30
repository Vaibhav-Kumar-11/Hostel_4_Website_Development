/**
 * Global site configuration — brand strings, navigation, external links.
 * Edit here to change anything that appears in the navbar or footer.
 */

export const site = {
  name: 'MADHOUSE',
  fullName: 'Hostel 4, IIT Bombay',
  subtitle: 'HOSTEL 4 • IIT BOMBAY',
  tagline: '1250+ Rooms. Thousands of Stories. One Madhouse.',
  shortTagline: 'More Than a Hostel.',
  description:
    'The official website of Hostel 4, IIT Bombay — known to everyone on campus as Madhouse. Mess menus, events, announcements, GC standings, facilities and maintenance, all in one place.',
  /** Update after the site is live on the institute domain. */
  canonicalUrl: 'https://gymkhana.iitb.ac.in/~hostel4/',
} as const

/** The seven top-level tabs. Nothing else belongs in the primary navigation. */
export const navigation = [
  { label: 'Home', to: '/', emphasis: true },
  { label: 'About', to: '/about' },
  { label: 'GC', to: '/gc' },
  { label: 'Events', to: '/events' },
  { label: 'Life', to: '/life' },
  { label: 'Resources', to: '/resources' },
  { label: 'Maintenance', to: '/maintenance' },
] as const

/**
 * The hostel's live maintenance ticketing system (CLR). This is the real
 * system residents already use — the website links straight into it rather
 * than pretending to run a complaint desk of its own.
 */
export const CLR_TICKET_URL =
  'https://clr.mobilisepro.com/#/create-ticket-qr-code/site/eyJpdiI6InRjK283bk14UzFhLzRtd2FadlE2N3c9PSIsInZhbHVlIjoibkNiVitQaU9WbWNFL0ZSREZZd05hZz09IiwibWFjIjoiNTIxMGUwNTc2MzYyNjY3NjQ2MGY5Mjk2MDkyYjRjMmM5MjM3NzI4MTllNjVhNTE4ZjVlMzJkZmZmODZjNmMwNCIsInRhZyI6IiJ9'

/**
 * Social handles. `href: null` renders the icon in a disabled state instead
 * of linking somewhere wrong — fill these in once the Council confirms them.
 */
export const socials = [
  { id: 'instagram', label: 'Instagram', href: null as string | null },
  { id: 'youtube', label: 'YouTube', href: null as string | null },
  { id: 'linkedin', label: 'LinkedIn', href: null as string | null },
  { id: 'facebook', label: 'Facebook', href: null as string | null },
]

/** Verified public IIT Bombay destinations — safe to link. */
export const instituteLinks = [
  { id: 'iitb', label: 'IIT Bombay', href: 'https://www.iitb.ac.in/' },
  { id: 'gymkhana', label: 'Student Gymkhana', href: 'https://gymkhana.iitb.ac.in/' },
  { id: 'asc', label: 'ASC — Academic Portal', href: 'https://asc.iitb.ac.in/' },
  { id: 'moodle', label: 'Moodle', href: 'https://moodle.iitb.ac.in/' },
  { id: 'hostel-affairs', label: 'Hostel Affairs, IIT Bombay', href: 'https://www.iitb.ac.in/newacadhome/hostels.jsp' },
  { id: 'internet', label: 'IITB Internet / LDAP Login', href: 'https://internet.iitb.ac.in/' },
]

/** Approximate campus coordinates for Hostel 4, IIT Bombay (map + directions). */
export const location = {
  label: 'Hostel 4, IIT Bombay',
  address: 'IIT Bombay, Powai, Mumbai, Maharashtra 400076',
  lat: 19.1301,
  lng: 72.9161,
  /** OpenStreetMap embed — no API key, no tracking, works behind the campus firewall. */
  get embedUrl() {
    const d = 0.004
    const bbox = [this.lng - d, this.lat - d / 2, this.lng + d, this.lat + d / 2].join('%2C')
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${this.lat}%2C${this.lng}`
  },
  get directionsUrl() {
    return `https://www.google.com/maps/dir/?api=1&destination=${this.lat},${this.lng}`
  },
  get osmUrl() {
    return `https://www.openstreetmap.org/?mlat=${this.lat}&mlon=${this.lng}#map=17/${this.lat}/${this.lng}`
  },
}

/** Photography supplied by the hostel. Add new files to /public/images/hostel. */
export const media = {
  hero: 'images/hostel/hostel-exterior-night.jpg',
  pathway: 'images/hostel/hostel-pathway-night.jpg',
  readingRoom: 'images/hostel/reading-room.jpg',
  gym: 'images/hostel/gym.jpg',
  indoorSports: 'images/hostel/indoor-sports-room.jpg',
}
