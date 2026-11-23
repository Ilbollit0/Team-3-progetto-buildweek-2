# Organizzazione e divisione del lavoro

Progettazione in ottica **Agile Project Management** (APM), nelle sue cinque fasi: Envision, Speculate, Explore, Adapt, Close, ridotte a quello che serve per una settimana. Team di 5 persone (vedi *Team e ruoli*).

Cosa va costruito sta in [Istruzioni progetto](Istruzioni%20progetto.md); qui c'è come ci organizziamo per farlo.

## Calendario

| Fase | Quando | Cosa ne esce |
| --- | --- | --- |
| Envision | Lunedì 23/11, mattina | Visione, obiettivi, vincoli, ruoli, regole di lavoro |
| Speculate | Lunedì 23/11, pomeriggio | Backlog con priorità, piano delle iterazioni, rischi |
| Explore | Da martedì 24 a giovedì 26/11 | Minimo completo martedì e mercoledì, extra giovedì |
| Adapt | Ogni giorno, all'esposizione al docente e allo stand-up | Piano aggiornato per il giorno dopo |
| Close | Venerdì 27/11 | Revisione, consegna, esposizione finale, retrospettiva |

## 1. Envision — cosa costruiamo e chi siamo

### Visione

> Una web app tipo Spotify, su più pagine, in HTML, CSS e JavaScript vanilla senza Bootstrap: si cerca musica da un'API e la si ascolta davvero dal player.

### Obiettivi

1. Il minimo richiesto funzionante e integrato su `main` entro mercoledì sera.
2. Giovedì gli extra (vedi *Extra*), solo a minimo completo.
3. Un README che spiega cosa fa l'app e come, scritto man mano e finito giovedì sera.
4. Venerdì tutto è già pronto: solo revisione e rilettura per l'esposizione finale.

### Vincoli

- **Consegna:** venerdì 27/11 alle 16:30, poi la presentazione (orario della Build Week 1, da confermare).
- **Tecnici:** almeno 4 pagine, niente SPA, niente Bootstrap, vincoli sul codice di *Istruzioni progetto* (1.3 e 2.6).
- **Venerdì Luca è assente:** quello che è suo (README, questo file, le sue voci) è finito giovedì sera.

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
| Alessandro | Player: audio reale, Play e pausa, volume, barra di avanzamento, brano in corso al cambio pagina (9); card del brano | `common.js`: `Player` (`play`, `togglePlay`, `setVolume`, `seek`), `createTrackCard` |
| Alessandro | Cerca: debounce, tre chiamate con `Promise.all`, risultati divisi, ultima ricerca (4, 5) | `search.js` |
| Luca | Preferiti e cronologia in localStorage, lista dei preferiti nella sidebar (7, 10); riga del brano | `common.js`: `getFavourites`, `isFavourite`, `toggleFavourite`, `getHistory`, `addToHistory`, `#sidebar-favs` in `renderSidebar`, `createTrackRow` |
| Luca | Dettaglio album con i suoi brani e il cuore dei preferiti (6, 7) | `album.js` |
| Giovanbattista | Home: recenti, preferiti, tre righe di suggerimenti con `Promise.all` (8, 10) | `home.js` |
| Francesca | Dettaglio artista con i brani più ascoltati (11) | `artist.js` |

Giovanbattista e Francesca passano al JS sulle stesse pagine di cui hanno fatto il CSS. Il CSS va finito martedì, perché mercoledì sera il JS delle loro pagine deve essere pronto. Se martedì sera il loro CSS non è finito, `home.js` passa a Luca e `artist.js` ad Alessandro; il CSS resta a loro.

`common.js` lo toccano tutti insieme (`fetchJSON` e modelli), Alessandro (`Player`, `createTrackCard`) e Luca (helper di localStorage, `renderSidebar`, `createTrackRow`), ognuno solo nella sua sezione del file: così i merge di Gabriel non vanno in conflitto.

### Microprogettazione — chi fa cosa, in ordine o in contemporanea

