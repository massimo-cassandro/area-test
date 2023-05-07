import './App.scss';
import React from 'react';
import getData from './google-sheets-data-provider';

import deco1 from './imgs/deco1.svg';
import deco2 from './imgs/deco2.svg';
import deco3 from './imgs/deco3.svg';
import deco4 from './imgs/deco4.svg';

function App() {
  const [content, setContent] = React.useState(null),
    [json, updJson] = React.useState(null);

  React.useEffect(() => {

    try {
      getData().then(result => updJson(result));

    } catch(e) {
      updJson(null);
      setContent('Error on data loading...');
    }

  }, []);


  React.useEffect(() => {

    /*
      [
        [
          {
            "Category": "Antipasti",
            "Name": "Caprese",
            "Description": "Tomatoes and mozzarella seasoned with oil and basil",
            "Price": 8,
            "Publish": true,
            "CategoryOrder": 1,
            "CategoryTranslation": "Hors d'oeuvre"
          }
          //...
        ],
        // ...
      ]

    */

    if(json?.length) {

      setContent(json.map((item, idx) => {

        // We get Category and CategoryTranslation from the first item
        return <React.Fragment key={idx}>
          <h2>{item[0].Category}</h2>
          {item[0].CategoryTranslation && <p lang="en" className='subtitle'>{item[0].CategoryTranslation}</p>}
          <ul>
            {item.map((row, idx) => {
              return <li key={idx}>
                <div className="name-wrapper">
                  <span className='name'>{row.Name}</span>
                  <span className='dotted-line'></span>
                  <span className='price'>{row.Price.toLocaleString('en-UK', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                    currency: 'EUR',
                    style: 'currency'
                  })}</span>
                </div>
                {row.Description && <div className="description">{row.Description}</div>}
              </li>;
            })}
          </ul>
          {idx < json.length -1 &&
            <div className="deco small"><img src={deco3} alt="" /></div>
          }
        </React.Fragment>;
      }));
    }

  }, [json]);


  return (<>
    <div className="menu">
      <h1>
        <img src={deco1} alt="" />
        Menu
        <img src={deco1} alt="" />
      </h1>
      <div className="deco"><img src={deco2} alt="" /></div>

      {content? content : <p className='big'>Loading...</p>}

      <div className="deco"><img src={deco4} alt="" /></div>

      <p className='small'><a href="https://www.freepik.com/free-vector/decorative-lines_4249919.htm">Images by rawpixel.com</a> on Freepik</p>
      <p className='small'><a href="https://github.com/massimo-cassandro/area-test/tree/main/2022-10-google-sheets-react">Source code</a></p>
    </div>
  </>);
}

export default App;
