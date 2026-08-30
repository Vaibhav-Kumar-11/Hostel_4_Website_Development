import { FileText } from 'lucide-react'
import { asset, cn } from '@/lib/utils'

/**
 * Does the mess PDF exist in `public/mess/` yet?
 *
 * The site is static, so nothing can check at runtime whether the file is
 * really there — a missing PDF would simply 404 in the resident's face. The
 * link is therefore opt-in: drop `current-menu.pdf` into `public/mess/`, flip
 * this to `true`, and the button appears. Until then the component renders
 * nothing at all, which is the honest state.
 *
 * Typed `boolean` rather than left to infer `false` so that flipping it is a
 * one-word edit that neither TypeScript nor an editor treats as dead code.
 */
export const MESS_PDF_AVAILABLE: boolean = false

/**
 * The week's mess menu as the council published it, alongside the meal cards
 * that are transcribed from it. Deliberately understated — the transcribed
 * menu is the thing residents read; this is the receipt.
 */
export default function MessMenuLink({ className }: { className?: string }) {
  if (!MESS_PDF_AVAILABLE) return null

  return (
    <a
      href={asset('mess/current-menu.pdf')}
      target="_blank"
      rel="noreferrer noopener"
      className={cn('btn btn-ghost px-4 py-2 text-xs', className)}
    >
      <FileText size={14} aria-hidden />
      This week&apos;s menu (PDF)
    </a>
  )
}
