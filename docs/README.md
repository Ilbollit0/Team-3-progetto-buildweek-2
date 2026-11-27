# EpiTunes — Musica da API

Web app su cinque pagine, login compreso, ispirata a Spotify. Cerca brani, album e artisti con la [iTunes Search API](https://performance-partners.apple.com/search-api) e ne fa ascoltare le anteprime di 30 secondi dal player in basso. Preferiti, brani ascoltati di recente e ricerche recenti restano salvati nel browser, separati per ogni utente.

Build Week 2 del master EPICODE, Team 3: HTML, CSS con Bootstrap 5.3 e JavaScript vanilla, senza framework.

---

## ▶️ Avvio

- Con Live Server di VS Code: tasto destro su `index.html` → «Open with Live Server».
- Si apre il login: la prima volta ci si registra con nome, cognome, email e password, poi si entra nella Home.
- Serve la connessione a internet: Bootstrap e le icone di Font Awesome arrivano dalla CDN, i dati da iTunes e le foto degli artisti da TheAudioDB.

Non c'è niente da installare né da compilare: sono cinque pagine HTML, un foglio di stile e sei file JavaScript.

---

## 👥 Team

| Persona | Ruolo | Parti principali |
| --- | --- | --- |
| Luca | Team Leader e JS | Preferiti e cronologia, riga del brano, precedente e successivo nel player, preferiti nella sidebar, riordino del CSS, documenti di progetto, README e presentazione |
| Gabriel | Git manager e HTML/CSS | Repo, branch e merge su `main`, struttura comune delle pagine, CSS comune e responsive con il menu a scomparsa, formattazione con Prettier |
| Giovanbattista | HTML/CSS e JS | Home (`index.html`, il suo CSS e `home.js`), CSS della Cerca, foto degli artisti, album nella pagina Artista, login con Francesca |
| Francesca | HTML/CSS e JS | Album e Artista: HTML, CSS, `album.js` e `artist.js`; sidebar e player scritti nell'HTML, freccia indietro, shuffle e ripeti, barre da trascinare, login (`login.html`, `login.js`), ricerche recenti e X nel campo della Cerca |
| Alessandro | JS | `Player`, card del brano, Cerca (`search.js`), preferiti di album e artisti, preferiti per categoria in Home |

Chi ha fatto ogni singola voce, e quando, sta nel *Backlog* di [Project management](Project%20management.md).

---

## 📋 Piano d'azione

Abbiamo lavorato con l'**Agile Project Management**, nelle sue cinque fasi: Envision, Speculate, Explore, Adapt e Close. Il lavoro era diviso in step: le righe dello stesso step si fanno in contemporanea, ognuno nel suo branch, e Gabriel le unisce su `main` almeno una volta al giorno. Il piano con tutte le decisioni sta in [Project management](Project%20management.md), il Gantt e i KPI in [Controllo e monitoraggio](Controllo%20e%20monitoraggio.md).

### Step 0 — Prova dell'API (lunedì 23/11)
1. Tutti insieme in Postman: ricerche di brani, album e artisti, lookup di un album e di un artista.
2. Tabella dei campi di iTunes e dei nomi che usiamo nel codice, da cui sono nati i modelli.

### Step 1-2 — Fondamenta (martedì 24/11, mattina)
3. Percorsi di CSS e JS spostati in `assets/`, CSS riordinato e annidato come l'HTML, già mobile-first.
4. Card e riga del brano scritte a coppie, con lo stesso markup in tutte le pagine (`data-track-id`, cuore `btn-fav`).
5. `fetchJSON` e i modelli `Track`, `Album`, `Artist` scritti insieme, uno alla tastiera e gli altri a seguire.

### Step 3 — CSS, player e preferiti (martedì 24/11, pomeriggio)
6. CSS di Home, Cerca, Album e Artista alle tre larghezze, con le classi di Bootstrap.
7. `Player` reale: play e pausa, avanzamento, volume, precedente e successivo nella coda.
8. Preferiti e cronologia in localStorage.

### Step 4-5 — Pagine e collegamenti (mercoledì 25/11)
9. Il JavaScript delle quattro pagine: Home, Cerca, Album e Artista.
10. Il player mostra l'ultimo brano ascoltato quando si cambia pagina.
11. Preferiti nella sidebar, aggiornati da qualunque pagina.
12. Correzioni dopo un controllo di tutte le pagine: titoli delle card leggibili sopra Bootstrap, cuori allineati tra le righe della Home, barra di navigazione su mobile.

### Step 6 — Prova (mercoledì sera e giovedì mattina)
13. Prettier su tutti i file, in un solo commit, dopo l'ultimo merge.
14. Prova delle pagine da `main` alle tre larghezze.

### Step 7 — Extra e README (giovedì 26/11)
15. Le migliorie della sezione «✅ Riepilogo requisiti → Extra», login compreso.
16. La presentazione per l'esposizione finale, in `docs/presentazione/`.

### Step 8 — Revisione (venerdì 27/11)
17. Piccole correzioni, rilettura ed esposizione finale.

---

## 🗂️ Struttura dei file

| File | Scopo |
| --- | --- |
| `login.html` | Accesso e registrazione, in due schede |
| `index.html` | Home: preferiti per categoria, riprodotti di recente, tre righe di suggerimenti |
| `search.html` | Cerca: campo di ricerca con la X, ricerche recenti e risultati in Brani, Album e Artisti |
| `album.html` | Dettaglio dell'album: copertina, dati e tracklist |
| `artist.html` | Dettaglio dell'artista: brani più popolari e album |
| `assets/css/app.css` | Tutto lo stile sopra Bootstrap, in CSS annidato, nell'ordine della pagina |
| `assets/js/common.js` | Il codice comune a tutte le pagine: utente collegato, API, modelli, player, preferiti, card e riga, sidebar |
| `assets/js/login.js` | Registrazione e accesso |
| `assets/js/home.js` | La Home |
| `assets/js/search.js` | La ricerca |
| `assets/js/album.js` | Il dettaglio dell'album |
| `assets/js/artist.js` | Il dettaglio dell'artista |
| `docs/` | Consegna, API, piano di progetto, monitoraggio, presentazione e questo README |

Ogni pagina carica prima `common.js` e poi il suo file. Se nessuno è collegato, `common.js` rimanda subito a `login.html`. Altrimenti il file della pagina, come prima cosa, chiama `initPage()`, che collega sidebar, topbar e player e restituisce il player.

---

## 🌐 API — iTunes Search e TheAudioDB

Tutte le chiamate sono letture, senza chiavi private.

| Cosa | Endpoint | Dove |
| --- | --- | --- |
| Suggerimenti della Home | `search?term=rock` (poi `pop`, `italian pop`) `&media=music&entity=song&limit=8` | `home.js` |
| Brani cercati | `search?term=…&entity=song&limit=12` | `search.js` |
| Album cercati | `search?term=…&entity=album&limit=8` | `search.js` |
| Artisti cercati | `search?term=…&entity=musicArtist&limit=8` | `search.js` |
| Un album e i suoi brani | `lookup?id=<collectionId>&entity=song` | `album.js` |
| Un artista e i suoi brani | `lookup?id=<artistId>&entity=song&limit=15` | `artist.js` |
| Gli album di un artista | `lookup?id=<artistId>&entity=album&limit=12` | `artist.js` |
| Foto di un artista, da TheAudioDB | `theaudiodb.com/api/v1/json/123/search.php?s=<nome>` | `search.js` |

Le tre ricerche della Cerca e le tre righe di suggerimenti partono insieme, con `Promise.all`. iTunes non dà le foto degli artisti: la Cerca le chiede a TheAudioDB per nome (`123` è la chiave pubblica di prova) e, se mancano, usa la copertina di un brano o di un album dell'artista (`lookup?id=<artistId>&entity=album&limit=1`).

**`fetchJSON`** è la funzione del docente, con due differenze. Non manda l'header `Content-Type`, perché una GET non ha un corpo, e quell'header farebbe partire una richiesta CORS in più. E non lancia mai errori: li scrive in console e restituisce una risposta vuota, così una pagina mostra le righe vuote invece di bloccarsi.

```js
const fetchJSON = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Risposta HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Chiamata all'API non riuscita:", url, error);
    return { results: [], resultCount: 0 };
  }
};
```

---

## 🧠 Modelli

I dati di iTunes passano sempre dai costruttori di tre classi: `Track`, `Album` e `Artist`. Solo i costruttori leggono i nomi dei campi di iTunes (`trackName`, `artworkUrl100`); le pagine usano i nostri (`title`, `cover`). Così, se un campo cambia, si corregge in un posto solo.

```js
class Track {
  constructor(raw) {
    this.id = String(raw.trackId);
    this.title = raw.trackName;
    this.artist = raw.artistName;
    this.album = raw.collectionName;
    this.albumId = String(raw.collectionId);
    this.artistId = String(raw.artistId);
    this.cover = raw.artworkUrl100;
    this.previewUrl = raw.previewUrl;
    this.durationMs = raw.trackTimeMillis;
  }
}
```

Gli id diventano stringhe, come quelli che arrivano da `dataset` e dalla query string: così si confrontano con `===` senza conversioni.

---

## ⚙️ JavaScript

### `common.js`

| Parte | Cosa fa |
| --- | --- |
| Controllo dell'utente, `userKey`, `getCurrentUser`, `renderUserPill` | In cima al file: se nessuno è collegato si va a `login.html`. `userKey` aggiunge l'id dell'utente alle chiavi di localStorage, così ognuno ha i suoi dati. Nella topbar le iniziali aprono un menu con il nome e «Esci» |
| `fetchJSON`, `bigArt`, `formatTime`, `debounce`, `buildElement` | Strumenti comuni: chiamata all'API, copertina 600×600 al posto della 100×100, millisecondi in «m:ss», ricerca che parte 400 ms dopo l'ultimo tasto, elemento con classe e testo |
| `Track`, `Album`, `Artist` | I modelli |
| `Player` | Suona le anteprime nell'`<audio>` della pagina e aggiorna il footer. `play(track, queue)` riceve anche la coda, cioè i brani della riga o della tracklist cliccata: precedente, successivo, shuffle e ripeti si muovono lì dentro, e a fine brano parte il successivo. Barra del brano e volume si regolano con un clic o trascinando |
| `restoreLastTrack` | Cambiando pagina l'audio si ferma, perché l'app non è una SPA: il player della pagina nuova mostra l'ultimo brano ascoltato, pronto da far ripartire |
| `getFavourites`, `toggleFavourite`, `getHistory`, `addToHistory` | Preferiti e cronologia dell'utente in localStorage, salvati come `Track` interi: si possono suonare senza chiamare di nuovo l'API |
| `createTrackCard`, `createTrackRow`, `createFavButton` | Card per le griglie, riga per le tracklist, cuore dei preferiti: uguali in tutte le pagine |
| `renderSidebar`, `renderSidebarFavs` | Link attivo della sidebar e lista dei preferiti, aggiornata a ogni cuore cliccato |
| `initPage` | La chiama ogni pagina tranne il login: collega sidebar, topbar con le iniziali e player |

### Le pagine

| Pagina | Come funziona |
| --- | --- |
| Login | Due schede di Bootstrap, Accedi e Registrati. La registrazione rifiuta un'email già usata; l'accesso controlla email e password. Chi entra resta collegato finché non chiude la scheda o preme «Esci». È un login simulato, tutto nel browser: le password non vanno a nessun server |
| Home | Mostra i preferiti divisi in Brani, Album e Artisti, poi i riprodotti di recente e tre righe di suggerimenti. Un brano preferito parte con un clic; un album o un artista preferito apre la sua pagina, e il cuore lo toglie. Le righe vuote restano nascoste. Un cuore aggiorna tutte le righe in cui compare lo stesso brano |
| Cerca | La ricerca parte 400 ms dopo l'ultimo tasto. Se intanto parte una ricerca nuova, i risultati di quella vecchia non si mostrano. Gli artisti hanno la foto. Un album apre il suo dettaglio, un artista il suo. La X svuota il campo; a campo vuoto la pagina mostra le ricerche recenti, salvate premendo Invio (fino a 8: un clic ne ripete una, la × la toglie, «Cancella cronologia» le toglie tutte), e sotto i brani cercati di recente |
| Album | Legge l'id dalla query string (`album.html?id=…`): copertina grande, anno, numero di brani e durata totale, tracklist con i cuori. Il nome dell'artista porta alla sua pagina |
| Artista | Legge l'id dalla query string: nome, genere e brani più popolari, con i cuori; sotto, la griglia dei suoi album, che si aprono con un clic e si salvano col cuore |

### Eventi

- Solo `addEventListener`, nessun `onclick` nell'HTML.
- **Event delegation:** un solo listener per contenitore, non uno per card. Card e righe portano l'id di quello che rappresentano (`data-track-id`, `data-album-id`, `data-artist-id`), e il listener lo legge con `closest()`. Il cuore `.btn-fav` si controlla per primo: se è stato cliccato lui, cambia il preferito e il brano non parte.
- Elementi selezionati solo con `querySelector` e `querySelectorAll`.
- I dati dell'API entrano nella pagina solo con `createElement` e `textContent`, mai come HTML: un titolo che contiene `<script>` resta testo.

### localStorage e sessionStorage

Le chiavi dei dati finiscono con l'id dell'utente (`_<id>`), aggiunto da `userKey`: due utenti sullo stesso browser non si vedono i preferiti a vicenda.

| Chiave | Dove | Contenuto |
| --- | --- | --- |
| `epitunes_users` | localStorage | Gli utenti registrati: id, nome, cognome, email e password |
| `epitunes_current_user` | sessionStorage | L'id dell'utente collegato; si svuota chiudendo la scheda |
| `epitunes_history_<id>` | localStorage | Gli ultimi 12 brani ascoltati, il più recente in testa, senza doppioni |
| `epitunes_favourites_<id>` | localStorage | I brani preferiti, l'ultimo aggiunto in testa |
| `epitunes_favourite_albums_<id>`, `epitunes_favourite_artists_<id>` | localStorage | Album e artisti preferiti, dalla Cerca e dalla pagina Artista |
| `epitunes_recent_searches_<id>` | localStorage | Le ricerche fatte con Invio, fino a 8, la più recente in testa, senza doppioni |
| `epitunes_recent_tracks_<id>` | localStorage | I brani cercati di recente: i primi 6 risultati dell'ultima ricerca con Invio e i brani cliccati nei risultati |

---

## 🧩 CSS — `app.css`

Bootstrap 5.3 si carica prima di `app.css`, quindi a parità di selettore vincono le nostre regole. Bootstrap fa la griglia delle card della Home e le classi di spaziatura; `app.css` fa il tema scuro e tutto il resto, in un solo file ordinato come la pagina: token, base, layout, sidebar, topbar, pagine, righe e griglia, card, hero, tracklist, player.

### CSS annidato

L'indentazione ricalca l'HTML, e ogni `@media` sta dentro il blocco che modifica:

```css
.sidebar {
  display: flex;

  @media (min-width: 992px) {
    display: block;
  }

  .sidebar-nav {
    a {
      &.active {
        color: var(--text-primary);
      }
    }
  }
}
```

### Responsive (mobile-first)

| Larghezza | Layout |
| --- | --- |
| Telefono e tablet, sotto i 992 px | Barra in alto con il logo e il menu a scomparsa (Home, Cerca e preferiti, con il collapse di Bootstrap); contenuti a tutta larghezza; player in basso |
| Desktop, `lg` da 992 px | Sidebar completa a sinistra, con i testi e la lista dei preferiti |

La consegna vuole la sidebar assente su mobile e solo icone su tablet. Noi la chiudiamo in un menu a scomparsa, perché senza non si passava dalla Home alla Cerca dal telefono.

---

## 🎨 Palette

| Uso | Colore |
| --- | --- |
| Sfondo della pagina | `#121212` |
| Card e player | `#181818` |
| Card al passaggio del mouse | `#282828` |
| Sidebar | `#000000` |
| Testo | `#ffffff` |
| Testo secondario | `#b3b3b3` |
| Accento, logo | `#f7d800`, il giallo Epicode |
| Pulsante play | `#1ed760` |
| Cuore dei preferiti | `#e25555` |

---

## ✅ Riepilogo requisiti

**Struttura e layout**
- ✅ Quattro pagine HTML, più il login; nessuna SPA.
- ✅ Layout a tre zone: sidebar, contenuti, player.
- ✅ Bootstrap 5.3 in tutte le pagine, mobile-first con `md` e `lg`.
- ✅ Tema scuro ispirato a Spotify.

**Dati**
- ✅ iTunes Search API, con le copertine.
- ✅ `fetchJSON` per tutte le chiamate.
- ✅ Modelli `Track`, `Album`, `Artist`.
- ✅ localStorage per recenti, preferiti e ricerche recenti.

**Pagine**
- ✅ Home con tre righe di suggerimenti, riprodotti di recente e preferiti.
- ✅ Cerca con debounce di 400 ms, `Promise.all` e risultati divisi in Brani, Album e Artisti.
- ✅ Dettaglio album con i pulsanti per aggiungere e togliere i preferiti.
- ✅ Quarta pagina a scelta: dettaglio artista.

**Player**
- ✅ Riproduce davvero l'audio, con play e pausa.
- ✅ Volume che si regola al click sulla barra.

**Vincoli sul codice**
- ✅ Solo `querySelector` e `querySelectorAll`, nessun `getElementById`.
- ✅ Solo `addEventListener`, nessun `onclick`.
- ✅ Event delegation su griglie e tracklist.
- ✅ Dati dell'API inseriti con `createElement`.
- ✅ Codice diviso in file: uno comune e uno per pagina.

**Extra**
- ✅ Precedente e successivo nella coda; a fine brano parte il successivo.
- ✅ Cuore dei preferiti anche in Home, Cerca e Artista, non solo in Album.
- ✅ Il player mostra l'ultimo brano ascoltato quando si cambia pagina.
- ✅ Preferiti nella sidebar.
- ✅ Shuffle e ripeti.
- ✅ Volume e avanzamento del brano che si regolano anche trascinando.
- ✅ Foto degli artisti nella Cerca, da TheAudioDB.
- ✅ Album dell'artista nella sua pagina.
- ✅ Login con registrazione e dati separati per ogni utente.
- ✅ Preferiti divisi per categoria in Home: brani, album, artisti.
- ✅ Click su un preferito in Home: il brano parte, l'album o l'artista apre la sua pagina.
- ✅ Ricerche recenti e brani cercati di recente nella Cerca, con la X per svuotare il campo.
- ⬜ Playlist per utente.

---

## ✔️ Verifica

Le pagine di `main` sono state provate in Chrome headless, pilotato con il DevTools Protocol. Giovedì mattina con risposte di iTunes simulate, con la stessa forma di quelle vere; giovedì pomeriggio, dopo il merge #45, con le risposte vere di iTunes e TheAudioDB registrate, a 390, 768 e 1024 px di larghezza. Le novità delle PR #46 e #47 (preferiti per categoria e ricerche recenti) sono state provate poi a parte, con le stesse risposte: console pulita e nessuno scorrimento orizzontale a 390 px.

- **Console:** nessun errore all'apertura, in 12 prove (4 pagine per 3 larghezze), e nessuno nel login (KPI K4).
- **Scorrimento orizzontale:** nessuno, a tutte e tre le larghezze (KPI K5).
- **Vincoli:** 0 occorrenze di `onclick`, `getElementById` e `var` nei file (KPI K6).
- **Login:** senza utente ogni pagina rimanda al login; dopo la registrazione si entra nella Home con le iniziali nella topbar; «Esci» riporta al login e chiude la sessione.
- **Cerca:** «q» e poi «queen» scritti di seguito fanno partire una sola ricerca, con tre chiamate insieme; per «queen» 8 artisti su 8 hanno la foto. Con Invio la ricerca entra tra le recenti; riaprendo la pagina, ricerche e brani cercati ci sono ancora, e un clic sulla pillola ripete la ricerca.
- **Home:** un cuore tolto nella riga dei preferiti si svuota anche nelle altre righe; la sezione dei preferiti si nasconde quando è vuota. Con un brano, un album e un artista tra i preferiti compaiono le tre categorie; il clic sull'album apre la sua pagina e il cuore sull'artista lo toglie.
- **Album e Artista:** il cuore salva il brano senza farlo partire; il click sulla riga lo fa partire con la coda della tracklist. Per i Måneskin la pagina Artista mostra 15 brani e 12 album.
- **Prova del team da `main` (step 6):** _da fare._

---

## 📁 Materiale

| Documento | Contenuto |
| --- | --- |
| [Istruzioni progetto](Istruzioni%20progetto.md) | La consegna, dagli appunti del meeting EPICODE |
| [Project management](Project%20management.md) | Visione, ruoli, regole di lavoro, backlog, rischi |
| [Controllo e monitoraggio](Controllo%20e%20monitoraggio.md) | Gantt e KPI |
| [Presentazione](presentazione/index.html) | Le slide dell'esposizione finale: il prodotto e come funziona |
