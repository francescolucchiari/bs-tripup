import { useState, useRef, useLayoutEffect } from 'react'
import { ChevronLeft, Plus, Pencil, Map, Activity, Vote } from 'lucide-react'
import SegmentedControl from '../components/SegmentedControl'
import AvatarStack from '../components/AvatarStack'
import TabBar from '../components/TabBar'
import ItineraryCardPreview from '../components/ItineraryCardPreview'
import PollFlow from '../components/PollFlow'
import AddExpenseModal from './AddExpenseModal'
import CreatePollModal from './CreatePollModal'
import './TripScreen.css'

/**
 * 2 · Trip view / Itinerary — hub del viaggio.
 * Header (cover + partecipanti) e segmented sono un layer fisso in alto;
 * la lista attività scorre sotto, sbucando dietro una fascia con
 * gradiente + backdrop-blur. Timeline a griglia: ogni marker giorno è
 * allineato per riga alla sua card (raggruppamento per data).
 *
 * Asset (cover + thumbnail cibo) in attesa di export: finché `null` la card
 * mostra il placeholder icona e la cover un fondo neutro.
 */
const ASSETS = {
  cover: '/trip/cover.jpg',
  eat1: '/trip/eat-lumi.jpg',
  eat2: '/trip/eat-retasco.jpg',
  eat3: '/trip/eat-timeout.jpg',
  blob: '/trip/header-blob.svg',
}

// L'utente corrente ("me") è l'avatar 1 (Ana). Stato iniziale: 4 partecipanti.
// Il 5° (Ren, avatar-5) verrà aggiunto tramite il futuro flusso "aggiungi partecipante".
const PARTICIPANTS = [
  { name: 'Ana', src: '/trip/avatar-1.jpg' }, // me
  { name: 'Tom', src: '/trip/avatar-2.jpg' },
  { name: 'Nic', src: '/trip/avatar-3.jpg' },
  { name: 'Mara', src: '/trip/avatar-4.jpg' },
]

// Immagini delle opzioni: in attesa degli export (vedi nomenclatura opt-*).
// Finché mancano, il thumb mostra il placeholder grigio.
const POLL_OPTIONS = [
  { id: 'timeout', name: 'Time Out Market', quote: 'Classy and very tasty', image: '/trip/opt-timeout.jpg' },
  { id: 'ramiro', name: 'Ramiro', quote: 'Great steaks!', image: '/trip/opt-ramiro.jpg' },
  { id: 'cevicheria', name: 'A Cevicheria', quote: 'Typical portuguese food', image: '/trip/opt-cevicheria.jpg' },
]

const TABS = [
  { key: 'travels', label: 'Travels', icon: Map },
  { key: 'activity', label: 'Activity', icon: Activity },
  { key: 'profile', label: 'Profile', avatar: { name: 'Ana', src: '/trip/avatar-1.jpg' } },
]

// Partecipanti della spesa (modale Add expense): il primo è "You" (chi paga).
// A questo punto del flusso il gruppo è completo con Ren (avatar-5).
const EXPENSE_PARTICIPANTS = [
  { id: 'me', name: 'You', src: '/trip/avatar-1.jpg' },
  { id: 'tom', name: 'Tom', src: '/trip/avatar-2.jpg' },
  { id: 'nic', name: 'Nic', src: '/trip/avatar-3.jpg' },
  { id: 'mara', name: 'Mara', src: '/trip/avatar-4.jpg' },
  { id: 'ren', name: 'Ren', src: '/trip/avatar-5.jpg' },
]

