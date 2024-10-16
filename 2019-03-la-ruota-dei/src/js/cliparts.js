import { wheel_data } from './wheel-data-store';
import '../grabbable2/grabbable';

(() => {

  const svg_retro = wheel_data.svg_wrapper.querySelector('#ruota_retro');

  // numero delle clips posizionabili nel disco
  let clips_posizionabili_totali,
    // viene mostrato il nome della clip?
    cliparts_have_text;

  // restituisce il numero delle clipart aggiunte
  const get_cliparts_num = function () {
      return wheel_data.cliparts_selected_wrapper.querySelectorAll('.clipart-selected').length;
    },

    // determina il numero delle clips posizionabili nel disco
    set_clips_posizionabili_totali = function () {
      clips_posizionabili_totali = +document.querySelector('[name="finestre"]:checked').value === 1? 12 : 6;
      cliparts_have_text = clips_posizionabili_totali === 6;

      // aggiunge una classe a `wheel_data.cliparts_selected_wrapper` per mostrare o meno il campo testo
      wheel_data.cliparts_selected_wrapper.classList.toggle('clipart-text', !cliparts_have_text);

      if(get_cliparts_num() > clips_posizionabili_totali) {
        wheel_data.cliparts_selected_wrapper
          .querySelectorAll(`.clipart-selected:nth-child(n+${clips_posizionabili_totali + 1}`)
          .forEach(item => {
            item.remove();
          });
      }

    };

  // listener radio scelta numero finestre
  document.querySelectorAll('[name="finestre"]').forEach(el => {
    el.addEventListener('click', () => {
      set_clips_posizionabili_totali();
    });
  });

  // aggiunge le clipart al disco
  wheel_data.addClipsToDisk = function () {

    set_clips_posizionabili_totali();

    svg_retro.querySelectorAll('.clipart').forEach(item => {
      item.remove();
    });

    wheel_data.cliparts_selected_wrapper.querySelectorAll('.clipart-selected').forEach((item, index) => {

      let clipart_text = item.querySelector('.clipart-text input').value;

      const clipart_size = 50,
        clipart_y = 30,
        radius_step = 30,
        retro_svg_vbox_width = svg_retro.getAttribute('viewBox').split(' ')[2],
        svg_center = retro_svg_vbox_width/2;

      if(cliparts_have_text) {

        let text_x = 28,
          textLength = svg_center - text_x - 52;

        svg_retro.insertAdjacentHTML('beforeend',
          `<g class="clipart clipart-text clipart-text-${item.dataset.idx}">
            <text
              text-anchor="start"
              transform="rotate(90)"
              style="/* visibility:hidden */"
            >
              ${clipart_text}
            </text>
          </g>`
        );

        // calcolo bbox
        // restituisce un oggetto con width, height, x, y
        let text_element = svg_retro.querySelector(`.clipart-text-${item.dataset.idx} text`),
          bbox = text_element.getBBox(),

          text_y= -svg_center + (bbox.y + bbox.height) - 5;

        text_element.setAttribute('y', text_y);
        text_element.setAttribute('x', text_x);

        if(bbox.width > textLength) {
          text_element.setAttribute('textLength', textLength);
          text_element.setAttribute('lengthAdjust', 'spacingAndGlyphs');
        }

        svg_retro.querySelector(`.clipart-text-${item.dataset.idx}`)
          .setAttribute('transform', `rotate(${radius_step * index} ${svg_center} ${svg_center})`);


        svg_retro.insertAdjacentHTML('beforeend',
          `<use class="clipart clipart-${item.dataset.idx}"
            width="${clipart_size}" height="${clipart_size}"
            y="${clipart_y}" x="${svg_center - (clipart_size / 2)}"
            transform="rotate(${radius_step * (index + 6)} ${svg_center} ${svg_center})"
            xlink:href="#${item.dataset.id}">
          </use>`
        );

      } else {
        svg_retro.insertAdjacentHTML('beforeend',
          `<use class="clipart clipart-${item.dataset.idx}"
            width="${clipart_size}" height="${clipart_size}"
            y="${clipart_y}" x="${svg_center - (clipart_size / 2)}"
            transform="rotate(${radius_step * index} ${svg_center} ${svg_center})"
            xlink:href="#${item.dataset.id}">
          </use>`
        );
      }
    });

  }; // end wheel_data.addClipsToDisk

  // funzione per l'aggiunta delle cliparts
  wheel_data.add_selected_clipart = function (clipart_data) {

    // INDICE clipart
    let idx = wheel_data.cliparts_selected_wrapper.querySelectorAll('.clipart-selected').length;

    wheel_data.cliparts_selected_wrapper.insertAdjacentHTML('beforeend',
      `<div class="clipart-selected" title="Trascina per cambiare la posizione">
          <div>
            <div class="clipart_btns">
              <div class="drag-btn" role="button"><span>Trascina</span></div>
              <div class="close-btn" title="Elimina" role="button"><span>Elimina</span></div>
            </div>
            <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 100 100">
              <use xlink:href="#${clipart_data.id}"></use>
            </svg>
            <div class="clipart-text mt-2">
              <label for="clipart-label-${idx}" class="sr-only">Nome</label>
              <input class="form-control" id="clipart-label-${idx}" value="${clipart_data.nome}" type="text">
            </div>
          </div>
      </div>`
    );

    let selected_last_child = wheel_data.cliparts_selected_wrapper
      .querySelector('.clipart-selected:last-child');

    for(let i in clipart_data) {
      selected_last_child.dataset[i] = clipart_data[i];
    }
    selected_last_child.dataset.idx = idx;

    wheel_data.cliparts_selected_wrapper.grabbable(wheel_data.addClipsToDisk);

    wheel_data.addClipsToDisk();

    let close_btn = selected_last_child.querySelector('.close-btn');

    close_btn.addEventListener('click', function () {
      this.closest('.clipart-selected').remove();
      wheel_data.addClipsToDisk();
    });
  }; // end wheel_data.add_selected_clipart

  // listener clic sulle clipart presenti nella lista
  wheel_data.cliparts_wrapper.querySelectorAll('.clipart').forEach(item => {

    item.addEventListener('click', () => {

      if (get_cliparts_num() < clips_posizionabili_totali ) {
        wheel_data.add_selected_clipart(item.dataset);

      } else {
        alert('Hai raggiunto il numero massimo di immagini!');
      }
    });

  });

  document.querySelector('.btn-reset-clips').addEventListener('click', function () {
    svg_retro.querySelectorAll('.clipart').forEach(item => {
      item.remove();
    });
    wheel_data.cliparts_selected_wrapper.innerHTML = '';
  }, false);

  set_clips_posizionabili_totali();

})();

