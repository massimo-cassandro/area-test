import React from 'react';
import LedBoard from './components/led-board';

function App() {
  const [nodes, updNodes] = React.useState(null);

  React.useEffect(() => {

    updNodes(document.querySelectorAll('*').length);
  }, []);

  return (<>
    <div className='app'>
      <h1>Led Board</h1>
      <LedBoard text={[
        ['Acme', 'Lorem ipsum', 'Dolor sit amet', 'New York', '22-set-2023', '€1455'],
        ['Abcd', 'Provident ea qui', 'Maiorca', '31-ago-2023', '€1799'],
        ['Acme Inc.', 'Error quia facilis', 'Paris', '05-set-2023', '€866']
      ]} />
    </div>
    <footer>Nodes count: {nodes?? '&mdash;'}</footer>
  </>);
}

export default App;
