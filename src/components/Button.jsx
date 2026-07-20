import './Button.css'

/**
 * Button — copre le due varianti del DS:
 *  - variant="primary" size="lg"  → cta-primary/lg  (~345×51, fondo --bg-cta)
 *  - variant="secondary" size="md" → cta-secondary/md (~111×38, fondo accent-subtle)
 *
 * Stati: default, pressed (prop `pressed` per mostrarlo staticamente, + :active reale),
 * disabled (prop `disabled`).
 *
 * Props:
 *  - variant: 'primary' | 'secondary'  (default 'primary')
 *  - size:    'lg' | 'md'              (default 'lg')
 *  - icon:    componente icona lucide (opzionale)
 *  - pressed: forza lo stile pressed (solo per showcase)
 *  - fullWidth: occupa tutta la larghezza disponibile
 */
export default function Button({
  variant = 'primary',
  size = 'lg',
  icon: Icon,
  children,
  disabled = false,
  pressed = false,
  fullWidth = false,
  type = 'button',
  onClick,
}) {
  return (
    <button
      type={type}
      className="btn"
      data-variant={variant}
      data-size={size}
      data-pressed={pressed || undefined}
      data-fullwidth={fullWidth || undefined}
      disabled={disabled}
      onClick={onClick}
    >
      {Icon && <Icon size={size === 'lg' ? 20 : 18} strokeWidth={2.25} />}
      {children && <span>{children}</span>}
    </button>
  )
}
