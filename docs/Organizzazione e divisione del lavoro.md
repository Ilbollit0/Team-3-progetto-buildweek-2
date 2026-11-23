# Organizzazione e divisione del lavoro

Progettazione in ottica **Agile Project Management** (APM), nelle sue cinque fasi: Envision, Speculate, Explore, Adapt, Close, ridotte a quello che serve per una settimana. Team di 5 persone (vedi *Team e ruoli*).

Cosa va costruito sta in [Istruzioni progetto](Istruzioni%20progetto.md); qui c'è come ci organizziamo per farlo.

## Calendario

| Fase | Quando | Cosa ne esce |
| --- | --- | --- |
| Envision | Lunedì 23/11, mattina | Visione, obiettivi, vincoli, ruoli, regole di lavoro |
| Speculate | Lunedì 23/11, pomeriggio | Backlog con priorità, piano delle iterazioni, rischi |
| Explore | Da martedì 24 a giovedì 26/11 | Tre iterazioni di un giorno |
| Adapt | Ogni giorno, allo stand-up | Piano aggiornato per il giorno dopo |
| Close | Venerdì 27/11 | Consegna, presentazione, retrospettiva |

## 1. Envision — cosa costruiamo e chi siamo

### Visione

> Una web app tipo Spotify, su più pagine, in HTML, CSS e JavaScript vanilla senza Bootstrap: si cerca musica da un'API e la si ascolta davvero dal player.

### Obiettivi

1. Il minimo richiesto funzionante e integrato entro giovedì sera.
2. Le migliorie scelte nel backlog, solo dopo il minimo.
3. Un README che spiega cosa fa l'app e come, scritto man mano.

### Vincoli

- **Consegna:** venerdì 27/11 alle 16:30, poi la presentazione (orario della Build Week 1, da confermare).
- **Tecnici:** almeno 4 pagine, niente SPA, niente Bootstrap, vincoli sul codice di *Istruzioni progetto* (1.3 e 2.6).

### Team e ruoli

Francesca, Gabriel, Giovanbattista, Alessandro e Luca (Team Leader). Le quattro aree di codice si assegnano lunedì tra Francesca, Gabriel, Giovanbattista e Alessandro, una a testa; il ruolo di Git manager è di Gabriel, in aggiunta alla sua area.

Le aree seguono gli oggetti dello scheletro (`start/`): ognuno risponde delle sue classi e dei suoi file, e gli altri usano solo i loro metodi pubblici.

| Persona | Ruolo | Di cosa risponde | Classi e file |
| --- | --- | --- | --- |
| Luca | Team Leader | Coordina, tiene backlog e piano in questo file, conduce lo stand-up, tiene i contatti con il docente, cura il README, dà supporto tecnico a tutti i partecipanti sulle loro parti di codice | — |
| Gabriel | Git manager | Repo, branch, pull request e merge su `main`: li gestisce una persona sola | — |
| _da assegnare_ | Layout e CSS | Tre zone, sidebar per device (mobile, `md`, `lg`), tema scuro, card; HTML comune a tutte le pagine | HTML delle pagine, `css/app.css`, `renderSidebar` |
| _da assegnare_ | API e Cerca | `fetchJSON`, chiamate all'API, modelli `newTrack` / `newAlbum` / `newArtist`, pagina Cerca | `fetchJSON`, `Track`, `Album`, `Artist`, `js/search.js` |
| _da assegnare_ | Home e Album | Home (suggerimenti, recenti, preferiti), dettaglio album, preferiti | `js/home.js`, `js/album.js`, helper dei preferiti |
| _da assegnare_ | Player | Audio, Play, volume, riprodotti di recente in localStorage | `Player`, helper della cronologia |

### Attività in comune

API e JSON non sono di una persona sola: non tutti nel gruppo ci hanno ancora preso la mano, e ogni area dipende dalla forma dei dati. Si fanno insieme:

- **Prova dell'API con Postman** (lunedì): tutti insieme, si leggono le risposte di iTunes per brani, album e artisti e si salva un JSON di esempio per ciascuno.
- **`fetchJSON` e costruttori dei modelli** (martedì mattina): scritti in gruppo, uno alla tastiera e gli altri che seguono, a turno. Poi il file resta a chi ha l'area API e Cerca, come gli altri file comuni.
- Chi si blocca su una chiamata o su un campo del JSON lo dice subito: si guarda insieme in Postman prima di cambiare il codice.

### Regole di lavoro

- Una repo GitHub, un branch per funzione, merge su `main` almeno una volta al giorno, prima dello stand-up.
- I file comuni (HTML della struttura, CSS di base, `fetchJSON`, modelli) li modifica solo chi ne è responsabile; gli altri gli chiedono la modifica.
- Si comunica su Discord; un blocco si dice subito, senza aspettare lo stand-up.

