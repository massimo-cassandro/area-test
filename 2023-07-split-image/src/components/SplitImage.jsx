
import { getUnsplahRandomPhoto } from '../js/get-unsplash-random-photo';
import randomcolor from 'randomcolor';

import PropTypes from 'prop-types';
// import classnames from 'classnames';
import React from 'react';
import styles from './SplitImage.module.scss';

function SplitImage(props) {
  const [content, setContent] = React.useState(<div className={styles.loading}>Loading...</div>),
    // wrapper = React.useRef(null),
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

      // https://github.com/davidmerfield/randomColor
      const colors = randomcolor({ count: props.stripes, hue: unsplashData.color }),
        maxDuration = 1.5,
        minDuration = .5;

      setContent(
        <div className={styles.outerWrapper} style={{
          '--img': `url(${imgUrl})`,
          '--items': props.stripes,
          '--max-duration': `${maxDuration}s`
        }}>
          <div className={styles.imgStripesWrapper}>
            {[...Array(props.stripes)].map((_, idx) => {
              return <div className={styles.imgStripeItem} key={idx}
                style={{
                  '--idx': idx,
                  '--color': colors[idx],
                  '--duration': 	`${(Math.random() * (maxDuration - minDuration) + minDuration).toFixed(2)}s`
                }}><div></div></div>; //additional div needed for proper image placement
            })}
          </div>
          <div className={styles.credits}>
            <span>Photo <a href={`${unsplashData.author_profile}?utm_source=github-demo&utm_medium=referral`}>
              {unsplashData.author} / Unsplash
            </a></span>
            <span>{unsplashData.description}
              {unsplashData.location && <span className={styles.location}> ({unsplashData.location})</span>}
              {' '}
              <a className={styles.photoLink} href={`${unsplashData.unsplash_url}?utm_source=github-demo&utm_medium=referral`} target="_blank" rel="noopener noreferrer">[orig. photo]</a>
            </span>
          </div>
        </div>
      );
    }

  }, [imgUrl, props.stripes, unsplashData]);




  return ( content );

}

// https://it.reactjs.org/docs/typechecking-with-proptypes.html

SplitImage.propTypes = {
  stripes: PropTypes.number
};
SplitImage.defaultProps = {
  stripes: 10
};

export default SplitImage;
