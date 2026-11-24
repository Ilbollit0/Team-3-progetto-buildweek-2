/*
  common.js — codice comune a tutte le pagine
  Ogni pagina chiama initPage(), che monta sidebar e player.

  Sezioni, in quest'ordine:
  1. Costanti: URL dell'API, chiavi di localStorage
  2. Helpers: fetchJSON, bigArt, formatTime, debounce, buildElement, clickRatio
  3. Modelli: Track, Album, Artist
  4. Player
  5. Cronologia e preferiti in localStorage
  6. Card e riga del brano
  7. Sidebar
  8. Inizializzazione: initPage
*/

// 1. Costanti

const API_BASE = "https://itunes.apple.com";
const STORAGE_KEY_HISTORY = "epitunes_history";
const STORAGE_KEY_FAVOURITES = "epitunes_favourites";
const STORAGE_KEY_LAST_SEARCH = "epitunes_last_search";
const MAX_HISTORY = 12;

// 2. Helpers

// Chiamata GET all'API: su un errore lo scrive in console e ritorna una risposta vuota.
// Niente header: una GET non manda dati, e un Content-Type farebbe partire una richiesta CORS in più
const fetchJSON = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Risposta HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Chiamata all'API non riuscita:", url, error);
    return { results: [], resultCount: 0 };
  }
};

// Copertina 600x600 al posto della 100x100 di artworkUrl100
const bigArt = (url) => {
  if (!url) return "";
  return url.replace("100x100", "600x600");
};

