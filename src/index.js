import React, { Component } from 'react';
import { render } from 'react-dom';

class Game extends Component {
  render() {
    return <div className="container">This is working!</div>;
  }
}

render(<Game />, document.getElementById('app'));
