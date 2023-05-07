(() => {
  'use strict';

  /*
    punteggio     : punteggio totale raggiunto,
    x_500         : coordinata X inizio immagine 500 (pari alla metà della differenza tra larghezza svg esterno e img 500)
    w_500         : larghezza in px dell'immagine della 500
    obiettivi     : json totale punti per obiettivi  ({1: xx, 2...})
  */

  const svg = document.querySelector('.wrapper-500 > svg'),
    dati_animazione_dataset = document.querySelector('.wrapper-500').dataset;

  let dati_animazione = {},
    wrapper_punteggio = document.getElementById('punteggio'),
    innerMask = document.querySelector('#innerMask rect'),
    testo_punteggio = wrapper_punteggio.querySelector('.punti');


  // console.log('dati_animazione (pre casting)', dati_animazione_dataset); // eslint-disable-line
  // casting
  for(let i in dati_animazione_dataset) {
    dati_animazione[i] = +dati_animazione_dataset[i];
  }
  console.log('dati_animazione', dati_animazione); // eslint-disable-line

  let currentX,
    maskWidth,
    punteggio_corrente,
    incremento;

  function animazione500() {

    if (punteggio_corrente < dati_animazione.punteggio) {

      punteggio_corrente++;

      testo_punteggio.innerHTML = punteggio_corrente;

      currentX += incremento;

      if(currentX > dati_animazione.w_500 + dati_animazione.x_500) {
        currentX = dati_animazione.w_500 + dati_animazione.x_500;
      }

      wrapper_punteggio.setAttribute('transform', 'translate(' + currentX + ' 0)');

      // clipPath
      maskWidth += incremento;
      innerMask.setAttribute('width', maskWidth);

      //assegnazioni classi completamento obiettivo
      if(punteggio_corrente >= dati_animazione.obiettivo3) {
        svg.classList.add('ob3-done');

      } else if(punteggio_corrente >= dati_animazione.obiettivo2) {
        svg.classList.add('ob2-done');

      } else if(punteggio_corrente >= dati_animazione.obiettivo1) {
        svg.classList.add('ob1-done');
      }


      window.requestAnimationFrame(animazione500);
    } else {
      svg.classList.add('animation-done');
    }

  }

  document.querySelector('.btn-play').addEventListener('click', function() {
    currentX = dati_animazione.x_500;
    maskWidth = 0;
    punteggio_corrente = 0;
    incremento = dati_animazione.w_500 / dati_animazione.obiettivo3; // incremento px per ogni punto

    console.log('incremento', incremento); // eslint-disable-line
    console.log('currentX', currentX); // eslint-disable-line

    svg.classList.remove('ob1-done', 'ob2-done', 'ob3-done', 'animation-done');

    window.requestAnimationFrame(animazione500);
  }, false);


})();
