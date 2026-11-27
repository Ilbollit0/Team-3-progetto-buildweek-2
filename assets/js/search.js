
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

//Francesca: recupera il pulsante X e gli elementi delle ricerche recenti
const clearBtn = document.querySelector("#search-clear");
const recentSection = document.querySelector("#recent-searches-section");
const recentList = document.querySelector("#recent-searches-list");
const clearRecentBtn = document.querySelector("#clear-recent-searches");

//Francesca: contenitore e chiave per i brani dell'ultima ricerca salvata
const recentTracksBox = document.querySelector("#recent-tracks-box");
const gridRecentTracks = document.querySelector("#grid-recent-tracks");
const STORAGE_KEY_RECENT_TRACKS = "epitunes_recent_tracks";
let recentTracks = [];

//Francesca: aggiunge il brano ascoltato in cima ai brani recenti (senza doppioni, max 6)
const addRecentTrack = (track) => {
  if (!track || !track.id) return;
  const saved = readList(userKey(STORAGE_KEY_RECENT_TRACKS));
  const updated = [
    track,
    ...saved.filter((item) => item.id !== track.id),
  ];
  localStorage.setItem(
    userKey(STORAGE_KEY_RECENT_TRACKS),
    JSON.stringify(updated),
  );
};

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

//Francesca: chiave e limite per la lista delle ricerche recenti per utente
const STORAGE_KEY_RECENT_SEARCHES = "epitunes_recent_searches";
const MAX_RECENT_SEARCHES = 8;

//Francesca: recupera la lista delle ricerche recenti dell'utente collegato
const getRecentSearches = () => readList(userKey(STORAGE_KEY_RECENT_SEARCHES));

//Francesca: salva un termine cercato in testa alle ricerche recenti (senza doppioni)
const addRecentSearch = (term) => {
  const clean = term.trim();
  if (!clean) return;
  const updated = [
    clean,
    ...getRecentSearches().filter(
      (item) => item.toLowerCase() !== clean.toLowerCase(),
    ),
  ].slice(0, MAX_RECENT_SEARCHES);
  localStorage.setItem(
    userKey(STORAGE_KEY_RECENT_SEARCHES),
    JSON.stringify(updated),
  );
};

//Francesca: disegna le ricerche recenti e le mostra SOLO se l'input di ricerca è vuoto
const renderRecentSearches = () => {
  if (!recentSection || !recentList) return;

  const isInputEmpty = input.value.trim() === "";
  const items = getRecentSearches();
  recentTracks = readList(userKey(STORAGE_KEY_RECENT_TRACKS));

  if (!isInputEmpty || (items.length === 0 && recentTracks.length === 0)) {
    recentSection.hidden = true;
    recentList.replaceChildren();
    if (recentTracksBox) recentTracksBox.hidden = true;
    if (gridRecentTracks) gridRecentTracks.replaceChildren();
    return;
  }

  recentSection.hidden = false;
  const chips = items.map((term) => {
    const chip = buildElement("div", "recent-search-chip");
    const label = buildElement("span", "", term);
    const remove = buildElement("span", "chip-remove", "×");
    remove.title = "Rimuovi";

    label.addEventListener("click", () => {
      input.value = term;
      if (clearBtn) clearBtn.hidden = false;
      recentSection.hidden = true;
      if (recentTracksBox) recentTracksBox.hidden = true;
      doSearch(term);
    });

    //Francesca: cliccando sulla × rimuove solo quella singola ricerca recente
    remove.addEventListener("click", (event) => {
      event.stopPropagation();
      const filtered = getRecentSearches().filter((item) => item !== term);
      localStorage.setItem(
        userKey(STORAGE_KEY_RECENT_SEARCHES),
        JSON.stringify(filtered),
      );
      renderRecentSearches();
    });

    chip.append(label, remove);
    return chip;
  });

  recentList.replaceChildren(...chips);
  //Francesca: mostra anche le card dei brani dell'ultima ricerca salvata
  if (recentTracksBox && gridRecentTracks) {
    gridRecentTracks.replaceChildren();
    recentTracksBox.hidden = recentTracks.length === 0;
    recentTracks.forEach((track) => {
      gridRecentTracks.appendChild(createTrackCard(track));
    });
  }
};

