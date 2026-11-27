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
//Seconda API per copertina artisti in search.
const AUDIODB_BASE = "https://www.theaudiodb.com/api/v1/json/123";
const STORAGE_KEY_HISTORY = "epitunes_history";
const STORAGE_KEY_FAVOURITES = "epitunes_favourites";
const STORAGE_KEY_LAST_SEARCH = "epitunes_last_search";
const MAX_HISTORY = 12;

//Francesca: chiavi per la lista utenti registrati (localStorage) e per l'utente attivo nella sessione (sessionStorage)
const STORAGE_KEY_USERS = "epitunes_users";
const STORAGE_KEY_CURRENT_USER = "epitunes_current_user";

//Francesca: genera una chiave univoca legata all'id dell'utente loggato per separare preferiti, cronologia e ricerche
const userKey = (key) =>
  `${key}_${sessionStorage.getItem(STORAGE_KEY_CURRENT_USER)}`;

//Francesca: controlla subito se l'utente è loggato; se non siamo già su login.html rimanda al login
const isLoginPage = window.location.pathname.endsWith("login.html");
if (!isLoginPage && !sessionStorage.getItem(STORAGE_KEY_CURRENT_USER)) {
  window.location.replace("login.html");
}

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

    //Francesca: stati attivi per riproduzione casuale (shuffle) e ripetizione brano (repeat), drag della barra canzoni
    this.isShuffle = false;
    this.isRepeat = false;
    this.isSeeking = false;

    // Eventi audio: scrivono negli elementi del footer, che mount() salva prima del primo play.
    // La durata arriva da loadedmetadata perché l'anteprima dura 30 secondi, non quanto il brano;
    // "pause" arriva anche a fine brano, quindi l'icona torna ▶ da sola; poi "ended" passa al successivo
    this.audio.addEventListener("timeupdate", () => {
      //Francesca: mentre si trascina la barra manualmente, non sovrascrive la posizione del pallino
      if (this.isSeeking) return;
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
      this.syncPlayButtons();
    });
    this.audio.addEventListener("pause", () => {
      this.isPlaying = false;
      this.toggleButton.textContent = "▶";
      this.syncPlayButtons();
    });

    //Francesca: a fine brano, se repeat è attivo riparte da 0:00 in loop, altrimenti passa al successivo
    this.audio.addEventListener("ended", () => {
      if (this.isRepeat && this.currentTrack) {
        this.audio.currentTime = 0;
        this.start();
      } else {
        this.skip(1);
      }
    });
  }

  // Footer del player: markup, elementi da aggiornare, click, volume iniziale
  mount() {
    const footer = document.querySelector(".player");
    if (!footer) return;

    this.coverImg = footer.querySelector("#player-cover-img");
    this.titleText = footer.querySelector("#player-title");
    this.artistText = footer.querySelector("#player-artist");
    this.toggleButton = footer.querySelector("#btn-toggle");
    this.shuffleButton = footer.querySelector("#btn-shuffle");
    this.repeatButton = footer.querySelector("#btn-repeat");
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

    //Francesca: attiva/disattiva la riproduzione casuale
    this.shuffleButton.addEventListener("click", () => {
      this.isShuffle = !this.isShuffle;
      this.shuffleButton.classList.toggle("is-active", this.isShuffle);
      this.shuffleButton.setAttribute("aria-pressed", String(this.isShuffle));
    });

    //Francesca: attiva/disattiva il loop del brano corrente
    this.repeatButton.addEventListener("click", () => {
      this.isRepeat = !this.isRepeat;
      this.repeatButton.classList.toggle("is-active", this.isRepeat);
      this.repeatButton.setAttribute("aria-pressed", String(this.isRepeat));
    });

    //Francesca: gestione barra avanzamento brano sia al click singolo sia trascinando il pallino
    const progressBar = footer.querySelector("#progress-bar");

    //Francesca: calcola la percentuale (tra 0 e 1) del cursore sulla barra del brano
    const getProgressRatio = (event) => {
      const rect = progressBar.getBoundingClientRect();
      const rawRatio = (event.clientX - rect.left) / rect.width;
      return Math.min(Math.max(rawRatio, 0), 1);
    };

    //Francesca: aggiorna subito la grafica della barra e il tempo visualizzato durante il trascinamento
    const previewProgress = (ratio) => {
      this.progressFill.style.width = `${ratio * 100}%`;
      if (this.audio.duration) {
        this.timeCurrent.textContent = formatTime(
          this.audio.duration * ratio * 1000,
        );
      }
    };

    //Francesca: inizio trascinamento sulla barra del brano
    progressBar.addEventListener("pointerdown", (event) => {
      if (!this.audio.duration) return;
      this.isSeeking = true;
      progressBar.setPointerCapture(event.pointerId);
      previewProgress(getProgressRatio(event));
    });

    //Francesca: sposta il pallino e aggiorna i secondi mentre si trascina
    progressBar.addEventListener("pointermove", (event) => {
      if (!this.isSeeking) return;
      previewProgress(getProgressRatio(event));
    });

    //Francesca: al rilascio del mouse applica il nuovo punto di riproduzione all'audio
    const finishSeek = (event) => {
      if (!this.isSeeking) return;
      const ratio = getProgressRatio(event);
      this.isSeeking = false;
      this.seek(ratio);
    };

    progressBar.addEventListener("pointerup", finishSeek);
    progressBar.addEventListener("pointercancel", finishSeek);

    //Francesca: gestione barra volume sia al click singolo sia trascinando il cursore
   const volumeBar = footer.querySelector("#volume-bar");
    let isDraggingVolume = false;

    //Francesca: calcola la percentuale orizzontale del cursore sulla barra del volume
    const updateVolumeFromEvent = (event) => {
      const rect = volumeBar.getBoundingClientRect();
      const ratio = (event.clientX - rect.left) / rect.width;
      this.setVolume(ratio);
    };

    //Francesca: inizio trascinamento volume (aggancia il puntatore anche se esce leggermente dalla barra)
    volumeBar.addEventListener("pointerdown", (event) => {
      isDraggingVolume = true;
      volumeBar.setPointerCapture(event.pointerId);
      updateVolumeFromEvent(event);
    });

    //Francesca: aggiorna il volume in tempo reale mentre si trascina
    volumeBar.addEventListener("pointermove", (event) => {
      if (!isDraggingVolume) return;
      updateVolumeFromEvent(event);
    });

    //Francesca: fine trascinamento al rilascio del tasto o interruzione del puntatore
    const stopVolumeDrag = () => {
      isDraggingVolume = false;
    };

    volumeBar.addEventListener("pointerup", stopVolumeDrag);
    volumeBar.addEventListener("pointercancel", stopVolumeDrag);

    this.setVolume(0.8);
    // Alessandro: mostra l’ultimo brano ascoltato
    this.restoreLastTrack();
  }

  // Alessandro: recupera l’ultimo brano senza riprodurlo
  restoreLastTrack() {
    const history = getHistory();
    const lastTrack = getHistory()[0];
    if (!lastTrack?.previewUrl) return;

    //Francesca: tolto innerHTML che era presente nello start

    this.currentTrack = lastTrack;
    this.queue = history.filter((item) => item.previewUrl);
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
    // Se la coda ha 1 solo brano, prova a riempirla con la cronologia
    if (this.queue.length <= 1) {
      const fallback = getHistory().filter((item) => item.previewUrl);
      if (fallback.length > 1) this.queue = fallback;
    }

    if (this.queue.length === 0) return;

    //Francesca: riproduzione casuale dalla coda evitando di ripetere subito lo stesso brano
    if (this.isShuffle && this.queue.length > 1) {
      const currentIndex = this.queue.findIndex(
        (item) => item.id === this.currentTrack?.id,
      );
      let randomIndex = currentIndex;
      while (randomIndex === currentIndex) {
        randomIndex = Math.floor(Math.random() * this.queue.length);
      }
      this.play(this.queue[randomIndex], this.queue);
      return;
    }

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
const getHistory = () => readList(userKey(STORAGE_KEY_HISTORY));

//Francesca: salva il brano ascoltato nella cronologia personale dell'utente corrente
const addToHistory = (track) => {
  const history = getHistory().filter((item) => item.id !== track.id);
  history.unshift(track);
  localStorage.setItem(
    userKey(STORAGE_KEY_HISTORY),
    JSON.stringify(history.slice(0, MAX_HISTORY)),
  );
};

// Preferiti: l'ultimo aggiunto in testa
const getFavourites = () => readList(userKey(STORAGE_KEY_FAVOURITES));

const isFavourite = (trackId) =>
  getFavourites().some((track) => track.id === trackId);

// Aggiunge o toglie il brano; ritorna true se adesso è tra i preferiti
const toggleFavourite = (track) => {
  const wasFavourite = isFavourite(track.id);
  const others = getFavourites().filter((item) => item.id !== track.id);
  const favourites = wasFavourite ? others : [track, ...others];
  localStorage.setItem(userKey(STORAGE_KEY_FAVOURITES), JSON.stringify(favourites));
 //Luca: aggiorna subito la sidebar, da qualunque pagina arrivi il cuore
renderAllSidebarFavs();
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
renderAllSidebarFavs();
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


 // [ALESSANDRO] Mostra brani, album e artisti nella sidebar
const renderAllSidebarFavs = () => {
  const list = document.querySelector("#sidebar-favs");
  if (!list) return;

  const brani = getFavourites();
  const album = readList(userKey("epitunes_favourite_albums"));
  const artisti = readList(userKey("epitunes_favourite_artists"));

  list.replaceChildren();

  // [ALESSANDRO] Crea il titolo di una categoria
  const aggiungiTitolo = (testo) => {
    const li = document.createElement("li");
    li.textContent = testo;
    li.className = "fw-bold text-white mt-3 mb-1";
    list.appendChild(li);
  };

  // [ALESSANDRO] Mostra i brani preferiti
 
if (brani.length > 0) {
  aggiungiTitolo("Brani");

  brani.forEach((track) => {
    const li = document.createElement("li");
    li.textContent = track.title;
    li.dataset.trackId = track.id;
    li.style.cursor = "pointer";

    // [ALESSANDRO] Riproduce il brano cliccato nella sidebar
    li.addEventListener("click", () => {
      if (window.player.currentTrack?.id === track.id) {
        window.player.togglePlay();
      } else {
        window.player.play(track, brani);
      }
    });

    list.appendChild(li);
  });
}


  // [ALESSANDRO] Mostra gli album preferiti
  if (album.length > 0) {
    aggiungiTitolo("Album");

    album.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item.title;
      li.style.cursor = "pointer";

      li.addEventListener("click", () => {
        window.location.href = "album.html?id=" + item.id;
      });

      list.appendChild(li);
    });
  }

  // [ALESSANDRO] Mostra gli artisti preferiti
  if (artisti.length > 0) {
    aggiungiTitolo("Artisti");

    artisti.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item.name;
      li.style.cursor = "pointer";

      li.addEventListener("click", () => {
        window.location.href = "artist.html?id=" + item.id;
      });

      list.appendChild(li);
    });
  }
};


