import { ChevronLeft } from 'lucide-react'
import './ScreenHeader.css'

/**
 * ScreenHeader — layout riutilizzabile: back button (icon) + titolo + azione
 * opzionale a destra. Il titolo resta centrato indipendentemente dall'azione.
 *
 * Props:
 *  - title:    testo del titolo
 *  - onBack:   handler del back (se assente, il back non viene mostrato)
 *  - showBack: forza mostra/nascondi back (default: true se onBack presente)
 *  - action:   nodo React opzionale a destra (es. icon button)
 */
export default function ScreenHeader({ title, onBack, showBack, action }) {
  const withBack = showBack ?? Boolean(onBack)
  return (
    <header className="screen-header">
      <span className="screen-header__slot screen-header__slot--start">
        {withBack && (
          <button className="screen-header__icon-btn" onClick={onBack} aria-label="Indietro">
            <ChevronLeft size={24} strokeWidth={2.25} />
          </button>
        )}
      </span>
      <h1 className="screen-header__title">{title}</h1>
      <span className="screen-header__slot screen-header__slot--end">{action}</span>
    </header>
  )
}