Finora il piano è macro: fasi, iterazioni, aree. Qui c'è il dettaglio dei compiti, step per step. Le righe dello stesso step si fanno **in contemporanea**; uno step marcato **in ordine** va su `main` prima che parta il successivo.

Quasi tutto si fa da soli: le funzioni che collegano il lavoro di persone diverse esistono già vuote nello scheletro e non rompono niente (`player.play()`, `getHistory()` e `getFavourites()` restituiscono `[]`, `isFavourite()` restituisce `false`). Ognuno le chiama anche prima che siano finite; la sezione resta vuota finché non arriva il merge di chi le scrive.

| Step | Quando | Chi | Compito | Come |
| --- | --- | --- | --- | --- |
| 0 | Lunedì pomeriggio | Tutti | Prova API con Postman ([Istruzioni API](Istruzioni%20API.md)) | Insieme |
| 1 | Martedì, prima ora | Gabriel | Percorsi di CSS e JS negli HTML; Prettier su tutti i file; le due `@media` in fondo ad `app.css` spezzate nelle sezioni, già mobile-first → merge su `main` | **In ordine**: chi lavora su HTML e CSS parte dal suo merge |
| 1 | Martedì, prima ora | Alessandro + Giovanbattista | Struttura HTML della card del brano (`createTrackCard`): classi, cover, titolo, artista, Play, cuore `btn-fav`, `data-track-id` | In coppia, in contemporanea a Gabriel |
| 1 | Martedì, prima ora | Luca + Francesca | Struttura HTML della riga del brano (`createTrackRow`): numero, titolo, durata, cuore `btn-fav`, `data-track-id`, `.is-playing` | In coppia, in contemporanea a Gabriel |
| 2 | Martedì, fino a mezzogiorno | Tutti | `fetchJSON`; costruttori di `Track`, `Album`, `Artist` dalla tabella di [Istruzioni API](Istruzioni%20API.md) | Insieme, **in ordine**: tutto il JS dopo lo usa |
| 3 | Martedì pomeriggio | Gabriel | CSS comune: `.app` a tre zone, `.sidebar` assente / icone / completa, `.topbar`, `.player` (1, 2) | In contemporanea |
| 3 | Martedì pomeriggio | Giovanbattista | CSS di `.home`, `.search`, `.row`, `.grid`, `.card` alle tre larghezze (2) | In contemporanea |
| 3 | Martedì pomeriggio | Francesca | CSS di `.album-page`, `.artist-page`, hero, `.tracklist`, `.track-row` alle tre larghezze (2) | In contemporanea |
| 3 | Martedì pomeriggio | Alessandro | `Player`: `constructor` ed eventi audio, `mount` con i click, `play`, `togglePlay`, `setVolume`, `seek` (9); `createTrackCard` | In contemporanea |
| 3 | Martedì pomeriggio | Luca | `getFavourites`, `isFavourite`, `toggleFavourite`, `getHistory`, `addToHistory` (7, 10); `createTrackRow` | In contemporanea |
| 4 | Mercoledì mattina | Alessandro | `search.js`: debounce, tre chiamate con `Promise.all`, righe Brani / Album / Artisti, ultima ricerca (4, 5) | In contemporanea |
| 4 | Mercoledì mattina | Luca | `album.js`: id dalla query string, lookup, hero, tracklist con `createTrackRow` (6, 7) | In contemporanea |
| 4 | Mercoledì mattina | Giovanbattista | `home.js`: `renderRow`, tre suggerimenti con `Promise.all`, righe recenti e preferiti (8, 10) | In contemporanea |
| 4 | Mercoledì mattina | Francesca | `artist.js`: id dalla query string, lookup, hero, brani con `createTrackRow` (11) | In contemporanea |
| 4 | Mercoledì mattina | Gabriel | Merge delle PR, rifinitura responsive | In contemporanea |
| 5 | Mercoledì pomeriggio | Alessandro | Brano in corso mostrato al cambio pagina (primo della cronologia) | In contemporanea |
| 5 | Mercoledì pomeriggio | Luca | Lista dei preferiti in `#sidebar-favs` | In contemporanea |
| 5 | Mercoledì pomeriggio | Gli altri | Chiusura delle proprie voci, correzioni | In contemporanea |
| 6 | Mercoledì sera | Tutti | Prova di `main` alle tre larghezze, zero errori in console (KPI K4, K5) | Insieme |
| 7 | Giovedì | _da definire_ | Extra (vedi *Extra*); README finito (Luca) | — |
| 8 | Venerdì | Tutti tranne Luca | Revisione e rilettura per l'esposizione finale | Insieme |

