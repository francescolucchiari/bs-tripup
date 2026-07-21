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
 *  2. arrivano 3 voti simulati (gli altri 3 partecipanti) → totale 4
 *  3. all-voted → countdown 5s
 *  4. a 0 → closed-celebration (coriandoli)
 *  5. ~1.5s dopo → itinerary-update (vince sempre l'opzione votata dall'utente)
 *
 * Props:
 *  - question
 *  - options: [{ id, name, quote, image }]
 */

const ME = '/trip/avatar-1.jpg' // utente corrente

// Voti simulati in arrivo dopo il mio: sono gli altri 3 partecipanti del
// viaggio (avatar 2-4), con relativo ritardo(ms). Le OPZIONI target non sono
// fisse: vengono calcolate in base alla scelta dell'utente (vedi handleVote),
// così la sua opzione vince sempre senza pareggi.
const INCOMING_AVATARS = [
  '/trip/avatar-2.jpg',
  '/trip/avatar-3.jpg',
  '/trip/avatar-4.jpg',
]
const INCOMING_TIMES = [1500, 3000, 4600]

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

export default function PollFlow({ question, options, onAddExpense }) {
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
      const t = setTimeout(() => setPhase('resolved'), 1500)
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
      const targets = [...rivals]
      while (targets.length < INCOMING_TIMES.length) targets.push(optId)

      targets.forEach((target, i) => {
        const t = setTimeout(
          () => setPoll((p) => addVote(p, target, INCOMING_AVATARS[i], false)),
          INCOMING_TIMES[i],
        )
        timers.current.push(t)
      })

      // dopo l'ultimo voto: all-voted + avvio countdown 5s
      const tv = setTimeout(() => {
        setPoll((p) => ({ ...p, allVoted: true }))
        setClosing(5)
      }, INCOMING_TIMES[INCOMING_TIMES.length - 1] + 400)
      timers.current.push(tv)
    },
    [options],
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
