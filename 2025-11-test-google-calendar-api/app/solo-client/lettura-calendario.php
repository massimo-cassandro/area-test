<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Google Calendar Reader</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 20px;
      }

      #content {
        background-color: #f4f4f4;
        padding: 15px;
        border-radius: 5px;
        margin-top: 15px;
        white-space: pre-wrap;
      }

      button {
        padding: 10px 15px;
        font-size: 16px;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <h1>📅 Eventi Google Calendar Privato</h1>

    <?php include '../menu.php' ?>

    <p>Clicca sul pulsante per autorizzare l'accesso al tuo calendario e visualizzare i prossimi eventi.</p>

    <button id="authorize_button" style="visibility: hidden;">
      Autorizza l'Accesso
    </button>

    <hr>

    <h2>Prossimi Eventi:</h2>
    <pre id="content">In attesa dell'autorizzazione...</pre>

    <script async defer src="https://apis.google.com/js/api.js" onload="gapiLoaded()"></script>
    <script async defer src="https://accounts.google.com/gsi/client" onload="gisLoaded()"></script>

    <?php include '../credenziali.incl.php' ?>
    <script>
      const CLIENT_ID = '<?php echo $clientID ?>'; // Esempio: 123456789012-abcdef123456.apps.googleusercontent.com
      const API_KEY = '<?php echo $APIkey ?>'; // Ottenuta dalla sezione 'Credenziali' - è opzionale ma consigliata
      const CALENDAR_ID = '<?php echo $calendarID ?>';
    </script>

    <script src="lettura-calendario.js"></script>
  </body>
</html>