Allo step 4 vale la regola di passaggio di `home.js` e `artist.js` scritta sopra, in *JS*.

### Attività in comune

API e JSON non sono di una persona sola: non tutti nel gruppo ci hanno ancora preso la mano, e ogni area dipende dalla forma dei dati. Si fanno insieme:

- **Prova dell'API con Postman** (lunedì): tutti insieme, si leggono le risposte di iTunes per brani, album e artisti e si salva un JSON di esempio per ciascuno. Come si fa: [Istruzioni API](Istruzioni%20API.md).
- **`fetchJSON` e costruttori dei modelli** (martedì mattina): scritti in gruppo, uno alla tastiera e gli altri che seguono, a turno. Dopo, le modifiche a `fetchJSON` e ai modelli passano da Luca, come per gli altri file comuni.
- Chi si blocca su una chiamata o su un campo del JSON lo dice subito: si guarda insieme in Postman prima di cambiare il codice.

### Regole di lavoro

- Una repo GitHub, un branch per persona con il suo nome: `Branch_Luca`, `Branch_Gabriel`, `Branch_Giova`, `Branch_Francesca`, `Branch_Alessandro`.
- Le pull request verso `main` le apre e le unisce Gabriel, almeno una volta al giorno, prima dello stand-up. Chi ha finito una voce glielo dice su Discord.
- Commit piccoli, con un messaggio di una riga che dice cosa cambia, per esempio «Aggiunge il volume al player».
- Il codice si formatta con Prettier, con le impostazioni standard: indentazione a 2 spazi, virgolette doppie, punto e virgola, come nello scheletro.
- I file comuni li modifica solo chi ne è responsabile, gli altri gli chiedono la modifica: Gabriel per l'HTML della struttura e il CSS di base, Luca per `fetchJSON` e modelli.
- Si comunica su Discord; un blocco si dice subito, senza aspettare lo stand-up.

### Nomi nel codice

I nomi sono in inglese, i commenti in italiano, come nello scheletro. Il caso del nome dice cos'è:

| Cosa | Convenzione | Esempi dallo scheletro |
| --- | --- | --- |
| Variabili, funzioni, metodi, parametri, proprietà (anche le `const` dentro una funzione) | `camelCase` | `renderRow`, `getFavourites`, `currentTrack` |
| Classi | `PascalCase` | `Track`, `Album`, `Player` |
| Valori fissi in cima al file, che il programma non cambia mai | `UPPER_SNAKE_CASE` | `API_BASE`, `MAX_HISTORY`, `STORAGE_KEY_HISTORY` |
| Booleani | domanda, con `is`, `has`, `can` | `isFavourite`, `isPlaying` |
| Classi CSS, `id` e attributi `data-*` | `kebab-case` | `.track-row`, `#search-input`, `data-page` |
| File | minuscolo, una parola per pagina | `home.js`, `album.html`, `app.css` |

- Le sigle si scrivono come parole (`albumId`, `previewUrl`). Unica eccezione `fetchJSON`, il nome usato dal docente.
- I campi del JSON di iTunes restano come arrivano (`trackName`, `artworkUrl100`): li legge solo il costruttore del modello, che li passa ai nostri nomi (`title`, `cover`).
- Un `data-*` scritto in `kebab-case` si legge in JS in `camelCase`: `data-track-id` diventa `element.dataset.trackId`.

**Event delegation (opzione A, decisa il 23/11):** card e righe portano l'id di quello che rappresentano, con un attributo per tipo; il cuore dei preferiti si riconosce dalla classe `btn-fav`. Uguale in tutte le pagine.

