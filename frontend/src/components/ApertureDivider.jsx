import { motion } from 'framer-motion'

export default function ApertureDivider({ flip = false }) {
  return (
    <div className={`flex items-center justify-center py-10 ${flip ? 'rotate-180' : ''}`}>
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.path
            key={i}
            d={bladePath(i)}
            fill="none"
            stroke="#C9A227"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.7 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: i * 0.06, ease: 'easeInOut' }}
          />
        ))}
        <motion.circle
          cx="28"
          cy="28"
          r="3"
          fill="#C9A227"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.4 }}
        />
      </svg>
    </div>
  )
}

// Generates 6 simple radial blade lines to suggest an aperture iris
function bladePath(i) {
  const angle = (i * 60 * Math.PI) / 180
  const cx = 28,
    cy = 28,
    r1 = 10,
    r2 = 24
  const x1 = cx + r1 * Math.cos(angle)
  const y1 = cy + r1 * Math.sin(angle)
  const x2 = cx + r2 * Math.cos(angle)
  const y2 = cy + r2 * Math.sin(angle)
  return `M ${x1} ${y1} L ${x2} ${y2}`
}
