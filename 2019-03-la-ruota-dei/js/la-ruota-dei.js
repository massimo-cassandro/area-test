//* eslint no-console: 0, no-unused-vars: 0, no-empty:  0 */
/* exported RUOTA */

/*!
 * La ruota dei...
 * Massimo Cassandro 2019
 *
*/

/*
  @codekit-append quiet '../node_modules/grabbable2/grabbable.js'
  @codekit-append '../assets/cliparts_list.js'
  @codekit-append 'src/_cliparts_list_builder.js'
  @codekit-append 'src/_cliparts.js'
  @codekit-append 'src/_form_settings.js'
  @codekit-append 'src/_manage_settings.js' //NB dopo _cliparts.js e _form_settings.js
  @codekit-append 'src/_print.js'
*/

var RUOTA = (() => {
  "use strict";
  var wheel = {
    svg_wrapper: document.getElementById('svg-wrapper'),
    storage_var: 'la_ruota_dei',
    cliparts_wrapper: document.querySelector('main .cliparts-list'),
    cliparts_selected_wrapper: document.querySelector('main .cliparts-selected-wrapper')
  };

  return wheel;
})();
