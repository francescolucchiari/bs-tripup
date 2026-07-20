import ScreenHeader from '../components/ScreenHeader'
import Button from '../components/Button'
import TabBar from '../components/TabBar'
import './Placeholder.css'

/**
 * Placeholder — scaffold neutro condiviso da tutte le schermate dello
 * scheletro navigabile (step 3).
 *
 * Mostra solo: titolo della schermata + una CTA di avanzamento verso la
 * schermata successiva del flusso (+ back dove serve). Nessun contenuto
 * vero: le schermate reali verranno innestate qui negli step successivi.
 *
 * Props:
 *  - title:     titolo mostrato al centro
 *  - eyebrow:   piccola label sopra il titolo (opzionale, es. "Sheet")
 *  - onBack:    handler back (se assente, nessun back nell'header)
 *  - onNext:    handler avanzamento (se assente, nessuna CTA)
 *  - nextLabel: testo della CTA (default "Continue")
 *  - tabBar:    key del tab attivo per mostrare la TabBar (opzionale)
 */
export default function Placeholder({
  title,
  eyebrow,
  onBack,
  onNext,
  nextLabel = 'Continue',
  tabBar,
}) {
  return (
    <div className="ph" data-tabbar={tabBar ? 'true' : undefined}>
      <ScreenHeader title="" onBack={onBack} />

      <div className="ph__body">
        {eyebrow && <span className="ph__eyebrow">{eyebrow}</span>}
        <h1 className="ph__title">{title}</h1>
        <p className="ph__note">Schermata placeholder — contenuto in arrivo</p>
        {onNext && (
          <div className="ph__cta">
            <Button variant="primary" size="lg" fullWidth onClick={onNext}>
              {nextLabel}
            </Button>
          </div>
        )}
      </div>

      {tabBar && <TabBar active={tabBar} fixed />}
    </div>
  )
}
