import { wheel_data } from './wheel-data-store';

(() => {

  const titolo1   = document.getElementById('titolo1'),
    titolo2       = document.getElementById('titolo2'),
    dim_titolo1   = document.getElementById('dim_titolo1'),
    dim_titolo2   = document.getElementById('dim_titolo2'),
    svg_titolo1   = wheel_data.svg_wrapper.querySelector('#ruota_fronte .titolo1'),
    svg_titolo2   = wheel_data.svg_wrapper.querySelector('#ruota_fronte .titolo2'),
    svg_finestra1 = wheel_data.svg_wrapper.querySelector('#ruota_fronte .finestra1'),
    svg_deco      = wheel_data.svg_wrapper.querySelector('#ruota_fronte .deco');

  wheel_data.update = function () {

    let num_finestre              = +document.querySelector('[name="finestre"]:checked').value, // solo versione due dischi
      mostra_deco                 = Boolean(+document.querySelector('[name="deco"]:checked').value),
      caratteri_titolo_outline    = Boolean(+document.querySelector('[name="caratteri_titolo"]:checked').value);

    svg_titolo1.textContent = titolo1.value;
    svg_titolo2.textContent = titolo2.value;


    let cssArray = [];
    if(caratteri_titolo_outline) {
      cssArray = ['fill: #fff', 'stroke:#000', 'stroke-width:1px'];
    } else {
      cssArray = ['fill: #000', 'stroke:none'];
    }
    svg_titolo1.style.cssText = cssArray.join(';') + '; font-size:' + dim_titolo1.value + 'px';
    svg_titolo2.style.cssText = cssArray.join(';') + '; font-size:' + dim_titolo2.value + 'px';


    //svg_titolo1.style.fontSize = dim_titolo1.value + 'px';
    //svg_titolo2.style.fontSize = dim_titolo2.value + 'px';

    svg_deco.toggleAttribute('hidden', mostra_deco);
    svg_finestra1.toggleAttribute('hidden', num_finestre === 1);
  };


  document.querySelectorAll('#settings input').forEach( item => {
    item.addEventListener('change', function () {
      wheel_data.update();
    });

    if(item.type === 'text') {
      item.addEventListener('keyup', function () {
        wheel_data.update();
      });
    }

    if(item.type === 'radio' || item.type === 'checkbox') {
      item.addEventListener('click', function () {
        wheel_data.update();
      });
    }

  });


  // document.querySelector('.btn-update').addEventListener('click', function () {
  //   wheel_data.update();
  // });


  wheel_data.update();

})();
