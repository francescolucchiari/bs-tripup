import Placeholder from './Placeholder'

/**
 * 8 · Balances / Settle up — bilanci consolidati (PRIORITARIA, hi-fi).
 * Lasciata come placeholder: verrà costruita con cura in uno step dedicato.
 */
export default function BalancesScreen({ onNext, onBack }) {
  return (
    <Placeholder
      title="Balances"
      onBack={onBack}
      onNext={onNext}
      nextLabel="Settle up"
    />
  )
}
