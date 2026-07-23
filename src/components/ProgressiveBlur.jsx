import './ProgressiveBlur.css'

/**
 * ProgressiveBlur — fascia di sfocatura progressiva.
 *
 * Più layer di `backdrop-filter`, ciascuno rivelato da una mask a gradiente
 * con soglia crescente: il blur sale con continuità verso il bordo invece di
 * comparire con uno scalino. Serve a far sfumare il contenuto che scorre
 * sotto un header o sopra una CTA fissa, anziché tagliarlo di netto.
 *
 * Props:
 *  - dir:    'up' (blur massimo in alto, default) | 'down' (in basso)
 *  - height: altezza della fascia in px
 *  - veil:   false | true (velo leggero, raccorda con lo sfondo)
 *            | 'solid' (arriva a piena opacità sul bordo: serve dove sotto
 *            la fascia resta contenuto scoperto, che il solo blur lascerebbe
 *            leggibile come un fantasma)
 *  - className: per posizionarla nel contesto che la usa
 */
const LAYERS = 6

export default function ProgressiveBlur({
  dir = 'up',
  height = 74,
  veil = false,
  className = '',
}) {
  return (
    <div
      className={className ? `pblur ${className}` : 'pblur'}
      data-dir={dir}
      data-veil={veil === 'solid' ? 'solid' : undefined}
      style={{ height }}
      aria-hidden="true"
    >
      {Array.from({ length: LAYERS }, (_, i) => (
        <div className="pblur__layer" key={i} />
      ))}
      {veil && <div className="pblur__veil" />}
    </div>
  )
}
