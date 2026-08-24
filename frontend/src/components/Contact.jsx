import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Loader2, MapPin, Mail, Phone, Instagram } from 'lucide-react'
import { submitContact } from '../lib/api'

const initialForm = { name: '', email: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      await submitContact(form)
      setStatus('success')
      setForm(initialForm)
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message)
    }
  }

  return (
    <section id="contact" className="py-28 px-6 md:px-10 bg-ink">
      <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-14">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="md:col-span-2"
        >
          <span className="eyebrow text-brass">Get In Touch</span>
          <h2 className="font-display font-medium text-4xl mt-4 mb-8">Let's talk media.</h2>
          <div className="space-y-5 text-porcelain/70 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 mt-0.5 text-brass shrink-0" />
              <span>12 Aperture Lane, Victoria Island, Lagos, Nigeria</span>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 mt-0.5 text-brass shrink-0" />
              <span>hello@liora.media</span>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 mt-0.5 text-brass shrink-0" />
              <span>+234 800 000 0000</span>
            </div>
            <div className="flex items-start gap-3">
              <Instagram className="w-4 h-4 mt-0.5 text-brass shrink-0" />
              <span>@lioramedia</span>
            </div>
          </div>
          <p className="text-xs text-fog mt-8 leading-relaxed">
            Placeholder studio details — update these with Liora Media's real address, contact
            info and socials.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="md:col-span-3 flex flex-col gap-6"
        >
          <label className="flex flex-col gap-2">
            <span className="eyebrow text-fog">Name</span>
            <input
              required
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className="input"
              placeholder="Your name"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="eyebrow text-fog">Email</span>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              className="input"
              placeholder="you@example.com"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="eyebrow text-fog">Message</span>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => update('message', e.target.value)}
              className="input resize-none"
              placeholder="How can we help?"
            />
          </label>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <AnimatePresence mode="wait">
              {status === 'success' && (
                <motion.span
                  key="success"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-sm text-brass"
                >
                  <Check className="w-4 h-4" /> Message sent — thank you.
                </motion.span>
              )}
              {status === 'error' && (
                <motion.span
                  key="error"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-signal"
                >
                  {errorMsg}
                </motion.span>
              )}
              {status === 'idle' && <span />}
            </AnimatePresence>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="eyebrow border border-brass text-brass px-8 py-3.5 hover:bg-brass hover:text-ink transition-colors duration-300 disabled:opacity-60 flex items-center gap-2"
            >
              {status === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
              {status === 'loading' ? 'Sending…' : 'Send Message'}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  )
}
