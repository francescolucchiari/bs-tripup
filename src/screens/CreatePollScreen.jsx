import Placeholder from './Placeholder'

/** 4 · Create poll — setup del poll con 3 ristoranti. */
export default function CreatePollScreen({ onNext, onBack }) {
  return (
    <Placeholder
      title="Create poll"
      onBack={onBack}
      onNext={onNext}
      nextLabel="Start poll"
    />
  )
}
