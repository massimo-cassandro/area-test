(() => {

  const row1 = document.querySelectorAll('.grid-item:not(.row-2)'),
    row2 = document.querySelectorAll('.grid-item.row-2'),
    toggled_monitor = document.querySelector('.toggled-monitor'),
    gap = window.getComputedStyle(document.querySelector('.grid')).gap
  ;

  let toggled = false;

  document.querySelector('.toggle-btn').addEventListener('click', () => {

    row1.forEach(el => {
      el.style.transform = toggled? 'none' : `translateY(calc(100% + ${gap}))`;
    });
    row2.forEach(el => {
      el.style.transform = toggled? 'none' : `translateY(calc(-100% - ${gap}))`;
    });

    toggled = !toggled;
    toggled_monitor.innerText = toggled.toString();

  }, false);

})();
