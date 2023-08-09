
// import React from 'react';
import PropTypes from 'prop-types';
// import classnames from 'classnames';
import styles from './led-board.module.scss';
import { nanoid } from 'nanoid';

import ledChars from './led-chars.svg';


function LedBoard(props) {
  // const Div = styled.div``;
  // const [var, setVar] = React.useState(__initial_state__);
  // React.useEffect(() => {}, []);

  // TODO accented chars
  // TODO cleaning chars
  // TODO a capo
  let text_array = props.text.toUpperCase().split('').map(i => i===' '? 'space' : i);



  return (<div className={styles.leadBoardWrapper}>
    {[...Array(props.items)].map((_, i) => {

      return <svg key={nanoid(5)} className={styles.ledBoardElement} viewBox="0 0 30 42">
        <use href={`${ledChars}#${text_array[i]?? 'space'}`}></use>
      </svg>;

    })}
  </div>);
}


// https://it.reactjs.org/docs/typechecking-with-proptypes.html

LedBoard.propTypes = {
  // NB must be the least common multiple of the grid-template-columns values of all css breakpoints
  items: PropTypes.number.isRequired,
  text: PropTypes.string
  // text: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     string: PropTypes.string,
  //     color: PropTypes.oneOf(['on', 'accent-1', 'accent-2'])
  //   })
  // )

};
LedBoard.defaultProps = {
  items: 96, // multiple of 12, 16 and 24
  // text: [{string: '', color: 'on'}]
};

export default LedBoard;
