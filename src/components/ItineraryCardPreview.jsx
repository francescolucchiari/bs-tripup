import { Image as ImageIcon } from 'lucide-react'
import './ItineraryCardPreview.css'

/**
 * ItineraryCardPreview — card ~313×80.
 * Thumbnail (foto o placeholder) + titolo + sottotitolo + importo a destra.
 *
 * Props:
 *  - image:    url thumbnail (opzionale → placeholder)
 *  - title:    titolo
 *  - subtitle: sottotitolo
 *  - amount:   importo a destra (stringa già formattata, es. "€ 120")
 *  - onClick
 */
export default function ItineraryCardPreview({ image, title, subtitle, amount, onClick }) {
  const Wrapper = onClick ? 'button' : 'div'
  return (
    <Wrapper className="itinerary-card" onClick={onClick} type={onClick ? 'button' : undefined}>
      <span className="itinerary-card__thumb">
        {image ? (
          <img src={image} alt="" />
        ) : (
          <ImageIcon size={22} strokeWidth={2} color="var(--icon-secondary)" />
        )}
      </span>
      <span className="itinerary-card__body">
        <span className="itinerary-card__title">{title}</span>
        {subtitle && <span className="itinerary-card__subtitle">{subtitle}</span>}
      </span>
      {amount != null && <span className="itinerary-card__amount">{amount}</span>}
    </Wrapper>
  )
}
