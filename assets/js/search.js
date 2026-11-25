
/* ============================================================
   search.js — ricerca con debounce
   [ALESSANDRO]
   ============================================================

   COSA DEVI FARE
   1) initPage("search")
   2) Recupera l'ultima query da localStorage (STORAGE_KEY_LAST_SEARCH).
      Se presente, popola l'input e lancia la ricerca.
   3) Aggancia l'evento "input" all'input #search-input con debounce 400ms.
   4) doSearch(term):
      - se term è vuoto -> nascondi i 3 row e svuota i grid
      - altrimenti fetch in PARALLELO (Promise.all):
          - tracks   = search?term=...&entity=song&limit=12
          - albums   = search?term=...&entity=album&limit=8
          - artists  = search?term=...&entity=musicArtist&limit=8
      - mostra ciascuna sezione solo se i risultati sono > 0
      - salva l'ultima query in localStorage
   5) Per ogni risultato crea una card:
      - track  -> click = player.play(track)
      - album  -> click = window.location.href = "album.html?id=" + albumId
      - artist -> click = window.location.href = "artist.html?id=" + artistId
*/

// [ALESSANDRO] Inizializza la pagina Cerca e il Player
const player = initPage("search");

// [ALESSANDRO] Recupera gli elementi HTML
const input = document.querySelector("#search-input");

const rowTracks = document.querySelector("#row-tracks");
const rowAlbums = document.querySelector("#row-albums");
const rowArtists = document.querySelector("#row-artists");

const gridTracks = document.querySelector("#grid-tracks");
const gridAlbums = document.querySelector("#grid-albums");
const gridArtists = document.querySelector("#grid-artists");

// Salva i risultati della ricerca
let tracks = [];
let searchId = 0;

// [ALESSANDRO] Crea la card di un brano
const renderTrackCard = (track) => {
  // Crea la card usando la funzione di common.js
  const card = createTrackCard(track);
  gridTracks.appendChild(card);
};

// [ALESSANDRO] Crea la card di un album
const renderAlbumCard = (album) => {
  // Crea la card dell'album
  const card = buildElement("div", "card");
  card.dataset.albumId = album.id;

  const imageWrap = buildElement("div", "card-image-wrap");
  const img = document.createElement("img");

  img.src = bigArt(album.cover);
  img.alt = album.title;
  img.loading = "lazy";

  imageWrap.appendChild(img);

  card.append(
    imageWrap,
    buildElement("p", "card-title", album.title),
    buildElement("p", "card-sub", album.artist),
  );

  gridAlbums.appendChild(card);
};

// [ALESSANDRO] Crea la card di un artista
const renderArtistCard = (artist) => {
  // Crea la card dell'artista
  const card = buildElement("div", "card");
  card.dataset.artistId = artist.id;

  const imageWrap = buildElement("div", "card-image-wrap");

  // Mostra l'iniziale perché iTunes non fornisce la foto
  const initial = buildElement(
    "div",
    "artist-placeholder",
    artist.name?.charAt(0) || "?",
  );

  imageWrap.appendChild(initial);

  card.append(
    imageWrap,
    buildElement("p", "card-title", artist.name),
    buildElement("p", "card-sub", artist.genre || ""),
  );

  gridArtists.appendChild(card);
};

// [ALESSANDRO] Gestisce i click sulle card dei brani
gridTracks.addEventListener("click", (event) => {
  const card = event.target.closest("[data-track-id]");
  if (!card) return;

  const track = tracks.find(
    (item) => item.id === card.dataset.trackId,
  );

  if (!track) return;

  // Gestisce il cuore dei preferiti
  const favButton = event.target.closest(".btn-fav");

  if (favButton) {
    const isFav = toggleFavourite(track);

    favButton.textContent = isFav ? "♥" : "♡";
    favButton.classList.toggle("is-fav", isFav);

    favButton.setAttribute(
      "aria-label",
      isFav ? "Togli dai preferiti" : "Aggiungi ai preferiti",
    );

    return;
  }

  // Riproduce il brano con la sua lista
  player.play(track, tracks);
});

// [ALESSANDRO] Gestisce i click sugli album
gridAlbums.addEventListener("click", (event) => {
  const card = event.target.closest("[data-album-id]");
  if (!card) return;

  window.location.href = "album.html?id=" + card.dataset.albumId;
});

// [ALESSANDRO] Gestisce i click sugli artisti
gridArtists.addEventListener("click", (event) => {
  const card = event.target.closest("[data-artist-id]");
  if (!card) return;

  window.location.href = "artist.html?id=" + card.dataset.artistId;
});

// [ALESSANDRO] Esegue la ricerca musicale
const doSearch = async (term) => {
  // Identifica la ricerca più recente
  const currentSearchId = ++searchId;

  // Salva l'ultima ricerca
  localStorage.setItem(STORAGE_KEY_LAST_SEARCH, term);

  // Svuota i risultati precedenti
  gridTracks.innerHTML = "";
  gridAlbums.innerHTML = "";
  gridArtists.innerHTML = "";
  tracks = [];

  // [ALESSANDRO] Nasconde le sezioni
  rowTracks.hidden = true;
  rowAlbums.hidden = true;
  rowArtists.hidden = true;

  // Se la ricerca è vuota si ferma
  if (!term) return;

  // Prepara le tre ricerche
  const query = encodeURIComponent(term);

  const tracksUrl = `${API_BASE}/search?term=${query}&entity=song&limit=12`;
  const albumsUrl = `${API_BASE}/search?term=${query}&entity=album&limit=8`;
  const artistsUrl = `${API_BASE}/search?term=${query}&entity=musicArtist&limit=8`;

  // Esegue le tre richieste in parallelo
  const [tracksData, albumsData, artistsData] = await Promise.all([
    fetchJSON(tracksUrl),
    fetchJSON(albumsUrl),
    fetchJSON(artistsUrl),
  ]);

  // Evita di mostrare risultati di una vecchia ricerca
  if (currentSearchId !== searchId) return;

  // Converte i dati nei modelli
  tracks = tracksData.results.map((raw) => new Track(raw));

  const albums = albumsData.results.map(
    (raw) => new Album(raw),
  );

  const artists = artistsData.results.map(
    (raw) => new Artist(raw),
  );

  // [ALESSANDRO] Mostra le sezioni che hanno risultati
  rowTracks.hidden = tracks.length === 0;
  rowAlbums.hidden = albums.length === 0;
  rowArtists.hidden = artists.length === 0;

  // Crea le card dei risultati
  tracks.forEach((track) => renderTrackCard(track));
  albums.forEach((album) => renderAlbumCard(album));
  artists.forEach((artist) => renderArtistCard(artist));
};

// [ALESSANDRO] Aspetta 400ms prima di avviare la ricerca
const debouncedSearch = debounce(doSearch, 400);

input.addEventListener("input", (event) => {
  // Annulla gli effetti delle ricerche precedenti
  searchId++;

  // [ALESSANDRO] Recupera il testo scritto
  const term = event.target.value.trim();

  // [ALESSANDRO] Salva subito l'ultima ricerca
  localStorage.setItem(STORAGE_KEY_LAST_SEARCH, term);

  // [ALESSANDRO] Svuota subito i risultati se il testo è vuoto
  if (!term) {
    doSearch("");
    return;
  }

  debouncedSearch(term);
});

// Recupera l'ultima ricerca salvata
const lastQuery = localStorage.getItem(STORAGE_KEY_LAST_SEARCH);

if (lastQuery) {
  input.value = lastQuery;
  doSearch(lastQuery);
}
