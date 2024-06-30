const upd_sliders_btns = (slider_wrapper, prev_btn, next_btn) => {
  if(prev_btn) {
    prev_btn.disabled = slider_wrapper.querySelectorAll('.slide-prev').length === 0;
  }
  if(next_btn) {
    next_btn.disabled = slider_wrapper.querySelectorAll('.slide:not(.slide-prev):not(.slide-on)').length === 0;
  }
};

const upd_carousel_btns = (carouselObj, prev_btn, next_btn) => {
  if(prev_btn) {
    prev_btn.disabled = carouselObj.translate_value === 0;
  }
  if(next_btn) {
    next_btn.disabled = carouselObj.translate_value === carouselObj.min_x;
  }
};

document.querySelectorAll('.slider-outer-wrapper').forEach(wrapper => {

  // init: add `.slider-active` class to `.slider`
  wrapper.querySelector('.slider').classList.add('slider-active');
  wrapper.querySelector('.slide:nth-child(1)').classList.add('slide-on');
  // end init

  let idx = 0;
  const slides = wrapper.querySelectorAll('.slide')
    ,prev_btn = wrapper.querySelector('.slider-control[data-show-slide="prev"]')
    ,next_btn = wrapper.querySelector('.slider-control[data-show-slide="next"]')
  ;

  const carousel = {
    element                 : wrapper.querySelector('.slider.carousel'),
    translate_value         : 0,
    slide_translate_amount  : 0,
    is_desktop              : false
  };

  if(carousel.element) {
    // translate amount = slide width + flexbox gap
    const gap = parseFloat(getComputedStyle(carousel.element).gap);
    carousel.slide_translate_amount = wrapper.querySelector('.slide').offsetWidth + (isNaN(gap)? 0 : gap);

    // wrapping
    const outer_wrapper = document.createElement('div');
    outer_wrapper.classList.add('carousel-outer-wrapper');
    carousel.element.parentNode.insertBefore(outer_wrapper, carousel.element);
    outer_wrapper.appendChild(carousel.element);

    const outer_wrapper_bb = outer_wrapper.getBoundingClientRect();

    // minimum wrapper size to consider it as desktop (according to your layout grid system)
    // to be checked on window resize
    carousel.is_desktop = outer_wrapper_bb.width >= 768;

    if(carousel.is_desktop) {
      // minimum translate value for `next` scrolling (left)
      carousel.min_x = outer_wrapper_bb.width - carousel.element.scrollWidth;
      // maximum translate value for `prev` scrolling (right)
      // carousel.max_x = 0;
    }

  }

  wrapper.addEventListener('click', e => {

    if(e.target.classList.contains('slider-control')) {

      // prev => to the right
      // next => to the left
      const slideToShow = e.target.dataset.showSlide;

      if(carousel.element && carousel.is_desktop) { // desktop carousel

        const this_translate_value = carousel.translate_value +
          (carousel.slide_translate_amount * (slideToShow === 'next'? -1 : 1));

        carousel.translate_value = slideToShow === 'next'?
          Math.max(this_translate_value, carousel.min_x) :
          Math.min(this_translate_value, 0);

        carousel.element.style.translate = carousel.translate_value + 'px';
        upd_carousel_btns(carousel, prev_btn, next_btn);

      } else { // slider or mobile carousel

        idx = slideToShow === 'next'? idx + 1 : idx - 1;
        wrapper.querySelector('.slide-on:not(.slide-prev):not(.slide-next)')?.classList.add(`slide-${slideToShow === 'next'? 'prev': 'next'}`);
        slides[idx].classList.add('slide-on');
        slides[idx].classList.remove('slide-prev', 'slide-next');
        upd_sliders_btns(wrapper, prev_btn, next_btn);

      }
    }

  }, false);

  wrapper.addEventListener('transitionstart', e => {
    if(e.target.classList.contains('slide') ) {
      e.target.classList.add('sliding');
    }
  }, false);

  wrapper.addEventListener('transitionend', e => {
    if((e.target.classList.contains('slide-prev') || e.target.classList.contains('slide-next')) ) {
      e.target.classList.remove('slide-on');
      upd_sliders_btns();
    }
    e.target.classList.remove('sliding');
  }, false);

  if(carousel.element && carousel.is_desktop) {
    upd_carousel_btns(carousel, prev_btn, next_btn);
  } else {
    upd_sliders_btns(wrapper, prev_btn, next_btn);
  }
});
