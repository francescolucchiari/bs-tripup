import { useState, useEffect } from 'react'
import MobileFrame from './components/MobileFrame'
import {
  HomeScreen,
  TripScreen,
  AddMemberScreen,
  CreatePollScreen,
  PollLiveScreen,
  PollClosedScreen,
  AddExpenseScreen,
  BalancesScreen,
  SettlementScreen,
} from './screens'
import { PARTICIPANTS } from './data/trip'

/**
 * Prototype — scheletro navigabile del flusso TripUp (step 3).
 *
 * Navigazione leggera basata su uno stack di stato React: nessuna
 * dipendenza da router. La CTA di ogni schermata fa `push` della
 * schermata successiva nell'ordine del flusso; il back fa `pop`.
 *
 * Flusso (ordine lineare):
 *   home → trip → addMember → createPoll → pollLive → pollClosed
 *        → addExpense → balances → settlement → (torna a home)
 *
 * Home e Trip, una volta visitate, restano MONTATE (nascoste quando non
 * sono in primo piano) invece di essere smontate dal cambio schermata:
 * altrimenti tornando indietro si perderebbe tutto lo stato del viaggio —
 * poll in corso o concluso, spesa aggiunta, posizione di scroll.
 * Il montaggio è pigro: Trip nasce alla prima visita, così le sue misure
 * iniziali (allineamento dello scroll) vengono prese da visibile.
 */
const PERSISTENT = ['home', 'trip']

const FLOW = [
  'home',
  'trip',
  'addMember',
  'createPoll',
  'pollLive',
  'pollClosed',
  'addExpense',
  'balances',
  'settlement',
]

const SCREENS = {
  home: HomeScreen,
  trip: TripScreen,
  addMember: AddMemberScreen,
  createPoll: CreatePollScreen,
  pollLive: PollLiveScreen,
  pollClosed: PollClosedScreen,
  addExpense: AddExpenseScreen,
  balances: BalancesScreen,
  settlement: SettlementScreen,
}

export default function Prototype() {
  // Stack di navigazione: l'ultimo elemento è la schermata visibile.
  const [stack, setStack] = useState(['home'])
  const current = stack[stack.length - 1]

  // Partecipanti del viaggio: vivono qui perché li leggono sia Trip (che li
  // modifica aggiungendo Ren) sia Home (conteggio + avatar sulla cover).
  const [participants, setParticipants] = useState(PARTICIPANTS)

  // Come sta messa la cena di stasera, pubblicata da Trip e letta dalla Home.
  const [tripStatus, setTripStatus] = useState({ kind: 'none' })

  // Schermate persistenti già visitate.
  const [mounted, setMounted] = useState(['home'])
  useEffect(() => {
    if (!PERSISTENT.includes(current)) return
    setMounted((m) => (m.includes(current) ? m : [...m, current]))
  }, [current])

  const goNext = () => {
    const idx = FLOW.indexOf(current)
    const next = FLOW[idx + 1]
    if (next) {
      setStack((s) => [...s, next])
    } else {
      // Fine flusso (settlement): ricomincia dalla Home.
      setStack(['home'])
    }
  }

  const goBack = () => {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s))
  }

  const Screen = SCREENS[current]
  const canGoBack = stack.length > 1

  return (
    <MobileFrame>
      {mounted.includes('home') && (
        <div hidden={current !== 'home'}>
          <HomeScreen onNext={goNext} participants={participants} status={tripStatus} />
        </div>
      )}

      {mounted.includes('trip') && (
        <div hidden={current !== 'trip'}>
          <TripScreen
            onNext={goNext}
            onBack={goBack}
            participants={participants}
            onParticipantsChange={setParticipants}
            onStatusChange={setTripStatus}
          />
        </div>
      )}

      {!PERSISTENT.includes(current) && (
        <Screen onNext={goNext} onBack={canGoBack ? goBack : undefined} />
      )}
    </MobileFrame>
  )
}
