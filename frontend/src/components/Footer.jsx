import { Aperture } from 'lucide-react'

export default function Footer({ content }) {
  const brand = content?.brand || {}
  const nav = content?.nav || {}
  const footer = content || {}
  const LINKS = [
    { label: nav.services || 'Services', href: '#services' },
    { label: nav.portfolio || 'Portfolio', href: '#portfolio' },
    { label: nav.studio || 'Studio', href: '#about' },
    { label: nav.booking || 'Booking', href: '#booking' },
    { label: nav.contact || 'Contact', href: '#contact' },
  ]
  return (
    <footer className="bg-ink2 border-t border-brass/10 px-6 md:px-10 py-14">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <a href="#top" className="flex items-center gap-2">
          <Aperture className="w-5 h-5 text-brass" strokeWidth={1.4} />
          <span className="font-display text-lg">
            {brand.name || 'Liora'} <span className="text-brass italic">{brand.accent || 'Media'}</span>
          </span>
        </a>

        <nav className="flex flex-wrap gap-x-8 gap-y-3">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="eyebrow text-porcelain/60 hover:text-brass transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <a href="/admin" className="eyebrow text-fog/60 hover:text-brass transition-colors">{footer.adminLabel || 'Admin'}</a>
          <span className="eyebrow text-fog">© {new Date().getFullYear()} {footer.copyright || 'Liora Media'}</span>
        </div>
      </div>
    </footer>
  )
}
