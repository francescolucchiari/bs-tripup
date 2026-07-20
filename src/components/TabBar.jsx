import { Map, Activity } from 'lucide-react'
import Avatar from './Avatar'
import './TabBar.css'

const DEFAULT_TABS = [
  { key: 'travels', label: 'Travels', icon: Map },
  { key: 'activity', label: 'Activity', icon: Activity },
  { key: 'profile', label: 'Profile', avatar: { name: 'Fra' } },
]

/**
 * TabBar — barra full-width (da export Figma).
 * Tab con icona (o avatar) + label. Tab attivo evidenziato con una pill
 * --bg-accent-subtle. Pensata per stare fissa in basso nel frame (prop `fixed`).
 *
 * Props:
 *  - active:   key del tab attivo
 *  - onChange: (key) => void
 *  - tabs:     override della lista. Ogni tab: { key, label, icon? , avatar? }
 *              (se `avatar` è presente, mostra un Avatar al posto dell'icona)
 *  - fixed:    posiziona la tab bar fissa in basso nel frame
 */
export default function TabBar({ active = 'travels', onChange, tabs = DEFAULT_TABS, fixed = false }) {
  return (
    <nav className="tab-bar" data-fixed={fixed || undefined}>
      {tabs.map(({ key, label, icon: Icon, avatar }) => {
        const isActive = key === active
        return (
          <button
            key={key}
            className="tab-bar__tab"
            data-active={isActive || undefined}
            onClick={() => onChange?.(key)}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="tab-bar__icon">
              {avatar ? <Avatar size="xs" {...avatar} /> : <Icon size={24} strokeWidth={1.5} />}
            </span>
            <span className="tab-bar__label">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
