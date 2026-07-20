import './Badge.css'

/**
 * Badge — pill piccola per stati/etichette (~96×24).
 * Varianti: 'accent' (default) | 'neutral' | 'warning'.
 *
 * Props:
 *  - variant: 'accent' | 'neutral' | 'warning'
 *  - icon:    componente icona lucide (opzionale)
 */
export default function Badge({ variant = 'accent', icon: Icon, children }) {
  return (
    <span className="badge" data-variant={variant}>
      {Icon && <Icon size={12} strokeWidth={2.5} />}
      {children}
    </span>
  )
}
