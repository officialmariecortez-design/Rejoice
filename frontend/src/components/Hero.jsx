import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { heroTiles } from '../lib/images'
import SafeImage from './SafeImage'

// Layout + outward-travel target for each tile, arranged like a contact
// sheet that scatters outward (shutter blades opening) as the page scrolls.
const LAYOUT_DESKTOP = [
  { top: '8%', left: '6%', w: 190, h: 250, tx: -260, ty: -140, rot: -22 },
  { top: '14%', left: '30%', w: 150, h: 200, tx: -120, ty: -260, rot: -10 },
  { top: '6%', left: '54%', w: 170, h: 230, tx: 60, ty: -280, rot: 8 },
  { top: '16%', left: '78%', w: 190, h: 250, tx: 280, ty: -140, rot: 20 },
  { top: '58%', left: '4%', w: 170, h: 230, tx: -280, ty: 150, rot: -16 },
  { top: '62%', left: '28%', w: 150, h: 200, tx: -120, ty: 270, rot: -6 },
  { top: '56%', left: '56%', w: 180, h: 240, tx: 100, ty: 260, rot: 12 },
  { top: '60%', left: '80%', w: 170, h: 230, tx: 260, ty: 150, rot: 22 },
]

// Same 8 tiles, resized and repositioned to actually fit inside a phone
// viewport (~360-430px wide) instead of the desktop layout's tiles, which
// sit at things like left:78% + width:190px and end up mostly clipped off
// the edge of the screen on mobile.
const LAYOUT_MOBILE = [
  { top: '5%', left: '4%', w: 110, h: 145, tx: -50, ty: -40, rot: -14 },
  { top: '3%', left: '54%', w: 110, h: 145, tx: 50, ty: -50, rot: 12 },
  { top: '24%', left: '28%', w: 100, h: 130, tx: -30, ty: -20, rot: -6 },
  { top: '46%', left: '2%', w: 100, h: 130, tx: -50, ty: 40, rot: -12 },
  { top: '44%', left: '56%', w: 110, h: 145, tx: 50, ty: 45, rot: 14 },
  { top: '66%', left: '26%', w: 100, h: 130, tx: -20, ty: 60, rot: -8 },
  { top: '64%', left: '4%', w: 90, h: 120, tx: -55, ty: 30, rot: -18 },
  { top: '62%', left: '68%', w: 90, h: 120, tx: 55, ty: 30, rot: 18 },
]

// Matches Tailwind's `md` breakpoint used everywhere else in this project.
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

function Tile({ tile, layout, progress, index }) {
  const x = useTransform(progress, [0, 1], [0, layout.tx])
  const y = useTransform(progress, [0, 1], [0, layout.ty])
  const rotate = useTransform(progress, [0, 1], [0, layout.rot])
  const scale = useTransform(progress, [0, 1], [1, 0.55])
  const opacity = useTransform(progress, [0, 0.55, 1], [0.9, 0.7, 0])

  return (
    <motion.div
      className="absolute rounded-sm overflow-hidden shadow-2xl shadow-black/60 border border-brass/10"
      style={{
        top: layout.top,
        left: layout.left,
        width: layout.w,
        height: layout.h,
        x,
        y,
        rotate,
        scale,
        opacity,
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.15 + index * 0.06, ease: 'easeOut' }}
    >
      <SafeImage src={tile.src} alt={tile.alt} className="w-full h-full object-cover" loading="eager" />
      <div className="absolute inset-0 bg-ink/25" />
    </motion.div>
  )
}

export default function Hero({ content }) {
  const c = content || {}
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const isMobile = useIsMobile()
  const layout = isMobile ? LAYOUT_MOBILE : LAYOUT_DESKTOP

  const textOpacity = useTransform(scrollYProgress, [0, 0.18, 0.55, 0.8], [0, 1, 1, 0])
  const textY = useTransform(scrollYProgress, [0, 0.8], [0, -60])
  const cueOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0])
  const vignetteOpacity = useTransform(scrollYProgress, [0, 1], [0.4, 0.9])

  return (
    <section id="top" ref={ref} className="relative h-[220vh]">
      <div className="sticky top-0 h-dvh w-full overflow-hidden bg-ink">
        {heroTiles.map((tile, i) => (
          <Tile key={i} tile={tile} layout={layout[i]} progress={scrollYProgress} index={i} />
        ))}

        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/40 to-ink"
          style={{ opacity: vignetteOpacity }}
        />

        <motion.div
          className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
          style={{ opacity: textOpacity, y: textY }}
        >
          <span className="eyebrow text-brass mb-5">{c.eyebrow}</span>
          <h1 className="font-display font-medium leading-[0.95] text-5xl sm:text-6xl md:text-7xl lg:text-8xl max-w-4xl">
            {c.title || 'Every frame,'}
            <br />
            <span className="italic text-brass">{c.accentTitle || 'deliberately'}</span> {c.titleEnd || 'made.'}
          </h1>
          <p className="mt-6 max-w-xl text-porcelain/70 text-base md:text-lg">
            {c.description}
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-4">
            <a
              href={c.primaryHref || "#booking"}
              className="bg-brass text-ink px-8 py-3.5 eyebrow hover:bg-porcelain transition-colors duration-300"
            >
              {c.primaryLabel || 'Book a Session'}
            </a>
            <a
              href={c.secondaryHref || "#portfolio"}
              className="border border-porcelain/30 px-8 py-3.5 eyebrow text-porcelain hover:border-brass hover:text-brass transition-colors duration-300"
            >
              {c.secondaryLabel || 'See the Work'}
            </a>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          style={{ opacity: cueOpacity }}
        >
          <span className="eyebrow text-porcelain/50">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-5 h-5 text-brass" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
