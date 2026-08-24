import { Aperture } from 'lucide-react'

const LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Studio', href: '#about' },
  { label: 'Booking', href: '#booking' },
  { label: 'Contact', href: '#contact' },
]

export default function Footer() {
  return (
    <footer className="bg-ink2 border-t border-brass/10 px-6 md:px-10 py-14">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <a href="#top" className="flex items-center gap-2">
          <Aperture className="w-5 h-5 text-brass" strokeWidth={1.4} />
          <span className="font-display text-lg">
            Liora <span className="text-brass italic">Media</span>
          </span>
        </a>

        <nav className="flex flex-wrap gap-x-8 gap-y-3">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="eyebrow text-porcelain/60 hover:text-brass transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <span className="eyebrow text-fog">© {new Date().getFullYear()} Liora Media</span>
      </div>
    </footer>
  )
}
