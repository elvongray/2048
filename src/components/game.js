/* eslint-disable operator-linebreak */
/* eslint-disable no-continue */
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

const controlKeys = {
  37: 'left',
  39: 'right',
  38: 'up',
  40: 'down',
  65: 'left',
  68: 'right',
  87: 'up',
  83: 'down',
};

//                                           X
// +---------------+                +-------------------+
// | 0 | 1 | 2 | 3 |                | 00 | 10 | 20 | 30 |
// +---------------+                +-------------------+
// | 4 | 5 | 6 | 7 |                | 01 | 11 | 21 | 31 |
// +---------------+ +----------->  +-------------------+ Y
// | 8 |  9| 10| 11|                | 02 | 12 | 22 | 32 |
// +---------------+                +-------------------+
// | 12| 13| 14| 15|                | 03 | 13 | 23 | 33 |
// +---------------+                +-------------------+
//                                  (x, y) -> (row, column)
//
// The 2048 game uses a 4 x 4 dimensional grid, in which tiles with values of the
// power of 2 can moved in four directions(up, down, left, right). In this implementation, a one dimensional array
// is used to compute the next position of the tiles. Each tiles contain info that is used to render
// The tile in 2 dimension as seen on the grid.
class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tiles: [],
    };
  }

  componentDidMount() {
    this.initializeNewGrid();
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  handleKeyDown(e) {
    if (controlKeys[e.keyCode] === 'left') {
      this.moveTilesLeft();
    } else if (controlKeys[e.keyCode] === 'right') {
      this.moveTilesRight();
    } else if (controlKeys[e.keyCode] === 'up') {
      this.moveTilesUp();
    } else if (controlKeys[e.keyCode] === 'down') {
      this.moveTilesDown();
    }

    if (Object.keys(controlKeys).includes(e.keyCode.toString())) {
      this.insertNewTileIntoGrid();
    }
  }

  getTile(tile1DCoordinate) {
    return {
      ...get2DCoordinate(tile1DCoordinate),
      cell: tile1DCoordinate,
      key: uuidv4(),
      value: randomTileList[generateRandomNo(randomTileList.length - 1)],
    };
  }

  restartGame() {
    this.initializeNewGrid();
  }

  initializeNewGrid() {
    const firstTile = this.getTile(generateRandomNo(NUMOFCELLS - 1));
    const secondTile = this.getTile(generateRandomNo(NUMOFCELLS - 1));
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

  // Find the empty cells in the grid and randomly select where
  // a new tile should be inserted
  insertNewTileIntoGrid() {
    const { tiles } = this.state;
    const emptyCells = [];

    for (const [index, tile] of tiles.entries()) {
      if (!tile) emptyCells.push(index);
    }

    const newTile = this.getTile(
      emptyCells[generateRandomNo(emptyCells.length - 1)],
    );
    tiles[newTile.cell] = newTile;

    this.setState({ tiles });
  }

  moveCurrentTileLeft(currentTile, currentTileList, index, cell) {
    let i = index;
    currentTileList[index] = undefined;

    while (i >= cell) {
      if (i > cell && !currentTileList[i - 1]) {
        i -= 1;
        continue;
      } else if (
        currentTileList[i - 1] &&
        currentTileList[i - 1].value === currentTile.value
      ) {
        const { x, y } = get2DCoordinate(i - 1);
        currentTile.value += currentTileList[i - 1].value;
        currentTileList[i - 1] = currentTile;
        currentTileList[i - 1].cell = i - 1;
        currentTileList[i - 1].x = x;
        currentTileList[i - 1].y = y;
        break;
      } else {
        const { x, y } = get2DCoordinate(i);
        currentTileList[i] = currentTile;
        currentTileList[i].cell = i;
        currentTileList[i].x = x;
        currentTileList[i].y = y;
        break;
      }
    }
  }

  /*
   * Move tiles to the left of the grid, here the grid is broken into
   * the four rows. Each of the rows are looped through to check if
   * there are cells that can be moved to the left or merged with each
   * other. Check the diagram above to see how the 1D array is mapped to the
   * 2D array
   */
  moveTilesLeft() {
    const { tiles } = this.state;
    const currentTileList = cloneDeep(tiles);

    for (const [index, currentTile] of currentTileList.entries()) {
      if (!currentTile) continue;

      // Move tiles on the first row to the left
      if (index <= 3) {
        this.moveCurrentTileLeft(currentTile, currentTileList, index, 0);
      }

      // Move tiles on the second row to the left
      if (index >= 4 && index <= 7) {
        this.moveCurrentTileLeft(currentTile, currentTileList, index, 4);
      }

      // Move tiles on the third row to the left
      if (index >= 8 && index <= 11) {
        this.moveCurrentTileLeft(currentTile, currentTileList, index, 8);
      }

      // Move tiles on the fourth row to the left
      if (index >= 12 && index <= 15) {
        this.moveCurrentTileLeft(currentTile, currentTileList, index, 12);
      }
    }

    this.setState({
      tiles: currentTileList,
    });
  }

  moveCurrentTileRight(currentTile, currentTileList, index, cell) {
    let i = index;
    currentTileList[index] = undefined;

    while (i <= cell) {
      if (i < cell && !currentTileList[i + 1]) {
        i += 1;
        continue;
      } else if (
        currentTileList[i + 1] &&
        currentTileList[i + 1].value === currentTile.value
      ) {
        const { x, y } = get2DCoordinate(i + 1);
        currentTile.value += currentTileList[i + 1].value;
        currentTileList[i + 1] = currentTile;
        currentTileList[i + 1].cell = i + 1;
        currentTileList[i + 1].x = x;
        currentTileList[i + 1].y = y;
        break;
      } else {
        const { x, y } = get2DCoordinate(i);
        currentTileList[i] = currentTile;
        currentTileList[i].cell = i;
        currentTileList[i].x = x;
        currentTileList[i].y = y;
        break;
      }
    }
  }

  /*
   * Move tiles to the right of the grid, here the grid is broken into
   * the four rows. Each of the rows are looped through to check if
   * there are cells that can be moved to the Right or merged with each
   * other.
   */
  moveTilesRight() {
    const { tiles } = this.state;
    const currentTileList = cloneDeep(tiles);

    for (let i = currentTileList.length - 1; i >= 0; i--) {
      const currentTile = currentTileList[i];
      if (!currentTile) continue;

      // Move tiles on the fourth row to the right
      if (i >= 12 && i <= 15) {
        this.moveCurrentTileRight(currentTile, currentTileList, i, 15);
      } else if (i >= 8 && i <= 11) {
        // Move tiles on the third row to the right
        this.moveCurrentTileRight(currentTile, currentTileList, i, 11);
      } else if (i >= 4 && i <= 7) {
        // Move tiles on the second row to the right
        this.moveCurrentTileRight(currentTile, currentTileList, i, 7);
      } else if (i <= 3) {
        // Move tiles on the first row to the right
        this.moveCurrentTileRight(currentTile, currentTileList, i, 3);
      }
    }

    this.setState({
      tiles: currentTileList,
    });
  }

  moveCurrentTileUp(currentTile, currentTileList, index, cell) {
    let i = index;
    currentTileList[index] = undefined;

    while (i >= cell) {
      if (i > cell && !currentTileList[i - 4]) {
        i -= 4;
        continue;
      } else if (
        currentTileList[i - 4] &&
        currentTileList[i - 4].value === currentTile.value
      ) {
        const { x, y } = get2DCoordinate(i - 4);
        currentTile.value += currentTileList[i - 4].value;
        currentTileList[i - 4] = currentTile;
        currentTileList[i - 4].cell = i - 4;
        currentTileList[i - 4].x = x;
        currentTileList[i - 4].y = y;
        break;
      } else {
        const { x, y } = get2DCoordinate(i);
        currentTileList[i] = currentTile;
        currentTileList[i].cell = i;
        currentTileList[i].x = x;
        currentTileList[i].y = y;
        break;
      }
    }
  }

  /*
   * Move tiles to the top of the grid, here the grid is broken into
   * the four coloumns. Each of the coloumns are looped through to check if
   * there are cells that can be moved to the Top or merged with each
   * other.
   */
  moveTilesUp() {
    const { tiles } = this.state;
    const currentTileList = cloneDeep(tiles);
    const firstColumn = [0, 4, 8, 12];
    const secondColumn = [1, 5, 9, 13];
    const thirdColumn = [2, 6, 10, 14];
    const fourthColumn = [3, 7, 11, 15];

    for (const [index, currentTile] of currentTileList.entries()) {
      if (!currentTile) continue;

      // Move tiles on the first column to the top
      if (firstColumn.includes(index)) {
        this.moveCurrentTileUp(currentTile, currentTileList, index, 0);
      } else if (secondColumn.includes(index)) {
        // Move tiles on the second column to the top
        this.moveCurrentTileUp(currentTile, currentTileList, index, 1);
      } else if (thirdColumn.includes(index)) {
        // Move tiles on the third column to the top
        this.moveCurrentTileUp(currentTile, currentTileList, index, 2);
      } else if (fourthColumn.includes(index)) {
        // Move tiles on the fourth column to the top
        this.moveCurrentTileUp(currentTile, currentTileList, index, 3);
      }
    }

    this.setState({
      tiles: currentTileList,
    });
  }

  moveCurrentTileDown(currentTile, currentTileList, index, cell) {
    let i = index;
    currentTileList[index] = undefined;

    while (i <= cell) {
      if (i < cell && !currentTileList[i + 4]) {
        i += 4;
        continue;
      } else if (
        currentTileList[i + 4] &&
        currentTileList[i + 4].value === currentTile.value
      ) {
        const { x, y } = get2DCoordinate(i + 4);
        currentTile.value += currentTileList[i + 4].value;
        currentTileList[i + 4] = currentTile;
        currentTileList[i + 4].cell = i + 4;
        currentTileList[i + 4].x = x;
        currentTileList[i + 4].y = y;
        break;
      } else {
        const { x, y } = get2DCoordinate(i);
        currentTileList[i] = currentTile;
        currentTileList[i].cell = i;
        currentTileList[i].x = x;
        currentTileList[i].y = y;
        break;
      }
    }
  }

  /*
   * Move tiles to the bottom of the grid, here the grid is broken into
   * the four coloumns. Each of the coloumns are looped through to check if
   * there are cells that can be moved to the bottom or merged with each
   * other.
   */
  moveTilesDown() {
    const { tiles } = this.state;
    const currentTileList = cloneDeep(tiles);
    const firstColumn = [0, 4, 8, 12];
    const secondColumn = [1, 5, 9, 13];
    const thirdColumn = [2, 6, 10, 14];
    const fourthColumn = [3, 7, 11, 15];

    for (let i = currentTileList.length - 1; i >= 0; i--) {
      const currentTile = currentTileList[i];
      if (!currentTile) continue;

      // Move tiles on the first column to the bottom
      if (firstColumn.includes(i)) {
        this.moveCurrentTileDown(currentTile, currentTileList, i, 12);
      } else if (secondColumn.includes(i)) {
        // Move tiles on the second column to the bottom
        this.moveCurrentTileDown(currentTile, currentTileList, i, 13);
      } else if (thirdColumn.includes(i)) {
        // Move tiles on the third column to the bottom
        this.moveCurrentTileDown(currentTile, currentTileList, i, 14);
      } else if (fourthColumn.includes(i)) {
        // Move tiles on the fourth column to the bottom
        this.moveCurrentTileDown(currentTile, currentTileList, i, 15);
      }
    }

    this.setState({
      tiles: currentTileList,
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
