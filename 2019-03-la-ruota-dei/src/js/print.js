import { wheel_data } from './wheel-data-store';

(() => {

  document.querySelectorAll('.btn-print').forEach( btn => {

    btn.addEventListener('click', function () {

      wheel_data.update();
      wheel_data.store_settings();
      wheel_data.addClipsToDisk();
      window.print();
    }, false);
  });

  document.querySelectorAll('.btn-store_settings').forEach( btn => {
    btn.addEventListener('click', function () {

      wheel_data.update();
      wheel_data.store_settings();
      wheel_data.addClipsToDisk();
    }, false);
  });

})();
