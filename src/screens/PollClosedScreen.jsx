import Placeholder from './Placeholder'

/** 6 · Poll closed → itinerary updated — vincitore aggiunto all'itinerario. */
export default function PollClosedScreen({ onNext, onBack }) {
  return (
    <Placeholder
      title="Poll closed · Itinerary updated"
      onBack={onBack}
      onNext={onNext}
      nextLabel="Add expense"
    />
  )
}
