import { useState } from 'react'
import { ArrowUpRight, ArrowDownRight, WandSparkles } from 'lucide-react'
import Avatar from '../components/Avatar'
import Button from '../components/Button'
import Toggle from '../components/Toggle'
import './ExpensesView.css'

/**
 * ExpensesView — tab "Expenses" del segmented nella Trip view.
 * Contenuto interamente mockato (numeri placeholder): riepilogo dovuto/da
 * dare, elenco pagamenti che coinvolgono l'utente (incl. una card in cui
 * "You" deve dei soldi → Pay) e "Others". I bottoni sono visivi.
 */

const AV = (n) => `/trip/avatar-${n}.jpg`

const INVOLVING = [
  { id: 'you', name: 'You', src: AV(1), sub: 'Owe Tom €46.00', kind: 'pay' },
  { id: 'mara', name: 'Mara', src: AV(4), sub: 'Owes You €61.40', kind: 'owed' },
  { id: 'ren', name: 'Ren', src: AV(5), sub: 'Owes You €41.20', kind: 'owed' },
]
const OTHERS = [
  { id: 'nic1', name: 'Nic', src: AV(3), sub: 'Owes Tom €30.80' },
  { id: 'nic2', name: 'Nic', src: AV(3), sub: 'Owes Mara €12.00' },
]

function PersonRow({ p }) {
  return (
    <div className="exp__person">
      <Avatar size="lg" src={p.src} name={p.name} />
      <div className="exp__person-info">
        <span className="exp__person-name">{p.name}</span>
        <span className="exp__person-sub">{p.sub}</span>
      </div>
      {p.kind === 'pay' && (
        <Button variant="primary" size="md">
          Pay
        </Button>
      )}
    </div>
  )
}

export default function ExpensesView() {
  const [simplify, setSimplify] = useState(true) // mock

  return (
    <div className="exp">
      {/* Riepilogo */}
      <div className="exp__summary">
        <div className="exp__totals">
          <div className="exp__total">
            <span className="exp__total-label">
              <ArrowUpRight size={16} strokeWidth={2} /> You are owed
            </span>
            <span className="exp__total-value">€102.60</span>
          </div>
          <span className="exp__total-divider" aria-hidden="true" />
          <div className="exp__total">
            <span className="exp__total-label exp__total-label--owe">
              <ArrowDownRight size={16} strokeWidth={2} /> You owe
            </span>
            <span className="exp__total-value exp__total-value--owe">€46.00</span>
          </div>
        </div>
        <div className="exp__simplify">
          <span className="exp__simplify-label">
            <WandSparkles size={16} strokeWidth={2} /> Payment simplification is on
          </span>
          <Toggle checked={simplify} onChange={setSimplify} />
        </div>
      </div>

      {/* Payments involving you */}
      <section className="exp__section">
        <h3 className="exp__section-title">Payments involving you</h3>
        <div className="exp__cards">
          {INVOLVING.map((p) => (
            <div className="exp__card" key={p.id}>
              <PersonRow p={p} />
              {p.kind === 'owed' && (
                <div className="exp__actions">
                  <button type="button" className="exp__settle">
                    Mark settled
                  </button>
                  <button type="button" className="exp__remind">
                    Remind
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Others */}
      <section className="exp__section">
        <h3 className="exp__section-title">Others</h3>
        <div className="exp__cards">
          {OTHERS.map((p) => (
            <div className="exp__card" key={p.id}>
              <PersonRow p={p} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
