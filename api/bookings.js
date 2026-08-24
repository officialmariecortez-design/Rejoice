import { sql, ensureTables } from './_db.js'
import { isAdmin, unauthorized } from './_lib/requireAdmin.js'

export default async function handler(req, res) {
  await ensureTables()

  if (req.method === 'POST') {
    const { name, email, phone, service, date, time, message } = req.body || {}

    if (!name || !email || !service || !date) {
      return res.status(400).json({ error: 'Name, email, service and date are required.' })
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' })
    }

    const rows = await sql`
      INSERT INTO bookings (name, email, phone, service, date, time, message)
      VALUES (
        ${String(name).trim()},
        ${String(email).trim()},
        ${phone ? String(phone).trim() : null},
        ${String(service).trim()},
        ${String(date).trim()},
        ${time ? String(time).trim() : null},
        ${message ? String(message).trim() : null}
      )
      RETURNING id
    `

    // Optional: send a confirmation email or Slack/WhatsApp alert here.

    return res.status(201).json({ id: rows[0].id, status: 'pending' })
  }

  if (req.method === 'GET') {
    if (!isAdmin(req)) return unauthorized(res)
    const rows = await sql`SELECT * FROM bookings ORDER BY created_at DESC`
    return res.status(200).json(rows)
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'Method not allowed.' })
}
