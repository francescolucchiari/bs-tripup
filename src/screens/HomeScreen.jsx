import { CalendarX2, ChevronRight, Map, ListChecks } from 'lucide-react'
import Button from '../components/Button'
import Avatar from '../components/Avatar'
import TabBar from '../components/TabBar'
import './HomeScreen.css'

/**
 * 1 · Home / My Trips — schermata d'ingresso del prototipo.
 * Top bar (wordmark + "New trip"), saluto, card del viaggio attivo con
 * striscia di stato sfalsata, griglia dei viaggi passati e TabBar.
 *
 * Solo la card del viaggio attivo naviga (→ Trip view): il resto è mock.
 */

const ASSETS = {
  // cover dedicata: quella dell'itinerario è verticale e qui verrebbe
  // ritagliata male (la card è 313×140, orizzontale)
  cover: '/trip/home-cover.jpg',
  // in attesa di export (vedi handoff): finché mancano resta il placeholder
  dolomiti: '/trip/past-dolomiti.jpg',
  amsterdam: '/trip/past-amsterdam.jpg',
}

// Cluster di avatar "appoggiato" sull'angolo in basso a destra della foto:
// non è contenuto nel riquadro, ci galleggia sopra e ne esce sul fondo
// (Mara e Tom hanno bottom negativo → sconfinano sulla card bianca).
// Offset dal bordo destro/inferiore della cover. Ordine = ordine di stacking.
const COVER_AVATARS = [
  { size: 'md', right: 61, bottom: 15, src: '/trip/avatar-3.jpg', name: 'Nic' },
  { size: 'sm', right: 10, bottom: -15, src: '/trip/avatar-2.jpg', name: 'Tom' },
  { size: 'md', right: 9, bottom: 26, src: '/trip/avatar-1.jpg', name: 'Ari' },
  { size: 'md', right: 47, bottom: -32, src: '/trip/avatar-4.jpg', name: 'Mara' },
]

const PAST_TRIPS = [
  {
    id: 'dolomiti',
    title: 'Ski Dolomiti ‘25',
    dates: 'Dec 22 - Jan 5, 2026',
    people: '6 participants',
    image: ASSETS.dolomiti,
  },
  {
    id: 'amsterdam',
    title: 'Amsterdam ‘24',
    dates: 'Oct 27 - 31, 2024',
    people: '2 participants',
    image: ASSETS.amsterdam,
  },
]

const TABS = [
  { key: 'travels', label: 'Travels', icon: Map },
  { key: 'activity', label: 'Activity', icon: ListChecks },
  { key: 'profile', label: 'Profile', avatar: { name: 'Ari', src: '/trip/avatar-1.jpg' } },
]

export default function HomeScreen({ onNext }) {
  return (
    <div className="home">
      {/* Top bar: wordmark (placeholder) + New trip */}
      <header className="home__bar">
        <img className="home__logo" src="/logo.svg" alt="TripUp" />
        <Button variant="primary" size="md">
          New trip
        </Button>
      </header>

      <div className="home__scroll">
        <h1 className="home__welcome">Welcome back, Ari</h1>

        {/* ---- Active trip ---- */}
        <section className="home__section">
          <h2 className="home__section-title">Active trip</h2>

          <div className="home__active">
            <button className="home__active-card" onClick={onNext}>
              <span className="home__cover">
                <img src={ASSETS.cover} alt="" />
                <span className="home__cover-avatars" aria-hidden="true">
                  {COVER_AVATARS.map((a, i) => (
                    <span
                      key={i}
                      className="home__cover-avatar"
                      style={{ right: a.right, bottom: a.bottom, zIndex: i + 1 }}
                    >
                      <Avatar size={a.size} src={a.src} name={a.name} ring />
                    </span>
                  ))}
                </span>
              </span>
              <span className="home__active-info">
                <span className="home__active-title">Lisbon Gateway</span>
                <span className="home__active-meta">June 6 - 10 · 4 participants</span>
              </span>
            </button>

            <div className="home__active-status">
              <CalendarX2 size={16} strokeWidth={2.25} />
              <span>Tonight · dinner not decided yet</span>
            </div>
          </div>
        </section>

        {/* ---- Past trips ---- */}
        <section className="home__section">
          <div className="home__section-head">
            <h2 className="home__section-title">Past trips</h2>
            <button type="button" className="home__seeall">
              See all
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          </div>

          <div className="home__past">
            {PAST_TRIPS.map((t) => (
              <article className="home__past-card" key={t.id}>
                <span className="home__past-cover">
                  <img
                    src={t.image}
                    alt=""
                    onError={(e) => {
                      // asset non ancora esportato → resta il placeholder
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </span>
                <span className="home__past-title">{t.title}</span>
                <span className="home__past-meta">
                  {t.dates}
                  <br />
                  {t.people}
                </span>
              </article>
            ))}
          </div>
        </section>
      </div>

      <TabBar active="travels" tabs={TABS} fixed />
    </div>
  )
}
