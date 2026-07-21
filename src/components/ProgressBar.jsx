import './ProgressBar.css'

/**
 * ProgressBar — barra orizzontale riempibile 0-100%, colore accent.
 * Usata per il poll.
 *
 * Props:
 *  - value: 0-100
 *  - tone:  'accent' (default, lime) | 'strong' (verde scuro)
 *  - size:  'sm' (default, 8px) | 'md' (10px, usata dal poll)
 */
export default function ProgressBar({ value = 0, tone = 'accent', size = 'sm' }) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div
      className="progress"
      data-tone={tone}
      data-size={size}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span className="progress__fill" style={{ width: `${pct}%` }} />
    </div>
  )
}
