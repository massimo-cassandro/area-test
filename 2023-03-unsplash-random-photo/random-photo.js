import { decode } from './blurhash/dist/esm/index.js';



// https://unsplash.com/documentation
// https://unsplash.com/documentation#get-a-random-photo

const container = document.querySelector('.container'),
  credits_container = document.querySelector('.credits'),
  reload_btn = document.querySelector('.reload'),
  full_img_btn = document.querySelector('.full-img-trigger'),
  slideshow_btn = document.querySelector('.slideshow'),
  photo_link = document.querySelector('.photo-link');

let slideshowOn = false, getUnsplashDataUrl;

if(document.location.host === '[::1]:8000') {

  // local testing
  const {access_key} = await import('./apikey.js');

  const collections_ids = '3660951', // comma separated
    orientation = 'landscape'; // landscape, portrait, squarish, null

  getUnsplashDataUrl = 'https://api.unsplash.com/photos/random' +
  `?collections=${collections_ids}` +
    (orientation? `&orientation=${orientation}` : '') +
    `&client_id=${access_key}`;

} else {

  // production
  getUnsplashDataUrl = 'https://primominuto.altervista.org/proxy/getUnsplashPhotos.php?m=tfc4lmFw';
}


const sizes = [
  {w: 2560, ratio: 16/9},
  {w: 1920, ratio: 16/9},
  {w: 1400, ratio: 16/9},
  {w: 1280, ratio: 16/9},
  {w: 1024, ratio: 4/3},
  {w: 760, ratio: 4/3},
  {w: 400, ratio: 9/21},
].map(size => ({...size, h: Math.ceil(size.w / size.ratio)}) );

const sizesAttr = sizes.map(s => `(width <= ${s.w}px and min-aspect-ratio: ${s.ratio.toFixed(3)}) ${s.w}px`).join(',');
const formats = ['avif', 'webp', 'pjpg']; // `fm` parameter, in order of use

// helper function to create dom elements
const creatEl = (tag, props = {}, ...children) => {
  const element = Object.assign(document.createElement(tag), props);
  element.append(...children);
  return element;
};

