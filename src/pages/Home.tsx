import Hero from '@/components/home/Hero'
import MadhouseLive from '@/components/home/MadhouseLive'
import TodayAtMadhouse from '@/components/home/TodayAtMadhouse'
import WhatsHappening from '@/components/home/WhatsHappening'
import ByTheNumbers from '@/components/home/ByTheNumbers'
import GCHighlights from '@/components/home/GCHighlights'
import LifeTeaser from '@/components/home/LifeTeaser'
import PhotoHighlights from '@/components/home/PhotoHighlights'
import QuickUtility from '@/components/home/QuickUtility'
import Community from '@/components/home/Community'
import LocationSection from '@/components/about/LocationSection'
import { usePageMeta } from '@/lib/meta'
import { site } from '@/data/site'

/**
 * The homepage carries the information hierarchy from the brief:
 * hero → live status → mess → events & notices → facts → GC → life →
 * photos → utilities → location.
 *
 * Section tones alternate (photo, dark band, sunken, default) so the page has
 * a rhythm instead of reading as one long stack of card grids.
 */
export default function Home() {
  usePageMeta({ title: `${site.name} — ${site.fullName}`, description: site.description })

  return (
    <>
      <Hero />
      <MadhouseLive />
      <TodayAtMadhouse />
      <WhatsHappening />
      <ByTheNumbers />
      <GCHighlights />
      <LifeTeaser />
      <PhotoHighlights />
      <QuickUtility />
      <Community />
      <LocationSection />
    </>
  )
}
