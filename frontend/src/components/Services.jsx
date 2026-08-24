import { motion } from 'framer-motion'
import {
  PenTool,
  Camera,
  Aperture,
  Video,
  Radio,
  Users,
  Film,
  Sparkles,
  Package,
} from 'lucide-react'
import ApertureDivider from './ApertureDivider'

const SERVICES = [
  {
    code: 'ƒ/1.4',
    icon: PenTool,
    title: 'Graphic Design & Branding',
    desc: 'Identity systems, logos, brand guidelines and marketing collateral built to hold up across every touchpoint.',
  },
  {
    code: 'ƒ/2',
    icon: Camera,
    title: 'Photography',
    desc: 'Portrait, product, editorial and lifestyle photography shot on location or in-studio.',
  },
  {
    code: 'ƒ/2.8',
    icon: Aperture,
    title: 'Studio Photo Sessions',
    desc: 'Book our in-house studio — cyclorama, lighting rigs and backdrops — for a fully equipped session.',
  },
  {
    code: 'ƒ/4',
    icon: Package,
    title: 'Camera & Lens Rentals',
    desc: 'Professional camera bodies, lenses, lighting and grip equipment available for hire, by the day or week.',
  },
  {
    code: 'ƒ/5.6',
    icon: Users,
    title: 'Campaign & Program Booking',
    desc: 'Dedicated production support and crew booking for brand campaigns, launches and ongoing programs.',
  },
  {
    code: 'ƒ/8',
    icon: Film,
    title: 'Videography & Cinematography',
    desc: 'Brand films, commercials, event coverage and short-form content shot and directed end to end.',
  },
  {
    code: 'ƒ/11',
    icon: Sparkles,
    title: 'Photo & Video Post-Production',
    desc: 'Retouching, color grading, editing and motion graphics that bring raw footage to its final cut.',
  },
  {
    code: 'ƒ/16',
    icon: Radio,
    title: 'Social & Digital Content',
    desc: 'Platform-ready content — reels, campaign assets and creative direction for social channels.',
  },
  {
    code: 'ƒ/22',
    icon: Video,
    title: 'Podcast & Audio Studio Rental',
    desc: 'A treated audio room with recording and streaming gear, available for podcast and voice sessions.',
  },
]

export default function Services() {
  return (
    <section id="services" className="relative py-28 px-6 md:px-10 bg-ink">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mb-16"
        >
          <span className="eyebrow text-brass">What We Do</span>
          <h2 className="font-display font-medium text-4xl md:text-5xl mt-4 leading-tight">
            One studio, every service
            <br /> a campaign needs.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-brass/10">
          {SERVICES.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
                whileHover={{ y: -6 }}
                className="bg-ink p-8 group cursor-default"
              >
                <div className="flex items-start justify-between mb-8">
                  <Icon
                    className="w-7 h-7 text-brass/80 group-hover:text-brass transition-colors"
                    strokeWidth={1.3}
                  />
                  <span className="eyebrow text-fog group-hover:text-brass transition-colors">
                    {s.code}
                  </span>
                </div>
                <h3 className="font-display text-xl mb-3">{s.title}</h3>
                <p className="text-sm text-porcelain/60 leading-relaxed">{s.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
      <ApertureDivider />
    </section>
  )
}
