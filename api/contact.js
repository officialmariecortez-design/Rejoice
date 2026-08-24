import { sql, ensureTables } from './_db.js'
import { isAdmin, unauthorized } from './_lib/requireAdmin.js'

export default async function handler(req, res) {
  await ensureTables()

  if (req.method === 'POST') {
    const { name, email, message } = req.body || {}

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required.' })
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' })
    }

    const rows = await sql`
      INSERT INTO contacts (name, email, message)
      VALUES (${String(name).trim()}, ${String(email).trim()}, ${String(message).trim()})
      RETURNING id
    `

    // Optional: send an email notification here (e.g. via nodemailer or
    // an HTTP email API — anything that runs from a serverless function)
    // once credentials are configured.

    return res.status(201).json({ id: rows[0].id, status: 'received' })
  }

  if (req.method === 'GET') {
    if (!isAdmin(req)) return unauthorized(res)
    const rows = await sql`SELECT * FROM contacts ORDER BY created_at DESC`
    return res.status(200).json(rows)
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'Method not allowed.' })
}
