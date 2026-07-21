import './Badge.css'

/**
 * Badge — pill piccola per stati/etichette.
 * Varianti: 'accent' (default) | 'neutral' | 'warning' | 'success'.
 * Size:
 *  - 'sm' (default): 10px, UPPERCASE, icona 12px
 *  - 'md':           12px, sentence-case, icona 16px (usata dal poll)
 *
 * Props:
 *  - variant:   'accent' | 'neutral' | 'warning' | 'success'
 *  - size:      'sm' | 'md'
 *  - icon:      componente icona lucide (opzionale)
 *  - uppercase: forza maiuscolo (default true)
 */
export default function Badge({
  variant = 'accent',
  size = 'sm',
  icon: Icon,
  uppercase = true,
  children,
}) {
  return (
    <span
      className="badge"
      data-variant={variant}
      data-size={size}
      data-uppercase={uppercase || undefined}
    >
      {Icon && <Icon size={size === 'md' ? 16 : 12} strokeWidth={2.5} />}
      {children}
    </span>
  )
}
