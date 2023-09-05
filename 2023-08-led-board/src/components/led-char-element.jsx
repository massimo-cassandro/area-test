import ledChars from './led-chars.svg';
import {chars_list} from './chars_list';


import React from 'react';
import PropTypes from 'prop-types';
// import classnames from 'classnames';
// import styles from './led-char-element.module.scss';

function LedChar(props) {
  const [currentChar, setChar] = React.useState(null);

  React.useEffect(() => {

    if(props.animation) {

      try {

        const ledChar = (props.char === ' '? null : props.char)?? null;

        const charIndex = chars_list.indexOf(ledChar),
          animationDelay = 80;

        (async () => {

          let charIdx = Math.max(0, charIndex - 12); // ensure there will be max 12 chars to be cycled
          (function cycleRandomChars(){
            setChar(chars_list[charIdx]);
            charIdx++;
            if(charIdx <= charIndex) {
              setTimeout(cycleRandomChars, animationDelay);
            }
          })();
        })();

      } catch(e) {

        console.error( e ); // eslint-disable-line
      } // finally {}


    } else {
      setChar(props.char);
    }

  }, [props.animation, props.char]);

  // React.useEffect(() => {

  // }, []);

  return (<svg className={props.className} viewBox="0 0 30 42">
    <use href={`${ledChars}#${currentChar?? 'space'}`}></use>
  </svg>);
}

// https://it.reactjs.org/docs/typechecking-with-proptypes.html

LedChar.propTypes = {
  char: PropTypes.string,
  className: PropTypes.string,
  animation: PropTypes.bool
};
LedChar.defaultProps = {
  char: null,
  animation: true
};

export default LedChar;
