import { useRef } from 'react'
import { CircleX } from 'lucide-react'
import './InputText.css'

/**
 * InputText — campo di testo con label opzionale (~345×64).
 * Stati: empty / filled (derivato dal valore), focus, disabled.
 * Quando è filled (e abilitato) mostra una CircleX 24×24 a destra che
 * svuota il campo al click (l'icona sparisce perché il campo torna empty).
 *
 * Props:
 *  - label:       etichetta sopra il valore (opzionale)
 *  - value:       valore controllato
 *  - onChange:    (nextValue: string) => void
 *  - placeholder: testo placeholder
 *  - type:        tipo input HTML (default 'text')
 *  - disabled
 */
export default function InputText({
  label,
  value = '',
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  id,
}) {
  const inputRef = useRef(null)
  const filled = value != null && String(value).length > 0

  const handleClear = () => {
    onChange?.('')
    inputRef.current?.focus({ preventScroll: true })
  }

  return (
    <label className="input-text" data-filled={filled || undefined} data-disabled={disabled || undefined}>
      <span className="input-text__body">
        {label && <span className="input-text__label">{label}</span>}
        <input
          ref={inputRef}
          id={id}
          className="input-text__field"
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </span>

      {filled && !disabled && (
        <button
          type="button"
          className="input-text__clear"
          aria-label="Svuota campo"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleClear}
        >
          <CircleX size={24} strokeWidth={2} />
        </button>
      )}
    </label>
  )
}
