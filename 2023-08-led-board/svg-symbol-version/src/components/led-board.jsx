
// import React from 'react';
import PropTypes from 'prop-types';
// import classnames from 'classnames';
import styles from './led-board.module.scss';
import LedBoardSymbol from './led-board-symbol-component';
import { nanoid } from 'nanoid';

import {charsMap} from './chars-map.js';


function generateCustomProps(char) {
  if(!char || !charsMap[char]) {
    return null;
  } else {
    const style = {};
    charsMap[char].forEach(led_idx => {
      style[`--l-${led_idx}`] = 'var(--led-board-on)';
    });
    return style;
  }
}

function LedBoard(props) {
  // const Div = styled.div``;
  // const [var, setVar] = React.useState(__initial_state__);
  // React.useEffect(() => {}, []);

  // TODO accented chars
  const text_array = props.text.toUpperCase().split('');

  return (<div className={styles.leadBoardWrapper}>
    {[...Array(props.items)].map((_, i) => {



      return <svg style={generateCustomProps(text_array[i]?.trim()?? '')}
        key={nanoid(5)} className={styles.ledBoardElement} viewBox="0 0 30 42">
        <use href="#led-board-element"></use>
      </svg>;

    })}
    <LedBoardSymbol />
  </div>);
}


// https://it.reactjs.org/docs/typechecking-with-proptypes.html

LedBoard.propTypes = {
  // NB must be the least common multiple of the grid-template-columns values of all css breakpoints
  items: PropTypes.number.isRequired,

  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      string: PropTypes.string,
      color: PropTypes.oneOf(['on', 'accent-1', 'accent-2'])
    })
  ])
};
LedBoard.defaultProps = {
  items: 96, // multiple of 12, 16 and 24
  text: null
};

export default LedBoard;
