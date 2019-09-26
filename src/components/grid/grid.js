import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './grid.scss';

import Tile from './tile/tile';

class Grid extends Component {
  static propTypes = {
    tiles: PropTypes.array.isRequired,
  };

  render() {
    const { tiles } = this.props;
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
          {tiles.map(tile => {
            if (tile) {
              return (
                <Tile x={tile.x} y={tile.y} value={tile.value} key={tile.key} />
              );
            }
          })}
        </div>
      </div>
    );
  }
}

export default Grid;

[undefined, 1, 3, 4].map(value => {
  if (value) {
    return value;
  }
});
