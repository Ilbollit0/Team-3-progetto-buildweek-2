
/* ============================================================
   search.js — ricerca con debounce
   [ALESSANDRO]
   ============================================================

   COSA DEVI FARE
   1) initPage("search")
   2) Recupera l'ultima query da localStorage.
   3) Aggancia l'evento input con debounce 400ms.
   4) Cerca brani, album e artisti con Promise.all.
   5) Mostra le card dei risultati.
   6) Gestisci Play/Pausa e preferiti.
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

// [ALESSANDRO] Chiavi per i preferiti di album e artisti
const STORAGE_KEY_ALBUMS = "epitunes_favourite_albums";
const STORAGE_KEY_ARTISTS = "epitunes_favourite_artists";

// [ALESSANDRO] Recupera i preferiti salvati
const getSavedFavourites = (key) => readList(userKey(key));

// [ALESSANDRO] Controlla se un album o artista è preferito
const isSavedFavourite = (id, key) =>
  getSavedFavourites(key).some((item) => item.id === id);

// [ALESSANDRO] Aggiunge o rimuove un preferito
const toggleSavedFavourite = (item, key) => {
  let favourites = getSavedFavourites(key);

  if (isSavedFavourite(item.id, key)) {
    favourites = favourites.filter(
      (fav) => fav.id !== item.id,
    );
  } else {
    favourites.push(item);
  }

  localStorage.setItem(userKey(key), JSON.stringify(favourites));

  return isSavedFavourite(item.id, key);
};

// [ALESSANDRO] Crea il cuore per album e artisti
const createSavedFavButton = (item, key) => {
  const isFav = isSavedFavourite(item.id, key);

  const button = buildElement(
    "button",
    "card-fav btn-fav",
    isFav ? "♥" : "♡",
  );

  button.type = "button";
  button.classList.toggle("is-fav", isFav);

  button.setAttribute(
    "aria-label",
    isFav ? "Togli dai preferiti" : "Aggiungi ai preferiti",
  );

  return button;
};

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

  // [ALESSANDRO] Aggiunge il cuore all'album
  const favButton = createSavedFavButton(
    album,
    STORAGE_KEY_ALBUMS,
  );

  card.appendChild(favButton);

  gridAlbums.appendChild(card);
};

// iTunes non ha le foto degli artisti: le chiede a TheAudioDB per nome
const getArtistPhoto = async (name) => {
  const data = await fetchJSON(
    `${AUDIODB_BASE}/search.php?s=${encodeURIComponent(name)}`,
  );
  return data.artists?.[0]?.strArtistThumb ?? "";
};

// Copertina di un album dell'artista, se non c'è la foto dell'artista
const getArtistAlbumCover = async (artistId) => {
  const data = await fetchJSON(
    `${API_BASE}/lookup?id=${encodeURIComponent(artistId)}&entity=album&limit=1`,
  );
  const rawAlbum = data.results.find((item) => item.wrapperType === "collection");
  return rawAlbum ? bigArt(new Album(rawAlbum).cover) : "";
};

// [ALESSANDRO] Crea la card di un artista
const renderArtistCard = (artist) => {
  // Crea la card dell'artista
  const card = buildElement("div", "card");
  card.dataset.artistId = artist.id;

  const imageWrap = buildElement("div", "card-image-wrap round");

  // Foto da TheAudioDB; se non c'è, copertina di un suo brano; se no, di un suo album
  getArtistPhoto(artist.name).then(async (photo) => {
    const trackCover = tracks.find((track) => track.artistId === artist.id)?.cover;
    const cover =
      photo || bigArt(trackCover) || (await getArtistAlbumCover(artist.id));
    if (!cover) return;

    const img = document.createElement("img");
    img.src = cover;
    img.alt = artist.name;
    img.loading = "lazy";
    imageWrap.appendChild(img);
  });
  card.append(
    imageWrap,
    buildElement("p", "card-title", artist.name),
    buildElement("p", "card-sub", artist.genre || ""),
  );

  // [ALESSANDRO] Aggiunge il cuore all'artista
  const favButton = createSavedFavButton(
    artist,
    STORAGE_KEY_ARTISTS,
  );

  card.appendChild(favButton);

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

  // [ALESSANDRO] Gestisce Play e Pausa
  if (player.currentTrack?.id === track.id) {
    player.togglePlay();
  } else {
    player.play(track, tracks);
  }
});

// [ALESSANDRO] Gestisce i click sugli album
gridAlbums.addEventListener("click", (event) => {
  const card = event.target.closest("[data-album-id]");
  if (!card) return;

  // [ALESSANDRO] Controlla se è stato cliccato il cuore
  const favButton = event.target.closest(".btn-fav");

  if (favButton) {
    const albumId = card.dataset.albumId;

    const savedAlbum = albums.find(
      (album) => album.id === albumId,
    );

    if (!savedAlbum) return;

    const isFav = toggleSavedFavourite(
      savedAlbum,
      STORAGE_KEY_ALBUMS,
    );

    favButton.textContent = isFav ? "♥" : "♡";
    favButton.classList.toggle("is-fav", isFav);

    favButton.setAttribute(
      "aria-label",
      isFav ? "Togli dai preferiti" : "Aggiungi ai preferiti",
    );

    return;
  }

  window.location.href = "album.html?id=" + card.dataset.albumId;
});

// [ALESSANDRO] Gestisce i click sugli artisti
gridArtists.addEventListener("click", (event) => {
  const card = event.target.closest("[data-artist-id]");
  if (!card) return;

  // [ALESSANDRO] Controlla se è stato cliccato il cuore
  const favButton = event.target.closest(".btn-fav");

  if (favButton) {
    const artistId = card.dataset.artistId;

    const savedArtist = artists.find(
      (artist) => artist.id === artistId,
    );

    if (!savedArtist) return;

    const isFav = toggleSavedFavourite(
      savedArtist,
      STORAGE_KEY_ARTISTS,
    );

    favButton.textContent = isFav ? "♥" : "♡";
    favButton.classList.toggle("is-fav", isFav);

    favButton.setAttribute(
      "aria-label",
      isFav ? "Togli dai preferiti" : "Aggiungi ai preferiti",
    );

    return;
  }

  window.location.href = "artist.html?id=" + card.dataset.artistId;
});

// [ALESSANDRO] Salva gli album e gli artisti trovati
let albums = [];
let artists = [];

// [ALESSANDRO] Esegue la ricerca musicale
const doSearch = async (term) => {
  // Identifica la ricerca più recente
  const currentSearchId = ++searchId;

  //Francesca: salva l'ultima ricerca associandola all'utente collegato
  localStorage.setItem(userKey(STORAGE_KEY_LAST_SEARCH), term);

  // [ALESSANDRO] Svuota i risultati precedenti
  gridTracks.replaceChildren();
  gridAlbums.replaceChildren();
  gridArtists.replaceChildren();

  tracks = [];
  albums = [];
  artists = [];

  // Nasconde le sezioni
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

  albums = albumsData.results.map(
    (raw) => new Album(raw),
  );

  artists = artistsData.results.map(
    (raw) => new Artist(raw),
  );

  // Mostra le sezioni che hanno risultati
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

  // Recupera il testo scritto
  const term = event.target.value.trim();

  // Salva subito l'ultima ricerca dell'utente collegato
  localStorage.setItem(userKey(STORAGE_KEY_LAST_SEARCH), term);

  // Svuota subito i risultati se il testo è vuoto
  if (!term) {
    doSearch("");
    return;
  }

  debouncedSearch(term);
});

//Francesca: recupera l'ultima ricerca salvata per l'utente collegato
const lastQuery = localStorage.getItem(userKey(STORAGE_KEY_LAST_SEARCH));

if (lastQuery) {
  input.value = lastQuery;
  doSearch(lastQuery);
}

