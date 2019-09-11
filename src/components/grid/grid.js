import React, { Component } from 'react';

import './grid.scss';

import Tile from './tile/tile';

class Grid extends Component {
  render() {
    const gameCells = [1, 2, 3, 4].map(key => (
      <div className="rowe" key={key}>
        <div className="column column-21" />
        <div className="column column-21" />
        <div className="column column-21" />
        <div className="column column-21" />
      </div>
    ));

    return (
      <div className="column column-100 game-arena-container">
        <div className="grid-container">{gameCells}</div>
        <div className="tiles-container">
          <Tile x={0} y={0} value={32} />
        </div>
      </div>
    );
  }
}

export default Grid;
