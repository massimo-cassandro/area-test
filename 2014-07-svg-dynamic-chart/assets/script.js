var regions = [{
  'region_name': 'Lombardia',
  'region_code': 'lom',
  'population': 9794525
},
{
  'region_name': 'Campania',
  'region_code': 'cam',
  'population': 5769750
},
{
  'region_name': 'Lazio',
  'region_code': 'laz',
  'population': 5557276
},
{
  'region_name': 'Sicilia',
  'region_code': 'sic',
  'population': 4999932
},
{
  'region_name': 'Veneto',
  'region_code': 'ven',
  'population': 4881756
},
{
  'region_name': 'Emilia-Romagna',
  'region_code': 'emi',
  'population': 4377487
},
{
  'region_name': 'Piemonte',
  'region_code': 'pie',
  'population': 4374052
},
{
  'region_name': 'Puglia',
  'region_code': 'pug',
  'population': 4050803
},
{
  'region_name': 'Toscana',
  'region_code': 'tos',
  'population': 3692828
},
{
  'region_name': 'Calabria',
  'region_code': 'cal',
  'population': 1958238
},
{
  'region_name': 'Sardegna',
  'region_code': 'sar',
  'population': 1640379
},
{
  'region_name': 'Liguria',
  'region_code': 'lig',
  'population': 1565127
},
{
  'region_name': 'Marche',
  'region_code': 'mar',
  'population': 1545155
},
{
  'region_name': 'Abruzzo',
  'region_code': 'abr',
  'population': 1312507
},
{
  'region_name': 'Friuli-Venezia Giulia',
  'region_code': 'fri',
  'population': 1221860
},
{
  'region_name': 'Trentino-Alto Adige',
  'region_code': 'tre',
  'population': 1039934
},
{
  'region_name': 'Umbria',
  'region_code': 'umb',
  'population': 886239
},
{
  'region_name': 'Basilicata',
  'region_code': 'bas',
  'population': 576194
},
{
  'region_name': 'Molise',
  'region_code': 'mol',
  'population': 313341
},
{
  'region_name': 'Val d\'Aosta',
  'region_code': 'vao',
  'population': 127844
}
];


var temp_array = regions.map(function (item) {
  return item.population;
});
var highest_value = Math.max.apply(Math, temp_array);

/*
// same result using reduce (thanks to  Dillon de Voor)
var highest_value = regions.reduce(function(max, region) {
  return Math.max(region.population, max);
}, 0);
*/

$(document).ready(function () {

  for (let i = 0; i < regions.length; i++) {

    $('#' + regions[i].region_code)
      .css({
        'fill': 'rgba(11, 104, 170,' + regions[i].population / highest_value + ')'
      })
      .data('region', regions[i]);
  }

  $('#map g').mouseover(function (e) {
    var region_data = $(this).data('region');
    $('<div class="info_panel">' +
          region_data.region_name + '<br>' +
          'Population: ' + region_data.population.toLocaleString('en-UK') +
          '</div>'
    )
      .appendTo('body');
  })
    .mouseleave(function () {
      $('.info_panel').remove();
    })
    .mousemove(function (e) {
      var mouseX = e.pageX, //X coordinates of mouse
        mouseY = e.pageY; //Y coordinates of mouse

      $('.info_panel').css({
        top: mouseY - 50,
        left: mouseX - ($('.info_panel').width() / 2)
      });
    });

});
