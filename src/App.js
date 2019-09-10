import React, { Component } from 'react';
import './App.css';
import Events from './components/Events';

class App extends Component {

  render() {
    return (
      <div className="events">
        <Events/>
      </div>
    );
  }
}

export default App;