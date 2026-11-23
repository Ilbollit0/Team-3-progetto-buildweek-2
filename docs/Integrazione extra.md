# Integrazione degli extra

Proposta da discutere martedì 24/11, prima dello step 3: la prima modifica, `player.play(track, queue)`, serve già lì. Backlog e piano stanno in [Project management](Project%20management.md); qui c'è solo la proposta.

## Perché

Giovedì il minimo è già integrato su `main`. Un extra che riapre il codice del minimo può romperlo proprio quando resta meno tempo per accorgersene e sistemarlo.

La proposta è anticipare a mercoledì pomeriggio (step 5) gli extra che toccano codice che martedì e mercoledì scriviamo comunque. Costano poche righe e passano dalla prova di `main` dello step 6, insieme al minimo. Giovedì restano solo gli extra che stanno in un posto isolato.

Gli extra anticipati restano **extra**: nel backlog sono segnati così, e ognuno li fa solo dopo le sue voci del minimo. Se quelle non sono finite, l'extra torna a giovedì.

## Extra per extra

| Extra | Quando | Chi | Perché |
| --- | --- | --- | --- |
| Preferiti anche dai singoli brani nelle altre viste | Mercoledì pomeriggio (step 5) | Giovanbattista (Home), Alessandro (Cerca), Francesca (Artista) | Il cuore `btn-fav` è già nel markup di card e riga dello step 1, quindi compare in tutte le pagine: senza listener resta un bottone che non fa niente. Bastano poche righe nel listener del contenitore, che ognuno scrive allo step 4 |
| Click su un preferito che avvia il brano | Mercoledì pomeriggio (step 5) | Giovanbattista (Home), Luca (sidebar) | In Home, se la riga dei preferiti usa la stessa `renderRow` delle altre righe, il click fa già partire il brano. I preferiti si salvano come `Track` interi, con `previewUrl`, quindi si suonano senza altre chiamate all'API. Nella sidebar serve un listener su `#sidebar-favs` |
| Player: precedente e successivo | Mercoledì pomeriggio (step 5) | Alessandro | I bottoni ci sono già nel player. Serve la coda, cioè i brani della riga o della tracklist cliccata: se la decidiamo adesso, le pagine la passano già allo step 4. Fatto giovedì, vorrebbe dire riaprire i click di tutte e 4 le pagine |
| Player: shuffle e ripeti | Giovedì (step 7) | Alessandro | Cambia solo il modo in cui il player sceglie il brano successivo, tutto dentro `Player`: non tocca niente di quello che usano le pagine |
| Login e playlist per utente | Giovedì (step 7), per ultimo | _da definire_ | È l'unico che non si può anticipare. Servono una pagina nuova, il nome dell'utente al posto di «Studente Epicode» nelle 4 pagine, le playlist nella sidebar e i preferiti salvati per utente: tocca i dati che leggono tutte le pagine |

## La regola da decidere prima dello step 3

Precedente e successivo funzionano solo se tutte le pagine passano la coda al player. La regola si decide una volta ed è uguale in tutte le pagine:

> Al click su un brano si chiama `player.play(track, queue)`: `queue` sono i brani della stessa riga o tracklist, nell'ordine in cui si vedono. Se manca, la coda è il solo `track`.

Allo step 3 Alessandro scrive `play` con questa firma e aggiorna il commento in `common.js`, che oggi dice `play(track)`. Allo step 4 chi scrive una pagina passa la coda: i brani sono già nell'array che usa per disegnare la riga.

Sempre allo step 3, Luca salva i preferiti come `Track` interi, come dice già il commento di `getFavourites` nello scheletro. È questo che permette di suonarli dalla Home e dalla sidebar.

## Cosa cambia nel backlog, se la approviamo

| Step | Chi | Voce |
| --- | --- | --- |
| 3 | Alessandro | `common.js`: nella voce del `Player`, `play(track, queue)` al posto di `play` |
| 3 | Luca | `common.js`: nella voce di preferiti e cronologia, preferiti salvati come `Track` interi |
| 5 | Alessandro | **Extra** · `common.js` (`Player`) e `search.js`: precedente e successivo nella coda, e a fine brano parte il successivo; cuore dei preferiti nelle card di Cerca |
| 5 | Luca | **Extra** · `common.js` (`renderSidebar`): click su un preferito della sidebar che avvia il brano |
| 5 | Giovanbattista | **Extra** · `home.js`: cuore dei preferiti nelle card della Home; click su un preferito che avvia il brano |
| 5 | Francesca | **Extra** · `artist.js`: cuore dei preferiti nei brani dell'Artista |
| 7 | Alessandro | **Extra** · `common.js` (`Player`): shuffle e ripeti |
| 7 | _da definire_ | **Extra** · una pagina nuova con il suo JS, le 4 pagine HTML (`user-pill`), `common.js` e `app.css`: login e playlist per utente |

Gabriel non ha extra: continua con merge e rifinitura, e la prova di `main` dello step 6 copre anche gli extra.

Cambia anche [Controllo e monitoraggio](Controllo%20e%20monitoraggio.md): il KPI K1 conta solo le voci del minimo, così un extra in ritardo non tiene aperto lo step 5, e il Gantt prende i task nuovi.

## Da decidere insieme

1. Quali extra anticipiamo: tutti e tre o solo alcuni?
2. Shuffle e ripeti: a giovedì, come proposto, o già mercoledì se Alessandro è avanti?
3. Il login con le playlist: lo facciamo giovedì? Chi lo fa?
4. Nelle [Istruzioni progetto](Istruzioni%20progetto.md) (2.5) c'è un'altra miglioria, lo «slider del volume che scorre anche durante la riproduzione, non solo al click». Sta tutta nel player, allo step 3 di Alessandro: la aggiungiamo?
