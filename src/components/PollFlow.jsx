import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PollCard from './PollCard'
import ItineraryUpdateCard from './ItineraryUpdateCard'

/**
 * PollFlow — pilota il ciclo di vita interattivo del sondaggio inline e,
 * a chiusura, morfa nella card d'itinerario del vincitore.
 *
 * Script (demo):
 *  1. l'utente vota (avatar `me`) → parte la sequenza
 *  2. arriva un voto per ciascun `other` partecipante → totale = 1 + others.length
 *     (4 con gruppo a 4, 5 con Ren aggiunto — il voto extra va sulla mia opzione)
 *  3. all-voted → countdown 5s
 *  4. a 0 → closed-celebration (coriandoli)
 *  5. ~1.5s dopo → itinerary-update (vince sempre l'opzione votata dall'utente)
 *
 * Props:
 *  - question
 *  - options: [{ id, name, quote, image }]
 *  - others:  [srcAvatar] degli altri partecipanti (default: gruppo a 4)
 */

const ME = '/trip/avatar-1.jpg' // utente corrente

// Avatar di default degli "altri" partecipanti (fallback: gruppo a 4 = 3
// altri). Se il gruppo è a 5 (Ren aggiunto), TripScreen passa 4 `others` →
// i voti totali diventano 5. Le opzioni target si calcolano sulla scelta
// dell'utente (vedi handleVote), così la sua vince sempre senza pareggi.
const DEFAULT_OTHERS = [
  '/trip/avatar-2.jpg',
  '/trip/avatar-3.jpg',
  '/trip/avatar-4.jpg',
]
// ritardi (ms) dei voti in arrivo, uno per ciascun "altro" partecipante
const incomingTimes = (n) => Array.from({ length: n }, (_, i) => 1500 + i * 1400)

const fmtBig = (s) => {
  const m = Math.floor(s / 60)
  const ss = s % 60
  return m > 0 ? `${m}m ${ss}s` : `${ss}s`
}

const addVote = (poll, optId, avatar, mine) => ({
  ...poll,
  myVoteId: mine ? optId : poll.myVoteId,
  options: poll.options.map((o) =>
    o.id === optId ? { ...o, voters: [...o.voters, avatar] } : o,
  ),
})

export default function PollFlow({ question, options, others = DEFAULT_OTHERS, onAddExpense, onResolved }) {
  const [poll, setPoll] = useState(() => ({
    question,
    status: 'open',
    allVoted: false,
    myVoteId: null,
    winnerId: null,
    options: options.map((o) => ({ ...o, voters: [] })),
  }))
  const [phase, setPhase] = useState('poll') // 'poll' | 'resolved'
  const [big, setBig] = useState(29 * 60 + 23) // countdown grande (fase open)
  const [closing, setClosing] = useState(null) // 5..0 quando all-voted
  const startedRef = useRef(false)
  const timers = useRef([])

  // cleanup timers al unmount
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  // countdown grande mentre è aperto e non tutti hanno votato
  useEffect(() => {
    if (poll.status !== 'open' || poll.allVoted) return undefined
    const id = setInterval(() => setBig((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [poll.status, poll.allVoted])

  // countdown di chiusura (5s) → chiude e poi morfa
  useEffect(() => {
    if (closing == null) return undefined
    if (closing <= 0) {
      // la mia opzione vince sempre (i voti simulati sono tarati apposta)
      setPoll((p) => ({ ...p, status: 'closed', winnerId: p.myVoteId }))
      const t = setTimeout(() => {
        setPhase('resolved')
        // il marker sul rail smette di girare e torna un dot; il nome del
        // vincitore serve alla Home per la striscia di stato
        onResolved?.(options.find((o) => o.id === poll.myVoteId)?.name ?? '')
      }, 1500)
      timers.current.push(t)
      return undefined
    }
    const id = setTimeout(() => setClosing((c) => c - 1), 1000)
    return () => clearTimeout(id)
  }, [closing])

  const handleVote = useCallback(
    (optId) => {
      if (startedRef.current) return
      startedRef.current = true
      setPoll((p) => addVote(p, optId, ME, true))

      // Target dei voti simulati calcolati sulla scelta dell'utente:
      // 1 voto a ciascun rivale (così ognuno tocca ≥1), i restanti alla MIA
      // opzione → con 3 opzioni finale 3–1–1, la mia sempre in testa.
      // I voti ai rivali arrivano prima (pareggio iniziale 1–1–1), i miei in
      // coda (stacco finale) → "sorpasso morbido".
      const rivals = options.map((o) => o.id).filter((id) => id !== optId)
      // un voto per ogni "altro" partecipante: 1 a ciascun rivale, i restanti
      // (incluso Ren se il gruppo è a 5) sulla MIA opzione → vince sempre.
      const targets = others.map((_, i) => rivals[i] ?? optId)
      const times = incomingTimes(others.length)

      targets.forEach((target, i) => {
        const t = setTimeout(
          () => setPoll((p) => addVote(p, target, others[i], false)),
          times[i],
        )
        timers.current.push(t)
      })

      // dopo l'ultimo voto: all-voted + avvio countdown 5s
      const tv = setTimeout(() => {
        setPoll((p) => ({ ...p, allVoted: true }))
        setClosing(5)
      }, times[times.length - 1] + 400)
      timers.current.push(tv)
    },
    [options, others],
  )

  const closesLabel = poll.allVoted ? `${closing ?? 0}s` : fmtBig(big)
  const winner = poll.options.find((o) => o.id === poll.winnerId)

  return (
    <AnimatePresence mode="wait">
      {phase === 'poll' ? (
        <motion.div
          key="poll"
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <PollCard poll={{ ...poll, closesLabel }} onVote={handleVote} />
        </motion.div>
      ) : (
        <motion.div
          key="resolved"
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <ItineraryUpdateCard
            image={winner?.image}
            label="Dinner"
            title={`@${winner?.name ?? ''}`}
            onAdd={() => onAddExpense?.(winner?.name ?? '')}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
