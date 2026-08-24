import { supabaseRequest, handleDatabaseError } from '../_db.js'
import { isAdmin, unauthorized } from '../_lib/requireAdmin.js'

const ALLOWED_STATUSES = ['pending', 'confirmed', 'declined', 'completed']

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', 'PATCH')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  if (!isAdmin(req)) return unauthorized(res)

  try {
    const { id } = req.query
    const { status } = req.body || {}

    if (!/^\d+$/.test(String(id))) {
      return res.status(400).json({ error: 'Booking ID must be a number.' })
    }

    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${ALLOWED_STATUSES.join(', ')}` })
    }

    const rows = await supabaseRequest(`bookings?id=eq.${encodeURIComponent(id)}&select=id,status`, {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ status }),
    })

    if (!rows?.length) {
      return res.status(404).json({ error: 'Booking not found.' })
    }

    return res.status(200).json({ id: Number(id), status: rows[0].status })
  } catch (error) {
    return handleDatabaseError(res, error)
  }
}
