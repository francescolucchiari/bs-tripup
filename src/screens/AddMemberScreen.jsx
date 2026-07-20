import Placeholder from './Placeholder'

/** 3 · Add member — sheet per aggiungere Ren. */
export default function AddMemberScreen({ onNext, onBack }) {
  return (
    <Placeholder
      title="Add member"
      eyebrow="Sheet"
      onBack={onBack}
      onNext={onNext}
      nextLabel="Create poll"
    />
  )
}
