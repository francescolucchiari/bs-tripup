import { Check } from 'lucide-react'
import './Toast.css'

/**
 * Toast — messaggio di conferma (~345×56) con icona check + testo.
 * Es. "Paid ✓".
 *
 * Props:
 *  - children: testo del messaggio
 *  - icon:     icona lucide (default Check)
 */
export default function Toast({ children, icon: Icon = Check }) {
  return (
    <div className="toast" role="status">
      <span className="toast__icon">
        <Icon size={15} strokeWidth={3} />
      </span>
      <span className="toast__text">{children}</span>
    </div>
  )
}
