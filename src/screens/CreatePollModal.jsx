import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Pencil, Plus, Minus } from 'lucide-react'
import Button from '../components/Button'
import Toggle from '../components/Toggle'
import './CreatePollModal.css'

/**
 * CreatePollModal — bottom-sheet "Create new poll" (overlay dentro TripScreen).
 * Aperta dal tap sulla card empty "Not planned" dell'itinerario.
 *
 * Contenuto interamente mockato (non editabile): question, 3 opzioni
 * suggerite, expiring time, switch "one vote per participant".
 * Al tap su "Create poll" → onCreate() (il poll diventa attivo inline).
 *
 * Props:
 *  - open:     boolean
 *  - onClose:  () => void  (X / overlay — annulla senza creare)
 *  - onCreate: () => void  (CTA "Create poll")
 *  - options:  [{ id, name, quote, image }] — le 3 opzioni mockate
 */
export default function CreatePollModal({ open, onClose, onCreate, options = [] }) {
  // solo estetico: il contenuto è mockato ma lo switch resta toccabile
  const [oneVote, setOneVote] = useState(true)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cpm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <motion.div
            className="cpm__overlay"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="cpm__sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Create new poll"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            {/* Header */}
            <header className="cpm__header">
              <h1 className="cpm__title">Create new poll</h1>
              <button className="cpm__close" onClick={onClose} aria-label="Chiudi">
                <X size={24} strokeWidth={2.25} />
              </button>
            </header>

            {/* Contenuto scrollabile */}
            <div className="cpm__scroll">
              {/* Question */}
              <div className="cpm__field">
                <div className="cpm__field-body">
                  <span className="cpm__field-label">Question</span>
                  <span className="cpm__field-value">Where should we eat tonight?</span>
                </div>
                <Pencil className="cpm__field-icon" size={20} strokeWidth={2} />
              </div>

              {/* Add options */}
              <div className="cpm__section">
                <div className="cpm__section-head">
                  <span className="cpm__section-title">Add options</span>
                  <span className="cpm__section-sub">
                    Suggested for you · Based on your position
                  </span>
                </div>

                <div className="cpm__options">
                  {options.map((opt, i) => (
                    <div className="cpm__option" key={opt.id}>
                      <span className="cpm__option-num">{i + 1}</span>
                      <div className="cpm__option-card">
                        <span className="cpm__option-thumb">
                          {opt.image && (
                            <img
                              src={opt.image}
                              alt=""
                              onError={(e) => {
                                // asset non ancora esportato → resta il placeholder
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          )}
                        </span>
                        <span className="cpm__option-info">
                          <span className="cpm__option-name">{opt.name}</span>
                          <span className="cpm__option-quote">“{opt.quote}”</span>
                        </span>
                      </div>
                      <button
                        type="button"
                        className="cpm__option-delete"
                        aria-label={`Rimuovi ${opt.name}`}
                      >
                        <Minus size={16} strokeWidth={3} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cpm__add">
                  <Button variant="secondary" size="md" icon={Plus}>
                    Add option
                  </Button>
                </div>
              </div>

              {/* Expiring time */}
              <div className="cpm__field">
                <div className="cpm__field-body">
                  <span className="cpm__field-label">Expiring time</span>
                  <span className="cpm__field-value">30 minutes</span>
                </div>
                <Pencil className="cpm__field-icon" size={20} strokeWidth={2} />
              </div>

              {/* One vote per participant */}
              <div className="cpm__field cpm__field--row">
                <span className="cpm__field-value">One vote per participant</span>
                <Toggle checked={oneVote} onChange={setOneVote} />
              </div>
            </div>

            {/* Footer CTA */}
            <div className="cpm__footer">
              <Button variant="primary" size="lg" fullWidth onClick={onCreate}>
                Create poll
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
