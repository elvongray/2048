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

const keys = {
  37: 'left',
  39: 'right',
  38: 'up',
  40: 'down',
  65: 'left',
  68: 'right',
  87: 'up',
  83: 'down',
};

class Game extends Component {
  state = {
    tiles: [],
    newGame: false,
  };

  componentDidMount() {
    this.initializeNewGrid();
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  handleKeyDown(e) {
    console.log(e);
  }

  getTile() {
    const tile1DCoordinate = generateRandomNo(NUMOFCELLS - 1);
    return {
      ...get2DCoordinate(tile1DCoordinate),
      cell: tile1DCoordinate,
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
    const tiles = Array(NUMOFCELLS);

    if (firstTile.x === secondTile.x && firstTile.y === secondTile.y) {
      this.initializeNewGrid();
      return;
    }

    tiles[firstTile.cell] = firstTile;
    tiles[secondTile.cell] = secondTile;

    this.setState({
      tiles,
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
