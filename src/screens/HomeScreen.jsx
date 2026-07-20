import Placeholder from './Placeholder'

/** 1 · Home / My Trips — lista viaggi. "Lisbon Gateway" attivo → apre la Trip view. */
export default function HomeScreen({ onNext }) {
  return (
    <Placeholder
      title="My Trips"
      onNext={onNext}
      nextLabel="Open Lisbon Gateway"
      tabBar="travels"
    />
  )
}
