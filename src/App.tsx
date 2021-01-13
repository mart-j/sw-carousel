import React, { FC } from 'react';
import './App.css';
import Carousel from './components/carousel/Carousel';

const App: FC = () => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <Carousel>
      {arr.map((item, i) => {
        return (
          <div className="wrapper" key={`${i}`}>
            <h1>{i}</h1>
            <h3>{i + 3}</h3>
          </div>
        );
      })}
    </Carousel>
  );
};
export default App;
