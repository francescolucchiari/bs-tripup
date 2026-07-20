import './Playground.css'

/* --- Dati dei token da visualizzare (solo per la pagina di verifica) --- */

const PRIMITIVES = [
  {
    group: 'Neutrals',
    swatches: [
      { name: 'white', var: '--white', hex: '#FFFFFF' },
      { name: 'gray-100', var: '--gray-100', hex: '#F9F9F9' },
      { name: 'gray-200', var: '--gray-200', hex: '#F3F3F3' },
      { name: 'gray-300', var: '--gray-300', hex: '#E9E9E9' },
      { name: 'gray-400', var: '--gray-400', hex: '#D9D9D9' },
      { name: 'gray-500', var: '--gray-500', hex: '#989898' },
      { name: 'gray-600', var: '--gray-600', hex: '#7E7E7E' },
      { name: 'gray-700', var: '--gray-700', hex: '#696969' },
      { name: 'black', var: '--black', hex: '#000000' },
    ],
  },
  {
    group: 'Green',
    swatches: [
      { name: 'green-100', var: '--green-100', hex: '#E5FFD3' },
      { name: 'green-200', var: '--green-200', hex: '#E3F6D4' },
      { name: 'green-300', var: '--green-300', hex: '#EBFD98' },
      { name: 'green-400', var: '--green-400', hex: '#A4E974' },
      { name: 'green-800', var: '--green-800', hex: '#26550F' },
      { name: 'green-900', var: '--green-900', hex: '#154200' },
    ],
  },
  {
    group: 'Orange',
    swatches: [
      { name: 'orange-100', var: '--orange-100', hex: '#FFE6D2' },
      { name: 'orange-200', var: '--orange-200', hex: '#FFC79D' },
      { name: 'orange-500', var: '--orange-500', hex: '#FF5700' },
      { name: 'orange-800', var: '--orange-800', hex: '#9A4E00' },
    ],
  },
  {
    group: 'Alpha',
    swatches: [
      { name: 'white-40', var: '--white-40', hex: 'rgba(255,255,255,.40)' },
      { name: 'black-8', var: '--black-8', hex: 'rgba(0,0,0,.08)' },
      { name: 'green-400-25', var: '--green-400-25', hex: 'rgba(164,233,116,.25)' },
    ],
  },
]

const SEMANTICS = [
  {
    group: 'Background',
    swatches: [
      { name: 'bg-primary', var: '--bg-primary' },
      { name: 'bg-page', var: '--bg-page' },
      { name: 'bg-secondary', var: '--bg-secondary' },
      { name: 'bg-accent-subtle', var: '--bg-accent-subtle' },
      { name: 'bg-accent', var: '--bg-accent' },
      { name: 'bg-accent-strong', var: '--bg-accent-strong' },
      { name: 'bg-cta', var: '--bg-cta' },
      { name: 'bg-warning-subtle', var: '--bg-warning-subtle' },
    ],
  },
]

const TYPE_SCALE = [
  { label: 'Heading XL · 32 bold', token: 'var(--heading-xl)', sample: 'TripUp' },
  { label: 'Heading L · 28 bold', token: 'var(--heading-l)', sample: 'Il tuo viaggio' },
  { label: 'Heading M · 22 bold', token: 'var(--heading-m)', sample: 'Weekend a Lisbona' },
  { label: 'Heading S · 18 regular', token: 'var(--heading-s)', sample: 'Dettagli del gruppo' },
  { label: 'Body-L · 16 bold', token: 'var(--body-l)', sample: 'Saldo da regolare tra amici' },
  { label: 'Body-M · 14 regular', token: 'var(--body-m)', sample: 'Aggiungi una spesa e dividila con il gruppo in un tap.' },
  { label: 'Body-M · 14 bold', token: 'var(--body-m-bold)', sample: 'Aggiungi una spesa e dividila con il gruppo.' },
  { label: 'Caption · 12 regular', token: 'var(--caption)', sample: 'Ultimo aggiornamento 2 minuti fa' },
  { label: 'Tiny · 10 bold', token: 'var(--tiny)', sample: 'NUOVO' },
]

function ColorGroup({ group, swatches }) {
  return (
    <div className="pg-group">
      <p className="pg-group__title">{group}</p>
      <div className="pg-swatches">
        {swatches.map((s) => (
          <div className="pg-swatch" key={s.name}>
            <div className="pg-swatch__chip pg-swatch__chip--checker">
              <span className="pg-swatch__fill" style={{ background: `var(${s.var})` }} />
            </div>
            <span className="pg-swatch__name">{s.name}</span>
            {s.hex && <span className="pg-swatch__hex">{s.hex}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TokensView() {
  return (
    <div className="pg">
      {/* --- Verifica font --- */}
      <section className="pg-section pg-section--first">
        <h2 className="pg-section__title">Font caricati</h2>
        <div className="pg-fontcheck">
          <div className="pg-fontcheck__row">
            <span className="pg-fontcheck__label">Cabin Condensed</span>
            <span style={{ font: "700 26px/1.1 'Cabin Condensed', sans-serif" }}>Aa Bb Cc 0123</span>
          </div>
          <div className="pg-fontcheck__row">
            <span className="pg-fontcheck__label">Nunito</span>
            <span style={{ font: "700 22px/1.1 'Nunito', sans-serif" }}>Aa Bb Cc 0123</span>
          </div>
        </div>
      </section>

      {/* --- Scala tipografica --- */}
      <section className="pg-section">
        <h2 className="pg-section__title">Scala tipografica</h2>
        <div className="pg-type">
          {TYPE_SCALE.map((t) => (
            <div className="pg-type__row" key={t.label}>
              <span className="pg-type__label">{t.label}</span>
              <span className="pg-type__sample" style={{ font: t.token }}>
                {t.sample}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* --- Importi & badge --- */}
      <section className="pg-section">
        <h2 className="pg-section__title">Importi &amp; badge · tracking -0.02em</h2>
        <div className="pg-amounts">
          <span className="pg-amount">€ 248,50</span>
          <span className="pg-chip">SALDATO</span>
          <span className="pg-chip pg-chip--warm">IN SOSPESO</span>
        </div>
      </section>

      {/* --- Primitives --- */}
      <section className="pg-section">
        <h2 className="pg-section__title">Colori · primitives</h2>
        {PRIMITIVES.map((g) => (
          <ColorGroup key={g.group} {...g} />
        ))}
      </section>

      {/* --- Semantics --- */}
      <section className="pg-section">
        <h2 className="pg-section__title">Colori · semantics</h2>
        {SEMANTICS.map((g) => (
          <ColorGroup key={g.group} {...g} />
        ))}
      </section>
    </div>
  )
}
