import chart from './donut-chart.js';

(() => {
  'use strict';


  // grafici dinamici
  let grafici = [
      {
        containerID: 'donut-chart',
        start_at: 0,
        clockwise: false,  // antiorario
        animazione: false,
        debug: 1,
        fake_linecaps: true
      },
      {
        containerID: 'donut-chart-rotated',
        start_at: 90,
        clockwise: false,  // antiorario
        animazione: false,
        debug: 2,
        fake_linecaps: true
      },
      {
        containerID: 'donut-chart-rotated-clockwise',
        start_at: 90,
        clockwise: true,  // orario
        animazione: false,
        debug: 3,
        fake_linecaps: false
      },
      {
        containerID: 'donut-chart-animated',
        start_at: 90,
        clockwise: true,  // orario
        animazione: true,
        animazione_fps:60,
        debug: 4,
        fake_linecaps: true
      }
    ],

    // valori del grafico
    values = [
      1500,
      120,
      405
    ],
    colori = [
      '#c00',
      '#18a306',
      '#105ebc',
      'orange',
      'gold'
    ];


  grafici = grafici.map(item => {

    return Object.assign({}, item, {
      container: document.getElementById(item.containerID),
      values: values,
      colori: colori,
      stroke_width: 20,

      circle_radius: 50
    });
  });

  grafici.forEach(item => {

    item.container.closest('.chart-container').querySelector('h2').insertAdjacentHTML('afterbegin',
      `${item.debug}. `
    );
    chart(item);
  });


  // visualizzazione attributi `d` dei grafici
  document.querySelectorAll('.chart-container').forEach(item => {
    item.querySelectorAll('path').forEach(pathEl => {
      let d = pathEl.getAttribute('d'),
        color = pathEl.getAttribute('stroke');

      item.insertAdjacentHTML('beforeend',
        `<p class="dati-arco" style="color:${color}">
            <code>${d}</code>
            <a target="_blank" href="https://svg-path-visualizer.netlify.app/#${d}" title="Path Visualizer">check</a>
        </p>`
      );
    });

  });

  document.querySelector('.avvia-animazione').addEventListener('click', () => {
    chart(grafici[3]);
  }, false);

})();
