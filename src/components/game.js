/* eslint-disable no-mixed-operators */
import React, { Component } from 'react';
import uuidv4 from 'uuid/v4';
import cloneDeep from 'lodash.clonedeep';

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
    if (keys[e.keyCode] === 'left') {
      this.moveTilesLeft();
    } else if (keys[e.keyCode] === 'right') {
      this.moveTilesRight();
    } else if (keys[e.keyCode] === 'up') {
      this.moveTilesUp();
    } else if (keys[e.keyCode] === 'down') {
      this.moveTilesDown();
    }
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

  moveCurrentTileLeft(currentTile, newTiles, index, cell) {
    let i = index;
    newTiles[index] = undefined;

    while (i >= cell) {
      if (i > cell && !newTiles[i - 1]) {
        i -= 1;
        continue;
      } else if (
        newTiles[i - 1] &&
        newTiles[i - 1].value === currentTile.value
      ) {
        const { x, y } = get2DCoordinate(i - 1);
        currentTile.value += newTiles[i - 1].value;
        newTiles[i - 1] = currentTile;
        newTiles[i - 1].cell = i - 1;
        newTiles[i - 1].x = x;
        newTiles[i - 1].y = y;
        break;
      } else {
        const { x, y } = get2DCoordinate(i);
        newTiles[i] = currentTile;
        newTiles[i].cell = i;
        newTiles[i].x = x;
        newTiles[i].y = y;
        break;
      }
    }
  }

  moveTilesLeft() {
    const { tiles } = this.state;
    let newTiles = cloneDeep(tiles);

    for (const [index, currentTile] of newTiles.entries()) {
      if (!currentTile) continue;

      if (index <= 3) {
        this.moveCurrentTileLeft(currentTile, newTiles, index, 0);
      }

      if (index >= 4 && index <= 7) {
        this.moveCurrentTileLeft(currentTile, newTiles, index, 4);
      }

      if (index >= 8 && index <= 11) {
        this.moveCurrentTileLeft(currentTile, newTiles, index, 8);
      }

      if (index >= 12 && index <= 15) {
        this.moveCurrentTileLeft(currentTile, newTiles, index, 12);
      }
    }

    this.setState({
      tiles: newTiles,
    });
  }

  moveCurrentTileRight(currentTile, newTiles, index, cell) {
    let i = index;
    newTiles[index] = undefined;

    while (i <= cell) {
      if (i < cell && !newTiles[i + 1]) {
        i += 1;
        continue;
      } else if (
        newTiles[i + 1] &&
        newTiles[i + 1].value === currentTile.value
      ) {
        const { x, y } = get2DCoordinate(i + 1);
        currentTile.value += newTiles[i + 1].value;
        newTiles[i + 1] = currentTile;
        newTiles[i + 1].cell = i + 1;
        newTiles[i + 1].x = x;
        newTiles[i + 1].y = y;
        break;
      } else {
        const { x, y } = get2DCoordinate(i);
        newTiles[i] = currentTile;
        newTiles[i].cell = i;
        newTiles[i].x = x;
        newTiles[i].y = y;
        break;
      }
    }
  }

  moveTilesRight() {
    const { tiles } = this.state;
    let newTiles = cloneDeep(tiles);

    for (let i = newTiles.length - 1; i >= 0; i--) {
      const currentTile = newTiles[i];
      if (!currentTile) continue;

      if (i >= 12 && i <= 15) {
        this.moveCurrentTileRight(currentTile, newTiles, i, 15);
      } else if (i >= 8 && i <= 11) {
        this.moveCurrentTileRight(currentTile, newTiles, i, 11);
      } else if (i >= 4 && i <= 7) {
        this.moveCurrentTileRight(currentTile, newTiles, i, 7);
      } else if (i <= 3) {
        this.moveCurrentTileRight(currentTile, newTiles, i, 3);
      }
    }

    this.setState({
      tiles: newTiles,
    });
  }

  moveCurrentTileUp(currentTile, newTiles, index, cell) {
    let i = index;
    newTiles[index] = undefined;

    while (i >= cell) {
      if (i > cell && !newTiles[i - 4]) {
        i -= 4;
        continue;
      } else if (
        newTiles[i - 4] &&
        newTiles[i - 4].value === currentTile.value
      ) {
        const { x, y } = get2DCoordinate(i - 4);
        currentTile.value += newTiles[i - 4].value;
        newTiles[i - 4] = currentTile;
        newTiles[i - 4].cell = i - 4;
        newTiles[i - 4].x = x;
        newTiles[i - 4].y = y;
        break;
      } else {
        const { x, y } = get2DCoordinate(i);
        newTiles[i] = currentTile;
        newTiles[i].cell = i;
        newTiles[i].x = x;
        newTiles[i].y = y;
        break;
      }
    }
  }

  moveTilesUp() {
    const { tiles } = this.state;
    let newTiles = cloneDeep(tiles);
    let firstColumn = [0, 4, 8, 12];
    let secondColumn = [1, 5, 9, 13];
    let thirdColumn = [2, 6, 10, 14];
    let fourthColumn = [3, 7, 11, 15];

    for (const [index, currentTile] of newTiles.entries()) {
      if (!currentTile) continue;

      if (firstColumn.includes(index)) {
        this.moveCurrentTileUp(currentTile, newTiles, index, 0);
      } else if (secondColumn.includes(index)) {
        this.moveCurrentTileUp(currentTile, newTiles, index, 1);
      } else if (thirdColumn.includes(index)) {
        this.moveCurrentTileUp(currentTile, newTiles, index, 2);
      } else if (fourthColumn.includes(index)) {
        this.moveCurrentTileUp(currentTile, newTiles, index, 3);
      }
    }

    this.setState({
      tiles: newTiles,
    });
  }

  moveCurrentTileDown(currentTile, newTiles, index, cell) {
    let i = index;
    newTiles[index] = undefined;

    while (i <= cell) {
      if (i < cell && !newTiles[i + 4]) {
        i += 4;
        continue;
      } else if (
        newTiles[i + 4] &&
        newTiles[i + 4].value === currentTile.value
      ) {
        const { x, y } = get2DCoordinate(i + 4);
        currentTile.value += newTiles[i + 4].value;
        newTiles[i + 4] = currentTile;
        newTiles[i + 4].cell = i + 4;
        newTiles[i + 4].x = x;
        newTiles[i + 4].y = y;
        break;
      } else {
        const { x, y } = get2DCoordinate(i);
        newTiles[i] = currentTile;
        newTiles[i].cell = i;
        newTiles[i].x = x;
        newTiles[i].y = y;
        break;
      }
    }
  }

  moveTilesDown() {
    const { tiles } = this.state;
    let newTiles = cloneDeep(tiles);
    let firstColumn = [0, 4, 8, 12];
    let secondColumn = [1, 5, 9, 13];
    let thirdColumn = [2, 6, 10, 14];
    let fourthColumn = [3, 7, 11, 15];

    for (let i = newTiles.length - 1; i >= 0; i--) {
      const currentTile = newTiles[i];
      if (!currentTile) continue;

      if (firstColumn.includes(i)) {
        this.moveCurrentTileDown(currentTile, newTiles, i, 12);
      } else if (secondColumn.includes(i)) {
        this.moveCurrentTileDown(currentTile, newTiles, i, 13);
      } else if (thirdColumn.includes(i)) {
        this.moveCurrentTileDown(currentTile, newTiles, i, 14);
      } else if (fourthColumn.includes(i)) {
        this.moveCurrentTileDown(currentTile, newTiles, i, 15);
      }
    }

    this.setState({
      tiles: newTiles,
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