| Elemento | Markup | Lettura nel listener del contenitore |
| --- | --- | --- |
| Card o riga di un brano | `data-track-id="123"` | `event.target.closest("[data-track-id]")?.dataset.trackId` |
| Card di un album | `data-album-id="456"` | `event.target.closest("[data-album-id]")?.dataset.albumId` |
| Card di un artista | `data-artist-id="789"` | `event.target.closest("[data-artist-id]")?.dataset.artistId` |
| Cuore dei preferiti, dentro card o riga | `<button class="btn-fav">` | Si controlla per primo: `event.target.closest(".btn-fav")`; se c'è, si cambia il preferito e non parte il brano |

## 2. Speculate — cosa facciamo e quando

### Backlog

**M** = minimo richiesto. **C** = miglioria, si fa solo a minimo completo. **Stato**: Da fare, In corso, Fatto.

| # | Funzionalità | Chi | Priorità | Stato |
| --- | --- | --- | --- | --- |
| 1 | Struttura a tre zone e sidebar per device | Gabriel | M | Da fare |
| 2 | Tema scuro, card, stile delle liste | Gabriel (comune), Giovanbattista (Home e Cerca), Francesca (Album e Artista) | M | Da fare |
| 3 | `fetchJSON`, chiamate API, modelli | Tutti insieme | M | Da fare |
| 4 | Cerca: input con debounce ~400 ms, risultati divisi in Brani e Album | Alessandro | M | Da fare |
| 5 | Last search: solo l'ultima ricerca | Alessandro | M | Da fare |
| 6 | Dettaglio album con i suoi brani | Luca | M | Da fare |
| 7 | Preferiti: aggiungi e rimuovi dall'album, lista in Home | Luca (helper e album), Giovanbattista (lista in Home) | M | Da fare |
| 8 | Home: tre elenchi di suggerimenti | Giovanbattista | M | Da fare |
| 9 | Player: audio reale, Play, volume | Alessandro | M | Da fare |
| 10 | Riprodotti di recente in localStorage, mostrati in Home | Luca (salvataggio), Giovanbattista (lista in Home) | M | Da fare |
| 11 | Quarta pagina: dettaglio artista | Francesca | M | Da fare |
| 12 | Player completo: shuffle, precedente e successivo, ripeti | _da definire_ (vedi *Extra*) | C | Da fare |
| 13 | Click su un preferito che avvia il brano | _da definire_ (vedi *Extra*) | C | Da fare |
| 14 | Preferiti anche dai singoli brani nelle altre viste | _da definire_ (vedi *Extra*) | C | Da fare |
| 15 | Login e playlist per utente | _da definire_ (vedi *Extra*) | C | Da fare |

### Iterazioni

| Giorno | Iterazione | Obiettivo | Voci del backlog |
| --- | --- | --- | --- |
| Lunedì 23/11 | — | Solo pianificazione e organizzazione, niente codice: Envision e Speculate, assegnazione dei lavori, prova dell'API con Postman tutti insieme | — |
| Martedì 24/11 | 1 | Prima ora: fondamenta di Gabriel e markup di card e riga. Mattina: `fetchJSON` e modelli scritti insieme entro mezzogiorno. Pomeriggio: CSS mobile-first finito, il player suona un brano, helper di preferiti e cronologia | 1, 2, 3, 9, helper di 7 e 10 |
| Mercoledì 25/11 | 2 | Minimo completo: le quattro pagine in JS, brano in corso al cambio pagina, preferiti nella sidebar; tutto integrato su `main` e provato alle tre larghezze entro sera | 4, 5, 6, 7, 8, 10, 11 |
| Giovedì 26/11 | 3 | Extra (vedi *Extra*), README finito, tutto su `main` entro sera | Voci scelte tra 12–15 |
| Venerdì 27/11 | — | Solo revisione e rilettura per l'esposizione finale, niente codice nuovo (vedi *5. Close*) | — |

### Extra

Giovedì è dedicato agli extra. Si scelgono tra le migliorie del backlog (12–15) o se ne aggiungono altre.

