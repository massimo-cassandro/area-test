/* globals RUOTA:true */

RUOTA = (wheel => {
  "use strict";


  document.querySelectorAll('.btn-print').forEach( btn => {

    btn.addEventListener('click', function () {

      wheel.update();
      wheel.store_settings();
      wheel.addClipsToDisk();
      window.print();
    }, false);
  });

  document.querySelectorAll('.btn-store_settings').forEach( btn => {
    btn.addEventListener('click', function () {

      wheel.update();
      wheel.store_settings();
      wheel.addClipsToDisk();
    }, false);
  });



  return wheel;

})(RUOTA || {});
