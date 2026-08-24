function getAdminKey(req) {
  const headerKey = req.headers['x-admin-key']
  if (typeof headerKey === 'string' && headerKey.trim()) return headerKey.trim()

  const authorization = req.headers.authorization
  if (typeof authorization === 'string') {
    const match = authorization.match(/^Bearer\s+(.+)$/i)
    if (match?.[1]?.trim()) return match[1].trim()
  }

  return ''
}

export function isAdmin(req) {
  const configured = String(process.env.ADMIN_API_KEY || '').trim()
  const supplied = getAdminKey(req)
  return Boolean(configured && supplied && supplied === configured)
}

export function unauthorized(res) {
  const configured = Boolean(String(process.env.ADMIN_API_KEY || '').trim())
  return res.status(401).json({
    error: configured
      ? 'Unauthorized. Check that the admin key matches the ADMIN_API_KEY environment variable in Vercel.'
      : 'Admin authentication is not configured. Add ADMIN_API_KEY to the Vercel environment variables and redeploy.',
  })
}
