import { slideshow_sizes } from './slideshow-sizes';
// import { useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import imageIcon from '../imgs/image-fill.svg'; // from https://phosphoricons.com
import { Blurhash } from "react-blurhash";

// `fm` parameter, in order of use, the last is the default one (accepted by all browsers)
// https://docs.imgix.com/apis/rendering/format/fm
const img_formats = ['avif', 'webp', 'pjpg'],

  // required for unsplash api
  utm_params = 'utm_source=demo%20for%20Medium%20article&utm_medium=referral';

function UnsplashSlideshowItem(props) {

  return (
    <div className={classnames('unsplash-slideshow-inner', props.className)}>

      {/*
        blurhash
        https://blurha.sh/
        https://github.com/woltapp/blurhash
        https://github.com/woltapp/blurhash/tree/master/TypeScript
        https://github.com/mad-gooze/fast-blurhash
        https://blog.scaleflex.com/the-ultimate-guide-to-fast-loading-websites-with-blurhash/
        https://codesandbox.io/s/blurhash-preview-forked-70zbjx
        https://www.npmjs.com/package/react-blurhash
      */}
      {props.img.blur_hash && <Blurhash
        hash={props.img.blur_hash}
        width={props.size.w}
        height={props.size.h}
        className="blurhash"
      />}

      <picture>
        {slideshow_sizes.map((brk, idx) => {
          const is_last_brk = idx === slideshow_sizes.length - 1;

          return img_formats.map(fmt => {
            const is_default_fmt = fmt === img_formats.at(-1);

              // https://unsplash.com/documentation#supported-parameters
              // https://docs.imgix.com/apis/rendering/size/w
              // https://docs.imgix.com/apis/rendering/size/h
              // https://docs.imgix.com/apis/rendering/size/ar
              // https://docs.imgix.com/apis/rendering/size/fit
              // https://docs.imgix.com/apis/rendering/size/crop
              // https://docs.imgix.com/apis/rendering/format/q
              // https://docs.imgix.com/apis/rendering/pixel-density/dpr

            const base_url = props.img.base_url + (/\?/.test(props.img.base_url)? '&' : '?') +
              'fit=crop&crop=focalpoint' + // top, bottom, left, right, faces, focalpoint, edges, entropy
              '&q=80' +
              `&w=${brk.w}&h=${brk.h}` +
              `&fm=${fmt}`,

              srcset_url = base_url + (brk.dpr2? ` 1x, ${base_url}&dpr=2 2x` : '');

            if(is_last_brk && is_default_fmt) {
              return <img
                key={crypto.randomUUID()}
                // data-id="${props.img.id}"
                src={base_url}
                srcSet={srcset_url !== base_url? srcset_url : null}
                alt={props.img.alt_description?? `Photo ${props.img.author} / Unsplash`}
                width={brk.w}
                height={brk.h}
                onLoad={props.img.blur_hash? e => {
                  e.target.closest('.unsplash-slideshow-inner').querySelector('.blurhash')?.remove()
                 } : null }
              />;

            } else {
              return <source
                key={crypto.randomUUID()}
                srcSet={srcset_url}
                type={is_default_fmt? null : `image/${fmt}`}
                media={brk.mq}
                width={brk.w}
                height={brk.h}
              />;
            }
          });
        })}
      </picture>
      <div className="message"><div>{props.text}</div></div>
      <div className="credits">
        {/* <span>{props.img.description}</span> */}
        <span>Photo <a href={`${props.img.author_profile}?${utm_params}`} target="_blank" rel="noopener noreferrer">
          {props.img.author} / Unsplash
        </a></span>
      </div>
      <div className="img-link">
        <a href={props.img.unsplash_url} target="_blank" rel="noopener noreferrer" title="Go to image page">
          <img src={imageIcon} alt="Img icon" />
        </a>
      </div>
    </div>
  );

}

// https://it.reactjs.org/docs/typechecking-with-proptypes.html

UnsplashSlideshowItem.propTypes = {
  img: PropTypes.object.isRequired,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  size: PropTypes.shape({
    w: PropTypes.number,
    h: PropTypes.number
  }),
  isFirst: PropTypes.bool
};
UnsplashSlideshowItem.defaultProps = {
  isFirst: false
};

export {UnsplashSlideshowItem};
