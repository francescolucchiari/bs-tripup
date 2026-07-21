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
 *  2. arrivano voti simulati (INCOMING) → totale 5
 *  3. all-voted → countdown 5s
 *  4. a 0 → closed-celebration (coriandoli)
 *  5. ~1.5s dopo → itinerary-update (vincitore = max voti)
 *
 * Props:
 *  - question
 *  - options: [{ id, name, quote, image }]
 */

const ME = '/trip/avatar-5.jpg'

// voti in arrivo dopo il mio: [opzione, avatar, ritardo(ms) dal mio voto]
const INCOMING = [
  { opt: 'timeout', avatar: '/trip/avatar-1.jpg', at: 1500 },
  { opt: 'ramiro', avatar: '/trip/avatar-2.jpg', at: 3000 },
  { opt: 'ramiro', avatar: '/trip/avatar-3.jpg', at: 4600 },
  { opt: 'cevicheria', avatar: '/trip/avatar-4.jpg', at: 6200 },
]

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

export default function PollFlow({ question, options }) {
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
      setPoll((p) => {
        const winner = [...p.options].sort((a, b) => b.voters.length - a.voters.length)[0]
        return { ...p, status: 'closed', winnerId: winner.id }
      })
      const t = setTimeout(() => setPhase('resolved'), 1500)
      timers.current.push(t)
      return undefined
    }
    const id = setTimeout(() => setClosing((c) => c - 1), 1000)
    return () => clearTimeout(id)
  }, [closing])

  const handleVote = useCallback((optId) => {
    if (startedRef.current) return
    startedRef.current = true
    setPoll((p) => addVote(p, optId, ME, true))
    INCOMING.forEach((step) => {
      const t = setTimeout(
        () => setPoll((p) => addVote(p, step.opt, step.avatar, false)),
        step.at,
      )
      timers.current.push(t)
    })
    // dopo l'ultimo voto: all-voted + avvio countdown 5s
    const tv = setTimeout(() => {
      setPoll((p) => ({ ...p, allVoted: true }))
      setClosing(5)
    }, INCOMING[INCOMING.length - 1].at + 400)
    timers.current.push(tv)
  }, [])

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
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
