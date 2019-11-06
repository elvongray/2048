import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './grid.scss';

import Tile from './tile/tile';

class Grid extends Component {
  static propTypes = {
    tiles: PropTypes.array.isRequired,
    gameOver: PropTypes.bool.isRequired,
    restartGame: PropTypes.func.isRequired,
  };

  render() {
    const { tiles, gameOver, restartGame } = this.props;
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
        {gameOver && (
          <div className="game-over-container">
            <div className="game-over">
              <div className="text">Game over!</div>
              <button
                type="button"
                className="button"
                onClick={() => restartGame()}
              >
                Try again
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Grid;
