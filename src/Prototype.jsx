import { useState } from 'react'
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
 */

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
      <Screen onNext={goNext} onBack={canGoBack ? goBack : undefined} />
    </MobileFrame>
  )
}
