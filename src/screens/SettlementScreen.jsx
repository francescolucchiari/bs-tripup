import Placeholder from './Placeholder'

/**
 * 9 · Settlement — payment sheet → conferma → stato finale "Everyone's squared up".
 * Ultima schermata del flusso: la CTA riporta all'inizio (Home).
 */
export default function SettlementScreen({ onNext, onBack }) {
  return (
    <Placeholder
      title="Settlement"
      eyebrow="Everyone's squared up"
      onBack={onBack}
      onNext={onNext}
      nextLabel="Back to My Trips"
    />
  )
}
