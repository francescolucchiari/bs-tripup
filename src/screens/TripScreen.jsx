import { useState, useRef, useLayoutEffect } from 'react'
import { ChevronLeft, Plus, Pencil, Map, Activity, Vote } from 'lucide-react'
import SegmentedControl from '../components/SegmentedControl'
import AvatarStack from '../components/AvatarStack'
import TabBar from '../components/TabBar'
import ItineraryCardPreview from '../components/ItineraryCardPreview'
import PollFlow from '../components/PollFlow'
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

const PARTICIPANTS = [
  { name: 'Ana', src: '/trip/avatar-1.jpg' },
  { name: 'Bruno', src: '/trip/avatar-2.jpg' },
  { name: 'Chiara', src: '/trip/avatar-3.jpg' },
  { name: 'Dario', src: '/trip/avatar-4.jpg' },
  { name: 'Fra', src: '/trip/avatar-5.jpg' },
]

const POLL_OPTIONS = [
  { id: 'timeout', name: 'Time Out Market', quote: 'Classy and very tasty', image: '/trip/eat-timeout.jpg' },
  { id: 'ramiro', name: 'Ramiro', quote: 'Great steaks!', image: '/trip/eat-retasco.jpg' },
  { id: 'cevicheria', name: 'A Cevicheria', quote: 'Typical portuguese food', image: '/trip/eat-lumi.jpg' },
]

const TABS = [
  { key: 'travels', label: 'Travels', icon: Map },
  { key: 'activity', label: 'Activity', icon: Activity },
  { key: 'profile', label: 'Profile', avatar: { name: 'Fra', src: '/trip/avatar-5.jpg' } },
]

export default function TripScreen({ onNext, onBack }) {
  const [seg, setSeg] = useState('itinerary')
  const scrollRef = useRef(null)
  const tueRef = useRef(null)

  // Vista iniziale invariata: porta la riga di Tue 9 dove partiva prima,
  // così Mon 8 resta sopra e si raggiunge scrollando verso l'alto.
  useLayoutEffect(() => {
    const s = scrollRef.current
    const t = tueRef.current
    if (!s || !t) return
    const align = () => {
      const pt = parseFloat(getComputedStyle(s).paddingTop) || 0
      s.scrollTop = Math.max(0, t.offsetTop - pt)
    }
    align()
    document.fonts?.ready.then(align) // riallinea dopo il load dei font
  }, [seg])

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
            <p className="trip__meta">June 6 - 10 · 5 participants</p>
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
              onChange={setSeg}
            />
          </div>
        </div>
      </div>

      {/* ---- CONTENUTO SCROLLABILE (scorre sotto il top layer) ---- */}
      <div className="trip__scroll" ref={scrollRef}>
        {seg === 'itinerary' ? (
          <div className="trip__timeline">
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

            <div className="rail" data-spine="up" data-align="top">
              <span className="daymark__poll">
                <Vote size={20} strokeWidth={2.25} />
              </span>
            </div>
            <PollFlow question="Where should we eat tonight?" options={POLL_OPTIONS} />
          </div>
        ) : (
          <p className="trip__expenses-note">Expenses — in arrivo</p>
        )}
      </div>

      <TabBar active="travels" tabs={TABS} fixed />
    </div>
  )
}