**Da definire oggi:** quali extra si fanno e chi fa ciascuno.

### Rischi

| Rischio | Cosa facciamo |
| --- | --- |
| Cambiando pagina l'audio si ferma (è multipagina, non SPA) | Lo accettiamo; il player della pagina nuova mostra il brano in corso, cioè il primo della cronologia in localStorage (Alessandro) |
| Le pagine e il player dipendono da API e layout, pronti solo martedì | Lunedì si salva da Postman un JSON di esempio; fino a martedì a mezzogiorno si lavora su quello |
| Il layout responsive senza Bootstrap richiede più tempo | Mobile-first da martedì mattina: prima la struttura, poi la rifinitura |
| L'HTML comune ripetuto nelle pagine diverge | Sidebar e player li genera `common.js`, uguali per tutte; la topbar, ripetuta nelle 4 pagine, la modifica solo Gabriel (vedi *Regole di lavoro*) |
| L'API risponde diversamente dal previsto (campi, limiti) | Lunedì la si prova con Postman; i modelli isolano il resto del codice dai campi dell'API |
| Parte del team non è ancora sicura con API e JSON | Postman, `fetchJSON` e modelli si fanno insieme (vedi *Attività in comune*) |
| Due soli giorni per il minimo | CSS finito martedì, regola del passaggio di `home.js` e `artist.js` (vedi *Assegnazione dei lavori*); quello che manca mercoledì sera si chiude giovedì mattina, prima degli extra |

## 3. Explore — come lavoriamo nelle iterazioni

- La mattina ognuno prende dal backlog le sue voci per l'iterazione del giorno.
- Commit piccoli, una voce alla volta; il merge su `main` prima dello stand-up permette di provare ogni giorno l'app integrata.
- Una voce è **fatta** quando:
  - funziona su mobile, `md` e `lg`;
  - rispetta i vincoli sul codice (`querySelector`, `createElement`, `addEventListener`, event delegation);
  - è su `main` e non dà errori in console.

## 4. Adapt — controllo e correzione

Stand-up ogni giorno alle 17:00–17:15 (orario della Build Week 1, da confermare), tre domande:

1. Cosa è fatto?
2. Cosa blocca?
3. Cosa si fa domani?

Dopo lo stand-up il TL aggiorna la colonna *Stato* del backlog e, se un lavoro slitta, il Gantt in [Controllo e monitoraggio](Controllo%20e%20monitoraggio.md); venerdì lo fa chi coordina la giornata: quello che non è finito passa al giorno dopo. Se mercoledì sera il minimo non è completo, giovedì mattina si chiude quello prima di passare agli extra.

### Esposizioni al docente

Ogni pomeriggio il gruppo espone i progressi al docente, che fa da project manager. Lunedì espone il TL; da martedì a venerdì espongono Giovanbattista, Alessandro, Gabriel e Francesca, un giorno a testa in quest'ordine. Quella di venerdì è l'esposizione finale di tutto il progetto.

| Giorno | Chi espone | Cosa |
| --- | --- | --- |
| Lunedì 23/11 | Luca | Organizzazione, divisione del lavoro, piano della settimana |
| Martedì 24/11 | Giovanbattista | _da definire_ |
| Mercoledì 25/11 | Alessandro | _da definire_ |
| Giovedì 26/11 | Gabriel | _da definire_ |
| Venerdì 27/11 | Francesca | Esposizione finale completa del progetto |

**Da definire insieme:** cosa porta chi espone, come si prepara e come si svolge l'esposizione finale di venerdì.

## 5. Close — consegna e chiusura

- Venerdì niente codice nuovo: tutto è già su `main` da giovedì sera. Si rilegge il progetto, si prova l'app alle tre larghezze e si prepara l'esposizione finale.
- Luca è assente. **Da definire:** chi coordina la giornata.
- Il Git manager carica in piattaforma il link della repo.
- Alla scadenza consegna ed esposizione finale (vedi *Esposizioni al docente*).
- Retrospettiva di 15 minuti: cosa ha funzionato, cosa cambiamo per la prossima Build Week.
