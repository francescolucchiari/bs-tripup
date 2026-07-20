import './BottomSheet.css'

/**
 * BottomSheet — contenitore che sale dal basso con overlay scuro, grabber in
 * cima, contenuto scrollabile. Apribile/chiudibile.
 *
 * Va montato dentro un contenitore `position: relative; overflow: hidden` che
 * rappresenta la schermata (es. la root di una screen, o la demo-screen del
 * playground). Copre quel contenitore, non l'intera viewport.
 *
 * Props:
 *  - open:     boolean
 *  - onClose:  () => void  (chiamato su click overlay / grabber)
 *  - title:    header opzionale
 *  - children: contenuto scrollabile
 */
export default function BottomSheet({ open = false, onClose, title, children }) {
  return (
    <div className="bottom-sheet" data-open={open || undefined} aria-hidden={!open}>
      <div className="bottom-sheet__overlay" onClick={onClose} />
      <div className="bottom-sheet__panel" role="dialog" aria-modal="true">
        <button className="bottom-sheet__grabber" onClick={onClose} aria-label="Chiudi" />
        {title && <div className="bottom-sheet__header">{title}</div>}
        <div className="bottom-sheet__content">{children}</div>
      </div>
    </div>
  )
}
