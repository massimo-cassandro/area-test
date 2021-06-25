/* globals RUOTA:true */

RUOTA = (wheel => {
  "use strict";

  /*
    var cliparts_list = [
      [
        "albero",
        "clipart-albero"
      ],
      [
        "zero",
        "clipart-num-00"
      ],

      [...]
    ]
  */

  // ordinamento in modo che i numeri siano in fondo
  // cliparts_list è generato dallo script gulp che crea le icone svg

  cliparts_list.sort((a, b) => {
    const num_prefix = 'clipart-num';

    let a_isNum = a[1].indexOf(num_prefix) > -1 ? 1 : 0,
      b_isNum = b[1].indexOf(num_prefix) > -1 ? 1 : 0;

    return a_isNum - b_isNum;
  });

  cliparts_list.forEach(function (item) {
    wheel.cliparts_wrapper.insertAdjacentHTML('beforeend',
      '<div class="clipart" data-id="' + item[1] + '" data-nome="' + item[0] + '" role="button">' +
        '<svg>' +
          '<title>' + item[0] + '</title>' +
          '<use xlink:href="#' + item[1] + '"></use>'+
        '</svg>'+
        '<div class="clipart-dida" title="' + item[0] + '">' + item[0] + '</div>'+
      '</div>'
    );
  });

  return wheel;

})(RUOTA || {});
