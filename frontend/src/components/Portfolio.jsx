import { motion } from 'framer-motion'
import { portfolioItems } from '../lib/images'

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-28 px-6 md:px-10 bg-ink2">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
        >
          <div>
            <span className="eyebrow text-brass">Selected Work</span>
            <h2 className="font-display font-medium text-4xl md:text-5xl mt-4">The Portfolio</h2>
          </div>
          <p className="max-w-sm text-porcelain/60 text-sm leading-relaxed">
            A cross-section of design, photography and campaign work produced in and out of the
            studio.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.1 }}
              className={`group relative overflow-hidden rounded-sm ${
                i === 0 ? 'sm:col-span-2 sm:row-span-2 aspect-square sm:aspect-auto' : 'aspect-[4/5]'
              }`}
            >
              <img
                src={item.src}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 p-6 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <span className="eyebrow text-brass">{item.tag}</span>
                <h3 className="font-display text-xl mt-2">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
