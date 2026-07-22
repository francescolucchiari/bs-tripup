import { useState, useRef, useLayoutEffect, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ArrowRight, Landmark, PartyPopper } from 'lucide-react'
import Button from '../components/Button'
import Avatar from '../components/Avatar'
import Radio from '../components/Radio'
import './PayModal.css'

/**
 * PayModal — bottom-sheet "Send payment" (overlay in TripScreen).
 * Due fasi nello STESSO sheet: 'send' → 'success'. Alla conferma il pannello
 * si accorcia dinamicamente in altezza (framer, easing) mentre il contenuto
 * fa crossfade.
 *
 * Props:
 *  - open:    boolean
 *  - onClose: () => void        (X / overlay in fase send)
 *  - onDone:  () => void        (CTA "Done" in fase success)
 *  - me:      { name, src }      chi paga ("You")
 *  - target:  { name, src, amount } destinatario + importo in centesimi
 */
const fmt = (cents) => `€${((cents ?? 0) / 100).toFixed(2)}`

export default function PayModal({ open, onClose, onDone, me, target }) {
  const [phase, setPhase] = useState('send')
  const [method, setMethod] = useState('bank')
  const bodyRef = useRef(null)
  const [h, setH] = useState(null)

  // reset alla riapertura
  useEffect(() => {
    if (open) {
      setPhase('send')
      setMethod('bank')
    }
  }, [open])

  // misura l'altezza del contenuto corrente → il pannello anima verso di essa
  useLayoutEffect(() => {
    if (bodyRef.current) setH(bodyRef.current.offsetHeight)
  }, [phase, open])

  const amount = fmt(target?.amount)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="pay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <motion.div
            className="pay__overlay"
            onClick={phase === 'send' ? onClose : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="pay__sheet"
            role="dialog"
            aria-modal="true"
            initial={{ y: '100%' }}
            animate={{ y: 0, ...(h != null ? { height: h } : {}) }}
            exit={{ y: '100%' }}
            transition={{
              y: { type: 'spring', stiffness: 320, damping: 34 },
              height: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
            }}
          >
            <div className="pay__body" ref={bodyRef}>
              <motion.div
                key={phase}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.28, delay: phase === 'success' ? 0.12 : 0 }}
              >
                {phase === 'send' ? (
                  <div className="pay__send">
                    <header className="pay__header">
                      <div className="pay__titles">
                        <h1 className="pay__title">Send payment</h1>
                        <p className="pay__subtitle">Lisbon Gateway</p>
                      </div>
                      <button className="pay__close" onClick={onClose} aria-label="Chiudi">
                        <X size={24} strokeWidth={2.25} />
                      </button>
                    </header>

                    <div className="pay__transfer">
                      <div className="pay__party">
                        <Avatar size="lg" src={me?.src} name={me?.name} />
                        <span className="pay__party-name">{me?.name}</span>
                      </div>
                      <ArrowRight className="pay__arrow" size={24} strokeWidth={2.25} />
                      <div className="pay__party">
                        <Avatar size="lg" src={target?.src} name={target?.name} />
                        <span className="pay__party-name">{target?.name}</span>
                      </div>
                    </div>

                    <p className="pay__amount">{amount}</p>

                    <div className="pay__methods">
                      <span className="pay__methods-title">Preferred payment methods</span>
                      <div
                        className="pay__method"
                        data-on={method === 'bank' || undefined}
                        onClick={() => setMethod('bank')}
                      >
                        <Radio checked={method === 'bank'} value="bank" onChange={setMethod} />
                        <span className="pay__method-icon pay__method-icon--bank">
                          <Landmark size={16} strokeWidth={2} />
                        </span>
                        <span className="pay__method-label">Connected bank account</span>
                      </div>
                      <div
                        className="pay__method"
                        data-on={method === 'apple' || undefined}
                        onClick={() => setMethod('apple')}
                      >
                        <Radio checked={method === 'apple'} value="apple" onChange={setMethod} />
                        <span className="pay__method-icon pay__method-icon--apple">
                          <img className="pay__method-glyph" src="/pay/apple.svg" alt="" />
                        </span>
                        <span className="pay__method-label">Apple Pay</span>
                      </div>
                    </div>

                    <div className="pay__cta">
                      <Button variant="primary" size="lg" fullWidth onClick={() => setPhase('success')}>
                        Send {amount}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="pay__success">
                    <motion.span
                      className="pay__success-badge"
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 18, delay: 0.18 }}
                    >
                      <PartyPopper size={32} strokeWidth={2} />
                    </motion.span>
                    <h1 className="pay__success-title">
                      You sent {amount} to {target?.name}
                    </h1>
                    <p className="pay__success-note">Good job, you’re squared up with everyone</p>
                    <div className="pay__cta">
                      <Button variant="primary" size="lg" fullWidth onClick={onDone}>
                        Done
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
