import React from 'react';
// import PropTypes from 'prop-types';
// import classnames from 'classnames';
import { nanoid } from 'nanoid';

function LedBoardSymbol(/* props */) {
  // const [var, setVar] = React.useState(__initial_state__);
  // React.useEffect(() => {}, []);

  function LedLights() {
    let gap  = 2, // space between circles
      radius = 2, // circles radius
      cy     = gap/2 + radius, // initial value
      idx    = 0
    ;

    const items = [];

    for(let row = 0; row < 7; row++) {
      let cx     = gap/2 + radius; // inital value
      for (let col = 0; col < 5; col++) {


        items.push(<circle cx={cx} cy={cy} r={radius} key={nanoid(5)} fill={`var(--led-${idx}, var(--led-board-off))`} />);
        cx += gap + radius * 2;
        idx++;
      }
      cy += gap + radius * 2;
    }
    return items;
  }

  return (
    <div hidden>
      <svg xmlns="http://www.w3.org/2000/svg">
        <symbol viewBox="0 0 30 42" id="led-board-element">
          <script>console.log(window.location.search)</script>
          <LedLights />
        </symbol>
      </svg>
    </div>
  );
}

// https://it.reactjs.org/docs/typechecking-with-proptypes.html

// LedBoardSymbol.propTypes = {};
// LedBoardSymbol.defaultProps = {};

export default LedBoardSymbol;
