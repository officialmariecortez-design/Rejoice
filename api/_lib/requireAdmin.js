export function isAdmin(req) {
  const key = req.headers['x-admin-key']
  return Boolean(process.env.ADMIN_API_KEY) && key === process.env.ADMIN_API_KEY
}

export function unauthorized(res) {
  res.status(401).json({ error: 'Unauthorized.' })
}
