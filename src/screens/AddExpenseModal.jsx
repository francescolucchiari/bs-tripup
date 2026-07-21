import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronDown, Pencil, Plus, Check, Minus } from 'lucide-react'
import SegmentedControl from '../components/SegmentedControl'
import Button from '../components/Button'
import Avatar from '../components/Avatar'
import './AddExpenseModal.css'

/**
 * AddExpenseModal — modale full-screen "Add expense" (overlay dentro TripScreen).
 * Aperta dal tasto "Add" della card cena. Tre metodi di divisione via
 * SegmentedControl: Amount (equa tra tutti), Percent (placeholder), Split by
 * items (itemizzazione con selezione partecipanti).
 *
 * Props:
 *  - open:      boolean
 *  - onClose:   () => void  (back chevron)
 *  - placeName: nome del posto vincitore del poll (per il prefill del Name)
 *  - participants: [{ id, name, src }] — il primo è "You" (chi paga)
 */

/* ---- money helpers (centesimi-accurati: le quote sommano sempre al totale) ---- */
const parseAmt = (s) => {
  const n = parseFloat(String(s ?? '').replace(',', '.'))
  return Number.isFinite(n) && n > 0 ? n : 0
}
const fmt = (cents) => `€${(cents / 100).toFixed(2)}`

// divide totalCents equamente in n quote; i centesimi di resto vanno ai primi
// (indice 0 = chi paga), così la somma resta esatta.
const equalCents = (totalCents, n) => {
  if (n <= 0) return []
  const base = Math.floor(totalCents / n)
  const rem = totalCents - base * n
  return Array.from({ length: n }, (_, i) => base + (i < rem ? 1 : 0))
}

// id univoci anche attraverso gli HMR reload (un contatore puro si resetta
// col modulo e può generare chiavi duplicate)
let SPLIT_SEQ = 0
const splitId = () => `split-${Date.now().toString(36)}-${SPLIT_SEQ++}`

