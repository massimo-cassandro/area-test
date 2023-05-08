// import {access_key} from './apikey.js';
import {breakpoints} from './img-breakpoints.js';
import { decode } from './blurhash/dist/esm/index.js';

(() => {

  // https://unsplash.com/documentation
  // https://unsplash.com/documentation#get-a-random-photo

  const container = document.querySelector('.container'),
    credits_container = document.querySelector('.credits'),
    url = 'https://www.mazx.it/proxy/getUnsplasPhotos.php?m=tfc4lmFw',
    debug = true; // add debug info

  // local testing
  // const collections_ids = '3660951', // comma separated
  //   orientation = 'landscape', // landscape, portrait, squarish, null
  //   url = 'https://api.unsplash.com/photos/random' +
  //     `?collections=${collections_ids}` +
  //     (orientation? `&orientation=${orientation}` : '') +
  //     `&client_id=${access_key}`;


  (async () => {
    const response = await fetch(url);
    if (!response.ok) {
      /* eslint-disable no-console */
      console.error('Ajax error on: ' + url);
      console.error(response);
      /* eslint-enable no-console */
      throw `Loading error: ${response.status}`;
    }
    const data = await response.json();
    return data;
  })()
    .then(data => {

      // used data
      const photo = {
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

      // console.log(photo);



      // https://docs.imgix.com/apis/rendering/format/fm
      const formats = ['avif', 'webp', 'pjpg']; // `fm` parameter, in order of use

      container.insertAdjacentHTML('afterbegin',
        `<picture>
          ${breakpoints.map((brk, idx) => {

            const is_last_brk = idx === breakpoints.length - 1;
            return formats.map(fmt => {
              const is_default_fmt = fmt === formats.at(-1),

                // https://unsplash.com/documentation#supported-parameters
                // https://docs.imgix.com/apis/rendering/size/w
                // https://docs.imgix.com/apis/rendering/size/h
                // https://docs.imgix.com/apis/rendering/size/ar
                // https://docs.imgix.com/apis/rendering/size/fit
                // https://docs.imgix.com/apis/rendering/size/crop
                // https://docs.imgix.com/apis/rendering/format/q

              src_url = is2x => {
                let url = photo.base_url + (/\?/.test(photo.base_url)? '&' : '?') +
                  'fit=crop&crop=focalpoint' + // top, bottom, left, right, faces, focalpoint, edges, and entropy
                  '&q=80' +
                  `&w=${brk.w}&h=${brk.h}` +
                  `&fm=${fmt}`;

                if(debug) {
                  url += `&txt=${encodeURI(`${brk.name}${is2x? '+2x' : ''}`)}` +
                    '&txt-pad=20' +
                    '&txt-font=Arial+Narrow+Bold' +
                    '&txt-align=middle,center' +
                    // '&txt-y=100' +
                    `&txt-size=${brk.name === 'xs'? '24' : brk.name === 'sm'? '36' : '48'}` +
                    '&txt-color=FFFFFF' +
                    // '&txt-line=1' +
                    '&txt-shad=10' +
                    '&txt-line-color=ffffff';
                }
                return url;
              };

              if(is_last_brk && is_default_fmt) {

                return `<img
                  style
                  src="${src_url()}"
                  srcset="${src_url()}${brk.dpr2? ` 1x, ${src_url(true)}&dpr=2 2x` : ''}"
                  alt="${photo.alt_description?? `${photo.author} / Unsplash`}"
                  width="${brk.w}" height="${brk.h}">`;

              } else {
                return `<source
                  srcset="${src_url()}${brk.dpr2? ` 1x, ${src_url(true)}&dpr=2 2x` : ''}"
                  ${!is_default_fmt? `type="image/${fmt}"` : ''}
                  media="${brk.mq}"
                  width="${brk.w}" height="${brk.h}">`;
              }
            }).join('');
          }).join('')}
        </picture>`
      );

      const img = document.querySelector('img');

      // blurhash
      // https://blurha.sh/
      // https://github.com/woltapp/blurhash
      // https://github.com/woltapp/blurhash/tree/master/TypeScript
      // https://github.com/mad-gooze/fast-blurhash
      // https://blog.scaleflex.com/the-ultimate-guide-to-fast-loading-websites-with-blurhash/
      // https://codesandbox.io/s/blurhash-preview-forked-70zbjx

      const pixels = decode(photo.blur_hash, img.width, img.height);

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      const imageData = ctx.createImageData(img.width, img.height);
      imageData.data.set(pixels);
      ctx.putImageData(imageData, 0, 0);

      container.insertAdjacentElement('afterbegin', canvas);

      img.onload = () => {
        document.querySelector('.loader-wrapper')?.remove();
        img.classList.add('show');
      };

      // photo credits
      const description = [photo.description, photo.location]
        .filter(i => i != null)
        .join (' / ');

      credits_container.innerHTML =
        `<span>${description}
          <a class="arrow" href="${photo.unsplash_url}?utm_source=test-app&utm_medium=referral">&#8618;</a>
        </span>
        <span>Photo <a href="${photo.author_profile}?utm_source=ada&utm_medium=referral">
          ${photo.author} / Unsplash
        </a></span>`;
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.error(error);
    });



})();
