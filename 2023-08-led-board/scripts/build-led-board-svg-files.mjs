/* eslint-disable no-console */
/* eslint-env node */

// generate the led svg file

// https://github.com/taoqf/node-html-parser

import * as fs from 'fs';
import { URL } from 'url';
import * as path from 'path';
import {chars_map} from './src/extract-char-map.mjs';

// https://github.com/taoqf/node-html-parser

const current_dir = new URL('.', import.meta.url).pathname,
  dest_file = path.resolve(current_dir, '../src/components/led-chars.svg');

function LedLights(char) {
  let gap  = 2, // space between circles
    radius = 2, // circles radius
    cy     = gap/2 + radius, // initial value
    idx = 0
  ;

  const items = [],
    charMap = chars_map[char]?? [];

  for(let row = 0; row < 7; row++) {
    let cx     = gap/2 + radius; // inital value
    for (let col = 0; col < 5; col++) {
      items.push(`<circle r="${radius}" cx="${cx}" cy="${cy}"${charMap.indexOf(idx) !== -1? ' fill="var(--led-on)"' : ''}/>`);
      cx += gap + radius * 2;
      idx++;
    }
    cy += gap + radius * 2;
  }
  return items.join('');
}


const symbols = [];

for (const char in {space: [], ...chars_map}) {
  symbols.push(
    `<symbol id="${char}" viewBox="0 0 30 42">${LedLights(char)}</symbol>`
  );
}

const svg = '<svg xmlns="http://www.w3.org/2000/svg">' +
  symbols.join('') +
  '</svg>';

// console.log(svg);

fs.writeFileSync(dest_file, svg);

console.log('*** END ***');
