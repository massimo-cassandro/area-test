// ===================================================================================
// ⚠️ SOSTITUISCI QUESTI VALORI CON LE TUE CREDENZIALI ⚠️
// ===================================================================================
// const CLIENT_ID = '386447409711-3q4787a0uap6sfe0bmbo9svjg6r03rhm.apps.googleusercontent.com'; // Esempio: 123456789012-abcdef123456.apps.googleusercontent.com
// const API_KEY = 'AIzaSyAlx09eD_uU286M6S023kwT-eBds2fP-q8'; // Ottenuta dalla sezione 'Credenziali' - è opzionale ma consigliata
// const CALENDAR_ID = 'a864dcce71223070c9e8cd116eb45272b48ff3b46965905b739e16a16be43d58@group.calendar.google.com';
// // ===================================================================================


const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

// Elementi DOM
const authorizeButton = document.getElementById('authorize_button');
const contentElement = document.getElementById('content');

/**
 * Funzione di callback chiamata dopo il caricamento di api.js.
 * Carica la libreria client di Google (gapi).
 */
function gapiLoaded() {
  gapi.load('client', initializeGapiClient);
}

/**
 * Inizializza il client gapi con le credenziali e la discovery doc.
 */
async function initializeGapiClient() {
  try {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [ DISCOVERY_DOC ],
    });
    gapiInited = true;
    maybeEnableButton();
  } catch (error) {
    contentElement.innerText = `Errore di inizializzazione gapi: ${error.details || error.message}`;
  }
}

/**
 * Funzione di callback chiamata dopo il caricamento di gsi/client.
 * Inizializza il client di autenticazione GIS (Google Identity Services).
 */
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // La callback viene definita al momento della richiesta del token
  });
  gisInited = true;
  maybeEnableButton();
}

/**
 * Abilita il pulsante di autorizzazione quando entrambe le librerie sono caricate.
 */
function maybeEnableButton() {
  if (gapiInited && gisInited) {
    authorizeButton.style.visibility = 'visible';
    authorizeButton.onclick = handleAuthClick;
  }
}

/**
 * Gestisce il clic sul pulsante di autorizzazione/caricamento.
 * Richiede il token di accesso o carica gli eventi se già autorizzato.
 */
function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      contentElement.innerText = `Errore di autorizzazione: ${resp.error}`;
      return;
    }
    // Token di accesso acquisito. Aggiorna l'interfaccia.
    authorizeButton.innerText = 'Carica Nuovi Eventi';
    await listUpcomingEvents();
  };

  if (gapi.client.getToken() === null) {
    // Richiedi il token se non è presente (apre il popup di Google)
    tokenClient.requestAccessToken({ prompt: 'consent' });
  } else {
    // Se il token è presente, ricarica gli eventi
    listUpcomingEvents();
  }
}

/**
 * Chiama l'API Google Calendar per recuperare i prossimi eventi.
 */
async function listUpcomingEvents() {
  contentElement.innerText = 'Caricamento eventi...';
  try {
    const now = (new Date()).toISOString();

    const response = await gapi.client.calendar.events.list({
      'calendarId': CALENDAR_ID,
      'timeMin': now,
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'orderBy': 'startTime',
    });

    const events = response.result.items;
    if (!events || events.length === 0) {
      contentElement.innerText = `Nessun evento in programma trovato per il calendario con ID: ${CALENDAR_ID}.`;
      return;
    }

    // Formatta e visualizza gli eventi
    const output = events.map((event) => {
      const start = event.start.dateTime ? new Date(event.start.dateTime).toLocaleString() : new Date(event.start.date).toLocaleDateString();
      return `Data/Ora: ${start}\nEvento: ${event.summary}\nLuogo: ${event.location || 'N/D'}\n`;
    }).join('---\n');

    contentElement.innerText = `Eventi per il calendario: ${CALENDAR_ID}\n\n${output}`;

  } catch (err) {
    // Gestione degli errori API (es. 401: Non autorizzato, 404: Calendario non trovato)
    const errorMessage = err.result?.error?.message || err.message;

    if (err.status === 401) {
      contentElement.innerText = `Errore di autorizzazione (401): Devi riautorizzare l'accesso.`;
      authorizeButton.innerText = 'Riautorizza Accesso';
    } else if (err.status === 404) {
      contentElement.innerText = `Errore 404: Calendario con ID "${CALENDAR_ID}" non trovato. Verifica l'ID e i permessi.`;
    } else {
      contentElement.innerText = `Errore nella lettura del calendario: ${errorMessage}`;
    }
  }
}
