import { useState } from 'react'
import Prototype from './Prototype'
import Playground from './pages/Playground'
import DevToggle from './DevToggle'

/**
 * App — scheletro navigabile del prototipo.
 *
 * In consegna si vede solo il prototipo: il DevToggle
 * ("Prototype" / "Design System") è uno strumento di sviluppo e resta
 * nascosto, così chi visiona il progetto non trova comandi che non fanno
 * parte dell'app.
 *
 * Per riaprirlo basta aggiungere `?dev` all'URL (es. localhost:5173/?dev),
 * senza toccare il codice: il playground con token e componenti resta
 * raggiungibile, solo non in evidenza.
 */
const DEV = new URLSearchParams(window.location.search).has('dev')

export default function App() {
  const [view, setView] = useState('prototype')

  if (!DEV) return <Prototype />

  return (
    <>
      <DevToggle value={view} onChange={setView} />
      {view === 'prototype' ? <Prototype /> : <Playground />}
    </>
  )
}
