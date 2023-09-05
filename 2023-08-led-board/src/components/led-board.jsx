
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './led-board.module.scss';
import { nanoid } from 'nanoid';

// import ledChars from './led-chars.svg';
import LedChar from './led-char-element';


// TODO accented chars
// TODO cleaning chars (remove dots. commas, etc)
// TODO text length check
// TODO define props.text

// FIX cycleText (raddoppia l'ultimo elemento, abbrevia il primo)

// TODO build from MatchMedia and props.items (remove grid from css?)
const rows = 8,
  items_per_row = 24;

function LedBoard(props) {
  const [thisOffer, setThisOffer] = React.useState(null),
    [text_array, setTextArray] = React.useState([]);


  React.useEffect(() => {
    if(props.text) {
      let idx = 0; // TODO random first idx?
      (function cycleText(){
        setThisOffer(props.text[idx]);
        idx++;
        if(idx >= props.text.length) {
          idx = 0;
        }
        setTimeout(cycleText, 5000); // TODO prop for delay

      })();
    }
  }, [props.text]);


  React.useEffect(() => {

    /*
      split text in subarrays according to `items_per_row` value and
      assigning color (first block: color on, second block: on-accent-1, ...)

      produces an array of arrays, the first element of each array is the string
      to display in the current (max `items_per_row` chars), the second element
      is the class to be applied (null, accent1 or accent2)
      [
        [string, className],
        ...
      ]

    */

    const classes = [null, 'accent1', 'accent2'];

    if(thisOffer) {

      setTextArray(
        thisOffer.map((string, idx) => {

          let subarray = [], this_string = '';

          string.trim().toUpperCase().split(' ').forEach(item => {

            // parola più lunga del consentito: viene aggiunta ma verrà tagliata
            // gestire nei controlli preliminari
            if(item.length > items_per_row && this_string === '') {
              subarray.push(item);

            } else if (item.length + this_string.length + 1 > items_per_row) { // +1 === space
              subarray.push(this_string);
              this_string = item;

            } else {
              this_string += (this_string? ' ' : '') + item;
            }

          });

          if(this_string) {
            subarray.push(this_string);
          }

          return subarray.map(item=> [item, classes[idx % classes.length]]);

        }).flat()
      ); // end setTextArray
    }

  }, [thisOffer]);



  return (<div className={styles.leadBoardWrapper}>
    {[...Array(rows)].map((_, rowIdx) => {

      const thisTextArray = text_array[rowIdx]?.[0]?.split('').map(i => i === ' '? 'space' : i)?? [],
        thisClassName = text_array[rowIdx]?.[1]?? null;

      return [...Array(items_per_row)].map((_, itemIdx) => {

        // eslint-disable-next-line no-lone-blocks
        {/* return <svg key={nanoid(5)} className={classnames(styles.ledBoardElement, (thisClassName? styles[thisClassName] : null) )} viewBox="0 0 30 42">
          <use href={`${ledChars}#${thisTextArray[itemIdx]?? 'space'}`}></use>
        </svg>; */}

        return <LedChar char={thisTextArray[itemIdx]} className={classnames(styles.ledBoardElement, (thisClassName? styles[thisClassName] : null) )} key={nanoid(5)} />;
      });

    })}
  </div>);
}


// https://it.reactjs.org/docs/typechecking-with-proptypes.html

LedBoard.propTypes = {
  // NB must be the least common multiple of the grid-template-columns values of all css breakpoints
  items: PropTypes.number.isRequired,
  text: PropTypes.array
  // text: PropTypes.string
  // text: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     string: PropTypes.string,
  //     color: PropTypes.oneOf(['on', 'accent-1', 'accent-2'])
  //   })
  // )

};
LedBoard.defaultProps = {
  items: 144, // multiple of 12, 16 and 24
  // text: [{string: '', color: 'on'}]
};

export default LedBoard;
