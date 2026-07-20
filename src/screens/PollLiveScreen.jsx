import Placeholder from './Placeholder'

/**
 * 5 · Poll live — votazione real-time (PRIORITARIA, hi-fi).
 * Lasciata come placeholder: verrà costruita con cura in uno step dedicato.
 */
export default function PollLiveScreen({ onNext, onBack }) {
  return (
    <Placeholder
      title="Poll live"
      onBack={onBack}
      onNext={onNext}
      nextLabel="Close poll"
    />
  )
}
