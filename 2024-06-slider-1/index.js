const mobile_slider_wrapper = document.querySelector('.mobile-slider-container .slider')
  ,slides = mobile_slider_wrapper.querySelectorAll('div')
  ,next_btn = document.getElementById('next')
  ,prev_btn = document.getElementById('prev')
;

let idx = 0;

const upd_btns = () => {
  prev_btn.disabled = mobile_slider_wrapper.querySelectorAll('.slide.prev').length === 0;
  next_btn.disabled = mobile_slider_wrapper.querySelectorAll('.slide:not(.prev):not(.on)').length === 0;
};

next_btn.addEventListener('click', () => {
  mobile_slider_wrapper.querySelector('.on:not(.prev):not(.next)')?.classList.add('prev');
  slides[++idx].classList.add('on');
  slides[idx].classList.remove('prev', 'next');
  upd_btns();
}, false);

prev_btn.addEventListener('click', () => {
  mobile_slider_wrapper.querySelector('.on:not(.prev):not(.next)')?.classList.add('next');
  slides[--idx].classList.add('on');
  slides[idx].classList.remove('prev', 'next');
  upd_btns();
}, false);


mobile_slider_wrapper.addEventListener('transitionstart', e => {
  if(e.target.classList.contains('slide') ) {
    e.target.classList.add('sliding');
  }
}, false);

mobile_slider_wrapper.addEventListener('transitionend', e => {
 if((e.target.classList.contains('prev') || e.target.classList.contains('next')) ) {
    e.target.classList.remove('on');
    upd_btns();
  }
  e.target.classList.remove('sliding');
}, false);



upd_btns();
