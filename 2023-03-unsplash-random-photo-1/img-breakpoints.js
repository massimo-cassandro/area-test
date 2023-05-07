// image sizes (based on bootstrap 5 breakpoints)
/*
+------------+-------------+-----------+------------+------------+------------------+-------------------+
|    BS5     |  Page width | img width | img height | img height |    img height    |     img height    |
| breakpoint |             |           |   (16/9)   |    (4/3)   | (9/21, portrait) | (21/9, landscape) |
+------------+-------------+-----------+------------+------------+------------------+-------------------+
|     xxl    |    >=1400   |    1920   |    1080    |    1440    |                  |                   |
+------------+-------------+-----------+------------+------------+------------------+-------------------+
|     xl     | 1200 - 1399 |    1400   |     788    |    1050    |                  |                   |
+------------+-------------+-----------+------------+------------+------------------+-------------------+
|     lg     |  992 - 1199 |    1200   |     675    |     900    |                  |                   |
+------------+-------------+-----------+------------+------------+------------------+-------------------+
|     md     |  768 - 991  |    992    |     558    |     744    |                  |                   |
+------------+-------------+-----------+------------+------------+------------------+-------------------+
|     sm     |   576 -767  |    768    |     432    |     576    |                  |                   |
+------------+-------------+-----------+------------+------------+------------------+-------------------+
|     xs     |    < 576    |    576    |     324    |     432    |       1344       |        247        |
+------------+-------------+-----------+------------+------------+------------------+-------------------+
*/



export const breakpoints = [
  {
    name: 'xxl',
    mq: '(min-width: 1400px)',
    // mq: '(min-aspect-ratio: 16/9) and (min-width: 1400px)',
    w: 1920,
    h: 1080,
    dpr2: false
  },
  // {
  //   name: 'xxl',
  //   mq: '(max-aspect-ratio: 4/3) and (min-width: 1400px)',
  //   w: 1920,
  //   dpr2: false
  // },
  {
    name: 'xl',
    mq: '(min-width: 1200px) and (max-width: 1399px)',
    // mq: '(min-aspect-ratio: 16/9) and (min-width: 1200px) and (max-width: 1399px)',
    w: 1400,
    h: 788,
    dpr2: false
  },
  {
    name: 'lg',
    mq: '(min-width: 992px) and (max-width: 1199px)',
    // mq: '(min-aspect-ratio: 16/9) and (min-width: 992px) and (max-width: 1199px)',
    w: 1200,
    h: 675,
    dpr2: false
  },
  {
    name: 'md',
    mq: '(min-width: 768px) and (max-width: 991px)',
    // mq: '(min-aspect-ratio: 16/9) and (min-width: 768px) and (max-width: 991px)',
    w: 992,
    h: 558,
    dpr2: true
  },
  {
    name: 'sm',
    mq: '(min-width: 576px) and (max-width: 767px)',
    // mq: '(min-aspect-ratio: 16/9) and (min-width: 576px) and (max-width: 767px)',
    w: 768,
    h: 432,
    dpr2: true
  },
  // {
  //   name: 'xs',
  //   mq: '(orientation: portrait) and (aspect-ratio: 9/16) and (max-width: 575px)',
  //   h: 576,
  //   dpr2: true
  // },
  {
    name: 'xs',
    // mq: '(orientation: landscape) and (aspect-ratio: 16/9) and (max-width: 575px)',
    mq: '(max-width: 575px)',
    w: 576,
    h: 324,
    dpr2: true
  }
];
