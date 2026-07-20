import './SegmentedControl.css'

/**
 * SegmentedControl — ~308×38, 2-3 segmenti (es. Itinerary / Expenses).
 * Segmento attivo con --bg-accent-strong.
 *
 * Props:
 *  - segments: array di stringhe, o di { value, label }
 *  - value:    valore attivo
 *  - onChange: (value) => void
 */
export default function SegmentedControl({ segments = [], value, onChange }) {
  return (
    <div className="segmented" role="tablist">
      {segments.map((s) => {
        const v = typeof s === 'string' ? s : s.value
        const label = typeof s === 'string' ? s : s.label
        const active = v === value
        return (
          <button
            key={v}
            className="segmented__seg"
            data-active={active || undefined}
            role="tab"
            aria-selected={active}
            onClick={() => onChange?.(v)}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
