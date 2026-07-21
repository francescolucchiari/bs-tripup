import { motion, AnimatePresence } from 'framer-motion'
import { Vote, Hourglass, Check } from 'lucide-react'
import Badge from './Badge'
import Radio from './Radio'
import ProgressBar from './ProgressBar'
import Avatar from './Avatar'
import RollingNumber from './RollingNumber'
import './PollCard.css'

/**
 * PollCard — sondaggio inline dell'itinerario (prende il posto della card
 * "Not planned"). Data-driven + animato (framer-motion):
 *  - avatar votante in scale-up dal centro (AnimatePresence)
 *  - conteggio che rulla dal basso (RollingNumber)
 *  - barre che si riempiono (transizione CSS di ProgressBar)
 *  - inner-glow arancio pulsante quando è attivo (CSS keyframes)
 *  - coriandoli che cadono in fade-out quando è chiuso
 *
 * poll = {
 *   question, status:'open'|'closed', closesLabel, allVoted,
 *   myVoteId, winnerId,
 *   options: [{ id, name, quote, image?, voters: [srcAvatar, ...] }],
 * }
 * Le barre sono relative al massimo dei voti (l'opzione in testa è piena).
 *
 * Props:
 *  - poll
 *  - onVote: (optionId) => void   (marker = <Radio/>)
 */

const CONFETTI = [
  { left: '-4px', top: '22px', rot: 20, fall: 150, delay: 0 },
  { left: '64px', top: '-12px', rot: 105, fall: 200, delay: 0.05 },
  { left: '46%', top: '-16px', rot: -64, fall: 210, delay: 0.02 },
  { left: '72%', top: '30px', rot: 8, fall: 165, delay: 0.09 },
  { right: '-4px', top: '28px', rot: 12, fall: 180, delay: 0.04 },
  { left: '30%', top: '46px', rot: -20, fall: 140, delay: 0.12 },
]

export default function PollCard({ poll, onVote }) {
  const { question, status, closesLabel, allVoted, myVoteId, winnerId, options } = poll
  const isClosed = status === 'closed'
  const maxVotes = options.reduce((m, o) => Math.max(m, o.voters.length), 0)
  const totalVotes = options.reduce((s, o) => s + o.voters.length, 0)
  const winner = options.find((o) => o.id === winnerId)

  return (
    <div className="poll" data-status={status}>
      {isClosed && (
        <div className="poll__confetti" aria-hidden="true">
          {CONFETTI.map((c, i) => (
            <motion.span
              key={i}
              className="poll__confetti-item"
              style={{ left: c.left, right: c.right, top: c.top }}
              initial={{ y: 0, opacity: 0, scale: 0.6, rotate: c.rot }}
              animate={{ y: c.fall, opacity: [0, 1, 1, 0], scale: 1, rotate: c.rot + 18 }}
              transition={{ duration: 0.95, ease: 'easeOut', times: [0, 0.12, 0.5, 1], delay: c.delay }}
            >
              🎉
            </motion.span>
          ))}
        </div>
      )}

      <div className="poll__head">
        <div className="poll__badges">
          {isClosed ? (
            <>
              <Badge variant="warning" size="md" uppercase={false} icon={Vote}>
                Poll closed
              </Badge>
              {winner && <span className="poll__won">{winner.name} won!</span>}
            </>
          ) : (
            <>
              <Badge variant="warning" size="md" uppercase={false} icon={Vote}>
                Active poll
              </Badge>
              {allVoted ? (
                <Badge variant="success" size="md" uppercase={false} icon={Check}>
                  All voted · Closing in {closesLabel}
                </Badge>
              ) : (
                <Badge variant="neutral" size="md" uppercase={false} icon={Hourglass}>
                  Closes in {closesLabel}
                </Badge>
              )}
            </>
          )}
        </div>
        <h3 className="poll__title">{question}</h3>
      </div>

      <ul className="poll__options" data-dense={totalVotes > 0 || undefined}>
        {options.map((opt) => {
          const count = opt.voters.length
          const pct = maxVotes > 0 ? (count / maxVotes) * 100 : 0
          const mine = opt.id === myVoteId
          return (
            <li className="poll-option" key={opt.id}>
              <div className="poll-option__row">
                <Radio checked={mine} value={opt.id} onChange={onVote} />
                <div className="poll-option__info">
                  <span className="poll-option__name">{opt.name}</span>
                  <span className="poll-option__quote">“{opt.quote}”</span>
                </div>
                <div className="poll-option__tally">
                  <div className="poll-option__avatars">
                    <AnimatePresence initial={false}>
                      {opt.voters.map((src, i) => (
                        <motion.span
                          key={src}
                          className="poll-option__avatar"
                          style={{ marginLeft: i === 0 ? 0 : -8, zIndex: i + 1 }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: 'spring', stiffness: 520, damping: 22 }}
                        >
                          <Avatar size="xs" src={src} ring />
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  </div>
                  <RollingNumber value={count} className="poll-option__count" />
                </div>
              </div>
              <div className="poll-option__barwrap">
                <ProgressBar value={pct} size="md" />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
