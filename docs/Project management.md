# Organizzazione e divisione del lavoro

Progettazione in ottica **Agile Project Management** (APM), nelle sue cinque fasi: Envision, Speculate, Explore, Adapt, Close, ridotte a quello che serve per una settimana. Team di 5 persone (vedi *Team e ruoli*).

Cosa va costruito sta in [Istruzioni progetto](Istruzioni%20progetto.md); qui c'è come ci organizziamo per farlo.

## Calendario

| Fase | Quando | Cosa ne esce |
| --- | --- | --- |
| Envision | Lunedì 23/11, mattina | Visione, obiettivi, vincoli, ruoli, regole di lavoro |
| Speculate | Lunedì 23/11, pomeriggio | Backlog a step e rischi; prova dell'API (step 0) |
| Explore | Da martedì 24 a giovedì 26/11 | Step 1–7: minimo martedì e mercoledì, extra giovedì |
| Adapt | Ogni giorno, all'esposizione al docente e allo stand-up | Piano aggiornato per il giorno dopo |
| Close | Venerdì 27/11 | Step 8: revisione, consegna, esposizione finale, retrospettiva |

## 1. Envision — cosa costruiamo e chi siamo

### Visione

> Una web app tipo Spotify, su più pagine, in HTML, CSS con Bootstrap e JavaScript vanilla: si cerca musica da un'API e la si ascolta davvero dal player.

### Obiettivi

1. Il minimo richiesto funzionante e integrato su `main` entro mercoledì sera.
2. Gli extra della sezione *Extra* del *Backlog*, ognuno solo dopo le sue voci del minimo.
3. Un README che spiega cosa fa l'app e come, scritto man mano e finito giovedì sera.
4. Venerdì tutto è già pronto: solo piccole correzioni, revisione e rilettura per l'esposizione finale.

### Vincoli

- **Consegna:** venerdì 27/11 alle 16:30, poi la presentazione (orario della Build Week 1, da confermare).
- **Tecnici:** almeno 4 pagine, niente SPA, Bootstrap 5.3 in ogni pagina, mobile-first con breakpoint `md` da 768px e `lg` da 992px, vincoli sul codice di *Istruzioni progetto* (1.3 e 2.6).
- **Venerdì Luca è assente:** quello che è suo (README, questo file, le sue voci) è finito giovedì sera.

### Team e ruoli

Francesca, Gabriel, Giovanbattista, Alessandro e Luca (Team Leader). Il lavoro si divide per oggetti dello scheletro: ognuno risponde delle sue classi, funzioni e file, e gli altri usano solo i loro metodi pubblici.

| Persona | Ruolo | Parti del codice |
| --- | --- | --- |
| Luca | Team Leader e JS: coordina, tiene backlog e piano in questo file, conduce lo stand-up, tiene i contatti con il docente, cura il README, dà supporto tecnico a tutti | Preferiti e cronologia, riga del brano, `album.js` |
| Gabriel | Git manager e HTML/CSS: repo, branch, pull request e merge su `main` (li gestisce solo lui) | Struttura comune delle 4 pagine, CSS comune |
| Giovanbattista | HTML/CSS, poi JS quando ha finito | `index.html` e `search.html` con il loro CSS, poi `home.js` |
| Francesca | HTML/CSS, poi JS quando ha finito | `album.html` e `artist.html` con il loro CSS, poi `artist.js` |
| Alessandro | JS | `Player`, card del brano, `search.js` |

### Regole di lavoro

- Una repo GitHub, un branch per persona con il suo nome: `Branch_Luca`, `Branch_Gabriel`, `Branch_Giova`, `Branch_Francesca`, `Branch_Alessandro`.
- Le pull request verso `main` le apre e le unisce Gabriel, almeno una volta al giorno, prima dello stand-up. Chi ha finito una voce glielo dice su Discord.
- Commit piccoli, con un messaggio di una riga che dice cosa cambia, per esempio «Aggiunge il volume al player».
- Il codice si formatta con Prettier, con le impostazioni standard: indentazione a 2 spazi, virgolette doppie, punto e virgola, come nello scheletro.
- I file comuni li modifica solo chi ne è responsabile, gli altri gli chiedono la modifica: Gabriel per la struttura HTML delle 4 pagine, la topbar e il CSS comune (colori, font, `.app`, `.sidebar`, `.main`, `.topbar`, `.player`), Luca per `fetchJSON` e i modelli dopo lo step 2. In `common.js` ognuno scrive solo nella sua sezione, così i merge di Gabriel non vanno in conflitto.
- Si comunica su Discord; un blocco si dice subito, senza aspettare lo stand-up. Se è su una chiamata o su un campo del JSON, lo si guarda insieme in Postman prima di cambiare il codice.

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

