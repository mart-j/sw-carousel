import React, { FC } from 'react';
import data from './data/index'
import './App.css';
import Carousel from './components/carousel/Carousel';

const App: FC = () => {


  return (
    <>
    <h1 className="heading">Reusable Slider Component for any HTML content</h1>
      <Carousel>
        {data.map(({ description, title, button }, i) => {
          return (
            <div className="wrapper" key={`${i}`}>
              <h1>{title}</h1>
              <h3>{description}</h3>
              <div className="buttonWrapper">
                <button className="button">{button}</button>
              </div>
            </div>
          );
        })}
      </Carousel>
    </>
  );
};
export default App;
