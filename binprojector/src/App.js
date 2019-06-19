import React from 'react';
import logo from './logo.svg';
import './App.css';

import Projector from './components/Projector'
import ImagePreloader from './components/ImagePreloader'

function App() {
  return (
    <div className="App">
      <Projector />
      <ImagePreloader />
    </div>
  );
}

export default App;
