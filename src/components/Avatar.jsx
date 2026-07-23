import './Avatar.css'

export const AVATAR_SIZES = { xs: 24, sm: 28, md: 40, lg: 48 }

/**
 * Avatar — tondo, immagine o iniziale su --surface-placeholder.
 * Props:
 *  - size: 'xs' | 'sm' | 'md' | 'lg'  (24 / 28 / 40 / 48px)
 *          oppure un numero di px: via di fuga per composizioni decorative
 *          fuori scala (es. il cluster sulla cover della Home). Nell'UI
 *          vera e propria usare sempre i nomi della scala.
 *  - src:  url immagine (opzionale)
 *  - name: nome (usato per l'iniziale e come alt fallback)
 *  - alt:  testo alternativo esplicito
 */
export default function Avatar({ size = 'md', src, name = '', alt, ring = false }) {
  const px = typeof size === 'number' ? size : (AVATAR_SIZES[size] ?? AVATAR_SIZES.md)
  const initial = name.trim().charAt(0).toUpperCase()
  return (
    <span
      className="avatar"
      data-ring={ring || undefined}
      style={{ width: px, height: px, fontSize: Math.round(px * 0.4) }}
    >
      {src ? (
        <img src={src} alt={alt ?? name} />
      ) : (
        <span aria-hidden={!initial}>{initial}</span>
      )}
    </span>
  )
}
