(function() {
  'use strict';
  var build_donut_chart = function(percent_value, stroke_width, portion_angle) {
    stroke_width = +stroke_width;
    percent_value = +percent_value;
    portion_angle = +portion_angle;

    var arc_start_angle = 0, // the angle from which we start drawing
      circle_radius = 50,
      // circle radius is corrected to fit correctly inside the SVG viewport
      stroke_corrected_circle_radius = circle_radius - stroke_width / 2,
      deg_value = 360 * (percent_value / 100), // value in degrees of the given percentile
      arc_center = {
        x: circle_radius,
        y: circle_radius
      },
      degreesToRadians = function(angle) {
        return angle * Math.PI / 180.0;
      },
      // transform polar coordinates (center + radius) to cartesian ones (x, y)
      polarToCartesian = function(angle) {
        var radians = degreesToRadians(angle);
        return {
          x: arc_center.x + stroke_corrected_circle_radius * Math.cos(radians),
          y: arc_center.y - stroke_corrected_circle_radius * Math.sin(radians)
        };
      },
      arc_start_coord = polarToCartesian(arc_start_angle);

    /*!log */
    var log = [
      ['circle radius', circle_radius],
      ['stroke width', stroke_width],
      ['chart value', percent_value + '% = ' + deg_value + '°'],
      ['arc center (green circle)', arc_center.x + ',' + arc_center.y],
      [
        'arc start angle',
        arc_start_angle +
          '° (' +
          degreesToRadians(arc_start_angle) +
          '<sup>rad</sup>)'
      ],
      [
        'arc start point coord. (red circle)',
        arc_start_coord.x + ',' + arc_start_coord.y
      ]
    ];

    // the end angle considering the angle from which we start drawing
    // note: arc_end_angle is not used in arc construction
    var arc_end_angle =
        deg_value <= arc_start_angle
          ? Math.abs(deg_value - arc_start_angle)
          : 360 - Math.abs(deg_value - arc_start_angle),
      arc_end_coord = polarToCartesian(arc_end_angle);

    // stroke width affects precision, so the arc is splitted into portions
    var portions = new Array(Math.floor(deg_value / portion_angle)).fill(
      portion_angle
    );

    if (deg_value % portion_angle) {
      portions.push(deg_value % portion_angle);
    }

    var d = 'M' + arc_start_coord.x + ',' + arc_start_coord.y,
      portion_start = arc_start_angle,
      portions_steps = [portion_start],
      xAxisRotation = 0,
      largeArcFlag = portions[0] < 180 ? '0' : '1',
      sweepFlag = 1;

    portions.forEach(function(portion) {
      var portion_end_angle =
          portion_start - portion >= 0
            ? portion_start - portion
            : 360 + portion_start - portion,
        portion_end = polarToCartesian(portion_end_angle);
      d +=
        ' ' +
        'A' +
        circle_radius +
        ',' +
        circle_radius +
        ' ' +
        xAxisRotation +
        ' ' +
        largeArcFlag +
        ' ' +
        sweepFlag +
        ' ' +
        portion_end.x +
        ',' +
        portion_end.y;

      portions_steps.push(portion_end_angle);
      portion_start = portion_end_angle;
    });

    /*!*/
    log.push(
      [
        'arc end angle',
        arc_end_angle +
          '° (' +
          degreesToRadians(arc_end_angle) +
          '<sup>rad</sup>)'
      ],
      [
        'arc end point coord. (blue circle)',
        arc_end_coord.x + ',' + arc_end_coord.y
      ],
      ['xAxisRotation', xAxisRotation],
      ['largeArcFlag', largeArcFlag],
      ['sweepFlag', sweepFlag],
      ['portion angle', portion_angle + '°'],
      [
        'portions',
        portions
          .map(function(item) {
            return item + '°';
          })
          .join(', ')
      ],
      [
        'portions steps (dashed lines)',
        portions_steps
          .map(function(item) {
            return item + '°';
          })
          .join(' → ')
      ],
      ['d', d.replace(/ A/g, '<br> A')]
    );

    // apply calculated values
    var circle_bg_element = document.querySelector('.circle_bg'),
      circle_arc_element = document.getElementById('circle_arc');

    circle_bg_element.setAttribute('stroke-width', stroke_width);
    circle_bg_element.setAttribute('r', stroke_corrected_circle_radius);

    circle_arc_element.setAttribute('stroke-width', stroke_width);
    circle_arc_element.setAttribute('d', d);

    var log_output = '<table>';
    log.forEach(function(item) {
      log_output += '<tr><th>' + item[0] + '</th><td>' + item[1] + '</td></tr>';
    });
    log_output += '</table>';

    document.getElementById('info').innerHTML = log_output;

    // showing arc center, start and end point
    var chart_start_point = document.getElementById('start_point'),
      chart_end_point = document.getElementById('end_point'),
      chart_arc_center = document.getElementById('arc_center');
    chart_start_point.setAttribute('cx', arc_start_coord.x);
    chart_start_point.setAttribute('cy', arc_start_coord.y);
    chart_end_point.setAttribute('cx', arc_end_coord.x);
    chart_end_point.setAttribute('cy', arc_end_coord.y);
    chart_arc_center.setAttribute('cx', arc_center.x);
    chart_arc_center.setAttribute('cy', arc_center.y);

    // portions
    document.querySelectorAll('.portion-line').forEach(function(item) {
      item.remove();
    });
    var svg_container = document.querySelector('.circle_svg');
    portions_steps.forEach(function(step) {
      var coords = polarToCartesian(step);
      svg_container.insertAdjacentHTML(
        'beforeend',
        '<line x1="' +
          arc_center.x +
          '" y1="' +
          arc_center.y +
          '" x2="' +
          coords.x +
          '" y2="' +
          coords.y +
          '" class="portion-line" />'
      );
    });
  };

  var btn = document.getElementById('draw');
  btn.addEventListener(
    'click',
    function() {
      build_donut_chart(
        document.getElementById('percent').value,
        document.getElementById('stroke_width').value,
        document.getElementById('portion_angle').value
      );
    },
    false
  );

  btn.click();
})();
