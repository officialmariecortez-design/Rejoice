import { sql, ensureTables } from '../_db.js'
import { isAdmin, unauthorized } from '../_lib/requireAdmin.js'

const ALLOWED_STATUSES = ['pending', 'confirmed', 'declined', 'completed']

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', 'PATCH')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  if (!isAdmin(req)) return unauthorized(res)

  await ensureTables()

  const { id } = req.query
  const { status } = req.body || {}

  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${ALLOWED_STATUSES.join(', ')}` })
  }

  const rows = await sql`UPDATE bookings SET status = ${status} WHERE id = ${id} RETURNING id`
  if (rows.length === 0) {
    return res.status(404).json({ error: 'Booking not found.' })
  }

  res.status(200).json({ id: Number(id), status })
}
