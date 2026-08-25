import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'
import { submitBooking } from '../lib/api'

const FALLBACK_SERVICE_OPTIONS = ['Studio Photo Session', 'Camera / Lens Rental', 'Lighting & Grip Rental', 'Campaign or Program Booking', 'Videography / Cinematography', 'Podcast Studio Rental', 'Other']

function makeInitialForm(defaultService) {
  return {
    name: '',
    email: '',
    phone: '',
    service: defaultService,
    date: '',
    time: '',
    message: '',
  }
}

export default function Booking({ services = [] }) {
  const serviceOptions = services.length ? services.map((s) => s.title) : FALLBACK_SERVICE_OPTIONS
  const [form, setForm] = useState(() => makeInitialForm(serviceOptions[0]))
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      await submitBooking(form)
      setStatus('success')
      setForm(makeInitialForm(serviceOptions[0]))
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message)
    }
  }

  return (
    <section id="booking" className="py-28 px-6 md:px-10 bg-ink2">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="eyebrow text-brass">Reserve Your Slot</span>
          <h2 className="font-display font-medium text-4xl md:text-5xl mt-4">Book a Session</h2>
          <p className="text-porcelain/60 mt-4 max-w-xl mx-auto">
            Studio time, camera and equipment rentals, or a full campaign crew — tell us what you
            need and preferred dates, and we'll confirm availability.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="grid sm:grid-cols-2 gap-6 border border-brass/15 p-8 md:p-10 bg-ink"
        >
          <Field label="Full Name">
            <input
              required
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className="input"
              placeholder="Jane Doe"
            />
          </Field>
          <Field label="Email">
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              className="input"
              placeholder="jane@studio.com"
            />
          </Field>
          <Field label="Phone">
            <input
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              className="input"
              placeholder="+234 800 000 0000"
            />
          </Field>
          <Field label="Service">
            <select
              value={form.service}
              onChange={(e) => update('service', e.target.value)}
              className="input"
            >
              {serviceOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Preferred Date">
            <input
              required
              type="date"
              value={form.date}
              onChange={(e) => update('date', e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Preferred Time">
            <input
              type="time"
              value={form.time}
              onChange={(e) => update('time', e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Project Details" full>
            <textarea
              rows={4}
              value={form.message}
              onChange={(e) => update('message', e.target.value)}
              className="input resize-none"
              placeholder="Tell us about the shoot, campaign or equipment you need…"
            />
          </Field>

          <div className="sm:col-span-2 flex items-center justify-between flex-wrap gap-4 pt-2">
            <AnimatePresence mode="wait">
              {status === 'success' && (
                <motion.span
                  key="success"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-sm text-brass"
                >
                  <Check className="w-4 h-4" /> Booking request sent — we'll be in touch shortly.
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
              className="eyebrow bg-brass text-ink px-8 py-3.5 hover:bg-porcelain transition-colors duration-300 disabled:opacity-60 flex items-center gap-2"
            >
              {status === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
              {status === 'loading' ? 'Sending…' : 'Submit Booking'}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  )
}

function Field({ label, children, full }) {
  return (
    <label className={`flex flex-col gap-2 ${full ? 'sm:col-span-2' : ''}`}>
      <span className="eyebrow text-fog">{label}</span>
      {children}
    </label>
  )
}
