function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

/*
opts = {
	cx              <-- center x
	cy              <-- center y
	radius          <-- circle radius
	start_angle     <-- start angle in degrees
	end_angle       <-- end angle in degrees
};
*/
// sector
var opts = {
  cx: 200,
  cy: 200,
  radius: 200,
  start_angle: 0,
  end_angle: 120,
};

var start = polarToCartesian(opts.cx, opts.cy, opts.radius, opts.end_angle),
  end = polarToCartesian(opts.cx, opts.cy, opts.radius, opts.start_angle),
  largeArcFlag = opts.end_angle - opts.start_angle <= 180 ? '0' : '1';

var d = [
  'M', start.x, start.y,
  'A', opts.radius, opts.radius, 0, largeArcFlag, 0, end.x, end.y,
  'L', opts.cx, opts.cy,
  'Z'
].join(' ');

document.getElementById('sector').setAttribute('d', d);
document.getElementById('sector_d_attr').innerHTML = d;


// arc

opts = {
  cx: 200,
  cy: 200,
  radius: 200,
  start_angle: 0,
  end_angle: 120,
  thickness: 30
};

start = polarToCartesian(opts.cx, opts.cy, opts.radius, opts.end_angle);
end = polarToCartesian(opts.cx, opts.cy, opts.radius, opts.start_angle);
largeArcFlag = opts.end_angle - opts.start_angle <= 180 ? '0' : '1';

var cutout_radius = opts.radius - opts.thickness,
  start2 = polarToCartesian(opts.cx, opts.cy, cutout_radius, opts.end_angle),
  end2 = polarToCartesian(opts.cx, opts.cy, cutout_radius, opts.start_angle),



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

document.getElementById('arc').setAttribute('d', d);
document.getElementById('arc_d_attr').innerHTML = d;
