# La ruota dei...

Marzo 2019. Aggiornamwnto dipendenze Ott 2024

[Demo](https://massimo-cassandro.github.io/area-test/2019-03-la-ruota-dei/build/index.html)

## illustrazioni:

* <https://www.educolor.it>
* <http://www.cartonionline.com>
* <http://www.disegnidacolorareonline.com>
* <http://www.infanziaweb.it>
* <http://www.supercoloring.com>
* <http://www.coloratutto.it>
* <https://www.disegnidacoloraregratis.it>
* <http://www.coloring-book.info>
* <http://betterfor.me>
* <https://www.stampaecolora.com>
* <https://www.bettercoloring.com>


## Per aggiungere altre clipart:

Registrare nuove immagini SVG (meglio se il viewBox è quadrato) nella directory `/assets/cliparts/`,
quindi lanciare lo script `gulpfile.js` (consulta `package.json` per i moduli necessari)
per aggiornare il file dei simboli `cliparts.svg` e
la lista `cliparts-list.js`.

Successivamente è necessario ricompilare il file `la-ruota-dei.min.js` per acquisire le nuove clipart.

Il file `cliparts.sketch` contiene le clipart incluse nel progetto.

