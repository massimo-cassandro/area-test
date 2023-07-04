<?php
// your API Access Key
$UNSPLASH_ACCESS_KEY='xxxxxxx';

// comma separated list of collections ids
$COLLECTIONS_IDS = 'yyyy';

$url = 'https://api.unsplash.com/photos/random' .
  "?collections={$COLLECTIONS_IDS}" .
  // "&orientation=landscape". // landscape, portrait, squarish
  "&client_id={$UNSPLASH_ACCESS_KEY}" .
  '&count=8';

$json = file_get_contents($url);

header("Content-Type: application/json; charset=utf-8");
echo $json;
