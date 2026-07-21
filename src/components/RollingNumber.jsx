import { AnimatePresence, motion } from 'framer-motion'
import './RollingNumber.css'

/**
 * RollingNumber — cifra che "rulla" dal basso verso l'alto al cambio valore:
 * il numero uscente sale e sfuma, quello entrante arriva dal basso.
 * Su primo mount non anima (initial={false}), solo ai cambi successivi.
 *
 * Props:
 *  - value:     numero da mostrare
 *  - className: classe extra sul contenitore (per la tipografia)
 */
export default function RollingNumber({ value, className }) {
  return (
    <span className={`rolling-number${className ? ` ${className}` : ''}`}>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={value}
          className="rolling-number__val"
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-110%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
