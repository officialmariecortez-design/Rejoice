export default function handler(req, res) {
  const configured = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
  res.status(200).json({
    status: configured ? 'ok' : 'configuration_required',
    service: 'liora-media-backend',
    database: 'supabase',
  })
}
