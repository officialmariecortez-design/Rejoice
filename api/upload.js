import { isAdmin, unauthorized } from './_lib/requireAdmin.js'
import { uploadImage } from './_lib/storage.js'

// Vercel Functions have a hard 4.5MB request body limit that can't be
// raised via config. Base64 inflates size by ~33%, so this decoded cap
// keeps the encoded JSON payload comfortably under that limit.
const MAX_BYTES = 3 * 1024 * 1024

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  if (!isAdmin(req)) return unauthorized(res)

  const { filename, contentType, dataBase64 } = req.body || {}

  if (!dataBase64 || typeof dataBase64 !== 'string') {
    return res.status(400).json({ error: 'No image data received.' })
  }
  if (!contentType || !contentType.startsWith('image/')) {
    return res.status(400).json({ error: 'Only image uploads are allowed.' })
  }

  let buffer
  try {
    buffer = Buffer.from(dataBase64, 'base64')
  } catch {
    return res.status(400).json({ error: 'Could not read image data.' })
  }

  if (buffer.length === 0) {
    return res.status(400).json({ error: 'The uploaded image is empty.' })
  }
  if (buffer.length > MAX_BYTES) {
    return res.status(413).json({ error: 'Image is too large. Please use a file under 3MB.' })
  }

  const extFromName = (filename || '').split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '')
  const extFromType = contentType.split('/')[1]?.toLowerCase().replace(/[^a-z0-9]/g, '')
  const ext = extFromName || extFromType || 'jpg'
  const path = `portfolio/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  try {
    const url = await uploadImage(path, buffer, contentType)
    return res.status(201).json({ url })
  } catch (error) {
    console.error('Upload error:', error)
    return res.status(500).json({ error: error.message || 'Upload failed.' })
  }
}
