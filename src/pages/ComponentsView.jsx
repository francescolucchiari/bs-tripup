import { useState } from 'react'
import { Settings, Plus, MapPin } from 'lucide-react'
import {
  Button,
  Avatar,
  AvatarStack,
  InputText,
  Badge,
  Accordion,
  Toast,
  ItineraryCardPreview,
  TabBar,
  SegmentedControl,
  ScreenHeader,
  ProgressBar,
  Chip,
  Toggle,
  Checkbox,
  Radio,
  BottomSheet,
} from '../components'
import './ComponentsView.css'

const PEOPLE = [
  { name: 'Ana' },
  { name: 'Bruno' },
  { name: 'Chiara' },
  { name: 'Dario' },
  { name: 'Elena' },
]

function Section({ title, code, children }) {
  return (
    <section className="cv-section">
      <h2 className="cv-section__title">{title}</h2>
      {code && <code className="cv-section__code">{code}</code>}
      {children}
    </section>
  )
}

export default function ComponentsView() {
  const [name, setName] = useState('Weekend a Lisbona')
  const [tab, setTab] = useState('travels')
  const [seg, setSeg] = useState('itinerary')
  const [vibe, setVibe] = useState('lively')
  const [toggleA, setToggleA] = useState(true)
  const [toggleB, setToggleB] = useState(false)
  const [check, setCheck] = useState(true)
  const [radio, setRadio] = useState('equal')
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <div className="cv">
      {/* ============ BOTTONI ============ */}
      <Section title="Button" code="cta-primary/lg · cta-secondary/md">
        <span className="cv-label">Primary / lg — default · pressed · disabled</span>
        <div className="cv-col">
          <Button variant="primary" size="lg">Crea viaggio</Button>
          <Button variant="primary" size="lg" pressed>Crea viaggio</Button>
          <Button variant="primary" size="lg" disabled>Crea viaggio</Button>
        </div>
        <span className="cv-label">Secondary / md — default · pressed · disabled</span>
        <div className="cv-row">
          <Button variant="secondary" size="md" icon={Plus}>Aggiungi</Button>
          <Button variant="secondary" size="md" icon={Plus} pressed>Aggiungi</Button>
          <Button variant="secondary" size="md" icon={Plus} disabled>Aggiungi</Button>
        </div>
      </Section>

      {/* ============ AVATAR ============ */}
      <Section title="Avatar" code="xs 24 · sm 28 · md 40 · lg 48">
        <div className="cv-stack">
          <div className="cv-col cv-col--center">
            <Avatar size="xs" name="Ana" />
            <span className="cv-tag">xs</span>
          </div>
          <div className="cv-col cv-col--center">
            <Avatar size="sm" name="Bruno" />
            <span className="cv-tag">sm</span>
          </div>
          <div className="cv-col cv-col--center">
            <Avatar size="md" name="Chiara" />
            <span className="cv-tag">md</span>
          </div>
          <div className="cv-col cv-col--center">
            <Avatar size="lg" name="Dario" />
            <span className="cv-tag">lg</span>
          </div>
          <div className="cv-col cv-col--center">
            <Avatar size="lg" src="https://i.pravatar.cc/96?img=15" name="Foto" />
            <span className="cv-tag">img</span>
          </div>
        </div>
      </Section>

      <Section title="AvatarStack" code="composizione · overflow +N">
        <div className="cv-row">
          <AvatarStack avatars={PEOPLE} max={3} size="sm" />
          <AvatarStack avatars={PEOPLE} max={4} size="md" />
        </div>
      </Section>

      {/* ============ INPUT ============ */}
      <Section title="InputText" code="~345×64 · filled / empty">
        <div className="cv-col">
          <InputText label="Nome del viaggio" value={name} onChange={setName} />
          <InputText label="Destinazione" value="" onChange={() => {}} placeholder="Dove andate?" />
          <InputText value="" onChange={() => {}} placeholder="Senza label" />
        </div>
      </Section>

      {/* ============ BADGE ============ */}
      <Section title="Badge" code="accent · neutral · warning">
        <div className="cv-row">
          <Badge variant="accent">Active poll</Badge>
          <Badge variant="neutral">Draft</Badge>
          <Badge variant="warning">Action needed</Badge>
        </div>
      </Section>

      {/* ============ ACCORDION ============ */}
      <Section title="Accordion" code="closed ~58 · open ~182">
        <div className="cv-col">
          <Accordion label="Giorno 1" value="4 attività">
            Mattina al Castello, pranzo ad Alfama, tramonto al Miradouro. Tutto
            modificabile dal gruppo.
          </Accordion>
          <Accordion label="Giorno 2" value="2 attività" defaultOpen>
            Gita a Sintra e cena di gruppo. Tocca per riordinare le tappe.
          </Accordion>
        </div>
      </Section>

      {/* ============ TOAST ============ */}
      <Section title="Toast" code="~345×56 · check + testo">
        <div className="cv-col">
          <Toast>Paid</Toast>
          <Toast>Spesa aggiunta al gruppo</Toast>
        </div>
      </Section>

      {/* ============ ITINERARY CARD PREVIEW ============ */}
      <Section title="ItineraryCardPreview" code="~313×80">
        <div className="cv-col">
          <ItineraryCardPreview
            image="https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=200&q=60"
            title="Sintra day trip"
            subtitle="Sab · 09:00"
            amount="€ 45"
          />
          <ItineraryCardPreview title="Cena ad Alfama" subtitle="Sab · 21:00" amount="€ 30" />
        </div>
      </Section>

      {/* ============ SEGMENTED CONTROL ============ */}
      <Section title="SegmentedControl" code="da Figma · pill + gap, attivo lime">
        <SegmentedControl
          segments={[
            { value: 'itinerary', label: 'Itinerary' },
            { value: 'expenses', label: 'Expenses' },
          ]}
          value={seg}
          onChange={setSeg}
        />
      </Section>

      {/* ============ SCREEN HEADER ============ */}
      <Section title="ScreenHeader" code="back + titolo + azione opzionale">
        <div className="cv-panel">
          <ScreenHeader
            title="Weekend a Lisbona"
            onBack={() => {}}
            action={
              <button className="screen-header__icon-btn" aria-label="Impostazioni">
                <Settings size={22} strokeWidth={2.25} />
              </button>
            }
          />
          <ScreenHeader title="Nuova spesa" onBack={() => {}} />
        </div>
      </Section>

      {/* ============ TAB BAR ============ */}
      <Section title="TabBar" code="da Figma · full-width · Travels / Activity / Profile">
        <div className="cv-center">
          <TabBar active={tab} onChange={setTab} />
        </div>
        <span className="cv-note">In una schermata reale è fissa in basso (prop `fixed`).</span>
      </Section>

      {/* ============ PROGRESS BAR ============ */}
      <Section title="ProgressBar" code="0-100% · accent">
        <div className="cv-col">
          <ProgressBar value={25} />
          <ProgressBar value={60} />
          <ProgressBar value={90} tone="strong" />
        </div>
      </Section>

      {/* ============ CHIP / VIBE ============ */}
      <Section title="Chip / vibe" code="lively · classic · trendy">
        <div className="cv-row">
          {['lively', 'classic', 'trendy'].map((v) => (
            <Chip key={v} selected={vibe === v} onClick={() => setVibe(v)}>
              {v}
            </Chip>
          ))}
        </div>
        <span className="cv-note">Selezionato: {vibe}</span>
      </Section>

      {/* ============ TOGGLE ============ */}
      <Section title="Toggle" code="on / off · accent">
        <div className="cv-row">
          <Toggle checked={toggleA} onChange={setToggleA} />
          <Toggle checked={toggleB} onChange={setToggleB} />
          <Toggle checked disabled />
        </div>
      </Section>

      {/* ============ CHECKBOX & RADIO ============ */}
      <Section title="Checkbox" code="selected / unselected">
        <div className="cv-col">
          <Checkbox checked={check} onChange={setCheck} label="Dividi in parti uguali" />
          <Checkbox checked={false} onChange={() => {}} label="Escludi me dalla spesa" />
          <Checkbox checked disabled label="Opzione bloccata" />
        </div>
      </Section>

      <Section title="Radio" code="selected / unselected">
        <div className="cv-col">
          <Radio checked={radio === 'equal'} value="equal" onChange={setRadio} label="Parti uguali" />
          <Radio checked={radio === 'shares'} value="shares" onChange={setRadio} label="Per quote" />
          <Radio checked={radio === 'custom'} value="custom" onChange={setRadio} label="Importi personalizzati" />
        </div>
      </Section>

      {/* ============ BOTTOM SHEET ============ */}
      <Section title="BottomSheet" code="overlay · grabber · scrollable">
        <div className="demo-screen">
          <div className="demo-screen__body">
            <MapPin size={28} color="var(--icon-accent)" />
            <p className="cv-note">Contenitore-schermata di esempio.</p>
            <Button variant="primary" size="md" onClick={() => setSheetOpen(true)}>
              Apri bottom sheet
            </Button>
          </div>
          <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Come dividere?">
            <div className="cv-col">
              <Radio checked={radio === 'equal'} value="equal" onChange={setRadio} label="Parti uguali" />
              <Radio checked={radio === 'shares'} value="shares" onChange={setRadio} label="Per quote" />
              <Radio checked={radio === 'custom'} value="custom" onChange={setRadio} label="Importi personalizzati" />
              <Button variant="primary" size="lg" fullWidth onClick={() => setSheetOpen(false)}>
                Conferma
              </Button>
            </div>
          </BottomSheet>
        </div>
      </Section>
    </div>
  )
}
