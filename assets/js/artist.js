/* ============================================================
   artist.js — pagina dettaglio artista
   ============================================================
*/

const player = initPage("");

const artistHero = document.querySelector("#artist-hero");
const topTracks = document.querySelector("#top-tracks");
const artistaActions = document.querySelector("#artist-actions");
const albumsGrid = document.querySelector("#grid-albums");
let artistAlbums = [];
let artistTracks = [];

//Francesca: vuota un elemento DOM rimuovendo tutti i suoi nodi
const clearElement = (el) => {
  if (!el) return;
  while (el.firstChild) el.removeChild(el.firstChild);
};

//Francesca: vuota il contenitore e mostra un paragrafo di stato
const renderMessage = (container, text) => {
  if (!container) return;
  clearElement(container);
  container.appendChild(buildElement("p", "loader", text));
};

//Francesca: sezione hero dell'artista
const renderArtistHero = (artist, tracks, fallbackCover) => {
  clearElement(artistHero);
  clearElement(artistaActions);

  const coverUrl = artist.cover || fallbackCover;
  if (coverUrl) {
    const coverWrap = document.createElement("div");
    coverWrap.className = "album-cover round";

    const img = document.createElement("img");
    img.src = coverUrl;
    img.alt = artist.name;
    coverWrap.appendChild(img);

    artistHero.appendChild(coverWrap);
  }

  const meta = document.createElement("div");
  meta.className = "hero-meta";

  const kicker = document.createElement("span");
  kicker.className = "hero-kicker";
  kicker.textContent = "ARTISTA";

  const title = document.createElement("h1");
  title.className = "hero-title";
  title.textContent = artist.name;

  const listeners = (
    Math.floor(Math.random() * 5_000_000) + 500_000
  ).toLocaleString("it-IT");

  const sub = document.createElement("p");
  sub.className = "hero-sub";
  sub.textContent = `${artist.genre} · ${listeners} ascoltatori mensili`;

  meta.appendChild(kicker);
  meta.appendChild(title);
  meta.appendChild(sub);

  artistHero.appendChild(meta);

  if (tracks.length > 0) {
    const bigPlayBtn = document.createElement("button");
    bigPlayBtn.type = "button";
    bigPlayBtn.className = "btn-play-big";
    bigPlayBtn.textContent = player.isPlaying ? "⏸" : "▶";
    bigPlayBtn.setAttribute("aria-label", "Riproduzione brani popolari");
    bigPlayBtn.addEventListener("click", () => {
      const isCurrentList = tracks.some(
        (t) => t.id === player.currentTrack?.id,
      );
      if (isCurrentList) {
        player.togglePlay();
      } else {
        player.play(tracks[0], tracks);
      }
    });
    artistaActions.appendChild(bigPlayBtn);
  }
};

//Francesca: renderizza l'intestazione "Popolari" e tutte le righe dei brani
const renderTopTracks = (tracks) => {
  clearElement(topTracks);

  const heading = document.createElement("h2");
  heading.className = "h4 fw-bold mb-3";
  heading.textContent = "Popolari";
  topTracks.appendChild(heading);

  tracks.forEach((track, idx) => {
    topTracks.appendChild(createTrackRow(track, idx));
  });
  //Francesca: l'eventuale brano attualmente in riproduzione
  player.highlightPlayingRow();
};

//Francesca: event delegation sulla lista dei brani popolari
topTracks.addEventListener("click", (event) => {
  const row = event.target.closest("[data-track-id]");
  if (!row) return;

  const track = artistTracks.find(
    (t) => String(t.id) === String(row.dataset.trackId),
  );
  if (!track) return;

  //Francesca: gestisce il click sul cuore preferiti
  const favBtn = event.target.closest(".btn-fav");
  if (favBtn) {
    toggleFavourite(track);
    renderTopTracks(artistTracks);
    return;
  }
  player.play(track, artistTracks);
});

