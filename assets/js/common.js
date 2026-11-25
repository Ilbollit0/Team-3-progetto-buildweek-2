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
// Per le pagine: play(track, queue), togglePlay(), setVolume(0-1), seek(0-1), highlightPlayingRow()
class Player {
  constructor() {
    this.audio = document.querySelector("#audio-element");
    this.currentTrack = null;
    this.queue = [];
    this.isPlaying = false;

    // Eventi audio: scrivono negli elementi del footer, che mount() salva prima del primo play.
    // La durata arriva da loadedmetadata perché l'anteprima dura 30 secondi, non quanto il brano;
    // "pause" arriva anche a fine brano, quindi l'icona torna ▶ da sola; poi "ended" passa al successivo
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
      const bigBtn = document.querySelector(".btn-play-big");
      if (bigBtn) bigBtn.textContent = "⏸";
    });
    this.audio.addEventListener("pause", () => {
      this.isPlaying = false;
      this.toggleButton.textContent = "▶";
      const bigBtn = document.querySelector(".btn-play-big");
      if (bigBtn) bigBtn.textContent = "▶";
    });
    this.audio.addEventListener("ended", () => this.skip(1));
  }

  // Footer del player: markup, elementi da aggiornare, click, volume iniziale
  mount() {
    const footer = document.querySelector(".player");
    if (!footer) return;

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
      .querySelector("#btn-prev")
      .addEventListener("click", () => this.skip(-1));
    footer
      .querySelector("#btn-next")
      .addEventListener("click", () => this.skip(1));
    footer
      .querySelector("#progress-bar")
      .addEventListener("click", (event) => this.seek(clickRatio(event)));
    footer
      .querySelector("#volume-bar")
      .addEventListener("click", (event) => this.setVolume(clickRatio(event)));

    this.setVolume(0.8);
    // Alessandro: mostra l’ultimo brano ascoltato
    this.restoreLastTrack();
  }

  // Alessandro: recupera l’ultimo brano senza riprodurlo
  restoreLastTrack() {
    const lastTrack = getHistory()[0];
    if (!lastTrack?.previewUrl) return;

    //Francesca: tolto innerHTML che era presente nello start

    this.currentTrack = lastTrack;
    this.queue = [lastTrack];
    this.audio.preload = "metadata";
    this.audio.src = lastTrack.previewUrl;

    this.coverImg.src = lastTrack.cover || "";
    this.titleText.textContent = lastTrack.title || "Brano sconosciuto";
    this.artistText.textContent = lastTrack.artist || "Artista sconosciuto";
    this.timeCurrent.textContent = "0:00";
    this.timeTotal.textContent = "0:00";
    this.progressFill.style.width = "0%";
    this.toggleButton.textContent = "▶";
    this.isPlaying = false;

    this.highlightPlayingRow();
  }

  // Brano nuovo: audio, footer, cronologia, riga in riproduzione.
  // queue sono i brani della stessa riga o tracklist, nell'ordine in cui si vedono; se manca, il solo track
  play(track, queue = [track]) {
    // Alcuni brani di iTunes non hanno l'anteprima: non c'è niente da suonare, e in coda si saltano
    if (!track?.previewUrl) return;
    this.currentTrack = track;
    this.queue = queue.filter((item) => item.previewUrl);
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

  // Brano precedente (-1) o successivo (+1) nella coda: ai due capi non fa niente
  skip(step) {
    const index = this.queue.findIndex(
      (item) => item.id === this.currentTrack?.id,
    );
    const track = this.queue[index + step];
    if (track) this.play(track, this.queue);
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

  //Francesca: bottone nelle canzoni (cerca)
  syncPlayButtons() {
    const bigBtn = document.querySelector(".btn-play-big");
    if (bigBtn) {
      bigBtn.textContent = this.isPlaying ? "⏸" : "▶";
    }

    document.querySelectorAll(".card").forEach((card) => {
      const playBtn = card.querySelector(".card-play");
      if (!playBtn) return;
      const isCurrentCard = card.dataset.trackId === this.currentTrack?.id;
      const showPause = isCurrentCard && this.isPlaying;
      playBtn.textContent = showPause ? "⏸" : "▶";
      card.classList.toggle("is-playing", showPause);
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
  //Luca: aggiorna subito la sidebar, da qualunque pagina arrivi il cuore
  renderSidebarFavs();
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

  //Francesca: tolto innerHTML che era presente nello start

  //Francesca: aggiunge la classe .active solo al link corrispondente alla pagina corrente
  sidebar.querySelectorAll(".sidebar-nav a").forEach((link) => {
    link.classList.toggle("active", link.dataset.page === activePage);
  });
  //Luca: riempie la lista dei preferiti appena creata
  renderSidebarFavs();
};

//Luca: preferiti nella sidebar, un <li> col titolo per brano, con data-track-id come card e righe (event delegation)
const renderSidebarFavs = () => {
  const list = document.querySelector("#sidebar-favs");
  if (!list) return;
  const items = getFavourites().map((track) => {
    const item = document.createElement("li");
    item.textContent = track.title;
    item.dataset.trackId = track.id;
    return item;
  });
  list.replaceChildren(...items);
};

//Francesca: nella topbar le iniziali del nome, il nome intero nel title
const pill = document.querySelector(".user-pill");
pill.title = pill.textContent;
pill.textContent = pill.textContent
  .split(" ")
  .map((word) => word[0])
  .join("");

// 8. Inizializzazione

//Francesca: mostra la freccia Indietro su album.html e artist.html e torna alla pagina precedente
const initTopbarNav = () => {
  const backBtn = document.querySelector(".topbar-nav .nav-btn");
  const forwardBtn = document.querySelector(
    '.topbar-nav .nav-btn[aria-label="Avanti"]',
  );
  const path = window.location.pathname;
  const isDetailPage = path.includes("album") || path.includes("artist");

  if (forwardBtn) {
    forwardBtn.remove();
  }

  if (backBtn) {
    backBtn.hidden = !isDetailPage;
    backBtn.addEventListener("click", () => {
      if (window.history.length > 1 && document.referrer) {
        window.history.back();
      } else {
        window.location.href = "index.html";
      }
    });
  }
};

// La chiama ogni pagina: monta sidebar e player e ritorna il player, che resta anche in window.player
const initPage = (activePage) => {
  renderSidebar(activePage);
  initTopbarNav();
  const player = new Player();
  player.mount();
  window.player = player;
  return player;
};
