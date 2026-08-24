import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, Aperture } from 'lucide-react'

const LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Studio', href: '#about' },
  { label: 'Booking', href: '#booking' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        scrolled ? 'bg-ink/90 backdrop-blur-md border-b border-brass/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 group">
          <Aperture
            className="w-6 h-6 text-brass transition-transform duration-700 group-hover:rotate-180"
            strokeWidth={1.4}
          />
          <span className="font-display text-xl tracking-wide">
            Liora <span className="text-brass italic">Media</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-9">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="eyebrow relative text-porcelain/80 hover:text-porcelain transition-colors after:content-[''] after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-brass hover:after:w-full after:transition-all after:duration-300"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#booking"
            className="eyebrow border border-brass text-brass px-5 py-2.5 hover:bg-brass hover:text-ink transition-colors duration-300"
          >
            Book Now
          </a>
        </nav>

        <button
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="md:hidden text-porcelain"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-ink border-b border-brass/10"
          >
            <div className="flex flex-col px-6 py-6 gap-5">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="eyebrow text-porcelain/80"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#booking"
                onClick={() => setOpen(false)}
                className="eyebrow border border-brass text-brass px-5 py-3 text-center"
              >
                Book Now
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
