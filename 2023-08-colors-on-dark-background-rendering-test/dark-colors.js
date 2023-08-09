const container = document.querySelector('.colors-grid'),
   colors = [
    '#fff', '#0091FF', '#FF9800', '#FDD835',
    '#468804', '#eb5708', '#950ada', '#c00',
    '#c9db03', '#3a4e48', '#770d2b', '#b58db6',
    '#d0ada7', '#696aad', '#2427d8', '#66BCE9',
    '#BA276E', '#5F59F7', '#b50579', '#083ba9',
    '#fc0'
   ];

colors.forEach(color => {
  container.insertAdjacentHTML('beforeend',
    `<div>
      <div class="color-sample" style="border-color: ${color}">
        <div class="text" style="color: ${color}">Lorem ipsum</div>
        <div class="box" style="background-color: ${color}">
          <div class="text-white">Lorem ipsum</div>
          <div class="text-dark">Lorem ipsum</div>
        </div>
      </div>
      <div class="color">${color}</div>
    </div>`
  );
});
