import { Check } from 'lucide-react'
import './Checkbox.css'

/**
 * Checkbox — selezionato / non selezionato, con label opzionale.
 *
 * Props:
 *  - checked:  boolean
 *  - onChange: (next: boolean) => void
 *  - label:    testo opzionale
 *  - disabled
 */
export default function Checkbox({ checked = false, onChange, label, disabled = false }) {
  return (
    <label className="checkbox" data-disabled={disabled || undefined}>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        className="checkbox__box"
        data-checked={checked || undefined}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
      >
        {checked && <Check size={14} strokeWidth={3} />}
      </button>
      {label && <span className="checkbox__label">{label}</span>}
    </label>
  )
}
