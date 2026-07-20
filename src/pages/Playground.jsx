import { useState } from 'react'
import MobileFrame from '../components/MobileFrame'
import SegmentedControl from '../components/SegmentedControl'
import ComponentsView from './ComponentsView'
import TokensView from './TokensView'
import './Playground.css'

/**
 * Playground — pagina temporanea di verifica.
 * Switch tra la showcase dei componenti (step 2) e i design token (step 1).
 * Nessuna schermata dell'app è ancora costruita.
 */
export default function Playground() {
  const [view, setView] = useState('components')

  return (
    <MobileFrame>
      <div className="pg-shell">
        <header className="pg-header">
          <span className="pg-badge">Design system · step 2</span>
          <h1 className="pg-title">TripUp Playground</h1>
          <p className="pg-subtitle">
            Componenti base e design token. Nessuna schermata dell'app è ancora costruita.
          </p>
          <div className="pg-switch">
            <SegmentedControl
              segments={[
                { value: 'components', label: 'Componenti' },
                { value: 'tokens', label: 'Token' },
              ]}
              value={view}
              onChange={setView}
            />
          </div>
        </header>

        {view === 'components' ? <ComponentsView /> : <TokensView />}

        <footer className="pg-footer">
          <span>TripUp · prototipo interattivo · mock data</span>
        </footer>
      </div>
    </MobileFrame>
  )
}
