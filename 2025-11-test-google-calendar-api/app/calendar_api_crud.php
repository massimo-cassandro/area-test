<?php
// calendar_api_crud.php

require_once __DIR__ . '/../vendor/autoload.php';

require 'credenziali.incl.php';

// --- CONFIGURAZIONE FISSA ---
define('CREDENTIALS_PATH', $credentials_path);
define('CALENDAR_ID', $calendarID);
define('CALENDAR_SCOPE', Google_Service_Calendar::CALENDAR);
// ----------------------------

// =========================================================================
// FUNZIONI DI SUPPORTO (initializeCalendarService, parseRequestData)
// Sono identiche alla versione precedente e omesse qui per brevità.
// ... (Mantieni le definizioni delle funzioni initializeCalendarService e parseRequestData
// ... come nello script precedente) ...

function initializeCalendarService() {
    $client = new Google_Client();
    $client->setApplicationName('Google Calendar API Endpoint');
    $client->setAuthConfig(CREDENTIALS_PATH);
    $client->setScopes([CALENDAR_SCOPE]);

    return (new Google_Service_Calendar($client))->events;
}

function parseRequestData($method) {
    if ($method === 'POST') {
        return $_POST;
    }

    $inputData = [];
    parse_str(file_get_contents('php://input'), $inputData);
    return $inputData;
}


// =========================================================================
// FUNZIONI CRUD SPECIFICHE (listEventsByMonth, updateCalendarEvent, deleteCalendarEvent)
// Sono identiche alla versione precedente e omesse qui per brevità.
// L'unica modifica è che l'header('Content-Type: application/json') è all'interno,
// garantendo che non sia inviato in caso di eccezione prima dell'header.
// ... (Mantieni le definizioni delle funzioni listEventsByMonth, updateCalendarEvent e deleteCalendarEvent
// ... come nello script precedente, includendo l'header('Content-Type: application/json') al loro interno) ...

function listEventsByMonth($eventsService, $data) {
    // ... logica di validazione e preparazione dei parametri ...
    $targetYear = $data['year'] ?? null;
    $targetMonth = $data['month'] ?? null;
    if (!$targetYear || !$targetMonth || !is_numeric($targetYear) || !is_numeric($targetMonth) || $targetMonth < 1 || $targetMonth > 12) {
        http_response_code(400);
        throw new Exception('Devi fornire "year" e "month" validi nel corpo della richiesta.');
    }
    // ... logica di estrazione eventi ...
    $startDate = new DateTime("$targetYear-$targetMonth-01T00:00:00", new DateTimeZone('UTC'));
    $nextMonth = clone $startDate;
    $nextMonth->modify('first day of next month');
    $timeMin = $startDate->format(DateTime::RFC3339);
    $timeMax = $nextMonth->format(DateTime::RFC3339);
    $optParams = array('orderBy' => 'startTime', 'singleEvents' => true, 'timeMin' => $timeMin, 'timeMax' => $timeMax);
    $events = $eventsService->listEvents(CALENDAR_ID, $optParams);
    $eventsArray = [];
    foreach ($events->getItems() as $event) {
        $start = $event->start->dateTime ?: $event->start->date;
        $end = $event->end->dateTime ?: $event->end->date;
        $remindersData = []; // ... logica promemoria ...
        $reminders = $event->getReminders();
        if ($reminders) {
            if ($reminders->getUseDefault() === false && $reminders->getOverrides()) {
                foreach ($reminders->getOverrides() as $reminder) {
                    $remindersData[] = ['method' => $reminder->getMethod(), 'minutes' => $reminder->getMinutes()];
                }
            } elseif ($reminders->getUseDefault() === true) {
                $remindersData = ['useDefault' => true];
            } else {
                $remindersData = ['useDefault' => false, 'overrides' => []];
            }
        }
        $eventsArray[] = ['id' => $event->getId(), 'summary' => $event->getSummary(), 'start' => $start, 'end' => $end, 'description' => $event->getDescription(), 'reminders' => $remindersData];
    }
    // Invocazione dell'header di successo
    header('Content-Type: application/json');
    echo json_encode($eventsArray, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}

function updateCalendarEvent($eventsService, $data) {
    $eventId = $data['eventId'] ?? null;
    if (!$eventId) { http_response_code(400); throw new Exception('È richiesto un "eventId" per la modifica.'); }
    // ... logica di update ...
    $event = $eventsService->get(CALENDAR_ID, $eventId);
    if (($data['summary'] ?? null) !== null) { $event->setSummary($data['summary']); }
    if (($data['description'] ?? null) !== null) { $event->setDescription($data['description']); }
    $updatedEvent = $eventsService->update(CALENDAR_ID, $eventId, $event);
    http_response_code(200);
    // Invocazione dell'header di successo
    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'message' => "Evento ID $eventId aggiornato.", 'updated_summary' => $updatedEvent->getSummary()], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}

function deleteCalendarEvent($eventsService, $data) {
    $eventId = $data['eventId'] ?? null;
    if (!$eventId) { http_response_code(400); throw new Exception('È richiesto un "eventId" per la cancellazione.'); }
    $eventsService->delete(CALENDAR_ID, $eventId);
    http_response_code(204);
    // Invocazione dell'header di successo
    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'message' => "Evento ID $eventId cancellato."]);
}

// =========================================================================
// PUNTO DI INGRESSO PRINCIPALE (con gestione errori più snella)
// =========================================================================

try {
    $method = $_SERVER['REQUEST_METHOD'];
    $eventsService = initializeCalendarService();
    $inputData = parseRequestData($method);

    switch ($method) {
        case 'POST':
            listEventsByMonth($eventsService, $inputData);
            break;
        // ... (gli altri case DELETE, PUT, PATCH rimangono invariati) ...
        case 'DELETE':
            deleteCalendarEvent($eventsService, $inputData);
            break;
        case 'PUT':
        case 'PATCH':
            updateCalendarEvent($eventsService, $inputData);
            break;

        default:
            http_response_code(405);
            throw new Exception('Method not allowed. Metodi supportati: POST, PUT, PATCH, DELETE.');
            break;
    }

} catch (Google_Service_Exception $e) {
    // Gestione Errori API (mantiene un formato minimo leggibile)
    $errorCode = http_response_code(500);
    echo "<h1>Errore API Google ($errorCode)</h1><p>" . htmlspecialchars($e->getMessage()) . "</p><p>Controlla le credenziali e i permessi.</p>";
} catch (Exception $e) {
    // Gestione Errori Generali/Validazione (mantiene un formato minimo leggibile)
    $errorCode = http_response_code() ?: 500; // Usa il codice HTTP impostato, altrimenti 500
    echo "<h1>Errore Generico ($errorCode)</h1><p>" . htmlspecialchars($e->getMessage()) . "</p>";
}
