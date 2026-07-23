/**
 * Dati del viaggio condivisi tra le schermate.
 *
 * Stanno qui e non dentro TripScreen perché la Home deve leggerli:
 * quando Ren entra nel gruppo, la card del viaggio attivo si aggiorna
 * (conteggio + avatar sulla cover).
 */

// L'utente corrente ("me") è l'avatar 1 (Ari). Stato iniziale: 4 partecipanti.
export const PARTICIPANTS = [
  { name: 'Ari', src: '/trip/avatar-1.jpg' }, // me
  { name: 'Tom', src: '/trip/avatar-2.jpg' },
  { name: 'Nic', src: '/trip/avatar-3.jpg' },
  { name: 'Mara', src: '/trip/avatar-4.jpg' },
]

// Il 5°, che entra tramite la modale "Add member".
export const REN = { name: 'Ren', src: '/trip/avatar-5.jpg' }
