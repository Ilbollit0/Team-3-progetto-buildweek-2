/* ============================================================
   login.js — gestione registrazione e accesso utenti
   ============================================================ */

//Francesca: se l'utente è già loggato in questa sessione, porta subito alla Home
if (sessionStorage.getItem(STORAGE_KEY_CURRENT_USER)) {
  window.location.replace("index.html");
}

//Francesca: riferimenti ai form e al box degli alert di errore
const loginForm = document.querySelector("#login-form");
const registerForm = document.querySelector("#register-form");
const authAlert = document.querySelector("#auth-alert");

//Francesca: mostra un messaggio di errore nel riquadro Bootstrap #auth-alert
const showAlert = (message) => {
  authAlert.textContent = message;
  authAlert.classList.remove("d-none");
};

//Francesca: nasconde l'alert quando si cambia scheda o si invia un nuovo form
const hideAlert = () => {
  authAlert.textContent = "";
  authAlert.classList.add("d-none");
};

document.querySelectorAll("#auth-tabs button").forEach((tabBtn) => {
  tabBtn.addEventListener("shown.bs.tab", hideAlert);
});

//Francesca: REGISTRAZIONE — salva nome, cognome, email e password in localStorage
registerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  hideAlert();

  const firstName = document.querySelector("#reg-first-name").value.trim();
  const lastName = document.querySelector("#reg-last-name").value.trim();
  const email = document.querySelector("#reg-email").value.trim().toLowerCase();
  const password = document.querySelector("#reg-password").value;

  if (!firstName || !lastName || !email || !password) {
    showAlert("Compila tutti i campi per registrarti.");
    return;
  }

  const users = readList(STORAGE_KEY_USERS);

  //Francesca: controlla se l'email è già presente tra gli utenti registrati
  const emailExists = users.some(
    (item) => item.email?.toLowerCase() === email,
  );
  if (emailExists) {
    showAlert("Questa email è già registrata. Vai su Accedi per entrare.");
    return;
  }

  //Francesca: crea il nuovo utente mantenendo anche "name" completo per la topbar di common.js
  const newUser = {
    id: crypto.randomUUID(),
    firstName,
    lastName,
    name: `${firstName} ${lastName}`,
    email,
    password,
  };

  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify([...users, newUser]));

  //Francesca: effettua subito l'accesso con il nuovo account e apre la Home
  sessionStorage.setItem(STORAGE_KEY_CURRENT_USER, newUser.id);
  window.location.replace("index.html");
});

//Francesca: ACCESSO — verifica che l'utente sia registrato e che la password corrisponda
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  hideAlert();

  const email = document.querySelector("#login-email").value.trim().toLowerCase();
  const password = document.querySelector("#login-password").value;

  const users = readList(STORAGE_KEY_USERS);

  //Francesca: cerca l'utente tramite email
  const foundUser = users.find((item) => item.email?.toLowerCase() === email);

  //Francesca: se non esiste nessun utente con quell'email, mostra errore e blocca l'accesso
  if (!foundUser) {
    showAlert("Utente non registrato. Crea un account nella scheda Registrati.");
    return;
  }

  //Francesca: se l'email esiste ma la password è sbagliata, mostra errore
  if (foundUser.password !== password) {
    showAlert("Password non valida. Riprova.");
    return;
  }

  //Francesca: credenziali corrette -> salva la sessione e porta alla Home
  sessionStorage.setItem(STORAGE_KEY_CURRENT_USER, foundUser.id);
  window.location.replace("index.html");
});