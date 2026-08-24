import { Component, useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import About from './components/About'
import Booking from './components/Booking'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Admin from './Admin'
import { FALLBACK_CONTENT, fetchSiteContent } from './lib/content'

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  render() {
    if (!this.state.error) return this.props.children
    return (
      <main className="min-h-screen bg-ink text-porcelain px-6 py-16 flex items-center justify-center">
        <div className="max-w-xl rounded-2xl border border-red-400/20 bg-ink2 p-8">
          <p className="eyebrow text-brass">Liora Media</p>
          <h1 className="mt-3 font-display text-3xl">The site encountered an error</h1>
          <p className="mt-4 text-fog">The application loaded, but a frontend component failed to render.</p>
          <pre className="mt-5 overflow-auto rounded-lg bg-black/30 p-4 text-xs text-red-200">{String(this.state.error?.message || this.state.error)}</pre>
          <button onClick={() => window.location.reload()} className="mt-6 rounded-lg bg-brass px-4 py-2 font-medium text-ink">Reload</button>
        </div>
      </main>
    )
  }
}

function PublicSite() {
  const [content, setContent] = useState(FALLBACK_CONTENT)

  useEffect(() => {
    let active = true
    fetchSiteContent().then((value) => {
      if (!active || !value) return
      setContent(value)
      if (value?.brand?.pageTitle) document.title = value.brand.pageTitle
      if (value?.brand?.metaDescription) {
        let meta = document.querySelector('meta[name="description"]')
        if (!meta) {
          meta = document.createElement('meta')
          meta.name = 'description'
          document.head.appendChild(meta)
        }
        meta.content = value.brand.metaDescription
      }
    })
    return () => { active = false }
  }, [])

  return (
    <div className="relative">
      <div className="grain" aria-hidden="true" />
      <Navbar content={content} />
      <main>
        <Hero content={content.hero} />
        <Services services={content.services} />
        <Portfolio content={content.portfolio} />
        <About content={content.about} />
        <Booking services={content.services} />
        <Contact content={content.contact} />
      </main>
      <Footer content={{ ...content.footer, brand: content.brand, nav: content.nav }} />
    </div>
  )
}

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  return <AppErrorBoundary>{path === '/admin' ? <Admin /> : <PublicSite />}</AppErrorBoundary>
}
