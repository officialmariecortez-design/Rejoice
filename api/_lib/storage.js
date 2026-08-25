const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '')
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const BUCKET = 'site-media'

function requireSupabase() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase environment variables are not configured.')
  }
}

function authHeaders(extra = {}) {
  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    ...extra,
  }
}

// Serverless functions are stateless between cold starts, but a warm
// instance can reuse this flag and skip the bucket check on every upload.
let bucketReady = false

async function ensureBucket() {
  if (bucketReady) return
  requireSupabase()

  const res = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      id: BUCKET,
      name: BUCKET,
      public: true,
      file_size_limit: 5242880, // 5MB, matches api/upload.js's own check
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    let data
    try { data = JSON.parse(text) } catch { data = { message: text } }
    // "Bucket already exists" (or duplicate key) just means a previous
    // request already created it — that's fine, anything else is a real error.
    if (!/already exists|duplicate/i.test(data?.message || data?.error || '')) {
      throw new Error(data?.message || 'Could not prepare storage bucket.')
    }
  }

  bucketReady = true
}

export async function uploadImage(path, buffer, contentType) {
  await ensureBucket()

  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': contentType, 'x-upsert': 'true' }),
    body: buffer,
  })

  if (!res.ok) {
    const text = await res.text()
    let data
    try { data = JSON.parse(text) } catch { data = { message: text } }
    throw new Error(data?.message || 'Upload failed.')
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`
}
