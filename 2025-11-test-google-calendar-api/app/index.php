<!DOCTYPE html>
<html lang="it">

<head>
  <meta charset="UTF-8">
  <title>Esempio Interazione Google Calendar CRUD</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
    }

    .card {
      border: 1px solid #ccc;
      padding: 15px;
      margin-bottom: 20px;
      border-radius: 5px;
    }

    .card h3 {
      margin-top: 0;
    }

    label {
      display: block;
      margin-top: 10px;
      font-weight: bold;
    }

    input[type="number"],
    input[type="text"] {
      width: 100%;
      padding: 8px;
      margin-top: 5px;
      box-sizing: border-box;
    }

    button {
      padding: 10px 15px;
      margin-top: 10px;
      cursor: pointer;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
    }

    .output {
      background-color: #f4f4f4;
      padding: 10px;
      border-radius: 4px;
      white-space: pre-wrap;
      word-wrap: break-word;
      min-height: 50px;
    }

    .error {
      color: red;
    }
  </style>
</head>

<body>
  <div class="container">
    <h1>Google Calendar API - Funzioni CRUD</h1>

    <?php include 'menu.php' ?>

    <div class="card">
      <h3>1. Estrai Eventi del Mese (POST / LIST)</h3>
      <form id="formListEvents">
        <label for="list_year">Anno:</label>
        <input type="number" id="list_year" name="year" value="<?php echo date('Y'); ?>" required>
        <label for="list_month">Mese (1-12):</label>
        <input type="number" id="list_month" name="month" value="<?php echo date('m'); ?>" min="1" max="12" required>
        <button type="submit">Esegui POST</button>
      </form>
      <label>Output:</label>
      <div id="outputList" class="output">In attesa...</div>
    </div>

    <hr>

    <div class="card">
      <h3>2. Modifica Evento (PATCH / UPDATE)</h3>
      <form id="formUpdateEvent">
        <label for="update_id">ID Evento da Modificare:</label>
        <input type="text" id="update_id" name="eventId" required value="id_evento_esempio">
        <label for="update_summary">Nuovo Titolo (Summary):</label>
        <input type="text" id="update_summary" name="summary" required value="Riunione Aggiornata">
        <label for="update_description">Nuova Descrizione:</label>
        <input type="text" id="update_description" name="description" value="Aggiornato dal form PHP">
        <button type="submit">Esegui PATCH</button>
      </form>
      <label>Output:</label>
      <div id="outputUpdate" class="output">In attesa...</div>
    </div>

    <hr>

    <div class="card">
      <h3>3. Cancella Evento (DELETE)</h3>
      <form id="formDeleteEvent">
        <label for="delete_id">ID Evento da Cancellare:</label>
        <input type="text" id="delete_id" name="eventId" required value="id_evento_da_cancellare">
        <button type="submit" style="background-color: #dc3545;">Esegui DELETE</button>
      </form>
      <label>Output:</label>
      <div id="outputDelete" class="output">In attesa...</div>
    </div>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const crudScriptUrl = 'calendar_api_crud.php';

      /**
       * Funzione generica per inviare richieste CRUD usando FormData.
       * Quando si usa FormData con un metodo diverso da POST, è necessario
       * convertirlo in URLSearchParams e impostare l'header 'Content-Type'
       * OPPURE convertirlo in una stringa URL-encoded, come facciamo qui.
       * Tuttavia, il modo più pulito che funziona con il tuo PHP è:
       * 1. Per POST: inviare FormData direttamente (il browser imposta il Content-Type).
       * 2. Per PATCH/DELETE: Convertire FormData in URLSearchParams per forzare
       * il Content-Type 'application/x-www-form-urlencoded' leggibile da parse_str() in PHP.
       * * **Nota:** Dato che il PHP legge i dati URL-encoded tramite parse_str(file_get_contents('php://input')),
       * dobbiamo continuare a inviare il corpo come URL-encoded per PATCH/DELETE.
       */
      function sendRequest(url, method, formData, outputElement) {
        outputElement.innerHTML = 'Caricamento...';
        outputElement.classList.remove('error');

        let requestBody;
        const headers = {};

        if (method === 'POST') {
          // Per POST, il browser gestisce automaticamente il Content-Type
          requestBody = formData;
          // NOTA: Non impostare 'Content-Type': 'multipart/form-data' qui.
          // Lascia che il browser lo imposti (o 'application/x-www-form-urlencoded' se non ci sono file).
        } else {
          // Per PATCH/DELETE, convertiamo FormData in URLSearchParams stringa
          // per inviarlo come application/x-www-form-urlencoded, che è ciò che PHP si aspetta (parse_str)
          requestBody = new URLSearchParams(formData).toString();
          headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }

        fetch(url, {
            method: method,
            headers: headers,
            body: requestBody,
          })
          .then(response => {
            // Gestione degli errori (identica alla versione precedente)
            if (!response.headers.get('content-type') || !response.headers.get('content-type').includes('application/json')) {
              throw response;
            }
            if (!response.ok && response.status !== 204) {
              throw response.json();
            }
            return response.status === 204 ? {
              success: true,
              message: 'Operazione completata (204 No Content)'
            } : response.json();
          })
          .then(data => {
            outputElement.innerHTML = JSON.stringify(data, null, 2);
          })
          .catch(error => {
            if (error instanceof Response) {
              error.text().then(text => {
                outputElement.innerHTML = `ERRORE HTTP ${error.status}:<br><pre>${text}</pre>`;
                outputElement.classList.add('error');
              });
            } else if (error instanceof Promise) {
              error.then(json => {
                outputElement.innerHTML = `ERRORE API: ${JSON.stringify(json, null, 2)}`;
                outputElement.classList.add('error');
              }).catch(() => {
                outputElement.innerHTML = 'Errore non analizzabile.';
                outputElement.classList.add('error');
              });
            } else {
              outputElement.innerHTML = `ERRORE: ${error.message}`;
              outputElement.classList.add('error');
            }
          });
      }

      // Event Listener per Estrazione Eventi (POST)
      document.getElementById('formListEvents').addEventListener('submit', function(e) {
        e.preventDefault();
        // Invia FormData direttamente per POST
        sendRequest(crudScriptUrl, 'POST', new FormData(this), document.getElementById('outputList'));
      });

      // Event Listener per Modifica Evento (PATCH)
      document.getElementById('formUpdateEvent').addEventListener('submit', function(e) {
        e.preventDefault();
        // Converte in URLSearchParams/stringa per PATCH/DELETE
        sendRequest(crudScriptUrl, 'PATCH', new FormData(this), document.getElementById('outputUpdate'));
      });

      // Event Listener per Cancellazione Evento (DELETE)
      document.getElementById('formDeleteEvent').addEventListener('submit', function(e) {
        e.preventDefault();
        // Converte in URLSearchParams/stringa per PATCH/DELETE
        sendRequest(crudScriptUrl, 'DELETE', new FormData(this), document.getElementById('outputDelete'));
      });
    });
  </script>
</body>

</html>
