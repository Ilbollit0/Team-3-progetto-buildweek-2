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

Francesca, Gabriel, Giovanbattista, Alessandro e Luca (Team Leader).

| Persona | Ruolo |
| --- | --- |
| Luca | Team Leader e JS: coordina, tiene backlog e piano in questo file, conduce lo stand-up, tiene i contatti con il docente, cura il README, dà supporto tecnico a tutti |
| Gabriel | Git manager e HTML/CSS: repo, branch, pull request e merge su `main` (li gestisce solo lui) |
| Giovanbattista | HTML/CSS, poi JS quando ha finito |
| Francesca | HTML/CSS, poi JS quando ha finito |
| Alessandro | JS |

### Assegnazione dei lavori

Il lavoro si divide per oggetti dello scheletro: ognuno risponde delle sue classi, funzioni e file, e gli altri usano solo i loro metodi pubblici. Il JS è in `assets/js/`, il CSS in `assets/css/app.css`. I numeri tra parentesi sono le voci del *Backlog*.

#### HTML e CSS

Mobile-first con breakpoint nostri, `md` da 768px e `lg` da 992px: oggi `app.css` è scritto desktop-first (`max-width: 800px` e `540px`) e va girato.

| Chi | Lavoro | File e selettori |
| --- | --- | --- |
| Gabriel | Struttura comune: percorsi di CSS e JS negli HTML (oggi puntano a `css/` e `js/`, i file sono in `assets/`), layout a tre zone, sidebar per device (assente su mobile, solo icone su `md`, completa su `lg`), stile del player (1, 2) | Le 4 pagine HTML, in `app.css` `.app`, `.sidebar`, `.main`, `.topbar`, `.player` |
| Giovanbattista | Home e Cerca: righe, griglie e card, box di ricerca, alle tre larghezze (2) | `index.html`, `search.html`, in `app.css` `.home`, `.search`, `.row`, `.grid`, `.card` |
| Francesca | Album e Artista: hero con copertina grande, tracklist, riga del brano in riproduzione (2) | `album.html`, `artist.html`, in `app.css` `.album-page`, `.artist-page`, `.tracklist`, `.track-row` |

Le parti in comune del CSS (colori, font, `.app`, `.sidebar`, `.player`) le modifica solo Gabriel.

#### JS

| Chi | Lavoro | File e funzioni |
| --- | --- | --- |
| Tutti insieme | Prova dell'API, `fetchJSON` e modelli (3), vedi *Attività in comune* | `common.js`: `fetchJSON`, `Track`, `Album`, `Artist` |
| Alessandro | Player: audio reale, Play e pausa, volume, barra di avanzamento, cronologia in localStorage (9, 10) | `common.js`: `Player` (`play`, `togglePlay`, `setVolume`, `seek`), `getHistory`, `addToHistory` |
| Alessandro | Cerca: debounce, tre chiamate con `Promise.all`, risultati divisi, ultima ricerca (4, 5) | `search.js` |
| Luca | Preferiti: aggiungi, togli, lista nella sidebar (7) | `common.js`: `getFavourites`, `isFavourite`, `toggleFavourite`, `#sidebar-favs` in `renderSidebar` |
| Luca | Dettaglio album con i suoi brani e il cuore dei preferiti (6, 7) | `album.js` |
| Giovanbattista | Home: recenti, preferiti, tre righe di suggerimenti con `Promise.all` (8, 10) | `home.js` |
| Francesca | Dettaglio artista con i brani più ascoltati (11) | `artist.js` |

Giovanbattista e Francesca passano al JS sulle stesse pagine di cui hanno fatto il CSS. Se mercoledì a mezzogiorno il loro CSS non è finito, `home.js` passa a Luca e `artist.js` ad Alessandro; il CSS resta a loro.

`common.js` lo toccano in tre (tutti insieme, Alessandro, Luca), ognuno solo nella sua sezione del file: così i merge di Gabriel non vanno in conflitto.

### Attività in comune

API e JSON non sono di una persona sola: non tutti nel gruppo ci hanno ancora preso la mano, e ogni area dipende dalla forma dei dati. Si fanno insieme:

- **Prova dell'API con Postman** (lunedì): tutti insieme, si leggono le risposte di iTunes per brani, album e artisti e si salva un JSON di esempio per ciascuno.
- **`fetchJSON` e costruttori dei modelli** (martedì mattina): scritti in gruppo, uno alla tastiera e gli altri che seguono, a turno. Dopo, le modifiche a `fetchJSON` e ai modelli passano da Luca, come per gli altri file comuni.
- Chi si blocca su una chiamata o su un campo del JSON lo dice subito: si guarda insieme in Postman prima di cambiare il codice.