export default function TripScreen({ onNext, onBack }) {
  const [seg, setSeg] = useState('itinerary')
  const [expense, setExpense] = useState(null) // { placeName } quando la modale è aperta
  const [createOpen, setCreateOpen] = useState(false) // modale "Create new poll"
  const [pollCreated, setPollCreated] = useState(false) // poll attivo nell'itinerario
  const scrollRef = useRef(null)
  const tueRef = useRef(null)
  const scrollMem = useRef(0) // posizione di scroll salvata dell'itinerario
  const initedRef = useRef(false)

  // La vista Itinerary resta sempre montata (solo nascosta su "Expenses"),
  // così lo stato interno — incluso il poll — non si resetta cambiando segmento.
  //  - prima apertura: allinea Tue 9 in cima (vista iniziale invariata)
  //  - ritorno da Expenses: ripristina la posizione di scroll salvata
  useLayoutEffect(() => {
    const s = scrollRef.current
    if (!s || seg !== 'itinerary') return
    if (initedRef.current) {
      s.scrollTop = scrollMem.current
      return
    }
    const t = tueRef.current
    if (!t) return
    const align = () => {
      const pt = parseFloat(getComputedStyle(s).paddingTop) || 0
      s.scrollTop = Math.max(0, t.offsetTop - pt)
    }
    align()
    document.fonts?.ready.then(align) // riallinea dopo il load dei font
    initedRef.current = true
  }, [seg])

  // Salva dove eri nell'itinerario prima di passare a un altro segmento.
  const handleSeg = (next) => {
    if (seg === 'itinerary' && scrollRef.current) {
      scrollMem.current = scrollRef.current.scrollTop
    }
    setSeg(next)
  }

  return (
    <div className="trip">
      {/* ---- TOP LAYER FISSO (header + segmented + fascia blur) ---- */}
      <div className="trip__top">
        <header className="trip__header">
          <img className="trip__blob" src={ASSETS.blob} alt="" aria-hidden="true" />

          {onBack && (
            <button className="trip__back" onClick={onBack} aria-label="Indietro">
              <ChevronLeft size={24} strokeWidth={2.25} />
            </button>
          )}

          <div className="trip__cover">
            {ASSETS.cover ? (
              <img src={ASSETS.cover} alt="" />
            ) : (
              <span className="trip__cover-ph" aria-hidden="true" />
            )}
            <button className="trip__cover-edit" aria-label="Modifica copertina">
              <Pencil size={16} strokeWidth={2.25} />
            </button>
          </div>

          <div className="trip__intro">
            <h1 className="trip__title">Lisbon Gateway</h1>
            <p className="trip__meta">June 6 - 10 · 4 participants</p>
            <div className="trip__participants">
              <AvatarStack avatars={PARTICIPANTS} max={5} size="sm" />
              <button
                className="trip__add"
                onClick={onNext}
                aria-label="Aggiungi partecipante"
              >
                <Plus size={24} strokeWidth={2} />
              </button>
            </div>
          </div>
        </header>

        {/* fascia progressive-blur (dietro al segmented) + segmented trasparente:
            il contenuto sfuma con continuità attraversando tutta la zona,
            senza scalino sul bordo del segmented. */}
        <div className="trip__belowfold">
          <div className="trip__fade" aria-hidden="true">
            <div className="trip__fade-layer" />
            <div className="trip__fade-layer" />
            <div className="trip__fade-layer" />
            <div className="trip__fade-layer" />
            <div className="trip__fade-layer" />
            <div className="trip__fade-layer" />
            <div className="trip__fade-veil" />
          </div>

          <div className="trip__segmented">
            <SegmentedControl
              segments={[
                { value: 'itinerary', label: 'Itinerary' },
                { value: 'expenses', label: 'Expenses' },
              ]}
              value={seg}
              onChange={handleSeg}
            />
          </div>
        </div>
      </div>

      {/* ---- CONTENUTO SCROLLABILE (scorre sotto il top layer) ---- */}
      <div className="trip__scroll" ref={scrollRef}>
        {/* Itinerary sempre montato (nascosto su Expenses) così lo stato del
            poll non si resetta cambiando segmento. */}
        <div
          className="trip__timeline"
          style={seg === 'itinerary' ? undefined : { display: 'none' }}
        >
            {/* Lunedì 8 — 3 attività (immagini in arrivo) */}
            <div className="rail" data-spine="down">
              <span className="daymark">
                <span className="daymark__dow">Mon</span>
                <span className="daymark__num">8</span>
              </span>
            </div>
            <ItineraryCardPreview
              label="Brunch"
              title="@Pastelaria S. Antonio"
              amount="€23.75"
            />

            <div className="rail" data-spine="through" />
            <ItineraryCardPreview
              label="Lunch"
              title="@Brunch And Bites - Alfama"
              amount="€64.25"
            />

            <div className="rail" data-spine="through" />
            <ItineraryCardPreview
              label="Dinner"
              title="@Koppu Ramen Izakaya - Chiado"
              amount="€75.00"
            />

            {/* Martedì 9 — Lumi Rooftop + Re'Tasco */}
            <div className="rail" data-spine="through" ref={tueRef}>
              <span className="daymark">
                <span className="daymark__dow">Tue</span>
                <span className="daymark__num">9</span>
              </span>
            </div>
            <ItineraryCardPreview
              image={ASSETS.eat1}
              label="Lunch"
              title="@Lumi Rooftop"
              amount="€47.80"
            />

            <div className="rail" data-spine="through" />
            <ItineraryCardPreview
              image={ASSETS.eat2}
              label="Dinner"
              title="@Re'Tasco"
              amount="€110.00"
            />

            {/* Mercoledì 10 — Time Out Market + Not planned */}
            <div className="rail" data-spine="through">
              <span className="daymark daymark--active">
                <span className="daymark__dow">Wed</span>
                <span className="daymark__num">10</span>
              </span>
            </div>
            <ItineraryCardPreview
              image={ASSETS.eat3}
              label="Lunch"
              title="@Time Out Market"
              amount="€76.00"
            />

            {pollCreated ? (
              <>
                <div className="rail" data-spine="up" data-align="top">
                  <span className="daymark__poll">
                    <Vote size={20} strokeWidth={2.25} />
                  </span>
                </div>
                <PollFlow
                  question="Where should we eat tonight?"
                  options={POLL_OPTIONS}
                  onAddExpense={(place) => setExpense({ placeName: place })}
                />
              </>
            ) : (
              <>
                <div className="rail" data-spine="up">
                  <span className="daymark__dot" />
                </div>
                <ItineraryCardPreview
                  empty
                  label="Dinner"
                  title="Not planned"
                  onClick={() => setCreateOpen(true)}
                />
              </>
            )}
        </div>
        {seg === 'expenses' && (
          <p className="trip__expenses-note">Expenses — in arrivo</p>
        )}
      </div>

      <TabBar active="travels" tabs={TABS} fixed />

      <CreatePollModal
        open={createOpen}
        options={POLL_OPTIONS}
        onClose={() => setCreateOpen(false)}
        onCreate={() => {
          setCreateOpen(false)
          setPollCreated(true) // il poll parte subito attivo nell'itinerario
        }}
      />

      <AddExpenseModal
        open={!!expense}
        placeName={expense?.placeName}
        participants={EXPENSE_PARTICIPANTS}
        onClose={() => setExpense(null)}
      />
    </div>
  )
}