### Backlog — chi fa cosa, step per step

Il lavoro è diviso in nove step, dallo 0 all'8. Gli step da 1 a 6 portano al minimo richiesto, lo step 7 è il giorno degli extra e del README. Gli extra hanno la loro tabella, in *Extra*. Lunedì niente codice: c'è solo lo step 0.

**Gli step in breve**

- **Step 0 · Prova dell'API** (lunedì pomeriggio): tutti insieme, con Postman.
- **Step 1 · Fondamenta** (martedì, prima ora): Gabriel sistema i percorsi negli HTML e le `@media` di `app.css`, poi passa Prettier su tutti i file; le due coppie scrivono la struttura della card e della riga del brano.
- **Step 2 · Dati** (martedì, fino a mezzogiorno): tutti insieme scrivono `fetchJSON` e i modelli `Track`, `Album`, `Artist`.
- **Step 3 · Stile e funzioni comuni** (martedì pomeriggio): il CSS delle pagine, il player, preferiti e cronologia.
- **Step 4 · Le pagine** (mercoledì mattina): il JS di Home, Cerca, Album e Artista; Gabriel unisce le PR e rifinisce il responsive.
- **Step 5 · Collegamenti** (mercoledì pomeriggio): al cambio pagina il player mostra il brano in corso, i preferiti compaiono nella sidebar, gli altri chiudono le loro voci.
- **Step 6 · Prova** (mercoledì sera): tutti provano `main` alle tre larghezze.
- **Step 7 · Extra e README** (giovedì).
- **Step 8 · Revisione** (venerdì): piccole correzioni e ritocchi, poi si prepara l'esposizione finale.

**Come si va avanti**

- Gli step seguono l'ordine della tabella, giorno per giorno. Le righe dello stesso step si fanno **in contemporanea**: ognuno fa la sua, nello stesso momento degli altri.
- Due lavori devono essere su `main` prima dello step 3, perché tutto il resto parte da lì. Gabriel li unisce appena sono pronti, e chi comincia lo step 3 aggiorna prima il suo branch da `main`. I due lavori sono:
  - **le fondamenta di Gabriel (step 1).** Senza i percorsi giusti le pagine non caricano né CSS né JS. E allo step 3 tre persone scrivono in `app.css` nello stesso momento, ognuna nelle sue sezioni: devono già essere quelle divise e formattate da Gabriel, se no i merge vanno in conflitto;
  - **`fetchJSON` e i modelli (step 2).** Tutto il JS che viene dopo legge i dati come li danno i modelli, per esempio `track.title`, `track.cover`, `track.previewUrl`: se quei nomi cambiassero dopo, andrebbero cambiati in tutte le pagine.
- Negli step 3, 4 e 5 ognuno lavora per conto suo, anche quando usa funzioni che scrive un altro. Nello scheletro quelle funzioni ci sono già, vuote, e non danno errori: si chiamano come se fossero finite, e quando arriva il merge di chi le scrive la pagina si riempie da sola. Fino ad allora:
  - `player.play()`, di Alessandro, non fa niente: cliccando un brano non si sente nulla;
  - `getHistory()` e `getFavourites()`, di Luca, restituiscono `[]`: in Home le righe dei recenti e dei preferiti restano vuote;
  - `isFavourite()`, di Luca, restituisce `false` e `toggleFavourite()` non salva niente: il cuore resta vuoto.
- `createTrackCard` e `createTrackRow` invece nello scheletro non ci sono: nascono allo step 1, così esistono già quando le pagine le usano allo step 4.
- **Stato**: Da fare, In corso, Fatto.

