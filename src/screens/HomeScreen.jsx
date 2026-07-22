import { CalendarX2, ChevronRight, Map, Activity } from 'lucide-react'
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
 * Il logo è un wordmark testuale segnaposto, da sostituire con l'asset.
 */

const ASSETS = {
  cover: '/trip/cover.jpg',
  // in attesa di export (vedi handoff): finché mancano resta il placeholder
  dolomiti: '/trip/past-dolomiti.jpg',
  amsterdam: '/trip/past-amsterdam.jpg',
}

// cluster di avatar sovrapposto alla cover (posizioni dal design, box 85×87)
const COVER_AVATARS = [
  { size: 'md', px: 40, left: 45, top: 0, src: '/trip/avatar-2.jpg', name: 'Tom' },
  { size: 'sm', px: 28, left: 57, top: 53, src: '/trip/avatar-3.jpg', name: 'Nic' },
  { size: 'sm', px: 32, left: 0, top: 16, src: '/trip/avatar-4.jpg', name: 'Mara' },
  { size: 'md', px: 40, left: 8, top: 58, src: '/trip/avatar-1.jpg', name: 'Ari' },
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
  { key: 'activity', label: 'Activity', icon: Activity },
  { key: 'profile', label: 'Profile', avatar: { name: 'Ari', src: '/trip/avatar-1.jpg' } },
]

export default function HomeScreen({ onNext }) {
  return (
    <div className="home">
      {/* Top bar: wordmark (placeholder) + New trip */}
      <header className="home__bar">
        <span className="home__logo">TRIPUP</span>
        <Button variant="primary" size="md">
          New trip
        </Button>
      </header>

      <div className="home__scroll">
        <h1 className="home__welcome">Welcome back Ari</h1>

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
                      style={{ left: a.left, top: a.top }}
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
