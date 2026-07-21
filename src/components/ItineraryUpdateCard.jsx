import { Phone, Utensils } from 'lucide-react'
import ItineraryCardPreview from './ItineraryCardPreview'
import Button from './Button'
import './ItineraryUpdateCard.css'

/**
 * ItineraryUpdateCard — esito del poll: il vincitore diventa una voce
 * d'itinerario (card-eat con CTA "Add") sopra un pannello con azioni
 * rapide "Call" / "Book table".
 *
 * Props:
 *  - image:  foto del locale vincitore
 *  - label:  pasto (default "Dinner")
 *  - title:  locale (es. "@Ramiro")
 *  - onAdd / onCall / onBook: handler (opzionali)
 */
export default function ItineraryUpdateCard({
  image,
  label = 'Dinner',
  title,
  onAdd,
  onCall,
  onBook,
}) {
  return (
    <div className="itin-update">
      <div className="itin-update__card">
        <ItineraryCardPreview
          image={image}
          label={label}
          title={title}
          action={
            <Button variant="dark" size="md" onClick={onAdd}>
              Add
            </Button>
          }
        />
      </div>
      <div className="itin-update__actions">
        <button type="button" className="itin-update__action" onClick={onCall}>
          <Phone size={16} strokeWidth={2.25} />
          <span>Call</span>
        </button>
        <button type="button" className="itin-update__action" onClick={onBook}>
          <Utensils size={16} strokeWidth={2.25} />
          <span>Book table</span>
        </button>
      </div>
    </div>
  )
}
