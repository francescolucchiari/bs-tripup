# TripUp

Prototipo mobile interattivo di un'app di viaggi di gruppo (design challenge).

- **Stack:** Vite + React (JavaScript)
- **Target:** mobile, iPhone di riferimento 393×852, dimensioni native (no responsive desktop)
- **Dati:** tutti mock/hardcoded, nessun backend
- **Icone:** `lucide-react`
- **Font:** Cabin Condensed (heading) + Nunito (body) via Google Fonts

## Sviluppo

```bash
npm install
npm run dev      # server locale
npm run build    # build di produzione
npm run preview  # anteprima della build
```

## Deploy su Vercel

Framework preset: **Vite** (auto-rilevato). Build command `npm run build`, output `dist/`.

## Stato

**Step 1 — scaffold + design system in codice.** Sono presenti i design tokens
(`src/styles/tokens.css`), il frame mobile riutilizzabile (`src/components/MobileFrame.jsx`)
e una pagina di verifica (`src/pages/Playground.jsx`). Le schermate dell'app non sono
ancora costruite.