| Step | Quando | Chi | Compito | Stato |
| --- | --- | --- | --- | --- |
| 0 | Lunedì pomeriggio | Tutti | `riferimenti/api-esempi/`, `riferimenti/postman/` e [Istruzioni API](Istruzioni%20API.md): prova dell'API con Postman; si salvano le risposte di esempio, la collection EpiTunes e la tabella dei campi | Fatto |
| 1 | Martedì, prima ora | Gabriel | Le 4 pagine HTML e `app.css`: fondamenta, cioè percorsi di CSS e JS negli HTML (da `css/` e `js/` ad `assets/`) e le due `@media` in fondo ad `app.css` spezzate nelle sezioni, già mobile-first; poi Prettier su tutti i file → merge su `main` | In corso |
| 1 | Martedì mattina | Luca | `app.css`: riordino, cioè CSS annidato che segue l'HTML, ogni `@media` dentro il blocco che modifica, blocchi doppi uniti, refuso `html,s` corretto; lo stile delle pagine resta identico → merge su `main` | Fatto |
| 1 | Martedì, prima ora | Alessandro + Giovanbattista | `common.js`: struttura HTML della card del brano (`createTrackCard`), cioè classi, cover, titolo, artista, Play, cuore `btn-fav`, `data-track-id` | Fatto |
| 1 | Martedì, prima ora | Luca + Francesca | `common.js`: struttura HTML della riga del brano (`createTrackRow`), cioè numero, titolo, durata, cuore `btn-fav`, `data-track-id`, `.is-playing` | Fatto |
| 2 | Martedì, fino a mezzogiorno | Tutti | `common.js`: `fetchJSON` e costruttori di `Track`, `Album`, `Artist` dalla tabella di [Istruzioni API](Istruzioni%20API.md), scritti insieme: uno alla tastiera e gli altri che seguono, a turno → merge su `main` | Fatto |
| 3 | Martedì pomeriggio | Gabriel | `app.css`: CSS comune, cioè colori e font del tema scuro, `.app` a tre zone, `.sidebar` (assente su mobile, solo icone su `md`, completa su `lg`), `.main`, `.topbar`, `.player` | Da fare |
| 3 | Martedì pomeriggio | Giovanbattista | `index.html`, `search.html` (classi di Bootstrap) e `app.css`: CSS di Home e Cerca alle tre larghezze (`.home`, `.search`, `.row`, `.grid`, `.card`) | In corso |
| 3 | Martedì pomeriggio | Francesca | `album.html`, `artist.html` (classi di Bootstrap) e `app.css`: CSS di Album e Artista alle tre larghezze (`.album-page`, `.artist-page`, hero con copertina grande, `.tracklist`, `.track-row` con il brano in riproduzione) | In corso |
| 3 | Martedì pomeriggio | Alessandro | `common.js`: `Player` (`constructor` ed eventi audio, `mount` con i click, `play(track, queue)`, `togglePlay`, `setVolume`, `seek`) e `createTrackCard` | Fatto |
| 3 | Martedì pomeriggio | Luca | `common.js`: preferiti e cronologia in localStorage (`getFavourites`, `isFavourite`, `toggleFavourite`, `getHistory`, `addToHistory`) e `createTrackRow` | Fatto |
| 4 | Mercoledì mattina | Alessandro | `search.js`: debounce di ~400 ms, tre chiamate con `Promise.all`, righe Brani / Album / Artisti, ultima ricerca | Da fare |
| 4 | Mercoledì mattina | Luca | `album.js`: id dalla query string, lookup, hero, tracklist con `createTrackRow` e cuore dei preferiti | Fatto |
| 4 | Mercoledì mattina | Giovanbattista | `home.js`: `renderRow`, tre righe di suggerimenti con `Promise.all`, righe dei recenti e dei preferiti | Da fare |
| 4 | Mercoledì mattina | Francesca | `artist.js`: id dalla query string, lookup, hero, brani più ascoltati con `createTrackRow` | In corso |
| 4 | Mercoledì mattina | Gabriel | `app.css`, parti comuni: rifinitura responsive; merge delle PR su GitHub | Da fare |
| 5 | Mercoledì pomeriggio | Alessandro | `common.js` (`Player`): brano in corso mostrato al cambio pagina, cioè il primo della cronologia | Da fare |
| 5 | Mercoledì pomeriggio | Luca | `common.js`: lista dei preferiti nella sidebar, in `#sidebar-favs` di `renderSidebar` | Da fare |
| 5 | Mercoledì pomeriggio | Gabriel, Giovanbattista, Francesca | I file delle proprie voci: chiusura delle voci aperte, correzioni | Da fare |
| 6 | Mercoledì sera | Tutti | Le 4 pagine da `main`: prova alle tre larghezze, zero errori in console (KPI K4, K5); le correzioni le fa chi risponde del file | Da fare |
| 7 | Giovedì | Luca | `README.md`: chiusura del README, che spiega cosa fa l'app e come | Da fare |
| 8 | Venerdì | Tutti tranne Luca | I file delle proprie voci, solo per piccole correzioni e ritocchi: revisione e rilettura per l'esposizione finale | Da fare |

