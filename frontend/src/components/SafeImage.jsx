import { useState } from 'react'
import { ImageOff } from 'lucide-react'

// Wraps <img> so a missing/expired/broken URL degrades to a quiet
// placeholder instead of the browser's default broken-image icon.
// Pass the same className you'd give an <img> (e.g. "w-full h-full
// object-cover") — it's reused for the placeholder so layout doesn't shift.
export default function SafeImage({ src, alt = '', className = '', loading = 'lazy' }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-ink2 text-fog/40 ${className}`}
        role="img"
        aria-label={alt}
      >
        <ImageOff className="w-6 h-6" strokeWidth={1.3} />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      className={className}
      onError={() => setFailed(true)}
    />
  )
}
