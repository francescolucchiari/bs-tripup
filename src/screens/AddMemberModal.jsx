import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Search } from 'lucide-react'
import Button from '../components/Button'
import Toggle from '../components/Toggle'
import Avatar from '../components/Avatar'
import './AddMemberModal.css'

/**
 * AddMemberModal — bottom-sheet "Add to “Lisbon Gateway”" (overlay in TripScreen).
 * Aperta dal "+" del pill partecipanti nell'header del viaggio.
 *
 * Contenuto mockato tranne l'invito a Ren: tap su "Add" → CTA "Invite sent"
 * disabilitata; si prosegue solo con "Continue" (→ onContinue(invited)).
 *
 * Props:
 *  - open:         boolean
 *  - onClose:      () => void  (X / overlay — chiude senza proseguire)
 *  - onContinue:   (invited: boolean) => void
 *  - participants: [{ name, src }] — per il cluster di bubble e il conteggio
 *  - companions:   [{ id, name, src }] — lista amici; il primo è Ren (invitabile)
 */
export default function AddMemberModal({
  open,
  onClose,
  onContinue,
  participants = [],
  companions = [],
}) {
  const [expenses, setExpenses] = useState(false) // solo estetico
  const [invited, setInvited] = useState(false) // Ren invitato

  // posizioni del cluster (dal design: container 109×75); le taglie
  // corrispondono alle size del DS (lg 48 · xs 24 · md 40). `px` serve a
  // calcolare l'offset del centro avatar rispetto al centro del cluster.
  const CLUSTER = { w: 109, h: 75 }
  const BUBBLES = [
    { size: 'lg', px: 48, left: 6, top: 27 },
    { size: 'xs', px: 24, left: 57, top: 51 },
    { size: 'xs', px: 24, left: 27, top: 0 },
    { size: 'md', px: 40, left: 54, top: 8 },
  ]
  // Ren "pending" nel cluster dopo l'invito: entra col ring tratteggiato verde
  const PENDING_POS = { size: 'md', left: 84, top: 34 }
  const pendingUser = invited ? companions[0] : null

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="amm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <motion.div
            className="amm__overlay"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="amm__sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Add to Lisbon Gateway"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            {/* Header */}
            <header className="amm__header">
              <h1 className="amm__title">Add to “Lisbon Gateway”</h1>
              <button className="amm__close" onClick={onClose} aria-label="Chiudi">
                <X size={24} strokeWidth={2.25} />
              </button>
            </header>

            <div className="amm__scroll">
              {/* Cluster partecipanti */}
              <div className="amm__bubbles">
                <div className="amm__cluster">
                  {BUBBLES.map((b, i) => {
                    const p = participants[i]
                    if (!p) return null
                    // parte dal centro del cluster (verso l'interno) e si
                    // sposta verso l'esterno fino alla posizione finale
                    const offX = b.left + b.px / 2 - CLUSTER.w / 2
                    const offY = b.top + b.px / 2 - CLUSTER.h / 2
                    return (
                      <motion.span
                        key={i}
                        className="amm__bubble"
                        style={{ left: b.left, top: b.top }}
                        initial={{ opacity: 0, scale: 0, x: -offX, y: -offY }}
                        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                        transition={{
                          type: 'spring',
                          stiffness: 260,
                          damping: 20,
                          mass: 0.7,
                          delay: 0.12 + i * 0.06,
                        }}
                      >
                        <Avatar size={b.size} src={p.src} name={p.name} />
                      </motion.span>
                    )
                  })}

                  {pendingUser && (
                    <motion.span
                      className="amm__bubble amm__bubble--pending"
                      style={{ left: PENDING_POS.left, top: PENDING_POS.top }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 0.7 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 18, mass: 0.6 }}
                    >
                      <Avatar
                        size={PENDING_POS.size}
                        src={pendingUser.src}
                        name={pendingUser.name}
                      />
                    </motion.span>
                  )}
                </div>
                <span className="amm__count">
                  {participants.length} participants
                  {pendingUser && (
                    <span className="amm__count-pending"> · 1 pending</span>
                  )}
                </span>
              </div>

              {/* Search (mock) */}
              <div className="amm__search">
                <Search size={24} strokeWidth={2} />
                <span>Search friends or add by name</span>
              </div>

              {/* Toggle spese */}
              <div className="amm__row">
                <span className="amm__row-label">Add to whole trip expenses</span>
                <Toggle checked={expenses} onChange={setExpenses} />
              </div>

              {/* Companions */}
              <div className="amm__companions">
                <span className="amm__section-title">Frequent travel companions</span>
                <ul className="amm__list">
                  {companions.map((c, i) => {
                    const isRen = i === 0
                    const sent = isRen && invited
                    return (
                      <li className="amm__person" key={c.id}>
                        <Avatar size="md" src={c.src} name={c.name} />
                        <span className="amm__person-name">{c.name}</span>
                        <Button
                          variant="primary"
                          size="md"
                          disabled={sent}
                          onClick={isRen ? () => setInvited(true) : undefined}
                        >
                          {sent ? 'Invite sent' : 'Add'}
                        </Button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="amm__footer">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => onContinue?.(invited)}
              >
                Continue
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
