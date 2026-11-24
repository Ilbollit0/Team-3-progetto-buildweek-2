# Build Week 2 — Web app tipo Spotify

Appunti dal meeting EPICODE di presentazione del progetto.

## 1. Linguaggi e tecnologie

### 1.1 Stack di base

- **HTML**: applicazione su più pagine HTML (almeno 4); il progetto non è una Single Page Application (SPA).
- **CSS**: layout responsive e stile ispirato all'interfaccia di Spotify (tema scuro); il tema chiaro non è richiesto.
- **JavaScript vanilla**: nessun framework; focus su DOM, gestione degli eventi e chiamate HTTP alle API.

### 1.2 Struttura multipagina (no SPA)

- «Quattro pagine HTML, quattro» è l'indicazione minima; è detto esplicitamente che non è una SPA.
- Trasformarlo in SPA è un di più, complesso e non richiesto: il docente sconsiglia di «infilarvisi nel casino», perché rendering e gestione dello stato (localStorage, player, ecc.) diventano molto più complicati che in un quiz.

### 1.3 Framework CSS e responsive

> **Decisione del 24/11: Bootstrap 5.3** in tutte e 4 le pagine, caricato prima di `app.css`, così a parità di selettore vincono le nostre regole. I breakpoint sono i suoi: `md` da 768px e `lg` da 992px.

- Il docente consiglia fortemente **Bootstrap** per il layout responsive e i breakpoint, in particolare `md` e `lg`: «così non vi importate un CSS che non finisce mai».
- Approccio **mobile-first**:
  - layout mobile come vista di partenza (larghezza ~768px);
  - tablet (`md`) e desktop (`lg`) con variazioni su sidebar e disposizione delle card.

### 1.4 API di ricerca musicale

- Le slide propongono la **iTunes Search API** per i dati live (brani, album, artisti).
- La scelta dell'API è libera, anche un'API tipo Spotify, purché:
  - sia un'API di ricerca musicale;
  - fornisca l'immagine di copertina (album/brano) da mostrare nel layout.
- Consigliato provare gli endpoint con **Postman** per capire cosa offrono e com'è fatta la risposta.

### 1.5 Helper `fetchJSON` (opzionale, consigliato)

Una funzione che:

- riceve `url` e `options` ed esegue `fetch(url, options)`;
- imposta gli header (`Content-Type: application/json` più lo spread di `options.headers`);
- controlla che la risposta sia OK;
- restituisce direttamente `response.json()`.

