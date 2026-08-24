import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, CheckCircle2, Clock3, LogOut, Mail, RefreshCw, ShieldCheck, XCircle } from 'lucide-react'

const STATUSES = ['pending', 'confirmed', 'declined', 'completed']
const KEY_STORAGE = 'liora_admin_key'

async function adminFetch(path, key, options = {}) {
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    'x-admin-key': key,
    'Authorization': `Bearer ${key}`,
    ...(options.headers || {}),
  }
  const res = await fetch(path, { ...options, headers })
  let data = null
  try { data = await res.json() } catch {}
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`)
  return data
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString()
}

function StatusBadge({ status }) {
  const classes = {
    pending: 'border-yellow-400/30 text-yellow-200 bg-yellow-400/10',
    confirmed: 'border-emerald-400/30 text-emerald-200 bg-emerald-400/10',
    declined: 'border-red-400/30 text-red-200 bg-red-400/10',
    completed: 'border-sky-400/30 text-sky-200 bg-sky-400/10',
  }
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs capitalize ${classes[status] || classes.pending}`}>{status || 'pending'}</span>
}

export default function Admin() {
  const [key, setKey] = useState(() => sessionStorage.getItem(KEY_STORAGE) || '')
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [bookings, setBookings] = useState([])
  const [contacts, setContacts] = useState([])
  const [tab, setTab] = useState('bookings')

  const pendingCount = useMemo(() => bookings.filter((item) => item.status === 'pending').length, [bookings])

  async function loadDashboard(adminKey = key) {
    if (!adminKey) return
    setLoading(true)
    setError('')
    try {
      const [bookingData, contactData] = await Promise.all([
        adminFetch('/api/bookings', adminKey),
        adminFetch('/api/contact', adminKey),
      ])
      setBookings(Array.isArray(bookingData) ? bookingData : [])
      setContacts(Array.isArray(contactData) ? contactData : [])
      setAuthenticated(true)
      sessionStorage.setItem(KEY_STORAGE, adminKey)
    } catch (err) {
      setAuthenticated(false)
      sessionStorage.removeItem(KEY_STORAGE)
      setError(err.message || 'Unable to authenticate.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (key) loadDashboard(key)
    // Authentication is intentionally attempted once for a key already saved in this browser.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function logout() {
    sessionStorage.removeItem(KEY_STORAGE)
    setKey('')
    setAuthenticated(false)
    setBookings([])
    setContacts([])
    setError('')
  }

  async function updateStatus(id, status) {
    try {
      await adminFetch(`/api/bookings/${id}`, key, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      setBookings((items) => items.map((item) => item.id === id ? { ...item, status } : item))
    } catch (err) {
      setError(err.message || 'Unable to update booking.')
    }
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-ink text-porcelain px-6 py-12 md:py-20">
        <div className="mx-auto max-w-md">
          <a href="/" className="mb-10 inline-flex items-center gap-2 text-sm text-fog hover:text-brass transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Liora Media
          </a>
          <div className="rounded-2xl border border-brass/20 bg-ink2 p-7 md:p-9 shadow-2xl">
            <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-full border border-brass/30 bg-brass/10">
              <ShieldCheck className="h-6 w-6 text-brass" />
            </div>
            <p className="eyebrow text-brass">Private area</p>
            <h1 className="mt-2 font-display text-3xl">Admin dashboard</h1>
            <p className="mt-3 text-sm leading-6 text-fog">Enter the private admin key configured in Vercel. It is kept in this browser session only.</p>
            <form onSubmit={(event) => { event.preventDefault(); loadDashboard(key.trim()) }} className="mt-7 space-y-4">
              <label className="block text-sm text-porcelain/80">
                Admin key
                <input
                  className="input mt-2 w-full rounded-lg"
                  type="password"
                  autoComplete="current-password"
                  value={key}
                  onChange={(event) => setKey(event.target.value)}
                  placeholder="Enter admin key"
                  required
                />
              </label>
              {error && <p className="rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
              <button disabled={loading} className="w-full rounded-lg bg-brass px-4 py-3 font-medium text-ink transition hover:opacity-90 disabled:opacity-50">
                {loading ? 'Checking…' : 'Open dashboard'}
              </button>
            </form>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-ink text-porcelain">
      <header className="border-b border-brass/10 bg-ink2 px-6 py-5 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="eyebrow text-brass">Liora Media</p>
            <h1 className="mt-1 font-display text-2xl md:text-3xl">Admin dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => loadDashboard()} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border border-brass/20 px-3 py-2 text-sm text-fog hover:text-porcelain disabled:opacity-50">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button onClick={logout} className="inline-flex items-center gap-2 rounded-lg border border-brass/20 px-3 py-2 text-sm text-fog hover:text-porcelain">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        {error && <div className="mb-6 rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{error}</div>}

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-brass/10 bg-ink2 p-5"><p className="text-sm text-fog">Bookings</p><p className="mt-1 text-3xl font-semibold">{bookings.length}</p></div>
          <div className="rounded-xl border border-brass/10 bg-ink2 p-5"><p className="text-sm text-fog">Pending</p><p className="mt-1 text-3xl font-semibold">{pendingCount}</p></div>
          <div className="rounded-xl border border-brass/10 bg-ink2 p-5"><p className="text-sm text-fog">Messages</p><p className="mt-1 text-3xl font-semibold">{contacts.length}</p></div>
        </div>

        <div className="mb-5 flex gap-2 border-b border-brass/10">
          <button onClick={() => setTab('bookings')} className={`px-4 py-3 text-sm ${tab === 'bookings' ? 'border-b-2 border-brass text-brass' : 'text-fog'}`}>Bookings</button>
          <button onClick={() => setTab('contacts')} className={`px-4 py-3 text-sm ${tab === 'contacts' ? 'border-b-2 border-brass text-brass' : 'text-fog'}`}>Messages</button>
        </div>

        {tab === 'bookings' ? (
          <section className="space-y-4">
            {bookings.length === 0 && <EmptyState icon={Clock3} text="No bookings yet." />}
            {bookings.map((booking) => (
              <article key={booking.id} className="rounded-xl border border-brass/10 bg-ink2 p-5 md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3"><h2 className="text-lg font-medium">{booking.name}</h2><StatusBadge status={booking.status} /></div>
                    <p className="mt-2 text-sm text-fog">{booking.email}{booking.phone ? ` · ${booking.phone}` : ''}</p>
                    <p className="mt-3 text-sm"><strong>{booking.service}</strong> · {booking.date}{booking.time ? ` at ${booking.time}` : ''}</p>
                    {booking.message && <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-porcelain/70">{booking.message}</p>}
                    <p className="mt-3 text-xs text-fog">Submitted {formatDate(booking.created_at)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map((status) => <button key={status} onClick={() => updateStatus(booking.id, status)} disabled={booking.status === status} className="rounded-md border border-brass/20 px-3 py-2 text-xs capitalize text-fog hover:text-porcelain disabled:opacity-40">{status}</button>)}
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="space-y-4">
            {contacts.length === 0 && <EmptyState icon={Mail} text="No messages yet." />}
            {contacts.map((contact) => (
              <article key={contact.id} className="rounded-xl border border-brass/10 bg-ink2 p-5 md:p-6">
                <div className="flex items-start gap-3"><Mail className="mt-1 h-5 w-5 shrink-0 text-brass" /><div><h2 className="font-medium">{contact.name}</h2><p className="text-sm text-fog">{contact.email}</p><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-porcelain/80">{contact.message}</p><p className="mt-3 text-xs text-fog">Received {formatDate(contact.created_at)}</p></div></div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  )
}

function EmptyState({ icon: Icon, text }) {
  return <div className="rounded-xl border border-dashed border-brass/15 bg-ink2 p-10 text-center text-fog"><Icon className="mx-auto mb-3 h-6 w-6 text-brass" /><p>{text}</p></div>
}