// [ALESSANDRO] Recupera i preferiti salvati
const getSavedFavourites = (key) => readList(userKey(key));



// [ALESSANDRO] Controlla se un album o artista è preferito
const isSavedFavourite = (id, key) =>
  getSavedFavourites(key).some(
    (item) => String(item.id) === String(id)
  );
// [ALESSANDRO] Aggiunge o rimuove un preferito
const toggleSavedFavourite = (item, key) => {
  let favourites = getSavedFavourites(key);
  if (isSavedFavourite(item.id, key)) {
  favourites = favourites.filter(
    (fav) => String(fav.id) !== String(item.id),
  );
} else {
  favourites.push(item);
}

  localStorage.setItem(userKey(key), JSON.stringify(favourites));
  renderAllSidebarFavs();
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
  const rawAlbum = data.results.find(
    (item) => item.wrapperType === "collection",
  );
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
    const trackCover = tracks.find(
      (track) => track.artistId === artist.id,
    )?.cover;
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
    addRecentTrack(track);
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

//Francesca: gestisce click su Play/Pausa e preferiti nei brani cercati di recente
if (gridRecentTracks) {
  gridRecentTracks.addEventListener("click", (event) => {
    const card = event.target.closest("[data-track-id]");
    if (!card) return;

    const track = recentTracks.find((item) => item.id === card.dataset.trackId);
    if (!track) return;

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

    if (player.currentTrack?.id === track.id) {
      player.togglePlay();
    } else {
      player.play(track, recentTracks);
      addRecentTrack(track);
      renderRecentSearches();
    }
  });
}

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

  //Francesca: se la ricerca è vuota, mostra le ricerche recenti dell'utente e si ferma
  if (!term) {
    renderRecentSearches();
    return;
  }

  //Francesca: nasconde le ricerche recenti mentre si visualizzano i risultati
  if (recentSection) recentSection.hidden = true;
  if (recentTracksBox) recentTracksBox.hidden = true;

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

  //Francesca: ignora la risposta se nel frattempo l'utente ha svuotato l'input o cercato altro
  if (currentSearchId !== searchId || !input.value.trim()) return;

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

  //Francesca: mostra la X solo se c'è testo nell'input
  if (clearBtn) {
    clearBtn.hidden = event.target.value.length === 0;
  }

  //Francesca: se la barra è vuota pulisce i risultati e mostra le ricerche recenti
  if (!term) {
    doSearch("");
    return;
  }
  debouncedSearch(term);
});

//Francesca: salva in localStorage SOLO ciò che l'utente cerca premendo Invio (termine + brani)
input.addEventListener("keydown", async (event) => {
  if (event.key !== "Enter") return;

  const term = input.value.trim();
  if (!term) return;

  addRecentSearch(term);
  await doSearch(term);

  if (tracks.length > 0) {
    localStorage.setItem(
      userKey(STORAGE_KEY_RECENT_TRACKS),
      JSON.stringify(tracks.slice(0, 6)),
    );
  }
});

//Francesca: svuota tutta la cronologia delle ricerche recenti dell'utente
if (clearRecentBtn) {
  clearRecentBtn.addEventListener("click", () => {
    localStorage.removeItem(userKey(STORAGE_KEY_RECENT_SEARCHES));
    localStorage.removeItem(userKey(STORAGE_KEY_RECENT_TRACKS));
    renderRecentSearches();
  });
}

//Francesca: al click sulla X svuota la barra e mostra di nuovo le ricerche recenti
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    searchId++;
    input.value = "";
    clearBtn.hidden = true;
    doSearch("");
    input.focus();
  });
}

//Francesca: all'avvio con barra vuota mostra subito le ultime ricerche dell'utente collegato
input.value = "";
if (clearBtn) clearBtn.hidden = true;
renderRecentSearches();
