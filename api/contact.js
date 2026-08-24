import { supabaseRequest, handleDatabaseError } from './_db.js'
import { isAdmin, unauthorized } from './_lib/requireAdmin.js'

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { name, email, message } = req.body || {}

      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email and message are required.' })
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ error: 'Please provide a valid email address.' })
      }

      const rows = await supabaseRequest('contacts?select=id', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({
          name: String(name).trim(),
          email: String(email).trim(),
          message: String(message).trim(),
        }),
      })

      return res.status(201).json({ id: rows?.[0]?.id, status: 'received' })
    }

    if (req.method === 'GET') {
      if (!isAdmin(req)) return unauthorized(res)
      const rows = await supabaseRequest('contacts?select=*&order=created_at.desc', { method: 'GET' })
      return res.status(200).json(rows)
    }

    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  } catch (error) {
    return handleDatabaseError(res, error)
  }
}