export default function AddExpenseModal({ open, onClose, placeName = '', participants = [] }) {
  const me = participants[0]
  const others = participants.slice(1)

  const [name, setName] = useState('')
  const [paid, setPaid] = useState('') // stringa, vuoto = da riempire
  const [tab, setTab] = useState('amount')
  const [splits, setSplits] = useState([])

  // prefill dinamico del Name in base al posto vincitore
  const displayName = name || (placeName ? `Dinner at ${placeName}` : '')
  const paidCents = Math.round(parseAmt(paid) * 100)

  /* ---- Amount: divisione equa tra tutti i partecipanti ---- */
  const amountShares = useMemo(
    () => equalCents(paidCents, participants.length),
    [paidCents, participants.length],
  )
  const amountOwedCents = paidCents - (amountShares[0] ?? 0) // = somma quote altrui

  /* ---- Split by items: quote per persona + assegnato ---- */
  const items = useMemo(() => {
    const perPerson = Object.fromEntries(participants.map((p) => [p.id, 0]))
    let assigned = 0
    for (const s of splits) {
      const cCents = Math.round(parseAmt(s.cost) * 100)
      assigned += cCents
      const memberIds = participants.filter((p) => s.members.includes(p.id)).map((p) => p.id)
      const shares = equalCents(cCents, memberIds.length)
      memberIds.forEach((id, i) => {
        perPerson[id] += shares[i]
      })
    }
    const owed = others.reduce((sum, p) => sum + perPerson[p.id], 0)
    return { assigned, owed }
  }, [splits, participants, others])

  const owedCents = tab === 'items' ? items.owed : amountOwedCents

  /* ---- azioni split ---- */
  const addSplit = () =>
    setSplits((s) => {
      const isFirst = s.length === 0
      const assignedCents = s.reduce(
        (sum, sp) => sum + Math.round(parseAmt(sp.cost) * 100),
        0,
      )
      const remainingCents = Math.max(0, paidCents - assignedCents)
      // 1ª split: importo vuoto (da inserire). Successive: prefill col rimanente
      // (totale − già assegnato), così non serve la sottrazione a mente.
      const cost =
        isFirst || remainingCents === 0 ? '' : (remainingCents / 100).toFixed(2)
      // di default lo split è diviso tra TUTTI i partecipanti
      return [
        ...s,
        {
          id: splitId(),
          name: '',
          cost,
          members: participants.map((p) => p.id),
        },
      ]
    })
  const updateSplit = (id, patch) =>
    setSplits((s) => s.map((sp) => (sp.id === id ? { ...sp, ...patch } : sp)))
  const removeSplit = (id) => setSplits((s) => s.filter((sp) => sp.id !== id))
  const toggleMember = (id, pid) =>
    setSplits((s) =>
      s.map((sp) =>
        sp.id === id
          ? {
              ...sp,
              members: sp.members.includes(pid)
                ? sp.members.filter((m) => m !== pid)
                : [...sp.members, pid],
            }
          : sp,
      ),
    )

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="axp"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* Header */}
          <header className="axp__header">
            <button className="axp__back" onClick={onClose} aria-label="Chiudi">
              <ChevronLeft size={24} strokeWidth={2} />
            </button>
            <div className="axp__titles">
              <h1 className="axp__title">Add expense</h1>
              <p className="axp__subtitle">
                to <strong>Lisbon Gateway</strong>
              </p>
            </div>
          </header>

          {/* Contenuto scrollabile */}
          <div className="axp__scroll">
            {/* Name */}
            <div className="axp__field">
              <div className="axp__field-body">
                <span className="axp__field-label">Name</span>
                <input
                  className="axp__field-input"
                  value={displayName}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Expense name"
                />
              </div>
              <Pencil className="axp__field-icon" size={20} strokeWidth={2} />
            </div>

            {/* You paid */}
            <div className="axp__paid">
              <Avatar size="lg" src={me?.src} name={me?.name} />
              <div className="axp__paid-info">
                <span className="axp__paid-title">You paid</span>
                <span className="axp__paid-date">10 Jun</span>
              </div>
              <label className="axp__paid-amount" aria-label="Importo pagato">
                <span className="axp__paid-cur">€</span>
                <input
                  className="axp__paid-input"
                  inputMode="decimal"
                  value={paid}
                  onChange={(e) => setPaid(e.target.value.replace(/[^\d.,]/g, ''))}
                  placeholder="0.00"
                />
              </label>
            </div>

            {/* You are owed — accordion (solo chiuso in questa iterazione) */}
            <button className="axp__owed" type="button">
              <span className="axp__owed-main">
                <span className="axp__owed-label">You are owed</span>
                <span className="axp__owed-value">{fmt(Math.max(0, owedCents))}</span>
              </span>
              <span className="axp__owed-details">
                Details
                <ChevronDown size={20} strokeWidth={2.25} />
              </span>
            </button>

            {/* Segmented */}
            <div className="axp__segmented">
              <SegmentedControl
                segments={[
                  { value: 'amount', label: 'Amount' },
                  { value: 'percent', label: 'Percent' },
                  { value: 'items', label: 'Split by items' },
                ]}
                value={tab}
                onChange={setTab}
              />
            </div>

            {/* Tab content */}
            {tab === 'amount' && (
              <div className="axp__card axp__division">
                <span className="axp__card-title">Total division</span>
                <ul className="axp__people">
                  {participants.map((p, i) => (
                    <li className="axp__person" key={p.id}>
                      <Avatar size="md" src={p.src} name={p.name} />
                      <span className="axp__person-info">
                        <span className="axp__person-name">{p.name}</span>
                        {i !== 0 && <span className="axp__person-sub">Owes you</span>}
                      </span>
                      <span className="axp__person-amount">{fmt(amountShares[i] ?? 0)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tab === 'percent' && (
              <div className="axp__card axp__placeholder">
                <span>Percent — in arrivo</span>
              </div>
            )}

            {tab === 'items' && (
              <div className="axp__items">
                {splits.length === 0 ? (
                  <div className="axp__card axp__split-empty">
                    <span className="axp__split-empty-text">
                      Split each item with different people
                    </span>
                    <Button variant="secondary" size="md" icon={Plus} onClick={addSplit}>
                      New split
                    </Button>
                  </div>
                ) : (
                  <div className="axp__split-stack">
                    <div
                      className="axp__assigned"
                      data-complete={items.assigned === paidCents && paidCents > 0 || undefined}
                    >
                      {items.assigned === paidCents && paidCents > 0 && (
                        <Check size={16} strokeWidth={2.5} />
                      )}
                      {fmt(items.assigned)} of {fmt(paidCents)} assigned
                    </div>

                    <div className="axp__card axp__split-card">
                    <AnimatePresence initial={false}>
                      {splits.map((s) => (
                        <motion.div
                          key={s.id}
                          className="axp__split"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.28, ease: 'easeOut' }}
                        >
                          <div className="axp__split-head">
                            <input
                              className="axp__split-name"
                              value={s.name}
                              onChange={(e) => updateSplit(s.id, { name: e.target.value })}
                              placeholder="e.g. food"
                            />
                            <div className="axp__split-right">
                              <label className="axp__split-cost">
                                <span>€</span>
                                <input
                                  inputMode="decimal"
                                  value={s.cost}
                                  onChange={(e) =>
                                    updateSplit(s.id, {
                                      cost: e.target.value.replace(/[^\d.,]/g, ''),
                                    })
                                  }
                                  placeholder="0.00"
                                />
                              </label>
                              {splits.length >= 2 && (
                                <button
                                  type="button"
                                  className="axp__split-delete"
                                  onClick={() => removeSplit(s.id)}
                                  aria-label="Elimina split"
                                >
                                  <Minus size={16} strokeWidth={3} />
                                </button>
                              )}
                            </div>
                          </div>
                          <span className="axp__split-divided">Divided by {s.members.length}</span>
                          <div className="axp__split-people">
                            {participants.map((p) => {
                              const on = s.members.includes(p.id)
                              return (
                                <button
                                  type="button"
                                  key={p.id}
                                  className="axp__pick"
                                  data-on={on || undefined}
                                  onClick={() => toggleMember(s.id, p.id)}
                                  aria-pressed={on}
                                >
                                  <span className="axp__pick-av">
                                    <Avatar size="md" src={p.src} name={p.name} />
                                    {on && (
                                      <span className="axp__pick-check">
                                        <Check size={12} strokeWidth={3} />
                                      </span>
                                    )}
                                  </span>
                                  <span className="axp__pick-name">{p.name}</span>
                                </button>
                              )
                            })}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                      <div className="axp__split-add">
                        <Button variant="secondary" size="md" icon={Plus} onClick={addSplit}>
                          Add split
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer CTA (no-op in questa iterazione) */}
          <div className="axp__footer">
            <Button variant="primary" size="lg" fullWidth>
              Add expense
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
