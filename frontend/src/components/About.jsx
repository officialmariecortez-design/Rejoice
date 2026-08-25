import { motion } from 'framer-motion'
import { teamStrip } from '../lib/images'
import ApertureDivider from './ApertureDivider'
import SafeImage from './SafeImage'

export default function About({ content }) {
  const c = content || {}
  const stats = c.stats || []
  return (
    <section id="about" className="py-28 px-6 md:px-10 bg-ink">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <span className="eyebrow text-brass">{c.eyebrow || 'The Studio'}</span>
          <h2 className="font-display font-medium text-4xl md:text-5xl mt-4 mb-6 leading-tight">
            {c.title || 'A small team, held to a high shutter speed.'}
          </h2>
          <p className="text-porcelain/65 leading-relaxed mb-6">
            {c.paragraphs?.[0]}
          </p>
          <p className="text-porcelain/65 leading-relaxed mb-10">
            {c.paragraphs?.[1]}
          </p>

          <div className="grid grid-cols-3 gap-6 border-t border-brass/15 pt-8">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-3xl text-brass">{s.value}</div>
                <div className="text-xs text-porcelain/50 mt-2 leading-snug">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-3 gap-4 h-56 sm:h-72 md:h-[420px]"
        >
          {teamStrip.map((src, i) => (
            <motion.div
              key={src}
              className={`relative overflow-hidden rounded-sm ${i === 1 ? 'mt-10' : ''}`}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.4 }}
            >
              <SafeImage src={src} alt="Liora Media team member at work" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 border border-brass/10" />
            </motion.div>
          ))}
        </motion.div>
      </div>
      <ApertureDivider flip />
    </section>
  )
}