//Francesca: recupera l'oggetto completo (id e nome) dell'utente attualmente collegato
const getCurrentUser = () => {
  const currentId = sessionStorage.getItem(STORAGE_KEY_CURRENT_USER);
  if (!currentId) return null;
  return readList(STORAGE_KEY_USERS).find((u) => u.id === currentId) || null;
};

//Francesca: trasforma la pillola utente della topbar in un dropdown Bootstrap con iniziali, nome intero e tasto Esci
const renderUserPill = (user) => {
  const pill = document.querySelector(".user-pill");
  if (!pill || !user) return;

  //Francesca: ricava le iniziali dal nome completo dell'utente (es. "Francesca Alesi" -> "FA")
  const initials = user.name
    .trim()
    .split(/\s+/)
    .map((word) => word[0].toUpperCase())
    .join("");

  //Francesca: contenitore dropdown Bootstrap allineato a destra nella topbar
  const dropdown = document.createElement("div");
  dropdown.className = "dropdown ms-auto";

  //Francesca: bottone circolare con le iniziali e il nome intero al passaggio del mouse (title)
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "user-pill border-0 text-white";
  btn.title = user.name;
  btn.textContent = initials;
  btn.setAttribute("data-bs-toggle", "dropdown");
  btn.setAttribute("aria-expanded", "false");

  //Francesca: voce cliccabile bianca nel dropdown utente che apre la modale profilo
  const menu = document.createElement("ul");
  menu.className = "dropdown-menu dropdown-menu-end dropdown-menu-dark shadow";

  const headerLi = document.createElement("li");
  const profileBtn = buildElement(
    "button",
    "dropdown-item text-white fw-semibold",
    user.name,
  );
  profileBtn.type = "button";
  profileBtn.setAttribute("data-bs-toggle", "modal");
  profileBtn.setAttribute("data-bs-target", "#user-profile-modal");
  headerLi.appendChild(profileBtn);

  //Francesca: crea la modale profilo utente tramite DOM (senza innerHTML) se non esiste ancora
  if (!document.querySelector("#user-profile-modal")) {
    const modal = buildElement("div", "modal fade");
    modal.id = "user-profile-modal";
    modal.tabIndex = -1;
    modal.setAttribute("aria-labelledby", "userProfileModalLabel");
    modal.setAttribute("aria-hidden", "true");

    const dialog = buildElement("div", "modal-dialog modal-dialog-centered");
    const content = buildElement(
      "div",
      "modal-content bg-dark text-white border-secondary",
    );

    // Header modale
    const header = buildElement("div", "modal-header border-secondary");
    const title = buildElement("h5", "modal-title fw-bold", "Profilo utente");
    title.id = "userProfileModalLabel";

    const closeX = buildElement("button", "btn-close btn-close-white");
    closeX.type = "button";
    closeX.setAttribute("data-bs-dismiss", "modal");
    closeX.setAttribute("aria-label", "Chiudi");
    header.append(title, closeX);

    // Body modale
    const body = buildElement("div", "modal-body text-center py-4");
    const avatar = buildElement(
      "div",
      "rounded-circle bg-success text-dark fw-bold d-inline-flex align-items-center justify-content-center mb-3",
      initials,
    );
    avatar.style.width = "64px";
    avatar.style.height = "64px";
    avatar.style.fontSize = "1.4rem";

    const fullName = buildElement("h4", "fw-bold mb-1", user.name);
    const subtitle = buildElement(
      "p",
      "text-secondary small mb-0",
      user.email || "Account EpiTunes",
    );
    body.append(avatar, fullName, subtitle);

    // Footer modale
    const footer = buildElement("div", "modal-footer border-secondary");
    const closeBtn = buildElement(
      "button",
      "btn btn-outline-light btn-sm",
      "Chiudi",
    );
    closeBtn.type = "button";
    closeBtn.setAttribute("data-bs-dismiss", "modal");
    footer.appendChild(closeBtn);

    content.append(header, body, footer);
    dialog.appendChild(content);
    modal.appendChild(dialog);
    document.body.appendChild(modal);
  }

  const dividerLi = document.createElement("li");
  const hr = document.createElement("hr");
  hr.className = "dropdown-divider";
  dividerLi.appendChild(hr);

  //Francesca: pulsante Esci che chiude la sessione corrente e riporta alla pagina di login
  const logoutLi = document.createElement("li");
  const logoutBtn = buildElement("button", "dropdown-item text-danger", "Esci");
  logoutBtn.type = "button";
  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    window.location.replace("login.html");
  });
  logoutLi.appendChild(logoutBtn);

  menu.append(headerLi, dividerLi, logoutLi);
  dropdown.append(btn, menu);
  pill.replaceWith(dropdown);
};

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
 //Francesca: blocca il caricamento della pagina se non esiste un utente loggato
  const currentUser = getCurrentUser();
  if (!currentUser) {
    window.location.replace("login.html");
    return null;
  }

  //Francesca: inizializza il menu utente nella topbar con i dati dell'utente collegato
  renderUserPill(currentUser);
  renderSidebar(activePage);
  initTopbarNav();
  const player = new Player();
  player.mount();
  window.player = player;
  return player;
};
