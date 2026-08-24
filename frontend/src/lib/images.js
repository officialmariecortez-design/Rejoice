// Curated placeholder imagery. Swap these for Liora Media's own shoots
// whenever real assets are ready — just replace the `src` values.
function unsplash(id, w = 800) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`
}

export const heroTiles = [
  { src: unsplash('photo-1516035069371-29a1b244cc32'), alt: 'Camera lens close-up' },
  { src: unsplash('photo-1502920917128-1aa500764cbd'), alt: 'Photographer at work' },
  { src: unsplash('photo-1493863641943-9b68992a8d07'), alt: 'Studio lighting setup' },
  { src: unsplash('photo-1500648767791-00dcc994a43e'), alt: 'Portrait photography session' },
  { src: unsplash('photo-1554048612-b6a482bc67e5'), alt: 'Camera equipment on set' },
  { src: unsplash('photo-1519183071298-a2962be96f83'), alt: 'Film camera detail' },
  { src: unsplash('photo-1543269865-cbf427effbad'), alt: 'Studio backdrop and lights' },
  { src: unsplash('photo-1516035069371-29a1b244cc32'), alt: 'Lens flare detail' },
]

export const portfolioItems = [
  { src: unsplash('photo-1542038784456-1ea8e935640e', 900), title: 'Editorial Portrait', tag: 'Photography' },
  { src: unsplash('photo-1611162617213-7d7a39e9b1d7', 900), title: 'Brand Identity — Nairobi Roasters', tag: 'Graphic Design' },
  { src: unsplash('photo-1519741497674-611481863552', 900), title: 'Studio Session', tag: 'Studio' },
  { src: unsplash('photo-1478147427282-58a87a120781', 900), title: 'Product Campaign', tag: 'Photography' },
  { src: unsplash('photo-1524863479829-916d8e77f114', 900), title: 'Live Campaign Coverage', tag: 'Campaign' },
  { src: unsplash('photo-1533090161767-e6ffed986c88', 900), title: 'Motion & Reel Production', tag: 'Video' },
]

export const teamStrip = [
  unsplash('photo-1520975916090-3105956dac38', 500),
  unsplash('photo-1522075469751-3a6694fb2f61', 500),
  unsplash('photo-1531123897727-8f129e1688ce', 500),
]
