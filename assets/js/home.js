/* ============================================================
   home.js — costruzione della Home
   ============================================================

   COSA DEVI FARE
   1) initPage("home")  // monta sidebar + player
   2) Costruisci queste righe (sezioni) nella .home:
        - "Riprodotti di recente" (da getHistory())  -- mostra solo se non vuota
        - "I tuoi preferiti"       (da getFavourites()) -- mostra solo se non vuota
        - "Suggerimenti pop"       (fetch search term=pop entity=song limit=12)
        - "Suggerimenti rock"      (fetch search term=rock entity=song limit=12)
        - "Suggerimenti hits"   (fetch search term=hits pop entity=song limit=12)
   3) Le tre fetch dei suggerimenti vanno in PARALLELO con Promise.all
   4) Ogni card è una Track: cover, titolo, artista, button play, button cuore (favourite)
   5) Click card -> window.player.play(track)
   6) Click cover senza play -> link a album.html?id=albumId (opzionale)
*/

const player = initPage("home");

const home = document.querySelector(".home");

/*
  renderRow(rowTitle, tracks)
  - crea una <section class="row"> con titolo h2 e griglia .grid di .card per ogni track
  - aggancia click handler che chiamano player.play(track) e toggleFavourite(track)
*/
const renderRow = (rowTitle, tracks) => {
  // TODO
};

/*
  loadHome()
  - chiama Promise.all sulle 3 fetch di suggerimenti
  - costruisce le righe nell'ordine: history, favourites, pop, rock, hits
*/
const loadHome = async () => {
  // TODO
};

loadHome();


/*-----------------------------*/
const preferiti = document.querySelector("#preferiti");

function creaCard(canzone) {
  // creo div per card 
  const col = document.createElement('div');
  col.classList.add('col-6', 'col-md-4', 'col-lg-3');

  //creo card
  const card = document.createElement('div');
  card.classList.add('card', 'h-100');

  //creo immagine card
  const img = document.createElement('img');
  img.src = canzone.artworkUrl100;
  img.classList.add('card-img-top');

  //creo scritte sotto card
  const body = document.createElement('div');
  body.classList.add('card-body');

  //creo nome artista 
  const artistName = document.createElement('p');
  artistName.classList.add('fw-bold', 'mb-2');
  artistName.textContent = canzone.artistName;

  //creo nome canzone
  const title = document.createElement('p');
  title.classList.add("mb-2");
  titolo.textContent = canzone.trackName;

//appendo.
  body.appendChild(artistName);
  body.appendChild(title);
  card.appendChild(img);
  card.appendChild(body);  
}

