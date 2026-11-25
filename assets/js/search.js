
/* ============================================================
   search.js — ricerca con debounce
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

const player = initPage("search");

const input = document.querySelector("#search-input");
const rowTracks = document.querySelector("#row-tracks");
const rowAlbums = document.querySelector("#row-albums");
const rowArtists = document.querySelector("#row-artists");
const gridTracks = document.querySelector("#grid-tracks");
const gridAlbums = document.querySelector("#grid-albums");
const gridArtists = document.querySelector("#grid-artists");

const renderTrackCard = (track) => {
  // Crea la card del brano
  const card = createTrackCard(track);

  // Riproduce il brano quando si clicca sulla card
  card.addEventListener("click", (event) => {
    if (event.target.closest(".btn-fav")) {
      const isFav = toggleFavourite(track);
      const button = event.target.closest(".btn-fav");

      button.textContent = isFav ? "♥" : "♡";
      button.classList.toggle("is-fav", isFav);
      button.setAttribute(
        "aria-label",
        isFav ? "Togli dai preferiti" : "Aggiungi ai preferiti",
      );
      return;
    }

    player.play(track);
  });

  gridTracks.appendChild(card);
};

const renderAlbumCard = (album) => {
  // Crea la card dell'album
  const card = buildElement("div", "card");
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

  // Apre la pagina dell'album
  card.addEventListener("click", () => {
    window.location.href = "album.html?id=" + album.id;
  });

  gridAlbums.appendChild(card);
};

const renderArtistCard = (artist) => {
  // Crea la card dell'artista
  const card = buildElement("div", "card");
  const imageWrap = buildElement("div", "card-image-wrap");

  // iTunes non fornisce la foto dell'artista
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

  // Apre la pagina dell'artista
  card.addEventListener("click", () => {
    window.location.href = "artist.html?id=" + artist.id;
  });

  gridArtists.appendChild(card);
};

const doSearch = async (term) => {
  // Salva l'ultima ricerca
  localStorage.setItem(STORAGE_KEY_LAST_SEARCH, term);

  // Svuota i risultati precedenti
  gridTracks.innerHTML = "";
  gridAlbums.innerHTML = "";
  gridArtists.innerHTML = "";

  // Nasconde le sezioni se la ricerca è vuota
  if (!term) {
    rowTracks.style.display = "none";
    rowAlbums.style.display = "none";
    rowArtists.style.display = "none";
    return;
  }

  // Prepara le tre ricerche
  const query = encodeURIComponent(term);

  const tracksUrl = `${API_BASE}/search?term=${query}&entity=song&limit=12`;
  const albumsUrl = `${API_BASE}/search?term=${query}&entity=album&limit=8`;
  const artistsUrl = `${API_BASE}/search?term=${query}&entity=musicArtist&limit=8`;

  // Esegue le richieste in parallelo
  const [tracksData, albumsData, artistsData] = await Promise.all([
    fetchJSON(tracksUrl),
    fetchJSON(albumsUrl),
    fetchJSON(artistsUrl),
  ]);

  // Converte i risultati nei nostri modelli
  const tracks = tracksData.results.map((raw) => new Track(raw));
  const albums = albumsData.results.map((raw) => new Album(raw));
  const artists = artistsData.results.map((raw) => new Artist(raw));

  // Mostra solo le sezioni con risultati
  rowTracks.style.display = tracks.length > 0 ? "" : "none";
  rowAlbums.style.display = albums.length > 0 ? "" : "none";
  rowArtists.style.display = artists.length > 0 ? "" : "none";

  // Crea le card dei risultati
  tracks.forEach((track) => renderTrackCard(track));
  albums.forEach((album) => renderAlbumCard(album));
  artists.forEach((artist) => renderArtistCard(artist));
};

const debouncedSearch = debounce(doSearch, 400);

input.addEventListener("input", (event) => {
  debouncedSearch(event.target.value.trim());
});

// TODO: al caricamento, recupera l'ultima query da localStorage e lancia doSearch(lastQuery)

// Recupera l'ultima ricerca salvata
const lastQuery = localStorage.getItem(STORAGE_KEY_LAST_SEARCH);

if (lastQuery) {
  input.value = lastQuery;
  doSearch(lastQuery);
}

