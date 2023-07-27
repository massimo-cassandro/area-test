
import { getUnsplahRandomPhoto } from '../js/get-unsplash-random-photo';
import randomColor from '../external-libs/randomColor';

import PropTypes from 'prop-types';
// import classnames from 'classnames';
import React from 'react';
// import styled from 'styled-components';

function Layout(props) {
  const [content, setContent] = React.useState(null),
    wrapper = React.useRef(null),
    [unsplashData, setUnsplashData] = React.useState(null);

  React.useEffect(() => {

    (async () => {
      const unsplashFoto = await getUnsplahRandomPhoto();
      return unsplashFoto;
    })()
      .then(data => setUnsplashData(data));

  }, []);

  React.useEffect(() => {

    if(unsplashData) {
      const colors = randomColor({ count: props.sections, hue: unsplashData.color }),
        maxDuration = 1.5,
        minDuration = .5,

        baseUrl = unsplashData.base_url + (/\?/.test(unsplashData.base_url)? '&' : '?') +
          'fit=crop&crop=focalpoint' + // top, bottom, left, right, faces, focalpoint, edges, and entropy
          '&q=80' +
          'auto=format' +
          '&w=1600&h=1200';
        // `&fm=${fmt}`;

      setContent(
        <div ref={wrapper} className='img-split-wrapper' style={{
          '--img': `url(${baseUrl})`,
          '--items': props.sections,
          '--max-duration': `${maxDuration}s`
        }}>
          {[...Array(props.sections)].map((_, idx) => {
            return <div className="img-split-item" key={idx}
              style={{
                '--idx': idx,
                '--color': colors[idx],
                '--duration': 	`${(Math.random() * (maxDuration - minDuration) + minDuration).toFixed(2)}s`
              }}><div></div></div>; // div aggiuntivo necessario per il corretto posizionamento dell'immagine

          })}

        </div>
      );
    }

  }, [props.sections, unsplashData]);




  return ( content );

}

// https://it.reactjs.org/docs/typechecking-with-proptypes.html

Layout.propTypes = {
  sections: PropTypes.number
};
Layout.defaultProps = {
  sections: 10
};

export default Layout;
