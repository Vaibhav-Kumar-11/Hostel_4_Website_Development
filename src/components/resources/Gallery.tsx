import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ImageOff, Maximize2, X } from 'lucide-react'
import { photos } from '@/data/gallery'
import type { GalleryCategory, Photo } from '@/types/content'
import { useScrollLock } from '@/hooks'
import { asset, cn } from '@/lib/utils'

/**
 * MADHOUSE PHOTO ROLL.
 *
 * A CSS-columns masonry grid with category filters and a full-screen viewer.
 * Images are lazy-loaded and each tile reserves its aspect ratio up front, so
 * filtering never causes the page to jump. The viewer supports arrow keys and
 * swipe, and traps focus while it is open.
 */

const ALL = 'All' as const
type Filter = typeof ALL | GalleryCategory

export default function Gallery({ limit, showFilters = true }: { limit?: number; showFilters?: boolean }) {
  const [filter, setFilter] = useState<Filter>(ALL)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const categories = useMemo<Filter[]>(() => {
    const present = [...new Set(photos.map((p) => p.category))].sort()
    return [ALL, ...present]
  }, [])

  const visible = useMemo(() => {
    const list = filter === ALL ? photos : photos.filter((p) => p.category === filter)
    return limit ? list.slice(0, limit) : list
  }, [filter, limit])

  const close = useCallback(() => setOpenIndex(null), [])
  const step = useCallback(
    (delta: number) =>
      setOpenIndex((i) => (i === null ? null : (i + delta + visible.length) % visible.length)),
    [visible.length],
  )

  useEffect(() => setOpenIndex(null), [filter])

  if (photos.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-3 px-6 py-20 text-center">
        <ImageOff className="muted" size={26} />
        <h3 className="text-lg font-bold uppercase">Nothing here yet</h3>
        <p className="muted max-w-sm text-sm">
          GC nights, festivals and the ordinary days in between will show up here.
        </p>
      </div>
    )
  }

  return (
    <>
      {showFilters && (
        <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={cn('chip shrink-0', filter === c && 'chip-active')}
            >
              {c}
              {c !== ALL && (
                <span className="opacity-60">
                  {photos.filter((p) => p.category === c).length}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/*
        Masonry via CSS columns — no JS layout pass, no reflow jank.

        Tile entrances use the CSS `anim-rise` class rather than a
        framer-motion opacity animation. These tiles are the gallery's actual
        content, and a JS-driven fade leaves them invisible whenever the
        browser stops issuing animation frames. `layout` stays on framer
        because it only smooths reflow when a filter changes — if it never
        runs the tiles simply snap into place, which is harmless.
      */}
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {visible.map((photo, i) => (
          <motion.button
            key={photo.id}
            layout
            onClick={() => setOpenIndex(i)}
            style={{ ['--d' as string]: `${Math.min(i, 8) * 0.04}s` }}
            className="anim-rise group relative block w-full break-inside-avoid overflow-hidden rounded-xl border text-left"
            aria-label={`Open photo: ${photo.caption}`}
          >
            <img
              src={asset(photo.src)}
              alt={photo.caption}
              loading="lazy"
              decoding="async"
              style={{ aspectRatio: photo.ratio ?? 4 / 3 }}
              className="w-full object-cover transition-transform duration-[800ms] ease-smooth group-hover:scale-[1.05]"
            />

            <span
              className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100"
              aria-hidden
            />
            <span className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-400 ease-smooth group-hover:translate-y-0 group-hover:opacity-100">
              <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-madhouse-400">
                {photo.category}
              </span>
              <span className="mt-1 block text-sm font-medium leading-snug text-ink-50">
                {photo.caption}
              </span>
            </span>
            <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-ink-950/55 text-ink-50 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
              <Maximize2 size={13} />
            </span>
          </motion.button>
        ))}
      </div>

      <Lightbox
        photos={visible}
        index={openIndex}
        onClose={close}
        onStep={step}
      />
    </>
  )
}

/* ── Full-screen viewer ──────────────────────────────────────────────────── */

function Lightbox({
  photos: list,
  index,
  onClose,
  onStep,
}: {
  photos: Photo[]
  index: number | null
  onClose: () => void
  onStep: (delta: number) => void
}) {
  const open = index !== null
  useScrollLock(open)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onStep(1)
      if (e.key === 'ArrowLeft') onStep(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, onStep])

  const photo = index !== null ? list[index] : null

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          className="fixed inset-0 z-[95] flex flex-col bg-ink-950/96 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label={photo.caption}
        >
          <div className="flex items-center justify-between px-5 py-4 text-ink-300 sm:px-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
              {photo.category}
              <span className="mx-2 text-ink-600">/</span>
              {(index ?? 0) + 1} of {list.length}
            </span>
            <button
              onClick={onClose}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 transition-colors hover:bg-white/10 hover:text-ink-50"
              aria-label="Close viewer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-4 sm:px-16">
            <button
              onClick={() => onStep(-1)}
              className="absolute left-2 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/15 text-ink-200 backdrop-blur-sm transition-colors hover:bg-white/10 sm:left-5"
              aria-label="Previous photo"
            >
              <ChevronLeft size={20} />
            </button>

            <AnimatePresence mode="wait">
              <motion.img
                key={photo.id}
                src={asset(photo.src)}
                alt={photo.caption}
                className="max-h-full max-w-full rounded-lg object-contain"
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.985 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) onStep(1)
                  if (info.offset.x > 80) onStep(-1)
                }}
              />
            </AnimatePresence>

            <button
              onClick={() => onStep(1)}
              className="absolute right-2 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/15 text-ink-200 backdrop-blur-sm transition-colors hover:bg-white/10 sm:right-5"
              aria-label="Next photo"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <p className="px-6 pb-7 pt-2 text-center text-sm text-ink-200">{photo.caption}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
