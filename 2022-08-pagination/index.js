(() => {

  const records_field = document.getElementById('records'),
    pageRows_field = document.getElementById('page-rows'),
    currentPage_field = document.getElementById('current-page'),
    container = document.querySelector('ul'),
    upd_btn = document.getElementById('upd');

  const build_pag = () =>{

    const records = +records_field.value,
      pageRows = +pageRows_field.value,
      currentPage = +currentPage_field.value;

    // *****************

    const pages = Math.ceil(records / pageRows),

      // numero massimo di pagine visualizzate
      showed_pages = 11; // meglio dispari


    let pages_array = [];

    if (pages <= showed_pages) {
      pages_array = [...Array(pages).fill().map((_, idx) => idx + 1)];

    } else {


      let side_pages = 2, // pagine a dx/sx della pagina corrente

        step_min = Math.max(1, currentPage - side_pages),
        step_max = Math.min(pages, currentPage + side_pages),

        // spazi aggiuntibi a dx/sx da lasciare liberi per '1', '...', <pages>
        slots_left = step_min > 2? 2 : step_min - 1,
        slots_right = step_max < pages - 1? 2 : pages - step_max;

      // console.log(step_min, step_max, slots_left, slots_right);
      // console.log(step_max - step_min + 1 + slots_left + slots_right);

      // fix per avere sempre il numero prefissato di pagine
      while (step_max - step_min + 1 + slots_left + slots_right < showed_pages) {
        step_min = Math.max(1, step_min - 1);
        step_max = Math.min(pages, step_max + 1);

      }

      console.log(step_max - step_min + 1 + slots_left + slots_right);

      // if(step_max - step_min + 1 + slots_left + slots_right > showed_pages) {
      //   step_min++;
      // }

      pages_array = [
        ...Array(step_max - step_min + 1)
          .fill()
          .map((_, idx) => step_min + idx)
      ];

      // console.log(pages_array.slice(0));

      if(pages_array[0] === 2) {
        pages_array.unshift(1);

      } else if (pages_array[0] === 3) {
        pages_array.unshift(1, 2);

      } else if (pages_array[0] > 3) {
        pages_array.unshift(1, null);
      }

      if(pages_array.at(-1) === pages - 1) {
        pages_array.push(pages);

      } else if(pages_array.at(-1) === pages - 2) {
        pages_array.push(pages -1, pages);

      } else if(pages_array.at(-1) < pages - 2) {
        pages_array.push(null, pages);
      }


    }

    console.log(pages_array);

    container.innerHTML = pages_array.map(item => {
      return `<li>
        <a href="#" ${item === currentPage? 'class="selected"' : ''}>
          ${item?? '...'}
        </a>
      </li>`;
    }).join('');
  };

  build_pag();

  upd_btn.addEventListener('click', () => {
    build_pag();
  }, false);

})();
