# Istruzioni API

Mini guida per la prova dell'API iTunes con Postman, lunedì 23/11, tutti insieme. Durata: circa un'ora e mezza.

## A cosa serve

Domani scriviamo il codice che chiama l'API e trasforma la risposta in oggetti `Track`, `Album` e `Artist`. Oggi guardiamo con Postman cosa risponde davvero l'API, così domani sappiamo già quali campi leggere. Postman serve solo a fare una chiamata e a vedere la risposta, senza scrivere codice.

L'API è **iTunes**: non serve una chiave e il browser la può chiamare direttamente.

## 1. Una chiamata di prova, tutti insieme (15 min)

Si condivide lo schermo. In Postman si crea una nuova richiesta **GET**, si incolla questo indirizzo e si preme **Send**:

```
https://itunes.apple.com/search?term=coldplay&entity=song&limit=3
```

Sotto compare il JSON. Si legge insieme:

- `resultCount`: quanti risultati sono arrivati (qui 3);
- `results`: l'array dei brani;
- in ogni brano: `trackName` (titolo), `artistName`, `artworkUrl100` (copertina), `previewUrl` (link all'audio). Si apre `previewUrl` nel browser: suona 30 secondi del brano.

## 2. Ognuno prova la chiamata della sua pagina (30 min)

A turno, ognuno prende la tastiera e prova la chiamata che userà nel suo codice. Tutte le chiamate si salvano in una collection di Postman chiamata **EpiTunes**.

| Chi | Chiamata (dopo `https://itunes.apple.com/`) | Cosa notare |
| --- | --- | --- |
| Giovanbattista (Home) | `search?term=pop&entity=song&limit=12` | Uguale a quella di prova |
| Alessandro (Cerca) | `search?term=coldplay&entity=album&limit=8` | Gli album hanno `collectionId` |
| Gabriel | `search?term=coldplay&entity=musicArtist&limit=8` | Gli artisti **non hanno immagine** |
| Luca (Album) | `lookup?id=<un collectionId preso sopra>&entity=song` | Il primo risultato è l'album, gli altri sono i brani |
| Francesca (Artista) | `lookup?id=<un artistId preso sopra>&entity=song&limit=15` | Il primo risultato è l'artista, gli altri sono i brani |

## 3. Campo dell'API → nome nel nostro codice (25 min)

Guardando le risposte, si scrive insieme quale campo dell'API diventa quale proprietà nostra. Domattina questa tabella diventa il codice dei costruttori in `assets/js/common.js`.

Esempio per partire: `trackName` → `title`, `artworkUrl100` → `cover`, `trackTimeMillis` → `durationMs`.

| Modello | Proprietà nostra ← campo API |
| --- | --- |
| `Track` | |
| `Album` | |
| `Artist` | |

## 4. Si salva tutto nella repo (15 min)

- **Risposte:** per ogni chiamata, in Postman **Save response** → **Save to a file**, nella cartella `riferimenti/api-esempi/`. Servono domattina, finché l'API non è collegata al codice.
- **Collection:** si esporta la collection EpiTunes in `riferimenti/postman/`. Chi manca la importa e ha le stesse chiamate.
- **Tabella del punto 3:** si compila direttamente in questo file.
- **Commit:** chi ha i file li committa sul suo branch, Gabriel apre la PR.

## 5. Due decisioni prima di chiudere (5 min)

- Cosa mostrare al posto della foto dell'artista: la copertina di un suo brano oppure un segnaposto.
- Se cercare solo nel catalogo italiano, aggiungendo `&country=it` alle chiamate.

## Fatto quando

- [ ] Le 5 chiamate della collection rispondono e `resultCount` è maggiore di 0.
- [ ] I JSON salvati in `riferimenti/api-esempi/` si aprono senza errori.
- [ ] La tabella del punto 3 ha tutti i campi di `Track`: `id`, `title`, `artist`, `album`, `albumId`, `artistId`, `cover`, `previewUrl`, `durationMs`.
- [ ] Le due decisioni sono prese.
