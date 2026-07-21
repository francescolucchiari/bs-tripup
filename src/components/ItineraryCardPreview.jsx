import { Image as ImageIcon, Plus } from 'lucide-react'
import './ItineraryCardPreview.css'

/**
 * ItineraryCardPreview — card attività dell'itinerario (~313px, "card-eat").
 * Aggiornata alla spec Figma: superficie glass, raggio 24, thumbnail 64px,
 * eyebrow (pasto) sopra il luogo in Cabin Condensed, importo piccolo a destra.
 *
 * Due stati:
 *  - filled (default): thumb foto (o placeholder icona), label + title + amount
 *  - empty:            bordo tratteggiato, thumb verde con "+", nessun importo
 *
 * Props:
 *  - image:  url thumbnail (opzionale → placeholder icona)
 *  - label:  eyebrow piccolo in alto (es. "Lunch", "Dinner")
 *  - title:  luogo / titolo (es. "@Lumi Rooftop", "Not planned")
 *  - amount: importo a destra già formattato (es. "€47.80")
 *  - action: nodo React a destra al posto dell'importo (es. bottone "Add")
 *  - empty:  stato "da pianificare"
 *  - onClick
 */
export default function ItineraryCardPreview({
  image,
  label,
  title,
  amount,
  action,
  empty = false,
  onClick,
}) {
  const Wrapper = onClick ? 'button' : 'div'
  return (
    <Wrapper
      className="itinerary-card"
      data-empty={empty || undefined}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      <span className="itinerary-card__thumb">
        {empty ? (
          <Plus size={24} strokeWidth={2.25} color="var(--icon-primary)" />
        ) : image ? (
          <img src={image} alt="" />
        ) : (
          <ImageIcon size={22} strokeWidth={2} color="var(--icon-secondary)" />
        )}
      </span>
      <span className="itinerary-card__body">
        {label && <span className="itinerary-card__label">{label}</span>}
        {title && <span className="itinerary-card__title">{title}</span>}
      </span>
      {action ? (
        <span className="itinerary-card__action">{action}</span>
      ) : !empty && amount != null ? (
        <span className="itinerary-card__amount">{amount}</span>
      ) : null}
    </Wrapper>
  )
}
