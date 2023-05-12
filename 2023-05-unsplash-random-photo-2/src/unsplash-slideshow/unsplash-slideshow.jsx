import { Loader } from './loader';
import { UnsplashSlideshowItem } from './unsplash-slideshow-item';
import { slideshow_texts } from './slideshows-texts';
import classnames from 'classnames';
import { useRef, useEffect, useState } from 'react';


// https://unsplash.com/documentation
// https://unsplash.com/documentation#get-a-random-photo


// production url
const url = process.env.NODE_ENV === 'production'? process.env.REACT_APP_GET_PHOTOS

  // development
  : 'https://api.unsplash.com/photos/random' +
    '?collections=OASjmaGzTus' +
    // "&orientation=landscape" + // landscape, portrait, squarish
    `&client_id=${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}` +
    '&count=8';


function UnsplashSlideshow() {
  const [jsonData, setJsonData] = useState(),
    [size, setSize] = useState(null),
    [currentSlide, setCurrentSlide] = useState(null),
    [prevSlide, setPrevSlide] = useState(0),
    [content, setContent] = useState(),
    [texts, setTexts] = useState(),
    containerRef = useRef(null)
    // texts = slideshow_texts.sort(() => Math.random() - 0.5)
  ;

  useEffect(() => {

    // for blurhash
    setSize({w: containerRef.current.offsetWidth, h: containerRef.current.offsetHeight});

    (async () => {
      const response = await fetch(url);

      if (!response.ok) {
        /* eslint-disable no-console */
        console.error('Ajax error on: ' + url);
        console.error(response);
        /* eslint-enable no-console */
        throw new Error(`Loading error: ${response.status}`);
      }

      const data = await response.json();
      return data;

    })()
      .then(data => {
        setTexts(slideshow_texts.sort(() => Math.random() - 0.5))
        setJsonData(data);
      });

  }, []);


  useEffect(() => {

    if(jsonData) {

      setContent(jsonData.map((item, idx) => {
        return <UnsplashSlideshowItem
          key={crypto.randomUUID()}
          img={{
            // id               : item.id,
            // color            : item.color,
            // width            : item.width,
            // height           : item.height,
            // description      : item.description,
            // location         : item.location.name,
            alt_description  : item.alt_description?? item.description,
            // date             : item.created_at,
            base_url         : item.urls.raw,
            unsplash_url     : item.links.html,
            author           : item.user.name?? item.user.username,
            author_profile   : item.user.links.html,
            blur_hash        : item.blur_hash
          }}
          size={size}
          text={texts[idx]}
          className={classnames({
            on: idx === currentSlide,
            off: idx === prevSlide
          })}
        />;
      }));
    }

  }, [currentSlide, jsonData, prevSlide, size, texts]);


  // slideshow
  useEffect(() => {

    if(containerRef && jsonData) {
      setTimeout(() => {
        const nextSlide = ((currentSlide?? 0) + 1) % jsonData.length;
        setPrevSlide(currentSlide?? 0);
        setCurrentSlide( nextSlide );
      }, 4000);
    }

  }, [content, currentSlide, jsonData]);

  return (
    <div className='unsplash-slideshow' ref={containerRef}>
      {content || <Loader />}
    </div>
  );
}

export {UnsplashSlideshow};
