import Placeholder from './Placeholder'

/**
 * 7 · Add expense / split del vino — divisione spesa per voci (PRIORITARIA, hi-fi).
 * Lasciata come placeholder: verrà costruita con cura in uno step dedicato.
 */
export default function AddExpenseScreen({ onNext, onBack }) {
  return (
    <Placeholder
      title="Add expense"
      onBack={onBack}
      onNext={onNext}
      nextLabel="View balances"
    />
  )
}
