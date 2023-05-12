import * as fs from 'fs';
import * as path from 'path';

import * as url from 'url';

import {grid_breakpoints, container_max_widths, slideshow_heights} from '../src/cfg/layout-variables.mjs';


// const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// https://getbootstrap.com/docs/5.3/layout/containers

const grid_variables_file = path.resolve(__dirname, '../src/scss/_layout-variables.scss');

fs.writeFileSync(grid_variables_file,
  '/*\n'+
  '   FILE GENERATED FROM `src/cfg/layout-variables.mjs` AND `scripts/variables-to-scss.mjs`\n' +
  '   DON\'T EDIT\n' +
  '*/\n\n' +

  '$grid-breakpoints: (\n' +
    Object.keys(grid_breakpoints).map(brk => `  ${brk}: ${grid_breakpoints[brk]}${grid_breakpoints[brk] > 0? 'px' : ''}`).join(',\n') +
  '\n);\n\n' +

  '$container-max-widths: (\n' +
    Object.keys(container_max_widths).map(brk => `  ${brk}: ${container_max_widths[brk]}px`).join(',\n') +
  '\n);\n\n'+

  '$slideshow-heights: (\n' +
    Object.keys(slideshow_heights).reverse().map(brk => `  ${brk}: ${slideshow_heights[brk]}px`).join(',\n') +
  '\n);\n'
);
