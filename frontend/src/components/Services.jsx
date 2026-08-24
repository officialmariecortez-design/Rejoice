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

const ICONS = [PenTool, Camera, Aperture, Package, Users, Film, Sparkles, Radio, Video]


export default function Services({ services = [] }) {
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
          {services.map((s, i) => {
            const Icon = ICONS[i % ICONS.length]
            return (
              <motion.div
                key={`${i}-${s.title}`}
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
