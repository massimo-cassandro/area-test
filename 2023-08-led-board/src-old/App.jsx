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
      <LedBoard text="Nella magia del Mediterraneo"/>
    </div>
    <footer>Nodes count: {nodes?? '&mdash;'}</footer>
  </>);
}

export default App;
