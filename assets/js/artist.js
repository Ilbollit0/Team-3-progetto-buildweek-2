/* ============================================================
   artist.js — pagina dettaglio artista
   ============================================================

   COSA DEVI FARE
   1) initPage("home")
   2) Leggi l'id dell'artista dalla query string (URLSearchParams).
   3) Se manca l'id -> messaggio "Artista non trovato" e stop.
   4) fetch /lookup?id=ID&entity=song&limit=15
      - results[0] è l'artist
      - results[1..] sono le top track
   5) Costruisci #artist-hero:
      - kicker "ARTISTA"
      - nome artista grande
      - genere (primaryGenreName) + numero ascoltatori (random, es. Math.random() * 5_000_000)
      - button "Play" -> player.play(prima track)
   6) Costruisci #top-tracks come tracklist (uguale a album).
*/

const player = initPage("home");

const artistHero = document.querySelector("#artist-hero");
const topTracks = document.querySelector("#top-tracks");
const artistaActions = document.querySelector("#artist-actions");

let artistTracks = [];

//Francesca: sezione hero dell'artista
const renderArtistHero = (artist, tracks, fallbackCover) => {
   clearElement(artistHero);
   clearElement(artistaActions);

   const coverUrl = artist.cover || fallbackCover;
   if(coverUrl) {
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

   const listeners = (Math.floor(Math.random() * 5_000_000) + 500_000).toLocaleString("it-IT");

   const sub = document.createElement("p");
   sub.className = "hero-sub";
   sub.textContent = `${artist.genre} · ${listeners} ascoltatori mensili`;

   meta.appendChild(kicker);
   meta.appendChild(title);
   meta.appendChild(sub);

   artistHero.appendChild(meta);

   if(tracks.length > 0) {
      const bigPlayBtn = document.createElement("button");
      bigPlayBtn.type = "button";
      bigPlayBtn.className = "btn-play-big";
      bigPlayBtn.textContent = "▶️"; //da modificare
      bigPlayBtn.setAttribute("aria-label", "Riproduzione brani popolari");
      bigPlayBtn.addEventListener("click", () => player.play(tracks[0], tracks));
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
   if(!row) return;

   const track = artistTracks.find((t) => String(t.id) === String(row.dataset.trackId));
   if(!track) return;

   //Francesca: gestisce il click sul cuore preferiti
   const favBtn = event.target.closest(".btn-fav");
   if(favBtn) {
      toggleFavourite(track);
      renderTopTracks(artistTracks);
      return;
   }
   player.play(track, artistTracks);
})

//Francesca: carica i dati dell'artista dall'API 
const loadArtist = async () => {
   const params = new URLSearchParams(window.location.search);
   const artistId = params.get("id");

   if(!artistId) {
      renderMessage(artistHero, "Artista non trovato.");
      return;
   }
   renderMessage(artistHero, "Caricamento artista...");

   try{
      const url = `${API_BASE}/lookup?id=${encodeURIComponent(artistId)}&entity=song&limit=15`;
      const data = await fetchJSON(url);
      const results = data.results || [];

      const rawArtist = results.find((item) => item.wrapperType === "artist");
      const rawTracks = results.filter((item) => item.wrapperType === "track");

      if(!rawArtist) {
         renderMessage(artistHero, "Artista non trovato.");
         return;
      }
      const artist = new Artist(rawArtist);
      artistTracks = rawTracks.map((raw) => Track(raw));
      const fallbackCover = artistTracks.length > 0 ? artistTracks[0].cover : "";

      renderArtistHero(artist, artistTracks, fallbackCover);
      renderTopTracks(artistTracks);
   }catch(error) {
      console.error("Errore nel caricamento dell'artista:", error);
      renderMessage(artistHero, "Errore durante il caricamento dell'artista.");
   }
};

loadArtist();
