import './Chip.css'

/**
 * Chip — tag "vibe" (lively / classic / trendy). Pill piccola su accent-subtle.
 * Contrasto: testo --text-accent (#154200) su --bg-accent-subtle (#E5FFD3) → AA ok.
 *
 * Props:
 *  - selected: stato selezionato (bordo/fondo accentati)
 *  - icon:     icona lucide opzionale
 *  - onClick:  se presente, il chip diventa interattivo
 */
export default function Chip({ children, selected = false, icon: Icon, onClick }) {
  const Wrapper = onClick ? 'button' : 'span'
  return (
    <Wrapper
      className="chip"
      data-selected={selected || undefined}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
      aria-pressed={onClick ? selected : undefined}
    >
      {Icon && <Icon size={14} strokeWidth={2.5} />}
      {children}
    </Wrapper>
  )
}
