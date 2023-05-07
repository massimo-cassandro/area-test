(() => {
  'use strict';

  function createPattern() {

    // path calc
    const angle = +document.getElementById('angle').value, // linea angle
      h = +document.getElementById('height').value, // tile height
      w = Math.round((Math.tan(((90-angle) * Math.PI) / 180) * h) * 1000) / 1000, // tile width
      strokeWidth = +document.getElementById('strokeWidth').value,
      strokeOpacity = +document.getElementById('strokeOpacity').value,
      path = `M0,0 l${w},${h} M${-w / 2},${h / 2} l${w},${h} M${w / 2},${-h / 2} l${w},${h}`,

      strokeColor = document.getElementById('strokeColor').value,
      fillColor = document.getElementById('fillColor').value;

    // adding the pattern code
    document.querySelector('.pattern-container').innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="pattern" patternUnits="userSpaceOnUse" width="${w}" height="${h}">
            <rect width="${w}" height="${h}" fill="${fillColor}" />
            <path d="${path}"
              stroke="${strokeColor}"
              stroke-width="${strokeWidth}"
              stroke-opacity="${strokeOpacity}"
            />
          </pattern>
        </defs>
      </svg>
    `;

    // showing pattern lines outside the tile boundaries
    document.querySelector('.pattern-construction').innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewbox="${-w/2} ${-h/2} ${w * 2} ${h * 2}" width="${w}rem" height="${h}rem">
        <rect width="${w}" height="${h}" fill="${fillColor}" />
        <path d="${path}"
          stroke="${strokeColor}"
          stroke-width="${strokeWidth}"
          stroke-opacity="${strokeOpacity}"
        />
      </svg>`;

    // SVG of a single pattern tile
    document.querySelector('.pattern-single-tile').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 ${w} ${h}" width="${w}" height="${h}">
      <rect width="${w}" height="${h}" fill="${fillColor}" />
      <path d="${path}"
        stroke="${strokeColor}"
        stroke-width="${strokeWidth}"
        stroke-opacity="${strokeOpacity}"
      />
    </svg>`;

    // display path code
    document.querySelector('.pattern-path').innerHTML = `Path: <span>${path}</span>
      <a class="small ms-2" href="https://svg-path-visualizer.netlify.app/#${encodeURI(path)}" target="_blank" rel="noopener noreferrer">Path visualizer</a>`;
  }

  // copy SVG
  document.querySelector('.copy-svg')?.addEventListener('click', e => {
    navigator.clipboard.writeText(document.querySelector('.pattern-single-tile').innerHTML)
    .then(
      () => {

        e.target.insertAdjacentHTML('afterend',
          `<div class="alert alert-success small" role="alert">
            SVG copied!
          </div>`
        );

        setTimeout(() => {
          e.target.nextSibling.remove();
        }, 2000);
      },
      () => {
        alert('Error while copying SVG');
      }
    );

  }, false);


  // validity feedback
  document.querySelectorAll('[type="text"], [type="number"]').forEach(field => {
    field.addEventListener('input', () => {
      field.classList.toggle('is-invalid', !field.checkValidity());
    }, false);
  });


  // colors inputs
  const colorHandler = inputField => {
    const siblingField = inputField.closest('.input-group').querySelector(`[type=${inputField.type === 'color'? 'text' : 'color'}]`);

    if(inputField.value && inputField.checkValidity()) {
      siblingField.value = inputField.value.toLowerCase();
    }
  }

  document.querySelectorAll('.color-input').forEach(item => {
    item.querySelectorAll('input').forEach(field => {
      field.addEventListener('change', () => {
        colorHandler(field);
      }, false);
      field.addEventListener('input', () => {
        colorHandler(field);
      }, false);
      colorHandler(field);
    });
  });

  // start
  document.querySelector('.controls .btn').addEventListener('click', () => {
    let err = false;
    document.querySelectorAll('[type="text"], [type="number"]').forEach(field => {
      field.classList.toggle('is-invalid', !field.checkValidity());
      err = err || !field.checkValidity();
    });
    if(!err) {
      createPattern();
    }
  }, false);

  createPattern();


})();
