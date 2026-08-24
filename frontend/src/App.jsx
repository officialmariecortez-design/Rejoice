import { useEffect, useState } from 'react'
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

export default function App() {
  const isAdminRoute = window.location.pathname.replace(/\/+$/, '') === '/admin'
  const [content, setContent] = useState(FALLBACK_CONTENT)
  const [loading, setLoading] = useState(!isAdminRoute)

  useEffect(() => {
    if (isAdminRoute) return
    fetchSiteContent().then((value) => {
      setContent(value)
      if (value?.brand?.pageTitle) document.title = value.brand.pageTitle
      if (value?.brand?.metaDescription) {
        let meta = document.querySelector('meta[name="description"]')
        if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta) }
        meta.content = value.brand.metaDescription
      }
      setLoading(false)
    })
  }, [isAdminRoute])

  if (isAdminRoute) return <Admin />
  if (loading) return <div className="min-h-screen bg-ink text-porcelain flex items-center justify-center"><span className="eyebrow text-brass">Loading studio…</span></div>

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
