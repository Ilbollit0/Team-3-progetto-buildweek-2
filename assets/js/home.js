
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

// [ALESSANDRO] Contenitori dei preferiti
const preferitiBrani = document.querySelector("#preferiti-brani");
const preferitiAlbum = document.querySelector("#preferiti-album");
const preferitiArtisti = document.querySelector("#preferiti-artisti");

const recenti = document.querySelector("#recenti");
const rock = document.querySelector("#rock");
const pop = document.querySelector("#pop");
const italianPop = document.querySelector("#italianPop");

const rowTracks = new Map();

//griglia dove vanno le card
const renderRow = (container, tracks) => {
  //toglie se ce gia
  container.querySelector(".row")?.remove();
  //le card
  const grid = document.createElement("div");
  grid.classList.add("row", "g-3");
  tracks.forEach((track) => grid.appendChild(creaCard(track)));

  container.appendChild(grid);
  container.hidden = tracks.length === 0;
  rowTracks.set(container, tracks);
  player.syncPlayButtons();
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

// [ALESSANDRO] Crea le card degli album preferiti
function creaCardAlbum(album) {
  const col = document.createElement("div");
  col.classList.add("col-6", "col-md-4", "col-lg-3");

  const card = document.createElement("div");
  card.classList.add("card", "h-100");

  const img = document.createElement("img");
  img.src = bigArt(album.cover);
  img.alt = album.title;
  img.classList.add("card-img-top");

  const titolo = document.createElement("p");
  titolo.textContent = album.title;

  card.append(img, titolo);

  // [ALESSANDRO] Cuore rosso per gli album preferiti
  const cuore = document.createElement("button");
  cuore.type = "button";
  cuore.className = "card-fav btn-fav is-fav";
  cuore.textContent = "♥";

  cuore.addEventListener("click", (event) => {
    event.stopPropagation();

    const albumSalvati = readList(
      userKey("epitunes_favourite_albums")
    );

    const aggiornati = albumSalvati.filter(
      (item) => String(item.id) !== String(album.id)
    );

    localStorage.setItem(
      userKey("epitunes_favourite_albums"),
      JSON.stringify(aggiornati)
    );

    renderPreferiti();
  });

  card.appendChild(cuore);
  col.appendChild(card);

  card.addEventListener("click", () => {
    window.location.href = "album.html?id=" + album.id;
  });

  return col;
}

// [ALESSANDRO] Crea le card degli artisti preferiti
function creaCardArtista(artista) {
  const col = document.createElement("div");
  col.classList.add("col-6", "col-md-4", "col-lg-3");

  const card = document.createElement("div");
  card.classList.add("card", "h-100");

  const titolo = document.createElement("p");
  titolo.classList.add("card-title");
  titolo.textContent = artista.name;

  card.appendChild(titolo);

  // [ALESSANDRO] Cuore rosso per gli artisti preferiti
  const cuore = document.createElement("button");
  cuore.type = "button";
  cuore.className = "card-fav btn-fav is-fav";
  cuore.textContent = "♥";
  cuore.setAttribute("aria-label", "Togli artista dai preferiti");

  cuore.addEventListener("click", (event) => {
    event.stopPropagation();

    const artistiSalvati = readList(
      userKey("epitunes_favourite_artists")
    );

    const aggiornati = artistiSalvati.filter(
      (item) => String(item.id) !== String(artista.id)
    );

    localStorage.setItem(
      userKey("epitunes_favourite_artists"),
      JSON.stringify(aggiornati)
    );

    renderPreferiti();
  });

  card.appendChild(cuore);
  col.appendChild(card);

  card.addEventListener("click", () => {
    window.location.href = "artist.html?id=" + artista.id;
  });

  return col;
}

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

// [ALESSANDRO] Mostra brani, album e artisti preferiti
const renderPreferiti = () => {
  const brani = getFavourites();

  const album = readList(
    userKey("epitunes_favourite_albums")
  );

  const artisti = readList(
    userKey("epitunes_favourite_artists")
  );

  // Mostra i brani preferiti
  renderRow(preferitiBrani, brani);

  // Mostra gli album preferiti
  const gridAlbum = document.createElement("div");
  gridAlbum.classList.add("row", "g-3");

  album.forEach((item) => {
    gridAlbum.appendChild(creaCardAlbum(item));
  });

  preferitiAlbum.querySelector(".row")?.remove();
  preferitiAlbum.appendChild(gridAlbum);
  preferitiAlbum.hidden = album.length === 0;

  // Mostra gli artisti preferiti
  const gridArtisti = document.createElement("div");
  gridArtisti.classList.add("row", "g-3");

  artisti.forEach((item) => {
    gridArtisti.appendChild(creaCardArtista(item));
  });

  preferitiArtisti.querySelector(".row")?.remove();
  preferitiArtisti.appendChild(gridArtisti);
  preferitiArtisti.hidden = artisti.length === 0;

  // [ALESSANDRO] Nasconde i preferiti se tutte le liste sono vuote
  preferiti.hidden =
    brani.length === 0 &&
    album.length === 0 &&
    artisti.length === 0;
};

const loadHome = async () => {
  renderRow(recenti, getHistory());
  renderPreferiti();

  const results = await Promise.all(SUGGESTIONS.map((s) => loadSong(s.term)));

  SUGGESTIONS.forEach((s, i) => {
    renderRow(document.querySelector(s.selector), results[i]);
  });
};

loadHome();

//creo eventi al click
home.addEventListener("click", (e) => {
  //card cliccata
  const card = e.target.closest("[data-track-id]");
  if (!card) return;

  //dov'é la card
  const container = card.closest(".row")?.parentElement;
  const tracks = rowTracks.get(container);

  if (!tracks) return;

  const track = tracks.find(
    (item) => String(item.id) === card.dataset.trackId
  );

  if (!track) return;

  // click sul centro
  const cntButton = e.target.closest(".btn-fav");

  if (cntButton) {
    toggleFavourite(track);

    // [ALESSANDRO] Aggiorna tutti i preferiti
    renderPreferiti();

    rowTracks.forEach((rowList, container) => {
      if (container !== preferitiBrani) {
        renderRow(container, rowList);
      }
    });

    return;
  }

  if (player.currentTrack?.id === track.id) {
    player.togglePlay();
  } else {
    // Unisce tutti i brani caricati nelle varie sezioni della Home (senza doppioni)
    const allHomeTracks = Array.from(rowTracks.values())
      .flat()
      .filter((t, index, self) => index === self.findIndex((x) => x.id === t.id));
    player.play(track, allHomeTracks);
    renderRow(recenti, getHistory());
  }
});
