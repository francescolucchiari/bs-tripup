import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion, animate } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight, WandSparkles } from 'lucide-react'
import Avatar from '../components/Avatar'
import Button from '../components/Button'
import Toggle from '../components/Toggle'
import './ExpensesView.css'

/**
 * ExpensesView — tab "Expenses" del segmented nella Trip view.
 * Contenuto mockato: riepilogo dovuto/da dare, pagamenti che coinvolgono
 * l'utente (incl. la card "You" → Pay verso Tom) e "Others".
 *
 * Props:
 *  - onPay:   (target) => void   apre la modale di pagamento
 *  - settled: boolean            quando true, le card escono a cascata e
 *                                compare lo stato "Everyone's squared up!"
 */

const AV = (n) => `/trip/avatar-${n}.jpg`
const fmtc = (cents) => `€${(cents / 100).toFixed(2)}`

// Anima un valore (in centesimi) verso `target` quando questo cambia.
function useCountCents(target, duration = 1.1) {
  const [v, setV] = useState(target)
  const prev = useRef(target)
  useEffect(() => {
    const controls = animate(prev.current, target, {
      duration,
      ease: 'easeOut',
      onUpdate: (x) => setV(x),
    })
    prev.current = target
    return () => controls.stop()
  }, [target, duration])
  return v
}

const INVOLVING = [
  { id: 'you', name: 'You', src: AV(1), sub: 'Owe Tom €46.00', kind: 'pay',
    target: { name: 'Tom', src: AV(2), amount: 4600 } },
  { id: 'mara', name: 'Mara', src: AV(4), sub: 'Owes You €61.40', kind: 'owed' },
  { id: 'ren', name: 'Ren', src: AV(5), sub: 'Owes You €41.20', kind: 'owed' },
]
const OTHERS = [
  { id: 'nic1', name: 'Nic', src: AV(3), sub: 'Owes Tom €30.80' },
  { id: 'nic2', name: 'Nic', src: AV(3), sub: 'Owes Mara €12.00' },
]

function PersonRow({ p, onPay }) {
  return (
    <div className="exp__person">
      <Avatar size="lg" src={p.src} name={p.name} />
      <div className="exp__person-info">
        <span className="exp__person-name">{p.name}</span>
        <span className="exp__person-sub">{p.sub}</span>
      </div>
      {p.kind === 'pay' && (
        <Button variant="primary" size="md" onClick={() => onPay?.(p.target)}>
          Pay
        </Button>
      )}
    </div>
  )
}

function Card({ p, onPay }) {
  return (
    <motion.div
      className="exp__card"
      layout
      initial={false}
      exit={{ opacity: 0, height: 0, marginBottom: 0, transition: { duration: 0.42, ease: 'easeInOut' } }}
    >
      <PersonRow p={p} onPay={onPay} />
      {p.kind === 'owed' && (
        <div className="exp__actions">
          <button type="button" className="exp__settle">Mark settled</button>
          <button type="button" className="exp__remind">Remind</button>
        </div>
      )}
    </motion.div>
  )
}

export default function ExpensesView({ onPay, settled = false }) {
  const [simplify, setSimplify] = useState(true) // mock
  const owedTotal = useCountCents(settled ? 0 : 10260) // €102.60 → 0
  const oweTotal = useCountCents(settled ? 0 : 4600) //  €46.00  → 0
  const [inv, setInv] = useState(settled ? [] : INVOLVING)
  const [oth, setOth] = useState(settled ? [] : OTHERS)
  const [squared, setSquared] = useState(settled)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  // Alla conferma del pagamento: rimuove le card a cascata (prima "You owe
  // Tom", poi le altre) e infine mostra lo stato "Everyone's squared up!".
  useEffect(() => {
    if (!settled) return
    if (inv.length === 0 && oth.length === 0) {
      setSquared(true)
      return
    }
    const order = [
      ...inv.map((p) => ['inv', p.id]),
      ...oth.map((p) => ['oth', p.id]),
    ]
    // Coreografia irregolare: gap variabili prima di ciascuna rimozione —
    // una card, pausa lunga, due ravvicinate, pausa lunga, due ravvicinate.
    const GAPS = [550, 1000, 480, 1150, 520] // ms di attesa prima di ogni card
    let acc = 0
    order.forEach(([grp, id], i) => {
      acc += GAPS[i] ?? 650
      const at = acc
      const t = setTimeout(() => {
        if (grp === 'inv') setInv((l) => l.filter((p) => p.id !== id))
        else setOth((l) => l.filter((p) => p.id !== id))
      }, at)
      timers.current.push(t)
    })
    const done = setTimeout(() => setSquared(true), acc + 950)
    timers.current.push(done)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settled])

  return (
    <div className="exp">
      {/* Riepilogo */}
      <div className="exp__summary">
        <div className="exp__totals">
          <div className="exp__total">
            <span className="exp__total-label">
              <ArrowUpRight size={16} strokeWidth={2} /> You are owed
            </span>
            <span className="exp__total-value">{fmtc(owedTotal)}</span>
          </div>
          <span className="exp__total-divider" aria-hidden="true" />
          <div className="exp__total">
            <span className="exp__total-label exp__total-label--owe">
              <ArrowDownRight size={16} strokeWidth={2} /> You owe
            </span>
            <span className="exp__total-value exp__total-value--owe">{fmtc(oweTotal)}</span>
          </div>
        </div>
        <div className="exp__simplify">
          <span className="exp__simplify-label">
            <WandSparkles size={16} strokeWidth={2} /> Payment simplification is on
          </span>
          <Toggle checked={simplify} onChange={setSimplify} />
        </div>
      </div>

      {squared ? (
        <motion.div
          className="exp__empty"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <span className="exp__empty-illus" aria-hidden="true">
            <img
              src="/illus/squared.png"
              alt=""
              onError={(e) => {
                // asset non ancora caricato → resta il cerchio pieno
                e.currentTarget.style.display = 'none'
              }}
            />
          </span>
          <h3 className="exp__empty-title">Everyone’s squared up!</h3>
          <p className="exp__empty-sub">Good job, keep enjoying the trip</p>
        </motion.div>
      ) : (
        <>
          {inv.length > 0 && (
            <section className="exp__section">
              <h3 className="exp__section-title">Payments involving you</h3>
              <div className="exp__cards">
                <AnimatePresence>
                  {inv.map((p) => (
                    <Card key={p.id} p={p} onPay={onPay} />
                  ))}
                </AnimatePresence>
              </div>
            </section>
          )}

          {oth.length > 0 && (
            <section className="exp__section">
              <h3 className="exp__section-title">Others</h3>
              <div className="exp__cards">
                <AnimatePresence>
                  {oth.map((p) => (
                    <Card key={p.id} p={p} onPay={onPay} />
                  ))}
                </AnimatePresence>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
