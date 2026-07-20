import './Radio.css'

/**
 * Radio — selezionato / non selezionato, con label opzionale.
 *
 * Props:
 *  - checked:  boolean
 *  - onChange: (value) => void
 *  - value:    valore passato a onChange
 *  - label:    testo opzionale
 *  - disabled
 */
export default function Radio({ checked = false, onChange, value, label, disabled = false }) {
  return (
    <label className="radio" data-disabled={disabled || undefined}>
      <button
        type="button"
        role="radio"
        aria-checked={checked}
        className="radio__circle"
        data-checked={checked || undefined}
        disabled={disabled}
        onClick={() => onChange?.(value)}
      >
        <span className="radio__dot" />
      </button>
      {label && <span className="radio__label">{label}</span>}
    </label>
  )
}
