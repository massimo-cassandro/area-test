const gauge = document.querySelector('.gauge')
  // ,gauge_base = gauge.querySelector('.gauge-base')
  // ,gauge_arc = gauge.querySelector('.gauge-arc')
  ,gauge_text = gauge.querySelector('text')
  ,strokeWidth = 12
  ,radius = 100
  ,value_input = document.getElementById('value')
  ,color_ranges = {
    50: 'danger',
    90: 'warning',
    100: 'success'
  }
  ,update_gauge = () => {
    const value = value_input.value
      ,color_range = Object.keys(color_ranges).find(range => value <= +range)
    ;

    // `- strokeWidth` needed to compensate for the round linecap
    const dasharray = `${((Math.PI * 2 * radius) * (value / 100)) - strokeWidth}  ${Math.PI * 2 * radius}`;

    gauge.style.setProperty('--color', `var(--${color_ranges[color_range]})`);
    gauge.style.setProperty('--dasharray', dasharray);
    gauge_text.textContent = value;
  };

gauge.style.setProperty('--stroke-width', `${strokeWidth}px`);
gauge.style.setProperty('--radius', `${radius}px`);

gauge.setAttribute('viewBox', `0 0 ${radius * 2} ${radius * 2}`);

// const textLength = radius * 2 * .7;
// gauge_text.setAttribute('textLength', textLength);
// gauge_text.setAttribute('x', (radius * 2 - textLength) / 2);
gauge_text.setAttribute('transform', `translate(-50%, -50%)`);

value_input.addEventListener('change', () => update_gauge(), false);
value_input.addEventListener('keydown', () => update_gauge(), false);

update_gauge();
