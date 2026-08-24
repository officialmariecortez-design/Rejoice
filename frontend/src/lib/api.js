// Frontend and API now deploy together on the same Vercel project, so
// requests default to a relative path (same origin). Set VITE_API_URL
// only if the API is ever split out to a different domain.
const BASE_URL = import.meta.env.VITE_API_URL || ''

async function post(path, payload) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  let data = null
  try {
    data = await res.json()
  } catch {
    // no json body
  }

  if (!res.ok) {
    throw new Error(data?.error || 'Something went wrong. Please try again.')
  }

  return data
}

export function submitContact(payload) {
  return post('/api/contact', payload)
}

export function submitBooking(payload) {
  return post('/api/bookings', payload)
}