**Regola di passaggio:** allo step 4 Giovanbattista e Francesca scrivono il JS delle pagine di cui hanno fatto il CSS, quindi il CSS va finito martedì. Se martedì sera non è finito, `home.js` passa a Luca e `artist.js` ad Alessandro; il CSS resta a loro.

#### Extra

Ognuno fa gli extra solo dopo le sue voci del minimo, e gli extra non contano nel KPI K1 di [Controllo e monitoraggio](Controllo%20e%20monitoraggio.md).

- **Mercoledì pomeriggio, con lo step 5:** gli extra che toccano codice del minimo. Così passano dalla prova di `main` dello step 6 insieme al minimo; giovedì riaprire quel codice rischierebbe di romperlo quando resta meno tempo per sistemarlo.
- **Giovedì, con lo step 7:** gli extra che stanno tutti in un posto.
- **Se le voci del minimo non sono finite**, l'extra passa a giovedì.

Per ora gli extra da fare sono di Alessandro; allo stand-up si possono ridistribuire.

| Quando | Chi | Compito | Stato |
| --- | --- | --- | --- |
| Martedì pomeriggio (step 3) | Luca | `common.js` (`Player`): precedente e successivo nella coda di `play(track, queue)`, e a fine brano parte il successivo; allo step 4 ogni pagina passa come `queue` i brani della riga o della tracklist cliccata, nell'ordine in cui si vedono | Fatto |
| Mercoledì pomeriggio (step 5) | Alessandro | `home.js`, `search.js` e `artist.js`: preferiti anche dai singoli brani nelle altre viste, cioè il cuore `btn-fav` nelle card e nelle righe di Home, Cerca e Artista, come in Album | Da fare |
| Mercoledì pomeriggio (step 5) | Alessandro | `home.js` e `common.js` (`renderSidebar`): click su un preferito che avvia il brano, nella riga dei preferiti della Home (basta che usi la stessa `renderRow` delle altre righe) e in `#sidebar-favs` | Da fare |
| Giovedì (step 7) | Alessandro | `common.js` (`Player`): shuffle e ripeti | Da fare |
| Giovedì (step 7) | Alessandro | `common.js` (`Player`): slider del volume che scorre anche trascinandolo, non solo al click | Da fare |
| Giovedì (step 7), per ultimo | Alessandro | Una pagina nuova con il suo JS, le 4 pagine HTML (`user-pill`), `common.js` e `app.css`: login e playlist per utente | Da fare |

### Rischi

| Rischio | Cosa facciamo |
| --- | --- |
| Cambiando pagina l'audio si ferma (è multipagina, non SPA) | Lo accettiamo; il player della pagina nuova mostra il brano in corso, cioè il primo della cronologia in localStorage (Alessandro) |
| Le pagine e il player dipendono da API e layout, pronti solo martedì | Lunedì si salva da Postman un JSON di esempio; fino a martedì a mezzogiorno si lavora su quello |
| L'HTML comune ripetuto nelle pagine diverge | Sidebar e player li genera `common.js`, uguali per tutte; la topbar, ripetuta nelle 4 pagine, la modifica solo Gabriel (vedi *Regole di lavoro*) |
| L'API risponde diversamente dal previsto (campi, limiti) | Lunedì la si prova con Postman; i modelli isolano il resto del codice dai campi dell'API |
| Parte del team non è ancora sicura con API e JSON | Postman, `fetchJSON` e modelli si fanno insieme (step 0 e 2 del *Backlog*) |
| Due soli giorni per il minimo | CSS finito martedì, regola di passaggio di `home.js` e `artist.js` (vedi *Backlog*); quello che manca mercoledì sera si chiude giovedì mattina, prima degli extra |

## 3. Explore — come lavoriamo nelle iterazioni

- La mattina ognuno prende dal backlog le sue voci del giorno.
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

- Venerdì niente funzioni nuove: tutto è già su `main` da giovedì sera. Piccole correzioni e ritocchi si fanno ancora, con push e PR come gli altri giorni, e Gabriel li unisce prima della consegna delle 16:30. Si rilegge il progetto, si prova l'app alle tre larghezze e si prepara l'esposizione finale.
- Luca è assente. **Da definire:** chi coordina la giornata.
- Il Git manager carica in piattaforma il link della repo.
- Alla scadenza consegna ed esposizione finale (vedi *Esposizioni al docente*).
- Retrospettiva di 15 minuti: cosa ha funzionato, cosa cambiamo per la prossima Build Week.
