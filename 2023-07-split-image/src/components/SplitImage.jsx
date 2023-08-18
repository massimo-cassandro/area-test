
import { getUnsplahRandomPhoto } from '../js/get-unsplash-random-photo';
import randomColor from '../external-libs/randomColor';

import PropTypes from 'prop-types';
// import classnames from 'classnames';
import React from 'react';
// import styled from 'styled-components';

function SplitImage(props) {
  const [content, setContent] = React.useState(<div className="loading">Loading...</div>),
    wrapper = React.useRef(null),
    [unsplashData, setUnsplashData] = React.useState(null),
    [imgUrl, setImgUrl] = React.useState(null);

  React.useEffect(() => {

    (async () => {
      const unsplashFoto = await getUnsplahRandomPhoto();
      return unsplashFoto;
    })()
      .then(data => {

        const image_url = data.base_url + (/\?/.test(data.base_url)? '&' : '?') +
          'fit=crop&crop=focalpoint' + // top, bottom, left, right, faces, focalpoint, edges, and entropy
          '&q=80' +
          'auto=format' +
          '&w=1600&h=1200';
          // `&fm=${fmt}`;

        const img = new Image();
        img.onload = () => {
          setUnsplashData(data);
          setImgUrl(image_url);
        };

        img.src = image_url;
      });


  }, []);



  React.useEffect(() => {

    if(unsplashData && imgUrl) {
      const colors = randomColor({ count: props.sections, hue: unsplashData.color }),
        maxDuration = 1.5,
        minDuration = .5;

      setContent(
        <div className="outer-wrapper" style={{
          '--img': `url(${imgUrl})`,
          '--items': props.sections,
          '--max-duration': `${maxDuration}s`
        }}>
          <div ref={wrapper} className='img-split-wrapper'>
            {[...Array(props.sections)].map((_, idx) => {
              return <div className="img-split-item" key={idx}
                style={{
                  '--idx': idx,
                  '--color': colors[idx],
                  '--duration': 	`${(Math.random() * (maxDuration - minDuration) + minDuration).toFixed(2)}s`
                }}><div></div></div>; //additional div needed for proper image placement
            })}
          </div>
          <div className="credits">
            <span>Photo <a href={`${unsplashData.author_profile}?utm_source=github-demo&utm_medium=referral`}>
              {unsplashData.author} / Unsplash
            </a></span>
            <span>{unsplashData.description}
              {unsplashData.location && <span className="location"> ({unsplashData.location})</span>}
              {' '}
              <a className="photo-link" href={`${unsplashData.unsplash_url}?utm_source=github-demo&utm_medium=referral`} target="_blank" rel="noopener noreferrer">[orig. photo]</a>
            </span>
          </div>
        </div>
      );
    }

  }, [imgUrl, props.sections, unsplashData]);




  return ( content );

}

// https://it.reactjs.org/docs/typechecking-with-proptypes.html

SplitImage.propTypes = {
  sections: PropTypes.number
};
SplitImage.defaultProps = {
  sections: 10
};

export default SplitImage;
