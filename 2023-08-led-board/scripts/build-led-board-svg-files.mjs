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
  dest_svg_file = path.resolve(current_dir, '../src/components/led-chars.svg'),
  chars_list_file = path.resolve(current_dir, '../src/components/chars_list.js');

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

fs.writeFileSync(dest_svg_file, svg);

// char list (for use in `led-char-ele,ent.jsx`)
const chars_list = Object.keys(chars_map);
chars_list.sort();

// space
chars_list.unshift(null);

fs.writeFileSync(chars_list_file,
  '// GENERATED FILE - DON\'T EDIT\n\n' +
  '// eslint-disable-next-line quotes\n' +
  'export const chars_list = ' + JSON.stringify(chars_list) + ';\n'
);

console.log('*** END ***');
