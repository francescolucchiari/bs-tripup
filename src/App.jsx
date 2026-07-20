import { useState } from 'react'
import Prototype from './Prototype'
import Playground from './pages/Playground'
import DevToggle from './DevToggle'

/**
 * App — step 3: scheletro navigabile del prototipo.
 *
 * Il DevToggle (fuori dal frame mobile) alterna tra due viste:
 *  - "Prototype"     → il flusso navigabile dell'app (Prototype)
 *  - "Design System" → il playground con token e componenti (Playground)
 *
 * Il toggle è uno strumento di sviluppo: non fa parte della navigazione
 * interna del prototipo.
 */
export default function App() {
  const [view, setView] = useState('prototype')

  return (
    <>
      <DevToggle value={view} onChange={setView} />
      {view === 'prototype' ? <Prototype /> : <Playground />}
    </>
  )
}
