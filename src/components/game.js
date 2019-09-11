import React, { Component } from 'react';

import GameInfo from './game-info/game-info';
import Grid from './grid/grid';

import './game.scss';

class Game extends Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <GameInfo />
        </div>
        <div className="row">
          <Grid />
        </div>
      </div>
    );
  }
}

export default Game;
