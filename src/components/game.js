/* eslint-disable no-mixed-operators */
import React, { Component } from 'react';
import uuidv4 from 'uuid/v4';

import GameInfo from './game-info/game-info';
import Grid from './grid/grid';

import './game.scss';

const randomTileList = [2, 2, 2, 4, 2, 2, 4, 2, 2, 4];
const COLOUMNSIZE = 4;
const NUMOFCELLS = 16;

const generateRandomNo = n => Math.ceil(Math.random() * n);

const get2DCoordinate = n => {
  const x = n % COLOUMNSIZE;
  const y = (n - x) / COLOUMNSIZE;

  return {
    x,
    y,
  };
};

const get1DCoordinate = ({ x, y }) => x + y * COLOUMNSIZE;

class Game extends Component {
  state = {
    tiles: [],
    newGame: false,
  };

  componentDidMount() {
    this.initializeNewGrid();
  }

  getTile() {
    return {
      ...get2DCoordinate(generateRandomNo(NUMOFCELLS)),
      key: uuidv4(),
      value: randomTileList[generateRandomNo(9)],
    };
  }

  restartGame() {
    this.initializeNewGrid();
  }

  initializeNewGrid() {
    const firstTile = this.getTile();
    const secondTile = this.getTile();

    if (firstTile.x === secondTile.x && firstTile.y === secondTile.y) {
      this.initializeNewGrid();
      return;
    }

    this.setState({
      tiles: [firstTile, secondTile],
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <GameInfo restartGame={() => this.restartGame()} />
        </div>
        <div className="row">
          <Grid tiles={this.state.tiles} />
        </div>
      </div>
    );
  }
}

export default Game;