//Francesca: carica i dati dell'artista dall'API
const loadArtist = async () => {
  const params = new URLSearchParams(window.location.search);
  const artistId = params.get("id");

  if (!artistId) {
    renderMessage(artistHero, "Artista non trovato.");
    return;
  }
  renderMessage(artistHero, "Caricamento artista...");

  try {
    const url = `${API_BASE}/lookup?id=${encodeURIComponent(artistId)}&entity=song&limit=15`;
    const data = await fetchJSON(url);
    const results = data.results || [];

    const rawArtist = results.find((item) => item.wrapperType === "artist");
    const rawTracks = results.filter((item) => item.wrapperType === "track");

    if (!rawArtist) {
      renderMessage(artistHero, "Artista non trovato.");
      return;
    }
    const artist = new Artist(rawArtist);
    artistTracks = rawTracks.map((raw) => new Track(raw));
    const fallbackCover =
      artistTracks.length > 0 ? bigArt(artistTracks[0].cover) : "";

    renderArtistHero(artist, artistTracks, fallbackCover);
    renderTopTracks(artistTracks);
    //aggiunto per card album
    loadAlbums(artistId);

  } catch (error) {
    console.error("Errore nel caricamento dell'artista:", error);
    renderMessage(artistHero, "Errore durante il caricamento dell'artista.");
  }
};

loadArtist();



//render card album 
// Giovanni: chiave dei preferiti album (la stessa di search.js, così sono condivisi)
const STORAGE_KEY_ALBUMS = "epitunes_favourite_albums";

// Giovanni: recupera i preferiti salvati
const getSavedFavourites = (key) => {
  const saved = localStorage.getItem(key);
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
};

// Giovanni: controlla se un album è tra i preferiti
const isSavedFavourite = (id, key) =>
  getSavedFavourites(key).some((item) => item.id === id);

// Giovanni: aggiunge o rimuove un album dai preferiti
const toggleSavedFavourite = (item, key) => {
  let favourites = getSavedFavourites(key);
  if (isSavedFavourite(item.id, key)) {
    favourites = favourites.filter((fav) => fav.id !== item.id);
  } else {
    favourites.push(item);
  }
  localStorage.setItem(key, JSON.stringify(favourites));
  return isSavedFavourite(item.id, key);
};

// Giovanni: crea il cuore della card
const createSavedFavButton = (item, key) => {
  const isFav = isSavedFavourite(item.id, key);
  const button = buildElement("button", "card-fav btn-fav", isFav ? "♥" : "♡");
  button.type = "button";
  button.classList.toggle("is-fav", isFav);
  button.setAttribute("aria-label", isFav ? "Togli dai preferiti" : "Aggiungi ai preferiti");
  return button;
};

// Giovanni: crea la card di un album
const renderAlbumCard = (album) => {
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
    createSavedFavButton(album, STORAGE_KEY_ALBUMS),
  );

  albumsGrid.appendChild(card);
};

// Giovanni: carica gli album dell'artista
const loadAlbums = async (artistId) => {
  const url = `${API_BASE}/lookup?id=${encodeURIComponent(artistId)}&entity=album&limit=12`;
  const data = await fetchJSON(url);

  // il primo risultato è l'artista: tengo solo gli album
  artistAlbums = (data.results || [])
    .filter((item) => item.wrapperType === "collection")
    .map((raw) => new Album(raw));

  clearElement(albumsGrid);
  artistAlbums.forEach((album) => renderAlbumCard(album));
};

// Giovanni: click sulle card album (cuore oppure apertura album)
albumsGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-album-id]");
  if (!card) return;

  const favButton = event.target.closest(".btn-fav");
  if (favButton) {
    const album = artistAlbums.find((a) => String(a.id) === card.dataset.albumId);
    if (!album) return;

    const isFav = toggleSavedFavourite(album, STORAGE_KEY_ALBUMS);
    favButton.textContent = isFav ? "♥" : "♡";
    favButton.classList.toggle("is-fav", isFav);
    favButton.setAttribute("aria-label", isFav ? "Togli dai preferiti" : "Aggiungi ai preferiti");
    return;
  }

  window.location.href = "album.html?id=" + card.dataset.albumId;
});