## 2. Speculate — cosa facciamo e quando

### Backlog

**M** = minimo richiesto. **C** = miglioria, si fa solo a minimo completo.

| # | Funzionalità | Area | Priorità |
| --- | --- | --- | --- |
| 1 | Struttura a tre zone e sidebar per device | Layout | M |
| 2 | Tema scuro, card, stile delle liste | Layout | M |
| 3 | `fetchJSON`, chiamate API, modelli | API | M |
| 4 | Cerca: input con debounce ~400 ms, risultati divisi in Brani e Album | Cerca | M |
| 5 | Last search: solo l'ultima ricerca | Cerca | M |
| 6 | Dettaglio album con i suoi brani | Album | M |
| 7 | Preferiti: aggiungi e rimuovi dall'album, lista in Home | Album, Home | M |
| 8 | Home: tre elenchi di suggerimenti | Home | M |
| 9 | Player: audio reale, Play, volume | Player | M |
| 10 | Riprodotti di recente in localStorage, mostrati in Home | Player, Home | M |
| 11 | Quarta pagina (es. dettaglio artista) | da decidere | M |
| 12 | Player completo: shuffle, precedente e successivo, ripeti | Player | C |
| 13 | Click su un preferito che avvia il brano | Home, Player | C |
| 14 | Preferiti anche dai singoli brani nelle altre viste | Cerca, Home | C |
| 15 | Login e playlist per utente | da decidere | C |

### Iterazioni

| Giorno | Iterazione | Obiettivo | Voci del backlog |
| --- | --- | --- | --- |
| Lunedì 23/11 | — | Solo pianificazione e organizzazione, niente codice: Envision e Speculate, assegnazione delle aree, prova dell'API con Postman tutti insieme | — |
| Martedì 24/11 | 1 | Fondamenta: scheletro HTML delle pagine, layout e CSS di base, `fetchJSON` e modelli scritti insieme entro mezzogiorno, il player suona un brano | 1, 2, 3, 9 |
| Mercoledì 25/11 | 2 | Funzioni minime con dati veri | 4, 5, 6, 7, 8, 10 |
| Giovedì 26/11 | 3 | Minimo completo e integrato su `main`, poi le migliorie; README aggiornato | 11, poi 12–15 |
| Venerdì 27/11 | — | Solo revisione e consegna, niente funzioni nuove (vedi *5. Close*) | — |

### Rischi

| Rischio | Cosa facciamo |
| --- | --- |
| Cambiando pagina l'audio si ferma (è multipagina, non SPA) | Lo accettiamo; il brano in corso si salva in localStorage e il player della pagina nuova lo mostra |
| Le pagine dipendono da API e layout, pronti solo martedì | Lunedì si salva da Postman un JSON di esempio; fino a martedì a mezzogiorno si lavora su quello |
| Il layout responsive senza Bootstrap richiede più tempo | Mobile-first da martedì mattina: prima la struttura, poi la rifinitura |
| L'HTML comune (sidebar, player) ripetuto nelle pagine diverge | Vale la regola dei file comuni (vedi *Regole di lavoro*) |
| L'API risponde diversamente dal previsto (campi, limiti) | Lunedì la si prova con Postman; i modelli isolano il resto del codice dai campi dell'API |
| Parte del team non è ancora sicura con API e JSON | Postman, `fetchJSON` e modelli si fanno insieme (vedi *Attività in comune*) |

## 3. Explore — come lavoriamo nelle iterazioni

- La mattina ognuno prende dal backlog le voci della sua area per l'iterazione del giorno.
- Branch piccoli, una funzione ciascuno; il merge prima dello stand-up permette di provare ogni giorno l'app integrata.
- Una voce è **fatta** quando:
  - funziona su mobile, `md` e `lg`;
  - rispetta i vincoli sul codice (`querySelector`, `createElement`, `addEventListener`, event delegation);
  - è su `main` e non dà errori in console.

## 4. Adapt — controllo e correzione

Stand-up ogni giorno alle 17:00–17:15 (orario della Build Week 1, da confermare), tre domande:

1. Cosa è fatto?
2. Cosa blocca?
3. Cosa si fa domani?

Dopo lo stand-up il TL aggiorna backlog e iterazioni in questo file: quello che non è finito passa al giorno dopo. Se giovedì sera il minimo non è completo, le migliorie saltano.

## 5. Close — consegna e chiusura

- Venerdì mattina niente funzioni nuove: prova finale alle tre larghezze, debug, README finale.
- Il Git manager carica in piattaforma il link della repo.
- Alla scadenza consegna e presentazione: ognuno presenta la sua area.
- Retrospettiva di 15 minuti: cosa ha funzionato, cosa cambiamo per la prossima Build Week.
