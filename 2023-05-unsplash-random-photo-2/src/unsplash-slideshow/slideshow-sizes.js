import {grid_breakpoints, container_max_widths, xs_width, slideshow_heights} from '../cfg/layout-variables.mjs';

const breakpoints_labels = Object.keys(grid_breakpoints);

function createMq (brk) {
  const nextBrk = breakpoints_labels[breakpoints_labels.indexOf(brk) + 1]?? null;
  return [
    `(min-width: ${grid_breakpoints[brk]}px)`,
    ...(nextBrk? [`(max-width: ${grid_breakpoints[nextBrk] - 1}px)`] : [])
  ].join(' and ');
}

let slideshow_sizes= [
  { name: 'xxl', 'dpr2': false },
  { name: 'xl',  'dpr2': false },
  { name: 'lg',  'dpr2': false },
  { name: 'md',  'dpr2': true },
  { name: 'sm',  'dpr2': true },
  { name: 'xs',  'dpr2': true }
];

slideshow_sizes = slideshow_sizes.map( i => {
  return {
    ...i,
    w: i.name === 'xs'? xs_width : container_max_widths[i.name],
    h: slideshow_heights[i.name],
    mq: i.name === 'xs'? null : createMq(i.name)
  };
});


// { name  : 'xxl', w: 1320, h: 350, mq: '(min-width: 1400px)', 'dpr2': false },
// ...
// { name  : 'xs',  w: 546,  h: 360, mq: null, 'dpr2': true }

// console.log(slideshow_sizes);

export {slideshow_sizes};

