import './DevToggle.css'

/**
 * DevToggle — strumento di sviluppo per alternare tra il prototipo
 * navigabile e il playground del design system.
 *
 * NON fa parte della navigazione interna del prototipo e vive fuori dal
 * frame mobile (fisso in alto a destra della pagina). Serve solo a
 * verificare/modificare i componenti durante lo sviluppo.
 *
 * Props:
 *  - value:    'prototype' | 'designSystem'
 *  - onChange: (value) => void
 */
export default function DevToggle({ value, onChange }) {
  const options = [
    { value: 'prototype', label: 'Prototype' },
    { value: 'designSystem', label: 'Design System' },
  ]
  return (
    <div className="dev-toggle" role="group" aria-label="Vista di sviluppo">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className="dev-toggle__btn"
          data-active={value === opt.value}
          aria-pressed={value === opt.value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
