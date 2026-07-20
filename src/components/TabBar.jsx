import { Map, Activity, User } from 'lucide-react'
import './TabBar.css'

const DEFAULT_TABS = [
  { key: 'trips', label: 'Trips', icon: Map },
  { key: 'activity', label: 'Activity', icon: Activity },
  { key: 'profile', label: 'Profile', icon: User },
]

/**
 * TabBar — ~271×76, 3 tab (Trips / Activity / Profile).
 * Tab attivo con highlight accent (lime). Pensata per stare fissa in basso
 * nel frame mobile (prop `fixed`).
 *
 * Props:
 *  - active:   key del tab attivo
 *  - onChange: (key) => void
 *  - tabs:     override della lista (default Trips/Activity/Profile)
 *  - fixed:    posiziona la tab bar fissa in basso, centrata nel frame
 */
export default function TabBar({ active = 'trips', onChange, tabs = DEFAULT_TABS, fixed = false }) {
  return (
    <nav className="tab-bar" data-fixed={fixed || undefined}>
      {tabs.map(({ key, label, icon: Icon }) => {
        const isActive = key === active
        return (
          <button
            key={key}
            className="tab-bar__tab"
            data-active={isActive || undefined}
            onClick={() => onChange?.(key)}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon size={22} strokeWidth={2.25} />
            <span className="tab-bar__label">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