### Regole di lavoro

- Una repo GitHub, un branch per funzione, merge su `main` almeno una volta al giorno, prima dello stand-up.
- I file comuni li modifica solo chi ne è responsabile, gli altri gli chiedono la modifica: Gabriel per l'HTML della struttura e il CSS di base, Luca per `fetchJSON` e modelli.
- Si comunica su Discord; un blocco si dice subito, senza aspettare lo stand-up.

## 2. Speculate — cosa facciamo e quando

### Backlog

**M** = minimo richiesto. **C** = miglioria, si fa solo a minimo completo.

| # | Funzionalità | Chi | Priorità |
| --- | --- | --- | --- |
| 1 | Struttura a tre zone e sidebar per device | Gabriel | M |
| 2 | Tema scuro, card, stile delle liste | Gabriel (comune), Giovanbattista (Home e Cerca), Francesca (Album e Artista) | M |
| 3 | `fetchJSON`, chiamate API, modelli | Tutti insieme | M |
| 4 | Cerca: input con debounce ~400 ms, risultati divisi in Brani e Album | Alessandro | M |
| 5 | Last search: solo l'ultima ricerca | Alessandro | M |
| 6 | Dettaglio album con i suoi brani | Luca | M |
| 7 | Preferiti: aggiungi e rimuovi dall'album, lista in Home | Luca (helper e album), Giovanbattista (lista in Home) | M |
| 8 | Home: tre elenchi di suggerimenti | Giovanbattista | M |
| 9 | Player: audio reale, Play, volume | Alessandro | M |
| 10 | Riprodotti di recente in localStorage, mostrati in Home | Alessandro (salvataggio), Giovanbattista (lista in Home) | M |
| 11 | Quarta pagina: dettaglio artista | Francesca | M |
| 12 | Player completo: shuffle, precedente e successivo, ripeti | Alessandro | C |
| 13 | Click su un preferito che avvia il brano | Giovanbattista | C |
| 14 | Preferiti anche dai singoli brani nelle altre viste | Alessandro (Cerca), Giovanbattista (Home) | C |
| 15 | Login e playlist per utente | Chi si libera per primo | C |

### Iterazioni

| Giorno | Iterazione | Obiettivo | Voci del backlog |
| --- | --- | --- | --- |
| Lunedì 23/11 | — | Solo pianificazione e organizzazione, niente codice: Envision e Speculate, assegnazione dei lavori, prova dell'API con Postman tutti insieme | — |
| Martedì 24/11 | 1 | Fondamenta: percorsi negli HTML, layout e CSS mobile-first, `fetchJSON` e modelli scritti insieme entro mezzogiorno, il player suona un brano | 1, 2, 3, 9 |
| Mercoledì 25/11 | 2 | Funzioni minime con dati veri | 4, 5, 6, 7, 8, 10 |
| Giovedì 26/11 | 3 | Minimo completo e integrato su `main`, poi le migliorie; README aggiornato | 11, poi 12–15 |
| Venerdì 27/11 | — | Solo revisione e consegna, niente funzioni nuove (vedi *5. Close*) | — |

### Rischi

| Rischio | Cosa facciamo |
| --- | --- |
| Cambiando pagina l'audio si ferma (è multipagina, non SPA) | Lo accettiamo; il player della pagina nuova mostra il brano in corso, cioè il primo della cronologia in localStorage (Alessandro) |
| Le pagine e il player dipendono da API e layout, pronti solo martedì | Lunedì si salva da Postman un JSON di esempio; fino a martedì a mezzogiorno si lavora su quello |
| Il layout responsive senza Bootstrap richiede più tempo | Mobile-first da martedì mattina: prima la struttura, poi la rifinitura |
| L'HTML comune ripetuto nelle pagine diverge | Sidebar e player li genera `common.js`, uguali per tutte; la topbar, ripetuta nelle 4 pagine, la modifica solo Gabriel (vedi *Regole di lavoro*) |
| L'API risponde diversamente dal previsto (campi, limiti) | Lunedì la si prova con Postman; i modelli isolano il resto del codice dai campi dell'API |
| Parte del team non è ancora sicura con API e JSON | Postman, `fetchJSON` e modelli si fanno insieme (vedi *Attività in comune*) |

## 3. Explore — come lavoriamo nelle iterazioni

- La mattina ognuno prende dal backlog le sue voci per l'iterazione del giorno.
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
- Alla scadenza consegna e presentazione: ognuno presenta le sue voci del backlog.
- Retrospettiva di 15 minuti: cosa ha funzionato, cosa cambiamo per la prossima Build Week.
