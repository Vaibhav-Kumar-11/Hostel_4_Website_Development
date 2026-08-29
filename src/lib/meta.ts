import { useEffect } from 'react'
import { site } from '@/data/site'

/**
 * Per-page document metadata.
 *
 * The site is a static single-page app, so titles and descriptions are set at
 * runtime. Search engines that execute JavaScript pick these up; the index.html
 * fallback covers everything else.
 */
export function usePageMeta({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  useEffect(() => {
    document.title = title

    const desc = description ?? site.description
    setMeta('name', 'description', desc)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', desc)
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', desc)
  }, [title, description])
}

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', value)
}
