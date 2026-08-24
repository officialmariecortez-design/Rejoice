import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, CheckCircle2, Clock3, LogOut, Mail, RefreshCw, Save, ShieldCheck } from 'lucide-react'
import { FALLBACK_CONTENT } from './lib/content'

const STATUSES = ['pending', 'confirmed', 'declined', 'completed']
const KEY_STORAGE = 'liora_admin_key'

async function adminFetch(path, key, options = {}) {
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    'x-admin-key': key,
    Authorization: `Bearer ${key}`,
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
  const classes = { pending: 'border-yellow-400/30 text-yellow-200 bg-yellow-400/10', confirmed: 'border-emerald-400/30 text-emerald-200 bg-emerald-400/10', declined: 'border-red-400/30 text-red-200 bg-red-400/10', completed: 'border-sky-400/30 text-sky-200 bg-sky-400/10' }
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs capitalize ${classes[status] || classes.pending}`}>{status || 'pending'}</span>
}

const fieldClass = 'input mt-2 w-full rounded-lg'
function TextField({ label, value, onChange, textarea = false }) {
  return <label className="block text-sm text-porcelain/80">{label}{textarea ? <textarea className={`${fieldClass} min-h-28 resize-y`} value={value || ''} onChange={e => onChange(e.target.value)} /> : <input className={fieldClass} value={value || ''} onChange={e => onChange(e.target.value)} />}</label>
}

function updatePath(setContent, path, value) {
  setContent(current => {
    const next = structuredClone(current)
    let target = next
    path.slice(0, -1).forEach(key => { target = target[key] })
    target[path[path.length - 1]] = value
    return next
  })
}

export default function Admin() {
  const [key, setKey] = useState(() => sessionStorage.getItem(KEY_STORAGE) || '')
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [bookings, setBookings] = useState([])
  const [contacts, setContacts] = useState([])
  const [content, setContent] = useState(FALLBACK_CONTENT)
  const [tab, setTab] = useState('content')

  const pendingCount = useMemo(() => bookings.filter(item => item.status === 'pending').length, [bookings])

  async function loadDashboard(adminKey = key) {
    if (!adminKey) return
    setLoading(true); setError(''); setNotice('')
    try {
      const [bookingData, contactData, contentData] = await Promise.all([
        adminFetch('/api/bookings', adminKey),
        adminFetch('/api/contact', adminKey),
        adminFetch('/api/content', adminKey),
      ])
      setBookings(Array.isArray(bookingData) ? bookingData : [])
      setContacts(Array.isArray(contactData) ? contactData : [])
      setContent(contentData || FALLBACK_CONTENT)
      setAuthenticated(true)
      sessionStorage.setItem(KEY_STORAGE, adminKey)
    } catch (err) {
      setAuthenticated(false); sessionStorage.removeItem(KEY_STORAGE); setError(err.message || 'Unable to authenticate.')
    } finally { setLoading(false) }
  }

  useEffect(() => { if (key) loadDashboard(key) }, [])

  function logout() { sessionStorage.removeItem(KEY_STORAGE); setKey(''); setAuthenticated(false); setBookings([]); setContacts([]); setError('') }

  async function saveContent() {
    setSaving(true); setError(''); setNotice('')
    try { await adminFetch('/api/content', key, { method: 'PUT', body: JSON.stringify({ content }) }); setNotice('Website content saved successfully.'); setTimeout(() => setNotice(''), 3500) }
    catch (err) { setError(err.message || 'Unable to save website content.') }
    finally { setSaving(false) }
  }

  async function updateStatus(id, status) {
    try {
      await adminFetch(`/api/bookings/${id}`, key, { method: 'PATCH', body: JSON.stringify({ status }) })
      setBookings(items => items.map(item => item.id === id ? { ...item, status } : item))
    } catch (err) { setError(err.message || 'Unable to update booking.') }
  }

  if (!authenticated) return (
    <main className="min-h-screen bg-ink text-porcelain px-6 py-12 md:py-20"><div className="mx-auto max-w-md">
      <a href="/" className="mb-10 inline-flex items-center gap-2 text-sm text-fog hover:text-brass transition-colors"><ArrowLeft className="h-4 w-4" /> Back to Liora Media</a>
      <div className="rounded-2xl border border-brass/20 bg-ink2 p-7 md:p-9 shadow-2xl">
        <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-full border border-brass/30 bg-brass/10"><ShieldCheck className="h-6 w-6 text-brass" /></div>
        <p className="eyebrow text-brass">Private area</p><h1 className="mt-2 font-display text-3xl">Website manager</h1>
        <p className="mt-3 text-sm leading-6 text-fog">Manage the public website, bookings and messages. Your admin key stays in this browser session.</p>
        <form onSubmit={e => { e.preventDefault(); loadDashboard(key.trim()) }} className="mt-7 space-y-4">
          <TextField label="Admin key" value={key} onChange={setKey} /><input type="hidden" autoComplete="username" />
          {error && <p className="rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
          <button disabled={loading} className="w-full rounded-lg bg-brass px-4 py-3 font-medium text-ink transition hover:opacity-90 disabled:opacity-50">{loading ? 'Checking…' : 'Open manager'}</button>
        </form>
      </div>
    </div></main>
  )

  return <main className="min-h-screen bg-ink text-porcelain">
    <header className="border-b border-brass/10 bg-ink2 px-6 py-5 md:px-10"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4"><div><p className="eyebrow text-brass">Liora Media</p><h1 className="mt-1 font-display text-2xl md:text-3xl">Website manager</h1></div><div className="flex items-center gap-2"><button onClick={() => loadDashboard()} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border border-brass/20 px-3 py-2 text-sm text-fog hover:text-porcelain disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh</button><button onClick={logout} className="inline-flex items-center gap-2 rounded-lg border border-brass/20 px-3 py-2 text-sm text-fog hover:text-porcelain"><LogOut className="h-4 w-4" /> Logout</button></div></div></header>
    <div className="mx-auto max-w-7xl px-6 py-8 md:px-10">
      {error && <div className="mb-5 rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{error}</div>}
      {notice && <div className="mb-5 flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-200"><CheckCircle2 className="h-4 w-4" />{notice}</div>}
      <div className="mb-7 grid gap-4 sm:grid-cols-3"><div className="rounded-xl border border-brass/10 bg-ink2 p-5"><p className="text-sm text-fog">Bookings</p><p className="mt-1 text-3xl font-semibold">{bookings.length}</p></div><div className="rounded-xl border border-brass/10 bg-ink2 p-5"><p className="text-sm text-fog">Pending</p><p className="mt-1 text-3xl font-semibold">{pendingCount}</p></div><div className="rounded-xl border border-brass/10 bg-ink2 p-5"><p className="text-sm text-fog">Messages</p><p className="mt-1 text-3xl font-semibold">{contacts.length}</p></div></div>
      <div className="mb-6 flex flex-wrap gap-2 border-b border-brass/10"><button onClick={() => setTab('content')} className={`px-4 py-3 text-sm ${tab === 'content' ? 'border-b-2 border-brass text-brass' : 'text-fog'}`}>Website Content</button><button onClick={() => setTab('bookings')} className={`px-4 py-3 text-sm ${tab === 'bookings' ? 'border-b-2 border-brass text-brass' : 'text-fog'}`}>Bookings</button><button onClick={() => setTab('contacts')} className={`px-4 py-3 text-sm ${tab === 'contacts' ? 'border-b-2 border-brass text-brass' : 'text-fog'}`}>Messages</button></div>
      {tab === 'content' ? <ContentEditor content={content} setContent={setContent} saveContent={saveContent} saving={saving} /> : tab === 'bookings' ? <Bookings bookings={bookings} updateStatus={updateStatus} /> : <Contacts contacts={contacts} />}
    </div>
  </main>
}

function ContentEditor({ content, setContent, saveContent, saving }) {
  const c = content
  const set = (path, value) => updatePath(setContent, path, value)
  function addService() { setContent(x => ({ ...x, services: [...(x.services || []), { code: 'ƒ/', title: 'New Service', desc: 'Describe this service.' }] })) }
  function removeService(i) { setContent(x => ({ ...x, services: x.services.filter((_, idx) => idx !== i) })) }
  function addPortfolio() { setContent(x => ({ ...x, portfolio: { ...x.portfolio, items: [...(x.portfolio?.items || []), { src: '', title: 'New Project', tag: 'Portfolio' }] } })) }
  function removePortfolio(i) { setContent(x => ({ ...x, portfolio: { ...x.portfolio, items: x.portfolio.items.filter((_, idx) => idx !== i) } })) }
  return <div className="space-y-6">
    <div className="sticky top-0 z-20 -mx-6 border-b border-brass/10 bg-ink/95 px-6 py-4 backdrop-blur md:-mx-10 md:px-10"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4"><div><p className="text-sm text-fog">Changes are saved to Supabase and appear on the public site after refresh.</p></div><button onClick={saveContent} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-brass px-5 py-2.5 text-sm font-medium text-ink disabled:opacity-50"><Save className="h-4 w-4" />{saving ? 'Saving…' : 'Save Changes'}</button></div></div>
    <section className="rounded-xl border border-brass/10 bg-ink2 p-6"><h2 className="font-display text-2xl">Brand & SEO</h2><div className="mt-5 grid gap-5 md:grid-cols-2"><TextField label="Brand name" value={c.brand?.name} onChange={v => set(['brand','name'], v)} /><TextField label="Accent name" value={c.brand?.accent} onChange={v => set(['brand','accent'], v)} /><TextField label="Browser title" value={c.brand?.pageTitle} onChange={v => set(['brand','pageTitle'], v)} /><TextField label="Meta description" value={c.brand?.metaDescription} onChange={v => set(['brand','metaDescription'], v)} textarea /></div></section>
    <section className="rounded-xl border border-brass/10 bg-ink2 p-6"><h2 className="font-display text-2xl">Hero</h2><div className="mt-5 grid gap-5 md:grid-cols-2"><TextField label="Eyebrow" value={c.hero?.eyebrow} onChange={v => set(['hero','eyebrow'], v)} /><TextField label="Main title" value={c.hero?.title} onChange={v => set(['hero','title'], v)} /><TextField label="Accent title" value={c.hero?.accentTitle} onChange={v => set(['hero','accentTitle'], v)} /><TextField label="Ending" value={c.hero?.titleEnd} onChange={v => set(['hero','titleEnd'], v)} /><TextField label="Description" value={c.hero?.description} onChange={v => set(['hero','description'], v)} textarea /><TextField label="Primary button" value={c.hero?.primaryLabel} onChange={v => set(['hero','primaryLabel'], v)} /><TextField label="Primary link" value={c.hero?.primaryHref} onChange={v => set(['hero','primaryHref'], v)} /><TextField label="Secondary button" value={c.hero?.secondaryLabel} onChange={v => set(['hero','secondaryLabel'], v)} /><TextField label="Secondary link" value={c.hero?.secondaryHref} onChange={v => set(['hero','secondaryHref'], v)} /></div></section>
    <section className="rounded-xl border border-brass/10 bg-ink2 p-6"><h2 className="font-display text-2xl">About & statistics</h2><div className="mt-5 space-y-5"><TextField label="Eyebrow" value={c.about?.eyebrow} onChange={v => set(['about','eyebrow'], v)} /><TextField label="Heading" value={c.about?.title} onChange={v => set(['about','title'], v)} /><TextField label="Paragraph 1" value={c.about?.paragraphs?.[0]} onChange={v => set(['about','paragraphs',0], v)} textarea /><TextField label="Paragraph 2" value={c.about?.paragraphs?.[1]} onChange={v => set(['about','paragraphs',1], v)} textarea /><div className="grid gap-4 md:grid-cols-3">{(c.about?.stats || []).map((s,i) => <div key={i} className="rounded-lg border border-brass/10 p-4"><TextField label={`Stat ${i+1} value`} value={s.value} onChange={v => set(['about','stats',i,'value'],v)} /><div className="mt-4"><TextField label="Label" value={s.label} onChange={v => set(['about','stats',i,'label'],v)} /></div></div>)}</div></div></section>
    <section className="rounded-xl border border-brass/10 bg-ink2 p-6"><div className="flex items-center justify-between gap-4"><div><h2 className="font-display text-2xl">Services</h2><p className="mt-1 text-sm text-fog">These also populate the booking service selector.</p></div><button onClick={addService} className="rounded-lg border border-brass/30 px-4 py-2 text-sm text-brass">Add Service</button></div><div className="mt-5 space-y-4">{(c.services || []).map((s,i) => <div key={i} className="grid gap-4 rounded-lg border border-brass/10 p-4 md:grid-cols-[100px_1fr_1fr_auto] md:items-end"><TextField label="Code" value={s.code} onChange={v=>set(['services',i,'code'],v)} /><TextField label="Title" value={s.title} onChange={v=>set(['services',i,'title'],v)} /><TextField label="Description" value={s.desc} onChange={v=>set(['services',i,'desc'],v)} /><button onClick={()=>removeService(i)} className="rounded-lg border border-red-400/20 px-3 py-2 text-sm text-red-200">Remove</button></div>)}</div></section>
    <section className="rounded-xl border border-brass/10 bg-ink2 p-6"><div className="flex items-center justify-between gap-4"><div><h2 className="font-display text-2xl">Portfolio</h2><p className="mt-1 text-sm text-fog">Use public image URLs for now. Storage uploads can be added next.</p></div><button onClick={addPortfolio} className="rounded-lg border border-brass/30 px-4 py-2 text-sm text-brass">Add Project</button></div><div className="mt-5 grid gap-4 md:grid-cols-2">{(c.portfolio?.items || []).map((item,i) => <div key={i} className="rounded-lg border border-brass/10 p-4 space-y-4"><TextField label="Image URL" value={item.src} onChange={v=>set(['portfolio','items',i,'src'],v)} /><TextField label="Title" value={item.title} onChange={v=>set(['portfolio','items',i,'title'],v)} /><TextField label="Category" value={item.tag} onChange={v=>set(['portfolio','items',i,'tag'],v)} /><button onClick={()=>removePortfolio(i)} className="rounded-lg border border-red-400/20 px-3 py-2 text-sm text-red-200">Remove</button></div>)}</div><div className="mt-5 grid gap-5 md:grid-cols-3"><TextField label="Eyebrow" value={c.portfolio?.eyebrow} onChange={v=>set(['portfolio','eyebrow'],v)} /><TextField label="Heading" value={c.portfolio?.title} onChange={v=>set(['portfolio','title'],v)} /><TextField label="Description" value={c.portfolio?.description} onChange={v=>set(['portfolio','description'],v)} textarea /></div></section>
    <section className="rounded-xl border border-brass/10 bg-ink2 p-6"><h2 className="font-display text-2xl">Contact & footer</h2><div className="mt-5 grid gap-5 md:grid-cols-2"><TextField label="Contact eyebrow" value={c.contact?.eyebrow} onChange={v=>set(['contact','eyebrow'],v)} /><TextField label="Contact heading" value={c.contact?.title} onChange={v=>set(['contact','title'],v)} /><TextField label="Address" value={c.contact?.address} onChange={v=>set(['contact','address'],v)} /><TextField label="Email" value={c.contact?.email} onChange={v=>set(['contact','email'],v)} /><TextField label="Phone" value={c.contact?.phone} onChange={v=>set(['contact','phone'],v)} /><TextField label="Instagram" value={c.contact?.instagram} onChange={v=>set(['contact','instagram'],v)} /><TextField label="Instagram URL" value={c.contact?.instagramUrl} onChange={v=>set(['contact','instagramUrl'],v)} /><TextField label="Contact note" value={c.contact?.note} onChange={v=>set(['contact','note'],v)} textarea /><TextField label="Footer copyright" value={c.footer?.copyright} onChange={v=>set(['footer','copyright'],v)} /><TextField label="Admin link label" value={c.footer?.adminLabel} onChange={v=>set(['footer','adminLabel'],v)} /></div></section>
  </div>
}

function Bookings({ bookings, updateStatus }) { return <section className="space-y-4">{bookings.length === 0 && <EmptyState icon={Clock3} text="No bookings yet." />}{bookings.map(booking => <article key={booking.id} className="rounded-xl border border-brass/10 bg-ink2 p-5 md:p-6"><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><div className="flex flex-wrap items-center gap-3"><h2 className="text-lg font-medium">{booking.name}</h2><StatusBadge status={booking.status} /></div><p className="mt-2 text-sm text-fog">{booking.email}{booking.phone ? ` · ${booking.phone}` : ''}</p><p className="mt-3 text-sm"><strong>{booking.service}</strong> · {booking.date}{booking.time ? ` at ${booking.time}` : ''}</p>{booking.message && <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-porcelain/70">{booking.message}</p>}<p className="mt-3 text-xs text-fog">Submitted {formatDate(booking.created_at)}</p></div><div className="flex flex-wrap gap-2">{STATUSES.map(status => <button key={status} onClick={()=>updateStatus(booking.id,status)} disabled={booking.status===status} className="rounded-md border border-brass/20 px-3 py-2 text-xs capitalize text-fog hover:text-porcelain disabled:opacity-40">{status}</button>)}</div></div></article>)}</section> }
function Contacts({ contacts }) { return <section className="space-y-4">{contacts.length === 0 && <EmptyState icon={Mail} text="No messages yet." />}{contacts.map(contact => <article key={contact.id} className="rounded-xl border border-brass/10 bg-ink2 p-5 md:p-6"><div className="flex items-start gap-3"><Mail className="mt-1 h-5 w-5 shrink-0 text-brass" /><div><h2 className="font-medium">{contact.name}</h2><p className="text-sm text-fog">{contact.email}</p><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-porcelain/80">{contact.message}</p><p className="mt-3 text-xs text-fog">Received {formatDate(contact.created_at)}</p></div></div></article>)}</section> }
function EmptyState({ icon: Icon, text }) { return <div className="rounded-xl border border-dashed border-brass/15 bg-ink2 p-10 text-center text-fog"><Icon className="mx-auto mb-3 h-6 w-6 text-brass" /><p>{text}</p></div> }
