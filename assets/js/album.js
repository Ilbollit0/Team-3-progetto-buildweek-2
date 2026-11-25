/* ============================================================
   album.js — pagina dettaglio album
   ============================================================

   COSA DEVI FARE
   1) initPage("home")
   2) Leggi l'id dell'album dalla query string:
        const id = new URLSearchParams(window.location.search).get("id");
   3) Se manca l'id -> messaggio "Album non trovato" e stop.
   4) fetch /lookup?id=ID&entity=song
      - results[0] è la collection (album)
      - results[1..] sono le track
   5) Costruisci #album-hero con:
      - cover grande (bigArt)
      - kicker "ALBUM"
      - titolo album
      - sotto-riga: artista · anno · numero brani · durata totale
      - button "Play" che chiama player.play sulla prima track
      - button "Cuore" (favourite) sulla prima track
   6) Costruisci #tracklist:
      - una riga per track: numero, titolo, durata, cuore
      - click sulla riga -> player.play(track)
      - click sul cuore -> toggleFavourite(track)
*/

const player = initPage("home");

const albumHero = document.querySelector("#album-hero");
const tracklist = document.querySelector("#tracklist");
const albumActions = document.querySelector("#album-actions");

let albumTracks = [];

//Francesca: svuota un elemento DOM rimuovendo tutti i suoi nodi
const clearElement = (el) => {
  if (!el) return;
  while (el.firstChild) el.removeChild(el.firstChild);
};

//Francesca: svuota il contenitore e mostra un messaggio di caricamento o di errore
const renderMessage = (container, text) => {
  if (!container) return;
  clearElement(container);
  container.appendChild(buildElement("p", "loader", text));
};

//Francesca: costruisce la sezione hero dell'album
const renderAlbumHero = (album, tracks, artistId) => {
  clearElement(albumHero);
  clearElement(albumActions);

  const coverWrap = document.createElement("div");
  coverWrap.className = "album-cover";

  const img = document.createElement("img");
  img.src = bigArt(album.cover);
  img.alt = album.title;
  coverWrap.appendChild(img);

  const meta = document.createElement("div");
  meta.className = "hero-meta";

   const kicker = document.createElement("span");
   kicker.className = "hero-kicker";
   kicker.textContent = "ALBUM";

   const title = document.createElement("h1");
   title.className = "hero-title";
   title.textContent = album.title;

   const sub = document.createElement("p");
   sub.className = "hero-sub";

   const artistLink = document.createElement("a");
   artistLink.className = "hero-artist-link";
   artistLink.href = `artist.html?id=${encodeURIComponent(artistId)}`;
   artistLink.textContent = album.artist;

   const totalMs = tracks.reduce((acc, t) => acc + (t.durationMs || 0), 0);

   const details = document.createElement("span");
   details.textContent = `· ${album.year} · ${tracks.length} brani · ${formatTime(totalMs)}`;

   sub.appendChild(artistLink);
   sub.appendChild(details);

   meta.appendChild(kicker);
   meta.appendChild(title);
   meta.appendChild(sub);

   albumHero.appendChild(coverWrap);
   albumHero.appendChild(meta);

   if(tracks.length > 0 && albumActions) {
      const bigPlayBtn = document.createElement("button");
      bigPlayBtn.type = "button";
      bigPlayBtn.className = "btn-play-big";
      bigPlayBtn.textContent = "▶️"; //da modificare
      bigPlayBtn.setAttribute("aria-label", "Riproduzione album");
      bigPlayBtn.addEventListener("click", () => player.play(tracks[0], tracks));
      albumActions.appendChild(bigPlayBtn);
   }
};

//Francesca: renderizza tutte le righe della tracklist dell'album
const renderAlbumTracklist = (tracks) => {
   clearElement(tracklist);
   tracks.forEach((track, idx) => {
      tracklist.appendChild(createTrackRow(track, idx));
   });
   //Francesca: l'eventuale brano attualmente in riproduzione
   player.highlightPlayingRow();
};

//Francesca: event delegation sulla tracklist
tracklist.addEventListener("click", (event) => {
   const row = event.target.closest("[data-track-id]");
   if(!row) return;

   const track = albumTracks.find((t) => String(t.id) === String(row.dataset.trackId));
   if(!track) return;

   const favBtn = event.target.closest(".btn-fav");
   if(favBtn) {
      toggleFavourite(track);
      //Luca: al posto del cuore cliccato ne creo uno nuovo, che mostra il preferito appena salvato
      favBtn.replaceWith(createFavButton(track, "track-fav"));
      return;
   }
   player.play(track, albumTracks);
})

//Francesca: carica i dati dell'album dall'API
const loadAlbum = async () => {
  const params = new URLSearchParams(window.location.search);
  const albumId = params.get("id");

  if (!albumId) {
    renderMessage(albumHero, "Album non trovato.");
    return;
  }
  renderMessage(albumHero, "Caricamento album...");

  try {
    const url = `${API_BASE}/lookup?id=${encodeURIComponent(albumId)}&entity=song`;
    const data = await fetchJSON(url);
    const results = data.results || [];

    const rawCollection = results.find(
      (item) => item.wrapperType === "collection",
    );
    const rawTracks = results.filter((item) => item.wrapperType === "track");

    if (!rawCollection) {
      renderMessage(albumHero, "Album non trovato.");
      return;
    }
    const album = new Album(rawCollection);
    
    //Luca: Track è una classe, quindi serve new
    albumTracks = rawTracks.map((raw) => new Track(raw));
    const artistId = rawCollection.artistId || albumTracks[0]?.artistId || "";

    renderAlbumHero(album, albumTracks, artistId);
    renderAlbumTracklist(albumTracks);
  } catch (error) {
    console.error("Errore nel caricamento dell'album:", error);
    renderMessage(albumHero, "Errore durante il caricamento dell'album.");
  }
};

loadAlbum();
