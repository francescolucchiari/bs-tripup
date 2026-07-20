import './InputText.css'

/**
 * InputText — campo di testo con label opzionale (~345×64).
 * Stati: empty / filled (derivato dal valore), focus, disabled.
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
  const filled = value != null && String(value).length > 0
  return (
    <label className="input-text" data-filled={filled || undefined} data-disabled={disabled || undefined}>
      {label && <span className="input-text__label">{label}</span>}
      <input
        id={id}
        className="input-text__field"
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </label>
  )
}
