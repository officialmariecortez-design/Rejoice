import { supabaseRequest, handleDatabaseError } from './_db.js'
import { isAdmin, unauthorized } from './_lib/requireAdmin.js'

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { name, email, phone, service, date, time, message } = req.body || {}

      if (!name || !email || !service || !date) {
        return res.status(400).json({ error: 'Name, email, service and date are required.' })
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ error: 'Please provide a valid email address.' })
      }

      const rows = await supabaseRequest('bookings?select=id,status', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({
          name: String(name).trim(),
          email: String(email).trim(),
          phone: phone ? String(phone).trim() : null,
          service: String(service).trim(),
          date: String(date).trim(),
          time: time ? String(time).trim() : null,
          message: message ? String(message).trim() : null,
          status: 'pending',
        }),
      })

      return res.status(201).json({ id: rows?.[0]?.id, status: rows?.[0]?.status || 'pending' })
    }

    if (req.method === 'GET') {
      if (!isAdmin(req)) return unauthorized(res)
      const rows = await supabaseRequest('bookings?select=*&order=created_at.desc', { method: 'GET' })
      return res.status(200).json(rows)
    }

    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  } catch (error) {
    return handleDatabaseError(res, error)
  }
}