const load_image = async () => {

  container.classList.remove('show');

  let unsplashData;

  try {
    const response = await fetch(getUnsplashDataUrl),
      data = await response.json();

    // getting needed data only
    /*
    sample:
    {
      "id": "38-p-NVIWh8",
      "color": "#8ca6c0",
      "width": 6056,
      "height": 3785,
      "alt_description": "a long wooden bridge over a body of water",
      "date": "2024-03-08T08:05:06Z",
      "base_url": "https://images.unsplash.com/photo-1709884735646-897b57461d61?ixid=M3w0MjA3MTl8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzQwMjEwNDJ8&ixlib=rb-4.1.0",
      "unsplash_url": "https://unsplash.com/photos/a-long-wooden-bridge-over-a-body-of-water-38-p-NVIWh8",
      "author": "Nikolai Lehmann",
      "author_profile": "https://unsplash.com/@nl_lehmann",
      "blur_hash": "LHH2=..TIVtm^*aiIT-=.9V@9Ft8",
      "image_description": "a long wooden bridge over a body of water / Lucerna, Schweiz"
    }
    */
    unsplashData = {
      id               : data.id,
      color            : data.color,
      width            : data.width,
      height           : data.height,
      description      : data.description,
      location         : data.location?.name,
      alt_description  : data.alt_description,
      date             : data.created_at,
      base_url         : data.urls.raw,
      unsplash_url     : data.links.html,
      author           : data.user.name?? data.user.username,
      author_profile   : data.user.links.html,
      blur_hash        : data.blur_hash
    };


  } catch(err) {
    /* eslint-disable no-console */
    console.error(getUnsplashDataUrl);
    console.error(err);
    /* eslint-enable no-console */
  }

  // https://unsplash.com/documentation#supported-parameters
  // https://docs.imgix.com/apis/rendering/size/w
  // https://docs.imgix.com/apis/rendering/size/h
  // https://docs.imgix.com/apis/rendering/size/ar
  // https://docs.imgix.com/apis/rendering/size/fit
  // https://docs.imgix.com/apis/rendering/size/crop
  // https://docs.imgix.com/apis/rendering/format/q

  const base_url = new URL(unsplashData.base_url);
  const searchParams = new URLSearchParams(base_url.search);

  [
    ['fit', 'crop'],
    ['crop', 'faces,entropy,edges'], // top, bottom, left, right, faces, focalpoint, edges, and entropy
    ['q', '60'],
  ].forEach(param => searchParams.set(...param));

  container.querySelector('picture')?.remove();

  const pictureEl = document.createElement('picture');

  formats.map(fmt => {
    const is_default_fmt = fmt === formats.at(-1);

    const srcsetArray = [];
    searchParams.set('fmt', fmt);

    sizes.forEach(size => {
      searchParams.set('w', size.w);
      searchParams.set('h', size.h);
      base_url.search = searchParams.toString();
      srcsetArray.push({url: base_url.toString(), size: size.w});
    });

    const srcsetAttr = srcsetArray.map(item => `${item.url} ${item.size}w`).join(',');

    let pictureInnerEl;

    if(is_default_fmt) {

      pictureInnerEl = document.createElement('img');
      pictureInnerEl.alt = unsplashData.alt_description?? `${unsplashData.author} / Unsplash`;
      pictureInnerEl.src = srcsetArray[Math.floor(srcsetArray.length / 2)].url;

    } else {

      pictureInnerEl = document.createElement('source');
      pictureInnerEl.type = `image/${fmt}`;
    }
    pictureInnerEl.srcset = srcsetAttr;
    pictureInnerEl.sizes = sizesAttr;

    pictureEl.appendChild(pictureInnerEl);

  }); // end formats.map


  container.insertAdjacentElement('afterbegin', pictureEl);

  const img = document.querySelector('img');

  // blurhash
  // https://blurha.sh/
  // https://github.com/woltapp/blurhash
  // https://github.com/woltapp/blurhash/tree/master/TypeScript
  // https://github.com/mad-gooze/fast-blurhash
  // https://blog.scaleflex.com/the-ultimate-guide-to-fast-loading-websites-with-blurhash/
  // https://codesandbox.io/s/blurhash-preview-forked-70zbjx

  const pixels = decode(unsplashData.blur_hash, img.width, img.height);

  container.querySelector('canvas')?.remove();
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(window.innerWidth, window.innerHeight);
  imageData.data.set(pixels);
  ctx.putImageData(imageData, 0, 0);

  container.insertAdjacentElement('afterbegin', canvas);

  img.onload = () => {
    container.classList.add('show');
  };

  // photo credits
  const description = [unsplashData.description, unsplashData.location]
    .filter(Boolean)
    .join (' / ');

  photo_link.querySelector('a').href = `${unsplashData.unsplash_url}?utm_source=test-app&utm_medium=referral`;



  credits_container.replaceChildren(
    creatEl('span', { textContent: description }),
    creatEl('span', { textContent: 'Photo ' },
      creatEl('a', {
        href: `${unsplashData.author_profile}?utm_source=test-app&utm_medium=referral`,
        textContent: `${unsplashData.author} / Unsplash`
      })
    )
  );
}; // end load_image

let timeoutID;
function runSlideShow() {

  if(slideshowOn) {
    timeoutID = setTimeout(async () => {
      await load_image();
      runSlideShow();
    }, 12000);
  } else {
    clearTimeout(timeoutID);
  }
}

reload_btn.addEventListener('click', async () => {
  await load_image();
  // container.classList.remove('full-img');
}, false);

full_img_btn.addEventListener('click', () => {
  container.classList.toggle('full-img');
  full_img_btn.querySelectorAll('img').forEach(im => im.classList.toggle('off'));
}, false);

slideshow_btn.addEventListener('click', () => {
  slideshow_btn.classList.toggle('off');
  slideshowOn = !slideshow_btn.classList.contains('off');
  runSlideShow();
});

load_image();

