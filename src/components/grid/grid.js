import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Hammer from 'hammerjs';

import './grid.scss';

import Tile from './tile/tile';

class Grid extends Component {
  static propTypes = {
    tiles: PropTypes.array.isRequired,
    gameOver: PropTypes.bool.isRequired,
    gameWon: PropTypes.bool.isRequired,
    handleSwipe: PropTypes.func.isRequired,
    restartGame: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.gridRef = React.createRef();
  }

  componentDidMount() {
    const hammertime = new Hammer(this.gridRef.current);
    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    hammertime.on('swipeup', () => this.props.handleSwipe({ direction: 'up' }));
    hammertime.on('swipedown', () =>
      this.props.handleSwipe({ direction: 'down' }),
    );
    hammertime.on('swipeleft', () =>
      this.props.handleSwipe({ direction: 'left' }),
    );
    hammertime.on('swiperight', () =>
      this.props.handleSwipe({ direction: 'right' }),
    );
  }

  render() {
    const { tiles, gameOver, restartGame, gameWon } = this.props;
    const gameCells = [1, 2, 3, 4].map(key => (
      <div className="rowe" key={key}>
        <div className="column column-21" />
        <div className="column column-21" />
        <div className="column column-21" />
        <div className="column column-21" />
      </div>
    ));

    return (
      <div
        className="column column-100 game-arena-container"
        ref={this.gridRef}
      >
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
        {(gameOver || gameWon) && (
          <div className="game-over-container">
            <div className="game-over">
              {gameOver && <div className="text">Game over!</div>}
              {gameWon && <div className="text">You won the game!</div>}
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
