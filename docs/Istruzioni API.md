# Istruzioni API

Mini guida per la prova dell'API iTunes con Postman, lunedì 23/11, tutti insieme. Durata: circa un'ora e mezza.

## A cosa serve

Domani scriviamo il codice che chiama l'API e trasforma la risposta in oggetti `Track`, `Album` e `Artist`. Oggi guardiamo con Postman cosa risponde davvero l'API, così domani sappiamo già quali campi leggere. Postman serve solo a fare una chiamata e a vedere la risposta, senza scrivere codice.

L'API è **iTunes**: non serve una chiave e il browser la può chiamare direttamente.

## 1. Una chiamata di prova, tutti insieme (15 min)

Si condivide lo schermo. In Postman:

1. **New** → **HTTP Request**, con il metodo **GET**.
2. Nella barra dell'indirizzo in alto si incolla l'indirizzo **completo**:

   ```
   https://itunes.apple.com/search?term=coldplay&entity=song&limit=3
   ```

3. Postman mette da solo quello che viene dopo il `?` nella scheda **Params** sotto la barra (`term`, `entity`, `limit`): lì si cambia un valore senza riscrivere l'indirizzo.
4. **Send**: la risposta compare in basso, nella scheda **Body**.
5. **Save** (`Cmd+S`) salva la chiamata nella collection **EpiTunes**.

Nella scheda Body compare il JSON. Si legge insieme:

- `resultCount`: quanti risultati sono arrivati (qui 3);
- `results`: l'array dei brani;
- in ogni brano: `trackName` (titolo), `artistName`, `artworkUrl100` (copertina), `previewUrl` (link all'audio). Si apre `previewUrl` nel browser: suona 30 secondi del brano.

## 2. Ognuno prova la chiamata della sua pagina (30 min)

A turno, ognuno prende la tastiera e prova la chiamata che userà nel suo codice. Tutte le chiamate si salvano in una collection di Postman chiamata **EpiTunes**.

| Chi | Indirizzo da incollare in Postman | Cosa notare |
| --- | --- | --- |
| Giovanbattista (Home) | `https://itunes.apple.com/search?term=pop&entity=song&limit=12` | Uguale a quella di prova |
| Alessandro (Cerca) | `https://itunes.apple.com/search?term=coldplay&entity=album&limit=8` | Gli album hanno `collectionId` |
| Gabriel | `https://itunes.apple.com/search?term=coldplay&entity=musicArtist&limit=8` | Gli artisti **non hanno immagine** |
| Luca (Album) | `https://itunes.apple.com/lookup?id=<collectionId>&entity=song` | Il primo risultato è l'album, gli altri sono i brani |
| Francesca (Artista) | `https://itunes.apple.com/lookup?id=<artistId>&entity=song&limit=15` | Il primo risultato è l'artista, gli altri sono i brani |

Nelle due chiamate `lookup`, al posto di `<collectionId>` e `<artistId>` si incolla un id copiato da una risposta precedente (album e artisti di coldplay).

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
