import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import './Accordion.css'

/**
 * Accordion — contenitore espandibile.
 * Chiuso ~345×58, aperto ~345×182.
 * Header: label + valore (opzionale) + chevron. Contenuto espanso in children.
 *
 * Props:
 *  - label:       testo dell'header
 *  - value:       valore/summary a destra (opzionale)
 *  - defaultOpen: stato iniziale (default false)
 *  - open/onToggle: uso controllato (opzionale)
 */
export default function Accordion({ label, value, children, defaultOpen = false, open, onToggle }) {
  const [internal, setInternal] = useState(defaultOpen)
  const isControlled = open != null
  const isOpen = isControlled ? open : internal

  const toggle = () => {
    if (isControlled) onToggle?.(!isOpen)
    else setInternal((o) => !o)
  }

  return (
    <div className="accordion" data-open={isOpen || undefined}>
      <button className="accordion__header" onClick={toggle} aria-expanded={isOpen}>
        <span className="accordion__label">{label}</span>
        <span className="accordion__right">
          {value != null && <span className="accordion__value">{value}</span>}
          <ChevronDown className="accordion__chevron" size={20} strokeWidth={2.25} />
        </span>
      </button>
      <div className="accordion__panel">
        <div className="accordion__content">
          <div className="accordion__inner">{children}</div>
        </div>
      </div>
    </div>
  )
}
