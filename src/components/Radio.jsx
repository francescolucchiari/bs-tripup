import { Check } from 'lucide-react'
import './Radio.css'

/**
 * Radio — selezionato / non selezionato, con label opzionale.
 * Selezionato: cerchio pieno (--bg-cta) con lucide Check 16px bianca
 * (--icon-inverse) e 4px di padding su ogni lato → 24×24.
 * Non selezionato: stesso ingombro 24×24, bordo 1.5px, trasparente.
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
        {checked && <Check className="radio__check" size={16} strokeWidth={2.5} />}
      </button>
      {label && <span className="radio__label">{label}</span>}
    </label>
  )
}
