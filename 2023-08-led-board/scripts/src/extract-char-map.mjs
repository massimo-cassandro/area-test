/* eslint-disable no-console */
/* eslint-env node */

// extract yellow leds positions from figma SVG files

import { parse } from 'node-html-parser';
import * as fs from 'fs';
import { URL } from 'url';
import * as path from 'path';

// https://github.com/taoqf/node-html-parser

const current_dir = new URL('.', import.meta.url).pathname,
  chars_dir = path.resolve(current_dir, '../../readme-files/chars'),
  chars_map = {},


  special_chars = {
    APOS: '\'',
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

export {chars_map};
