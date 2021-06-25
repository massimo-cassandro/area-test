export default function (opts) {

  // parametri
  const default_options = {
    container: null,
    values: [], // lista dei valori da rappresentare
    colori: [], // lista di colori: uno per valore da rappresentare
    start_at: 0,
    clockwise: false,
    animazione: false,
    animazione_fps: 60,

    // se true alla fine di ogni arco viene aggiunto un cerchio a simulare
    fake_linecaps: false,

    stroke_width: 10,     // spessore traccia
    circle_radius: 50,

    debug: false  // false oppure stringa (o numero) per individuare il grafico
  };

  let options = Object.assign({}, default_options, opts);

  const circle_center = {
    x: options.circle_radius,
    y: options.circle_radius
  };

  // functions
  const truncate_decimal = (number, decimals = 4) => {
      return +parseFloat((number).toFixed(decimals));
    },

    // transform polar coordinates (center + radius) to cartesian ones (x, y)
    // riduzione: coefficinet di riduzione dei valori delle coordinate
    // da moltiplicare per lo spessore della traccia
    polarToCartesian = (degrees_angle) => {
      let radians = degrees_angle * Math.PI / 180.0;
      return {
        x: truncate_decimal(Math.abs(circle_center.x + options.circle_radius * Math.cos(radians))),
        y: truncate_decimal(Math.abs(circle_center.y - options.circle_radius * Math.sin(radians)))
      };
    },



    // restituisce l'attributo `d` dell'arco di cerchio descritto dall'angolo
    // corrispondente all apercentuale data e le percentuali del punto finale
    calcola_attr_d = (parametri) => {

      let d = [
        `M${parametri.coord_inizio.x},${parametri.coord_inizio.y}`,
        `A${options.circle_radius},${options.circle_radius}`,
        0, //xAxisRotation,
        (parametri.angolo_arco <= 180 ? 0 : 1), // largeArcFlag
        options.clockwise && parametri.angolo_arco < 360? 1 : 0, // sweepFlag
        `${parametri.coord_fine.x},${parametri.coord_fine.y}`
      ].join(' ');


      return d;
    },

    // restituisce il tag path dell'arco di cerchio descritto dall'angolo
    // corrispondente all apercentuale data
    generaPathTagArco = (parametri_arco, color = 'lime', idx = null) => {

      // se idx è presente viene usato per aggiungere una classe aggiuntiva

      let d = calcola_attr_d(parametri_arco),
        extra_class = idx !== null? `item-${idx}` : '';
      return {
        chart_segment: `<path class="chart-arc ${extra_class}" d="${d}" stroke-width="${options.stroke_width}" stroke="${color}" />`,
        chart_linecap: `<circle class="chart-arc-linecap ${extra_class}" fill="${color}" cx="${parametri_arco.coord_fine.x}" cy="${parametri_arco.coord_fine.y}" r="${options.stroke_width/2}"/>`
      };

    }; // end generaPathTagArco


  options.container.innerHTML = `
    <svg class="donut-chart" viewBox="${-options.stroke_width/2} ${-options.stroke_width/2} ${options.circle_radius * 2 + options.stroke_width} ${options.circle_radius * 2 + options.stroke_width}" xmlns="http://www.w3.org/2000/svg">
      <circle class="base-circle" stroke-width="${options.stroke_width}" cx="${options.circle_radius}" cy="${options.circle_radius}" r="${options.circle_radius}" />
      <g class="chart"></g>
      ${options.animazione && options.fake_linecaps? '<g class="chart-linecaps"></g>' : ''}

      <!-- riferimenti -->
      <circle class="ref-circle" stroke-width="1" cx="${options.circle_radius}" cy="${options.circle_radius}" r="${options.circle_radius}"/>
      <line class="chart-ref-lines" x1="${options.circle_radius}" y1="${- options.stroke_width}" x2="${options.circle_radius}" y2="${options.circle_radius * 2 + options.stroke_width}" />
      <line class="chart-ref-lines" x1="${- options.stroke_width}" y1="${options.circle_radius}" x2="${options.circle_radius * 2 + options.stroke_width}" y2="${options.circle_radius}" />
      <text x="${options.circle_radius * 5/3}" y="${options.circle_radius - 2}" class="chart-ref-text">0°</text>
      <text x="${options.circle_radius + 2}" y="${options.circle_radius * 1/3}" class="chart-ref-text">90°</text>
      <text x="${options.circle_radius * 1/3}" y="${options.circle_radius -2}" class="chart-ref-text">180°</text>
      <text x="${options.circle_radius + 2}" y="${options.circle_radius * 5/3}" class="chart-ref-text">270°</text>
      <image href="imgs/${options.clockwise? 'clockwise' : 'counterclockwise'}.svg"
        height="20" width="20"
        x="${(options.circle_radius * 2) - 20 + (options.stroke_width/2)}" y="${-(options.stroke_width/2 - 5)}"
      />
    </svg>
  `;

  let chart_container = options.container.querySelector('svg > .chart');

  const esegui_animazione =  (archi) => {
    let idx = 0,
      linecaps_container = options.container.querySelector('svg > .chart-linecaps');

    function animazione_arco() {

      let animationRequest,
        parametri_arco=archi[idx],
        arco, d, arco_path, arco_linecap,
        this_perc = 0,
        start_timestamp = Date.now(),
        fine_animazione = false,
        elapsed, now,
        fps = options.animazione_fps,
        fpsInterval = 1000/fps;


      const step = () => {
        now = Date.now();
        elapsed = now - start_timestamp;

        if((this_perc >= parametri_arco.perc) ) {
          this_perc = parametri_arco.perc;
          fine_animazione = true;
        }

        // request another frame
        animationRequest = window.requestAnimationFrame(step);

        // if enough time has elapsed, draw the next frame
        if (elapsed > fpsInterval) {

          // Get ready for next frame by setting start_timestamp=now, but...
          // Also, adjust for fpsInterval not being multiple of 16.67
          start_timestamp = now - (elapsed % fpsInterval);

          if( this_perc === 0 ) {
            arco = generaPathTagArco(
              calcolaParametri(0, parametri_arco.angolo_inizio),
              options.colori[idx],
              idx
            );
            chart_container.insertAdjacentHTML('afterbegin', arco.chart_segment );
            arco_path = chart_container.querySelector(`.chart-arc.item-${idx}`);
            if(options.fake_linecaps) {
              chart_container.insertAdjacentHTML(
                // idx === archi.length - 1? 'beforeend' : 'afterbegin',
                'afterbegin',
                arco.chart_linecap
              );
              arco_linecap = chart_container.querySelector(`.chart-arc-linecap.item-${idx}`);
            }

          } else {
            arco = calcolaParametri(this_perc, parametri_arco.angolo_inizio);
            d = calcola_attr_d(arco);
            arco_path.setAttribute('d', d);

            if(options.fake_linecaps) {
              arco_linecap.setAttribute('cx', arco.coord_fine.x);
              arco_linecap.setAttribute('cy', arco.coord_fine.y);

              // alla fine dell'animazione, il falso-linecap viene spostato
              // in modo che risuti sopra le linee
              if(fine_animazione) {
                linecaps_container.insertAdjacentElement(
                  'afterbegin', // il primo deve rimanere sopra gli altri
                  arco_linecap
                );
              }
            }
          }

          if(fine_animazione) {
            window.cancelAnimationFrame(animationRequest);
            idx++;
            if(idx < archi.length) {
              animazione_arco();
            }
          } else {
            this_perc++;
          }
        }

      };// end step

      step();
    } // end animazione_arco

    animazione_arco();

  }; // end esegui_animazione


  // ************************************************
  // CALCOLO PARAMETRI e avvio applicazione

  function calcolaParametri(perc, angolo_inizio) {
    // NB: gli unici dati necessari al disegno dell'arco sono
    // angolo_arcomì, coord_inizio e coord_fine
    // gli altri sono inseriti  scopo di debug

    // idx è l'indice dell'arco


    let parametri = {perc: perc};

    // angolo corrispondente alla percentuale indicata
    parametri.angolo_arco = 360/100 * parametri.perc,
    parametri.angolo_inizio = angolo_inizio;
    parametri.angolo_fine = options.clockwise? angolo_inizio - parametri.angolo_arco : angolo_inizio + parametri.angolo_arco;


    // riadattamento dei valori in modo che non superino 360°
    // (non realmente necessario)
    parametri.angolo_inizio_arco = parametri.angolo_inizio;
    parametri.angolo_fine_arco = parametri.angolo_fine;

    parametri.angolo_inizio_arco = parametri.angolo_inizio_arco >= 360? Math.abs(360 - parametri.angolo_inizio_arco) : parametri.angolo_inizio_arco;
    parametri.angolo_fine_arco = parametri.angolo_fine_arco >= 360? Math.abs(360 - parametri.angolo_fine_arco) : parametri.angolo_fine_arco;

    if(perc === 100) {
      parametri.angolo_inizio_arco = 0;
      parametri.angolo_fine_arco = 359.000001;

    } else if(perc === 0) {
      parametri.angolo_inizio_arco = parametri.angolo_inizio;
      parametri.angolo_fine_arco = parametri.angolo_inizio;
    }




    // coordinate inizio e fine
    parametri.coord_inizio = polarToCartesian(parametri.angolo_inizio_arco);
    parametri.coord_fine = polarToCartesian(parametri.angolo_fine_arco);

    return parametri;
  }

  // angolo di partenza del grafico (viene aggiornato ad ogni ciclo)
  let angolo_inizio = options.start_at,

    // conversione dei valori in percentuale
    // calcolo angolo inizio e fine di ogni arco
    totale = options.values.reduce((a,b) => a + b, 0),

    archi = options.values.map( (item, idx)  => {

      let parametri_arco = calcolaParametri(item / totale * 100, angolo_inizio, idx);
      angolo_inizio = parametri_arco.angolo_fine_arco;

      return parametri_arco;

    }).filter(item => item.perc > 0);

  if(options.animazione) {
    esegui_animazione(archi);


  } else {

    archi.forEach( (parametri_arco, idx, array) => { // non funziona con asyn

      let arco = generaPathTagArco(parametri_arco, options.colori[idx]);
      chart_container.insertAdjacentHTML('afterbegin', arco.chart_segment );
      if(options.fake_linecaps) {
        chart_container.insertAdjacentHTML(idx === array.length - 1? 'beforeend' : 'afterbegin', arco.chart_linecap );
      }
    });
  }


  /* eslint-disable */
  if(options.debug) {
    console.groupCollapsed(`Grafico ${options.debug}`);
    console.table({
      'start_at': options.start_at
    });
    archi.forEach((item,idx) => {
      console.log(`%c Arco ${idx+1}`, `color: ${options.colori[idx]};`);
      console.table(item);
    });
    console.groupEnd();
  }
 /* eslint-enable */


}
