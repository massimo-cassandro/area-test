/* eslint-disable no-console */
/* eslint-env node */

// extract yellow leds positions from figma SVG files

import { parse } from 'node-html-parser';
import * as fs from 'fs';
import { URL } from 'url';
import * as path from 'path';

// https://github.com/taoqf/node-html-parser

const current_dir = new URL('.', import.meta.url).pathname,
  chars_dir = path.resolve(current_dir, '../readme-files/chars'),
  dest_file = path.resolve(current_dir, '../src/components/chars-map.js'),
  chars_map = {},


  special_chars = {
    APOSTROPHE: '\'',
    DASH: '-',
    EURO: '€',
    SLASH: '/'
  };



for (const file of fs.readdirSync(chars_dir)) {

  const root = parse(fs.readFileSync(`${chars_dir}/${file}`));

  let char = file.replace(/\.svg$/, '').toUpperCase();
  char = special_chars[char]?? char;


  chars_map[char] = [];

  root.querySelectorAll('circle').forEach((el, idx) => {
    if((el.attributes.fill?.toUpperCase()?? null) === '#FFC000') {
      chars_map[char].push(idx);
    }
  });
}

const file_content = '// THIS FILE WAS GENERATED BY `./extract-char-map.mjs`. ANY MODIFICATION WILL BE OVERWRITTEN\n\n' +
  '// characters map\n' +
  '// The array of each letter contains the indexes of the LEDs that must be "turned on"\n' +
  '// the top-left LED index is 0\n\n' +
  '// eslint-disable-next-line quotes\n' +
  'export const charsMap = ' + JSON.stringify(chars_map) +';\n';

fs.writeFileSync(dest_file, file_content);

console.log('*** END ***');
