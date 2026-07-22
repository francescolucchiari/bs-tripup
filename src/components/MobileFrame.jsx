import { Signal, Wifi, BatteryFull } from 'lucide-react'
import './MobileFrame.css'

/**
 * MobileFrame — contenitore mobile riutilizzabile del prototipo TripUp.
 *
 * Dimensioni native di un iPhone di riferimento (393×852), nessuno scaling
 * responsive: il prototipo vive sempre in questo frame centrato.
 *
 * Struttura:
 *  - status bar iOS finta (ora + icone di sistema)
 *  - area contenuto scrollabile (children)
 *  - home indicator iOS finto
 *
 * Props:
 *  - children:   contenuto della schermata
 *  - time:       ora mostrata nella status bar (default "9:41")
 *  - statusBar:  "dark" (icone/testo scuri, default) | "light" (chiari)
 *  - bg:         colore di sfondo dell'area contenuto (default var(--bg-page))
 */
export default function MobileFrame({
  children,
  time = '9:41',
  statusBar = 'dark',
  bg = 'var(--bg-page)',
}) {
  return (
    <div className="mobile-frame" data-statusbar={statusBar}>
      {/* Status bar iOS finta */}
      <div className="mobile-frame__statusbar">
        <span className="mobile-frame__time">{time}</span>
        <span className="mobile-frame__notch" aria-hidden="true" />
        <span className="mobile-frame__icons" aria-hidden="true">
          <Signal size={17} strokeWidth={2.25} />
          <Wifi size={17} strokeWidth={2.25} />
          <BatteryFull size={24} strokeWidth={2} />
        </span>
      </div>

      {/* Area contenuto scrollabile */}
      <div className="mobile-frame__content" style={{ background: bg }}>
        {children}
      </div>
    </div>
  )
}
