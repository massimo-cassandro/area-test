function donut(opts) {
  /*
	opts = {
		radius          <-- radius
		start_angle     <-- start angle (degrees)
		end_angle       <-- end angle (degrees)
		thickness       <-- arc thickness
		container       <-- container DOM element
	};
	*/

  // le coordinate x e y del centro della torta sono uguali al raggio
  opts.cx = opts.radius;
  opts.cy = opts.radius;

  // restituisce l'attributo `d` dell'arco di cerchio descritto dai parametri dati
  function arc(arc_end_angle) {

    if (arc_end_angle >= 360) {
      arc_end_angle = 359.9999;
    }

    function polarToCartesian(radius, angleInDegrees) {
      var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

      return {
        x: opts.cx + (radius * Math.cos(angleInRadians)),
        y: opts.cy + (radius * Math.sin(angleInRadians))
      };
    }

    var start = polarToCartesian(opts.radius, arc_end_angle),
      end = polarToCartesian(opts.radius, opts.start_angle),

      cutout_radius = opts.radius - opts.thickness,
      start2 = polarToCartesian(cutout_radius, arc_end_angle),
      end2 = polarToCartesian(cutout_radius, opts.start_angle),

      largeArcFlag = arc_end_angle - opts.start_angle <= 180 ? '0' : '1',

      d = [
        'M', start.x, start.y,
        'A', opts.radius, opts.radius, 0, largeArcFlag, 0, end.x, end.y,
        'L', opts.cx, opts.cy,
        'Z',

        'M', start2.x, start2.y,
        'A', cutout_radius, cutout_radius, 0, largeArcFlag, 0, end2.x, end2.y,
        'L', opts.cx, opts.cy,
        'Z'
      ].join(' ');

    return d;

  }

  // creazione elemento SVG e elementi `path`
  var container_size = opts.radius * 2;

  opts.container.innerHTML = '<svg viewBox="0 0 ' + container_size + ' ' + container_size + '" width="' + container_size + '" height="' + container_size + '">' +
		'<path class="pie_bg" fill="#ddd" stroke="none" fill-rule="evenodd" />' +
		'<path class="pie_arc" fill="orange" stroke="none" fill-rule="evenodd" />' +
		'</svg>';

  var pie_bg = opts.container.querySelector('.pie_bg'),
    pie_arc = opts.container.querySelector('.pie_arc');

  pie_bg.setAttribute('d', arc(360));
  pie_arc.setAttribute('d', arc(opts.end_angle));

}

donut({
  radius: 200,
  start_angle: 0,
  end_angle: 120,
  thickness: 30,
  container: document.getElementById('torta')
});
