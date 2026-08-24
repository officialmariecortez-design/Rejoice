const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '')
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

function requireSupabase() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase environment variables are not configured.')
  }
}

export async function supabaseRequest(path, options = {}) {
  requireSupabase()

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  const text = await response.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text || null
  }

  if (!response.ok) {
    const message = data?.message || data?.error_description || data?.hint || 'Supabase request failed.'
    const error = new Error(message)
    error.status = response.status
    error.details = data
    throw error
  }

  return data
}

export function handleDatabaseError(res, error) {
  console.error('Supabase error:', error)
  const status = Number.isInteger(error?.status) && error.status >= 400 && error.status < 600 ? error.status : 500
  return res.status(status).json({
    error: status === 500 ? 'Database is not reachable right now.' : (error.message || 'Database request failed.'),
  })
}
