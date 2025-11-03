// ===================================================================================
// ⚠️ SOSTITUISCI QUESTI VALORI CON LE TUE CREDENZIALI ⚠️
// ===================================================================================
const CLIENT_ID = '386447409711-3q4787a0uap6sfe0bmbo9svjg6r03rhm.apps.googleusercontent.com'; // Esempio: 123456789012-abcdef123456.apps.googleusercontent.com
const API_KEY = 'AIzaSyAlx09eD_uU286M6S023kwT-eBds2fP-q8'; // Ottenuta dalla sezione 'Credenziali' - è opzionale ma consigliata
const CALENDAR_ID = 'a864dcce71223070c9e8cd116eb45272b48ff3b46965905b739e16a16be43d58@group.calendar.google.com';
// ===================================================================================

const CALENDAR_DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
// Ambiti per Calendar (solo lettura) E Tasks (solo lettura)
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/tasks.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

// Elementi DOM
const authorizeButton = document.getElementById('authorize_button');
const contentElement = document.getElementById('content');

/**
 * Funzione di callback chiamata dopo il caricamento di api.js.
 */
function gapiLoaded() {
  gapi.load('client', initializeGapiClient);
}

/**
 * Inizializza il client gapi e carica entrambe le API (Calendar e Tasks).
 */
async function initializeGapiClient() {
  try {
    await gapi.client.init({
      apiKey: API_KEY, // Può essere omessa se non usi restrizioni API_KEY
      discoveryDocs: [ CALENDAR_DISCOVERY_DOC ],
    });

    // 🚨 SOLUZIONE PER L'ERRORE 'UNDEFINED': Caricamento esplicito dell'API Tasks
    await gapi.client.load('tasks', 'v1');

    gapiInited = true;
    maybeEnableButton();
  } catch (error) {
    // Log dettagliato dell'errore nella console per debug
    console.error("Errore di inizializzazione GAPI:", error);
    contentElement.innerText = `Errore di inizializzazione gapi: Controlla CLIENT_ID e Origini JS Autorizzate nella console cloud. Dettagli: ${error.details || error.message || 'Errore sconosciuto. Vedi console.'}`;
  }
}

/**
 * Funzione di callback chiamata dopo il caricamento di gsi/client.
 */
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '',
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
    contentElement.innerText = "Librerie caricate. Clicca su 'Autorizza l'Accesso'.";
  }
}

/**
 * Gestisce il clic sul pulsante di autorizzazione/caricamento.
 */
function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      contentElement.innerText = `Errore di autorizzazione: ${resp.error}. Riprova.`;
      return;
    }
    // Il token di accesso è stato acquisito o aggiornato
    authorizeButton.innerText = 'Ricarica Dati';
    await listAllData();
  };

  if (gapi.client.getToken() === null) {
    // Richiede il consenso per entrambi gli ambiti
    tokenClient.requestAccessToken({ prompt: 'consent' });
  } else {
    listAllData();
  }
}

/**
 * Chiama l'API Google Tasks per recuperare le attività non completate.
 */
async function listTasks() {
  let allTasks = [];
  try {
    // Recupera tutte le liste di attività
    const taskListsResponse = await gapi.client.tasks.tasklists.list();
    const taskLists = taskListsResponse.result.items || [];

    // Per ogni lista, recupera le attività non completate
    for (const list of taskLists) {
      const tasksResponse = await gapi.client.tasks.tasks.list({
        'tasklist': list.id,
        'showCompleted': false,
        'showHidden': true,
        'maxResults': 100,
      });
      const tasks = tasksResponse.result.items || [];

      tasks.forEach(task => {
        if (task.title && task.status !== 'completed') {
          allTasks.push({
            type: 'Attività',
            summary: task.title,
            listTitle: list.title,
            sortKey: task.due || task.updated || new Date(0).toISOString(), // Ordina per scadenza o aggiornamento
            displayDate: task.due ? `Scadenza: ${new Date(task.due).toLocaleDateString()}` : 'Nessuna scadenza',
          });
        }
      });
    }
  } catch (err) {
    console.error("Errore nel recupero delle attività (Tasks API):", err);
  }
  return allTasks;
}

/**
 * Chiama l'API Google Calendar per recuperare i prossimi eventi.
 */
async function listEvents() {
  let events = [];
  try {
    const now = (new Date()).toISOString();
    const calendarResponse = await gapi.client.calendar.events.list({
      'calendarId': CALENDAR_ID,
      'timeMin': now,
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'orderBy': 'startTime',
    });

    events = (calendarResponse.result.items || []).map(event => ({
      type: 'Evento',
      summary: event.summary,
      sortKey: event.start.dateTime || event.start.date,
      start: event.start.dateTime || event.start.date,
      location: event.location,
    }));
  } catch (err) {
    console.error("Errore nel recupero degli eventi (Calendar API):", err);
  }
  return events;
}

/**
 * Recupera e combina Eventi e Attività.
 */
async function listAllData() {
  contentElement.innerText = 'Caricamento dati in corso...';

  // Esegui le chiamate API in parallelo
  const [ events, tasks ] = await Promise.all([
    listEvents(),
    listTasks()
  ]);

  // Combina i dati e li ordina per data/ora
  const combinedData = [ ...events, ...tasks ];

  if (combinedData.length === 0) {
    contentElement.innerText = `Nessun evento o attività imminente trovato.`;
    return;
  }

  // Ordina i dati combinati
  combinedData.sort((a, b) => {
    const aDate = a.sortKey ? new Date(a.sortKey) : new Date(0);
    const bDate = b.sortKey ? new Date(b.sortKey) : new Date(0);
    return aDate - bDate;
  });

  // Formatta l'Output
  const output = combinedData.map(item => {
    if (item.type === 'Evento') {
      const startStr = item.start ? new Date(item.start).toLocaleString() : 'Data intera';
      return `[📅 EVENTO] ${startStr}\nOggetto: ${item.summary}\nLuogo: ${item.location || 'N/D'}\n`;
    } else if (item.type === 'Attività') {
      return `[✅ ATTIVITÀ] ${item.displayDate}\nOggetto: ${item.summary}\nLista: ${item.listTitle}\n`;
    }
  }).join('\n---\n');

  contentElement.innerText = `Dati Calendario (${CALENDAR_ID}) e Attività recuperati:\n\n${output}`;
}