Serve a non ripetere ovunque la stessa logica di fetch e parsing JSON (principio DRY, Don't Repeat Yourself). Fa parte della «valigetta degli attrezzi» del docente, che la usa sempre.

### 1.6 Strumenti di test e sviluppo

- Postman per provare gli endpoint (es. iTunes) e verificare il formato dei dati.
- Nessun vincolo su editor, bundler o altri strumenti: conta il codice front-end e l'uso corretto di HTML, CSS e JS.

## 2. Indicazioni tecniche e funzionali

### 2.1 Layout

#### Tre zone

Layout a tre zone ispirato a Spotify:

- **Sidebar** (sinistra): navigazione principale, con Home, Cerca ed eventuali altre sezioni.
- **Main** (centro): contenuti correnti, cioè liste di brani, album, risultati di ricerca, suggerimenti.
- **Player** (footer): barra inferiore con il player audio, che riproduce davvero l'audio (non è solo grafica).

#### Comportamento per device

| Device | Sidebar e layout |
| --- | --- |
| Mobile (partenza) | Sidebar assente; layout semplificato, centrato sulle card di contenuto |
| Tablet (`md`) | Sidebar con sole icone, senza testi |
| Desktop (`lg`) | Sidebar completa, icone e testi; layout più ricco, disposizione delle card a scelta del gruppo |

### 2.2 Pagine e navigazione

#### Pagine minime

Almeno 4 pagine HTML; una struttura possibile:

1. **Home**: suggerimenti iniziali, riprodotti di recente, preferiti.
2. **Cerca**: input con debounce e risultati (brani/album).
3. **Album** (dettaglio): brani dell'album con i pulsanti per aggiungerli o toglierli dai preferiti.
4. **Pagina a scelta del gruppo** (es. dettaglio artista).

Quattro è il minimo: se il gruppo inventa altre funzioni, le pagine possono diventare 5, 6 e oltre.

#### Home

- All'avvio mostra **tre elenchi di suggerimenti** (il contenuto non è definito nel dettaglio: servono dei contenuti di partenza).
- Con l'uso dell'app e del player si arricchisce di:
  - **riprodotti di recente**, letti da localStorage;
  - **preferiti**, i brani aggiunti dall'utente.

#### Cerca

- Input testuale per cercare brani, album, artisti.
- **Debounce di ~400 ms** sulla digitazione, per non chiamare l'API a ogni carattere.
- `Promise` o `Promise.all` per gestire più chiamate insieme (opzionale).
- Risultati separati in **Brani** e **Album**; da un album si apre la pagina di dettaglio.

#### Dettaglio album

- Elenco dei brani dell'album, presi dall'API.
- Per ogni brano un pulsante «aggiungi ai preferiti» / «rimuovi dai preferiti».
- I preferiti sono un array che si popola e si svuota al click sui pulsanti.

### 2.3 Dati e stato locale

#### Modelli dei dati API

- I dati dell'API passano per oggetti/modelli come `newTrack`, `newAlbum`, `newArtist`.
- Con iTunes l'indicazione è vincolante; con un'altra API il gruppo adatta i modelli ai dati che riceve.
- Tra i vincoli delle slide, il n. 2 e il penultimo, quelli sui dati API che passano sempre per questi costruttori, sono opzionali.

#### localStorage

Salva:

- i brani riprodotti di recente;
- gli altri dati che devono sopravvivere al refresh della pagina (es. ultima ricerca, preferiti).

Dopo un reload, la Home mostra i «riprodotti di recente» a partire da questi dati.

#### Ultima ricerca

Una sezione «Last search» mostra **solo l'ultima ricerca** fatta, non un array con tutta la cronologia: serve a rivedere al volo l'ultima query.

### 2.4 Preferiti

- Dalla pagina Album ogni brano si aggiunge o si toglie dai preferiti; l'array si aggiorna e la lista compare anche in Home.
- Il click su un preferito in Home **non** deve far partire il brano: nella demo «non succede niente» perché non è richiesto.
- Migliorie proposte:
  - il click su un preferito avvia la riproduzione;
  - aggiungere ai preferiti anche dai singoli brani nelle altre viste, non solo dagli album.

### 2.5 Player audio

#### Versione minima

Il player è reale: riproduce l'audio del brano selezionato. Funzionano:

- il pulsante **Play**;
- lo **slider del volume** (si sposta al click e regola il volume).

Gli altri controlli ci sono solo graficamente: ordine casuale (shuffle), brano precedente, brano successivo, ripeti.

#### Migliorie

- Rendere «tutto vero» il player: shuffle, precedente/successivo, ripeti.
- Slider del volume che scorre anche durante la riproduzione, non solo al click.
- Click sui preferiti che avvia l'audio (vedi 2.4).

### 2.6 Vincoli sul codice

#### DOM

- Selezione degli elementi con `document.querySelector` e `document.querySelectorAll`.
- `getElementById` sconsigliato (vincolo implicito): si usano i selettori CSS.
- I dati dell'API entrano nella pagina sempre con `createElement` e i metodi di append (`appendChild`, ecc.), mai scritti direttamente nell'HTML con template statici.

#### Eventi

- Solo `addEventListener`; niente `onclick` inline nell'HTML.
- **Event delegation** sulle griglie (liste di brani, album, ecc.): il click si aggancia al contenitore, non ai singoli elementi, così funziona anche sugli item creati dinamicamente.

#### Organizzazione del codice

- Codice diviso in moduli/file separati, senza over-engineering:
  - non spezzare un file corto in tanti file microscopici;
  - dividere in modo sensato, es. file separati per API, modelli, view, player.
- Il docente cita un gruppo che aveva già fatto così nella Build Week precedente.

### 2.7 Funzionalità avanzate facoltative

L'interfaccia mostra un nome tipo «studente epico», come se ci fosse un login. L'autenticazione non è richiesta, ma è proposta come funzionalità avanzata:

- login;
- playlist divise per utente;
- ID utente propagato per associare preferiti e playlist all'utente loggato.

## In sintesi

Una web app tipo Spotify, multipagina, con layout a tre zone e player audio reale, in HTML, CSS e JavaScript vanilla su un'API di ricerca musicale, che rispetta i vincoli di codice e di struttura dati indicati.

Secondo il docente, la versione mostrata sarebbe quasi un progetto settimanale completo: questa Build Week è pensata come un progetto «a metà», da migliorare di molto rispetto al minimo sindacale. Nelle prossime Build Week le indicazioni saranno ancora meno, per lasciare più spazio alla creatività del team.
