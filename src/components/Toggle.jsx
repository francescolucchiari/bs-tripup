import './Toggle.css'

/**
 * Toggle — switch on/off. Accent (lime) quando attivo.
 *
 * Props:
 *  - checked:  boolean
 *  - onChange: (next: boolean) => void
 *  - disabled
 */
export default function Toggle({ checked = false, onChange, disabled = false, id }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      className="toggle"
      data-checked={checked || undefined}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
    >
      <span className="toggle__knob" />
    </button>
  )
}
