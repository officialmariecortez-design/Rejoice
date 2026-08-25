import { supabaseRequest, handleDatabaseError } from './_db.js'
import { isAdmin, unauthorized } from './_lib/requireAdmin.js'

const DEFAULT_CONTENT = {
  brand: { name: 'Liora', accent: 'Media', pageTitle: 'Liora Media', metaDescription: 'Creative studio for design, photography, film and media production.' },
  hero: {
    eyebrow: 'ƒ/ Studio · Photography · Media Production',
    title: 'Every frame,',
    accentTitle: 'deliberately',
    titleEnd: 'made.',
    description: 'Liora Media is a full-service creative studio — design, photography, film and the equipment behind every great campaign, under one roof.',
    primaryLabel: 'Book a Session', primaryHref: '#booking', secondaryLabel: 'See the Work', secondaryHref: '#portfolio'
  },
  about: {
    eyebrow: 'The Studio', title: 'A small team, held to a high shutter speed.',
    paragraphs: [
      'Liora Media was built for brands and creators who need more than one vendor to pull off a campaign. Our designers, photographers and producers work from the same studio, share the same equipment room, and hold every deliverable to the same standard — whether it\'s a single portrait or a full program rollout.',
      'Behind every session is gear we maintain ourselves, a studio we know inside out, and a crew that\'s shot enough campaigns to know exactly what a brief actually needs.'
    ],
    stats: [
      { value: '9+', label: 'Services Under One Studio' },
      { value: '240+', label: 'Campaigns Delivered' },
      { value: '15', label: 'Rental Kits On Standby' }
    ]
  },
  services: [
    { code: 'ƒ/1.4', title: 'Graphic Design & Branding', desc: 'Identity systems, logos, brand guidelines and marketing collateral built to hold up across every touchpoint.' },
    { code: 'ƒ/2', title: 'Photography', desc: 'Portrait, product, editorial and lifestyle photography shot on location or in-studio.' },
    { code: 'ƒ/2.8', title: 'Studio Photo Sessions', desc: 'Book our in-house studio — cyclorama, lighting rigs and backdrops — for a fully equipped session.' },
    { code: 'ƒ/4', title: 'Camera & Lens Rentals', desc: 'Professional camera bodies, lenses, lighting and grip equipment available for hire, by the day or week.' },
    { code: 'ƒ/5.6', title: 'Campaign & Program Booking', desc: 'Dedicated production support and crew booking for brand campaigns, launches and ongoing programs.' },
    { code: 'ƒ/8', title: 'Videography & Cinematography', desc: 'Brand films, commercials, event coverage and short-form content shot and directed end to end.' },
    { code: 'ƒ/11', title: 'Photo & Video Post-Production', desc: 'Retouching, color grading, editing and motion graphics that bring raw footage to its final cut.' },
    { code: 'ƒ/16', title: 'Social & Digital Content', desc: 'Platform-ready content — reels, campaign assets and creative direction for social channels.' },
    { code: 'ƒ/22', title: 'Podcast & Audio Studio Rental', desc: 'A treated audio room with recording and streaming gear, available for podcast and voice sessions.' }
  ],
  portfolio: { eyebrow: 'Selected Work', title: 'The Portfolio', description: 'A cross-section of design, photography and campaign work produced in and out of the studio.', items: [
    { src: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=900&q=75', title: 'Editorial Portrait', tag: 'Photography' },
    { src: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=900&q=75', title: 'Brand Identity', tag: 'Graphic Design' },
    { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=75', title: 'Studio Session', tag: 'Studio' },
    { src: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&w=900&q=75', title: 'Product Campaign', tag: 'Photography' },
    { src: 'https://images.unsplash.com/photo-1524863479829-916d8e77f114?auto=format&fit=crop&w=900&q=75', title: 'Live Campaign Coverage', tag: 'Campaign' },
    { src: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=900&q=75', title: 'Motion & Reel Production', tag: 'Video' }
  ] },
  contact: {
    eyebrow: 'Get In Touch', title: "Let's talk media.", address: '12 Aperture Lane, Victoria Island, Lagos, Nigeria', email: 'hello@liora.media', phone: '+234 800 000 0000', instagram: '@lioramedia', instagramUrl: '#', note: 'Update these details from the admin dashboard whenever they change.'
  },
  footer: { copyright: 'Liora Media', adminLabel: 'Admin' },
  nav: { services: 'Services', portfolio: 'Portfolio', studio: 'Studio', booking: 'Booking', contact: 'Contact', bookNow: 'Book Now' }
}

function mergeDefaults(value) {
  if (!value || typeof value !== 'object') return DEFAULT_CONTENT
  return {
    ...DEFAULT_CONTENT, ...value,
    brand: { ...DEFAULT_CONTENT.brand, ...(value.brand || {}) },
    hero: { ...DEFAULT_CONTENT.hero, ...(value.hero || {}) },
    about: { ...DEFAULT_CONTENT.about, ...(value.about || {}) },
    contact: { ...DEFAULT_CONTENT.contact, ...(value.contact || {}) },
    footer: { ...DEFAULT_CONTENT.footer, ...(value.footer || {}) },
    nav: { ...DEFAULT_CONTENT.nav, ...(value.nav || {}) },
    portfolio: { ...DEFAULT_CONTENT.portfolio, ...(value.portfolio || {}), items: Array.isArray(value.portfolio?.items) ? value.portfolio.items : DEFAULT_CONTENT.portfolio.items },
    services: Array.isArray(value.services) ? value.services : DEFAULT_CONTENT.services,
  }
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const rows = await supabaseRequest('site_content?select=content&id=eq.1')
      const content = rows?.[0]?.content || DEFAULT_CONTENT
      return res.status(200).json(mergeDefaults(content))
    }

    if (req.method === 'PUT') {
      if (!isAdmin(req)) return unauthorized(res)
      const content = mergeDefaults(req.body?.content || req.body)
      const rows = await supabaseRequest('site_content?id=eq.1', {
        method: 'PATCH',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ content, updated_at: new Date().toISOString() }),
      })
      return res.status(200).json(rows?.[0]?.content || content)
    }

    res.setHeader('Allow', 'GET, PUT')
    return res.status(405).json({ error: 'Method not allowed.' })
  } catch (error) {
    return handleDatabaseError(res, error)
  }
}
