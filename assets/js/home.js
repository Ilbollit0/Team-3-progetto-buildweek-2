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
const preferiti = document.querySelector("#preferiti");
const recenti = document.querySelector("#recenti");
const rock = document.querySelector("#rock");
const pop = document.querySelector("#pop");
const italianPop = document.querySelector("#italianPop");

const rowTracks = new Map();

//griglia dove vanno le card
const renderRow = (container, tracks) => {
  //toglie se ce gia 
  container.querySelector('.row')?.remove();
  //le card
  const grid = document.createElement('div');
  grid.classList.add('row', 'g-3');
  tracks.forEach((track) => grid.appendChild(creaCard(track)));

  container.appendChild(grid);
  container.hidden = tracks.length === 0;
  rowTracks.set(container, tracks);
};




/*-----------------------------*/

//VECCHIA CREA CARD
// function creaCard(song) {
//   // creo div per card 
//   const col = document.createElement('div');
//   col.classList.add('col-6', 'col-md-4', 'col-lg-3');

//   //creo card
//   const card = document.createElement('div');
//   card.classList.add('card', 'h-100');
//   card.dataset.trackId = song.id;

//   //creo immagine card
//   const img = document.createElement('img');
//   img.src = bigArt(song.cover);
//   img.classList.add('card-img-top');

//   //creo scritte sotto card
//   const body = document.createElement('div');
//   body.classList.add('card-body');

//   //creo nome artista 
//   const artistName = document.createElement('p');
//   artistName.classList.add('fw-bold', 'mb-2', 'text-white' );
//   artistName.textContent = song.artist;

//   //creo nome song
//   const title = document.createElement('p');
//   title.classList.add("mb-2" , 'text-white-50');
//   title.textContent = song.title;

//   //appendo.
//   body.appendChild(artistName);
//   body.appendChild(title);
//   card.appendChild(img);
//   card.appendChild(body);
//   card.appendChild(createFavButton(song, 'card-fav'));
//   col.appendChild(card);

//   return col;
// }

//NUOVA CREA CARD GIA ESTENTE IN COMMON.JS
const creaCard = (track) => {
  const col = document.createElement("div");
  col.classList.add("col-6", "col-md-4", "col-lg-3");

  const card = createTrackCard(track);
  col.appendChild(card);
// nel caso servisse mettewre altezza a card
  return col;
};

// una ricerca per riga, con il contenitore che la mostra
const SUGGESTIONS = [
  { term: "rock", selector: "#rock" },
  { term: "pop", selector: "#pop" },
  { term: "italian pop", selector: "#italianPop" },
];

const loadSong = async (ricerca) => {
  const data = await fetchJSON(
    `${API_BASE}/search?term=${encodeURIComponent(ricerca)}&media=music&entity=song&limit=8`,
  );
  return data.results.map((raw) => new Track(raw));
};



const loadHome = async () => {
  renderRow(recenti, getHistory());
  renderRow(preferiti, getFavourites());

  const results = await Promise.all(SUGGESTIONS.map((s) => loadSong(s.term)));

  SUGGESTIONS.forEach((s, i) => {
    renderRow(document.querySelector(s.selector), results[i])
  });
};

loadHome();



//creo eventi al click
home.addEventListener('click', (e) => {
  //card cliccata 
  const card = e.target.closest('[data-track-id]');
  if (!card) return;
  //dov'é la card
  const container = card.closest('.row').parentElement
  const tracks = rowTracks.get(container);

  const track = tracks.find((item) => item.id === card.dataset.trackId);
  if (!track) return;
  // click sul centro
  const cntButton = e.target.closest('.btn-fav');
  if (e.target.closest(".btn-fav")) {
    toggleFavourite(track);
    renderRow(preferiti, getFavourites());
    rowTracks.forEach((rowList, container) => renderRow(container, rowList));
    return;
  }

  if (player.currentTrack?.id === track.id) {
    player.togglePlay();
  } else {
    player.play(track, tracks);
    renderRow(recenti, getHistory());
  }
});