// Millisecondi in "m:ss": 65000 -> "1:05"
const formatTime = (ms) => {
  if (!ms) return "0:00";
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${String(sec).padStart(2, "0")}`;
};

// Chiama fn solo dopo ms millisecondi senza nuove chiamate: la ricerca mentre si scrive
const debounce = (fn, ms) => {
  let timerId = null;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), ms);
  };
};

// Elemento con classe e testo: il testo entra con textContent, così i dati dell'API non diventano HTML
const buildElement = (tag, className, text = "") => {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
};

// Punto del click su una barra (avanzamento, volume): 0 all'inizio, 1 alla fine
const clickRatio = (event) => {
  const bar = event.currentTarget.getBoundingClientRect();
  return (event.clientX - bar.left) / bar.width;
};

// 3. Modelli

// Solo i modelli leggono i nomi dei campi di iTunes; le pagine usano i nostri.
// Gli id diventano stringhe, come quelli di dataset e query string: così si confrontano con ===

// Brano (wrapperType "track"): cover è la 100x100, per una più grande c'è bigArt
class Track {
  constructor(raw) {
    this.id = String(raw.trackId);
    this.title = raw.trackName;
    this.artist = raw.artistName;
    this.album = raw.collectionName;
    this.albumId = String(raw.collectionId);
    this.artistId = String(raw.artistId);
    this.cover = raw.artworkUrl100;
    this.previewUrl = raw.previewUrl;
    this.durationMs = raw.trackTimeMillis; 
  }
}

// Album (wrapperType "collection"): year è l'anno di releaseDate, "2000-07-10T07:00:00Z" -> "2000"
class Album {
  constructor(raw) {
    this.id = String(raw.collectionId);
    this.title = raw.collectionName;
    this.artist = raw.artistName;
    this.cover = raw.artworkUrl100;
    this.year = raw.releaseDate?.slice(0, 4) ?? "";
    this.trackCount = raw.trackCount;
  }
}

// Artista (wrapperType "artist"): iTunes non dà la sua foto, quindi niente cover
class Artist {
  constructor(raw) {
    this.id = String(raw.artistId);
    this.name = raw.artistName;
    this.genre = raw.primaryGenreName;
  }
}

// 4. Player

// Player: suona le anteprime nell'<audio> della pagina e disegna il footer.
// Per le pagine: play(track), togglePlay(), setVolume(0-1), seek(0-1), highlightPlayingRow()
class Player {
  constructor() {
    this.audio = document.querySelector("#audio-element");
    this.currentTrack = null;
    this.isPlaying = false;

    // Eventi audio: scrivono negli elementi del footer, che mount() salva prima del primo play.
    // La durata arriva da loadedmetadata perché l'anteprima dura 30 secondi, non quanto il brano;
    // "pause" arriva anche a fine brano, quindi l'icona torna ▶ da sola
    this.audio.addEventListener("timeupdate", () => {
      const ratio = this.audio.currentTime / this.audio.duration || 0;
      this.progressFill.style.width = `${ratio * 100}%`;
      this.timeCurrent.textContent = formatTime(this.audio.currentTime * 1000);
    });
    this.audio.addEventListener("loadedmetadata", () => {
      this.timeTotal.textContent = formatTime(this.audio.duration * 1000);
    });
    this.audio.addEventListener("play", () => {
      this.isPlaying = true;
      this.toggleButton.textContent = "⏸";
    });
    this.audio.addEventListener("pause", () => {
      this.isPlaying = false;
      this.toggleButton.textContent = "▶";
    });
  }

  // Footer del player: markup, elementi da aggiornare, click, volume iniziale
  mount() {
    const footer = document.querySelector(".player");
    if (!footer) return;
    footer.innerHTML = `
      <div class="player-track">
        <div class="player-cover"><img id="player-cover-img" alt="" /></div>
        <div class="player-meta">
          <p class="player-title" id="player-title">Seleziona un brano</p>
          <p class="player-artist" id="player-artist">—</p>
        </div>
      </div>

      <div class="player-center">
        <div class="player-controls">
          <button class="btn-ctrl" id="btn-shuffle" aria-label="Shuffle">⇄</button>
          <button class="btn-ctrl" id="btn-prev"    aria-label="Precedente">⏮</button>
          <button class="btn-play" id="btn-toggle"  aria-label="Play/Pausa">▶</button>
          <button class="btn-ctrl" id="btn-next"    aria-label="Successivo">⏭</button>
          <button class="btn-ctrl" id="btn-repeat"  aria-label="Ripeti">↻</button>
        </div>
        <div class="player-progress">
          <span id="time-current">0:00</span>
          <div class="progress-bar" id="progress-bar">
            <div class="progress-fill" id="progress-fill"></div>
          </div>
          <span id="time-total">0:00</span>
        </div>
      </div>

      <div class="player-right">
        <span>🔊</span>
        <div class="volume-bar" id="volume-bar">
          <div class="volume-fill" id="volume-fill" style="width: 80%"></div>
        </div>
      </div>
    `;

    this.coverImg = footer.querySelector("#player-cover-img");
    this.titleText = footer.querySelector("#player-title");
    this.artistText = footer.querySelector("#player-artist");
    this.toggleButton = footer.querySelector("#btn-toggle");
    this.progressFill = footer.querySelector("#progress-fill");
    this.timeCurrent = footer.querySelector("#time-current");
    this.timeTotal = footer.querySelector("#time-total");
    this.volumeFill = footer.querySelector("#volume-fill");

    this.toggleButton.addEventListener("click", () => this.togglePlay());
    footer
      .querySelector("#progress-bar")
      .addEventListener("click", (event) => this.seek(clickRatio(event)));
    footer
      .querySelector("#volume-bar")
      .addEventListener("click", (event) => this.setVolume(clickRatio(event)));

    this.setVolume(0.8);
  }

  // Brano nuovo: audio, footer, cronologia, riga in riproduzione
  play(track) {
    // Alcuni brani di iTunes non hanno l'anteprima: non c'è niente da suonare
    if (!track?.previewUrl) return;
    this.currentTrack = track;
    this.audio.src = track.previewUrl;
    this.start();

    // La durata resta a zero finché non arriva loadedmetadata
    this.coverImg.src = track.cover;
    this.titleText.textContent = track.title;
    this.artistText.textContent = track.artist;
    this.timeTotal.textContent = "0:00";

    addToHistory(track);
    this.highlightPlayingRow();
  }

  // Avvio dell'audio: AbortError vuol dire che è partito un altro brano prima di questo, non è un errore
  start() {
    this.audio.play().catch((error) => {
      if (error.name !== "AbortError") {
        console.error("Riproduzione non riuscita:", error);
      }
    });
  }

  // Play/pausa sul brano corrente
  togglePlay() {
    if (!this.currentTrack) return;
    if (this.audio.paused) this.start();
    else this.audio.pause();
  }

  // Volume tra 0 e 1, anche se il valore esce dalla scala
  setVolume(v) {
    const volume = Math.min(Math.max(v, 0), 1);
    this.audio.volume = volume;
    this.volumeFill.style.width = `${volume * 100}%`;
  }

  // Salto nel brano: ratio tra 0 (inizio) e 1 (fine)
  seek(ratio) {
    if (!this.audio.duration) return;
    this.audio.currentTime = this.audio.duration * ratio;
  }

  // .is-playing sulla riga del brano corrente: le pagine la richiamano quando ridisegnano le righe
  highlightPlayingRow() {
    document.querySelectorAll(".track-row").forEach((row) => {
      row.classList.toggle(
        "is-playing",
        row.dataset.trackId === this.currentTrack?.id,
      );
    });
  }
}

// 5. Cronologia e preferiti

// Lista di Track salvata in localStorage: vuota se manca o se il valore è rovinato (modificato a mano)
const readList = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? [];
  } catch {
    return [];
  }
};

// Cronologia: l'ultimo brano in testa, senza doppioni, al più MAX_HISTORY
const getHistory = () => readList(STORAGE_KEY_HISTORY);

const addToHistory = (track) => {
  const history = getHistory().filter((item) => item.id !== track.id);
  history.unshift(track);
  localStorage.setItem(
    STORAGE_KEY_HISTORY,
    JSON.stringify(history.slice(0, MAX_HISTORY)),
  );
};

// Preferiti: l'ultimo aggiunto in testa
const getFavourites = () => readList(STORAGE_KEY_FAVOURITES);

const isFavourite = (trackId) =>
  getFavourites().some((track) => track.id === trackId);

// Aggiunge o toglie il brano; ritorna true se adesso è tra i preferiti
const toggleFavourite = (track) => {
  const wasFavourite = isFavourite(track.id);
  const others = getFavourites().filter((item) => item.id !== track.id);
  const favourites = wasFavourite ? others : [track, ...others];
  localStorage.setItem(STORAGE_KEY_FAVOURITES, JSON.stringify(favourites));
  return !wasFavourite;
};

// 6. Card e riga del brano

// Card e righe portano data-track-id e il cuore .btn-fav, uguali in tutte le pagine (event delegation, opzione A)

// Cuore dei preferiti, lo stesso in card e riga: pieno e con .is-fav se il brano è già tra i preferiti
const createFavButton = (track, className) => {
  const isFav = isFavourite(track.id);
  const button = buildElement(
    "button",
    `${className} btn-fav${isFav ? " is-fav" : ""}`,
    isFav ? "♥" : "♡",
  );
  button.type = "button";
  button.setAttribute(
    "aria-label",
    isFav ? "Togli dai preferiti" : "Aggiungi ai preferiti",
  );
  return button;
};

// Card del brano per le griglie; copertina 600x600 perché la card è più larga dei 100px di artworkUrl100
const createTrackCard = (track) => {
  const card = buildElement("div", "card");
  card.dataset.trackId = track.id;

  const imageWrap = buildElement("div", "card-image-wrap");
  const img = document.createElement("img");
  img.src = bigArt(track.cover);
  img.alt = "";
  img.loading = "lazy";
  imageWrap.appendChild(img);

  const playButton = buildElement("button", "card-play", "▶");
  playButton.type = "button";
  playButton.setAttribute("aria-label", `Riproduci ${track.title}`);

  card.append(
    imageWrap,
    buildElement("p", "card-title", track.title),
    buildElement("p", "card-sub", track.artist),
    playButton,
    createFavButton(track, "card-fav"),
  );
  return card;
};

// Riga del brano per tracklist e brani popolari: index parte da 0, quindi il numero è index + 1.
// .is-playing non la mette la riga ma player.highlightPlayingRow()
const createTrackRow = (track, index) => {
  const row = buildElement("div", "track-row");
  row.dataset.trackId = track.id;
  row.append(
    buildElement("span", "track-num", index + 1),
    buildElement("span", "track-title", track.title),
    buildElement("span", "track-time", formatTime(track.durationMs)),
    createFavButton(track, "track-fav"),
  );
  return row;
};

// 7. Sidebar

// Sidebar: logo, link (activePage "home" o "search" evidenzia il suo) e preferiti
const renderSidebar = (activePage) => {
  const sidebar = document.querySelector(".sidebar");
  if (!sidebar) return;
  sidebar.innerHTML = `
    <div class="brand">
      <div class="brand-mark">E</div>
      <span class="brand-text">EpiTunes</span>
    </div>
    <nav class="sidebar-nav">
      <a href="index.html"  data-page="home"   ${activePage === "home" ? 'class="active"' : ""}><span class="ico">🏠</span><span>Home</span></a>
      <a href="search.html" data-page="search" ${activePage === "search" ? 'class="active"' : ""}><span class="ico">🔍</span><span>Cerca</span></a>
    </nav>
    <p class="sidebar-section-title">I tuoi preferiti</p>
    <ul class="sidebar-list" id="sidebar-favs"></ul>
  `;
  // TODO (opzionale): popola #sidebar-favs con i titoli dei preferiti
};

// 8. Inizializzazione

// La chiama ogni pagina: monta sidebar e player e ritorna il player, che resta anche in window.player
const initPage = (activePage) => {
  renderSidebar(activePage);
  const player = new Player();
  player.mount();
  window.player = player;
  return player;
};
