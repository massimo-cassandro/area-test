(() => {
  'use strict';

  document.fonts.ready.then(() => {
    console.log('fonts ready!'); // eslint-disable-line

    const canvas = document.getElementById('canvas'),
      canvas_width = 500,
      canvas_height = 380,
      export_link = document.getElementById('export'),

      set_export_link_href = () => {
        export_link.href = canvas.toDataURL('image/jpeg');
      };

    let ctx = canvas.getContext('2d');

    canvas.width = canvas_width;
    canvas.height = canvas_height;

    // Create a linear gradient
    let gradient = ctx.createLinearGradient(0, 0, canvas_width, canvas_height);

    // Add three color stops
    gradient.addColorStop( 0, 'purple');
    gradient.addColorStop(.4, 'violet');
    gradient.addColorStop(.5, 'purple');
    gradient.addColorStop(.8, 'violet');
    gradient.addColorStop( 1, 'purple');

    // Set the fill style and draw a rectangle
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas_width, canvas_height);

    // top & bottom lines
    ctx.fillStyle = 'gold';
    ctx.fillRect(10, 10, canvas.width-20 , 5);
    ctx.fillRect(10, canvas.height-15, canvas.width-20 , 5);

    ctx.fillStyle = 'white';
    ctx.font = '80px Lobster';
    ctx.textAlign = 'center';
    ctx.fillText('Hello world!', canvas_width / 2, 100);

    document.getElementById('insert-text-btn').addEventListener('click', () => {
      let text = document.getElementById('text').value;

      ctx.fillStyle = 'gold';
      ctx.font = '36px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(text, canvas_width / 2, canvas_height / 2);
      set_export_link_href();
    }, false);

    set_export_link_href();
  });

})();
