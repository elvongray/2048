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
      gameOver: false,
      checkGameOver: false,
      numberOfChecks: 0,
      numberOfDirectionsToMove: 0,
      score: 0,
    };
  }

  componentDidMount() {
    this.initializeNewGrid();
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  componentDidUpdate() {
    if (this.state.checkGameOver) {
      this.checkIfGameOver();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  // This function will only be called if all the cells have been occupied by tiles.
  // All the tile functions are called to confirm if there are not
  //  any move that can be made in the four direactions
  checkIfGameOver() {
    if (this.state.numberOfDirectionsToMove === 0) {
      this.moveTilesLeft();
      this.moveTilesRight();
      this.moveTilesUp();
      this.moveTilesDown();

      // This checks if the number of directions to move state
      // is still zero after the first checkIfGameOver call, which means the player cannot make any other
      // move and the game is over
      if (this.state.numberOfChecks > 0) {
        this.setState({
          checkGameOver: false,
          gameOver: true,
          numberOfChecks: 0,
        });
      } else {
        this.setState(state => ({
          numberOfChecks: state.numberOfChecks + 1,
        }));
      }
    } else {
      this.setState({
        numberOfDirectionsToMove: 0,
        checkGameOver: false,
        numberOfChecks: 0,
      });
    }
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
    this.setState(
      {
        checkGameOver: false,
        gameOver: false,
        numberOfChecks: 0,
        numberOfDirectionsToMove: 0,
        score: 0,
      },
      () => {
        this.initializeNewGrid();
      },
    );
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

    this.setState(
      {
        tiles,
      },
      () => {
        // Animate the initial tiles added to the grid.
        // Note: Not a good pattern
        const tile1 = document.querySelector(
          `.tile-${firstTile.x}-${firstTile.y} .tile-inner`,
        );
        const tile2 = document.querySelector(
          `.tile-${secondTile.x}-${secondTile.y} .tile-inner`,
        );

        tile1.classList.add('pulse1');
        tile2.classList.add('pulse1');
        setTimeout(() => {
          tile1.classList.remove('pulse1');
          tile2.classList.remove('pulse1');
        }, 500);
      },
    );
  }

  // Find the empty cells in the grid and randomly select where
  // a new tile should be inserted
  insertNewTileIntoGrid() {
    const { tiles } = this.state;
    const emptyCells = [];

    for (const [index, tile] of tiles.entries()) {
      if (!tile) emptyCells.push(index);
    }

    if (!emptyCells.length) {
      this.setState({ checkGameOver: true });
      return;
    }

    const newTile = this.getTile(
      emptyCells[generateRandomNo(emptyCells.length - 1)],
    );
    tiles[newTile.cell] = newTile;

    this.setState({ tiles }, () => {
      const tile = document.querySelector(
        `.tile-${newTile.x}-${newTile.y} .tile-inner`,
      );
      if (!tile) return;
      tile.classList.add('pulse1');
      setTimeout(() => {
        tile.classList.remove('pulse1');
      }, 500);
    });
  }

  updateTiles(currentTileList) {
    if (this.state.checkGameOver) {
      if (currentTileList.includes(undefined)) {
        this.setState(state => ({
          numberOfDirectionsToMove: state.numberOfDirectionsToMove + 1,
        }));
      }
    } else {
      this.setState({
        tiles: currentTileList,
      });
    }
  }

  updateScores(score) {
    this.setState(state => ({
      score: state.score + score,
    }));
  }

  moveCurrentTileLeft(
    currentTile,
    currentTileList,
    index,
    firstCell,
    lastCell,
  ) {
    let i = index;
    currentTileList[index] = undefined;

    while (i >= firstCell) {
      if (i > firstCell && !currentTileList[i - 1]) {
        i -= 1;
        continue;
      } else if (
        currentTileList[i - 1] &&
        currentTileList[i - 1].value === currentTile.value &&
        i - 1 >= firstCell &&
        i - 1 <= lastCell
      ) {
        const { x, y } = get2DCoordinate(i - 1);

        currentTile.value += currentTileList[i - 1].value;
        currentTileList[i - 1] = currentTile;
        currentTileList[i - 1].cell = i - 1;
        currentTileList[i - 1].x = x;
        currentTileList[i - 1].y = y;
        this.updateScores(currentTile.value);
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
        this.moveCurrentTileLeft(currentTile, currentTileList, index, 0, 3);
      }

      // Move tiles on the second row to the left
      if (index >= 4 && index <= 7) {
        this.moveCurrentTileLeft(currentTile, currentTileList, index, 4, 7);
      }

      // Move tiles on the third row to the left
      if (index >= 8 && index <= 11) {
        this.moveCurrentTileLeft(currentTile, currentTileList, index, 8, 11);
      }

      // Move tiles on the fourth row to the left
      if (index >= 12 && index <= 15) {
        this.moveCurrentTileLeft(currentTile, currentTileList, index, 12, 15);
      }
    }

    this.updateTiles(currentTileList);
  }

  moveCurrentTileRight(
    currentTile,
    currentTileList,
    index,
    firstCell,
    lastCell,
  ) {
    let i = index;
    currentTileList[index] = undefined;

    while (i <= lastCell) {
      if (i < lastCell && !currentTileList[i + 1]) {
        i += 1;
        continue;
      } else if (
        currentTileList[i + 1] &&
        currentTileList[i + 1].value === currentTile.value &&
        i + 1 >= firstCell &&
        i + 1 <= lastCell
      ) {
        const { x, y } = get2DCoordinate(i + 1);
        currentTile.value += currentTileList[i + 1].value;
        currentTileList[i + 1] = currentTile;
        currentTileList[i + 1].cell = i + 1;
        currentTileList[i + 1].x = x;
        currentTileList[i + 1].y = y;
        this.updateScores(currentTile.value);
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
        this.moveCurrentTileRight(currentTile, currentTileList, i, 12, 15);
      } else if (i >= 8 && i <= 11) {
        // Move tiles on the third row to the right
        this.moveCurrentTileRight(currentTile, currentTileList, i, 8, 11);
      } else if (i >= 4 && i <= 7) {
        // Move tiles on the second row to the right
        this.moveCurrentTileRight(currentTile, currentTileList, i, 4, 7);
      } else if (i <= 3) {
        // Move tiles on the first row to the right
        this.moveCurrentTileRight(currentTile, currentTileList, i, 0, 3);
      }
    }

    this.updateTiles(currentTileList);
  }

  moveCurrentTileUp(currentTile, currentTileList, index, cell, column) {
    let i = index;
    currentTileList[index] = undefined;

    while (i >= cell) {
      if (i > cell && !currentTileList[i - 4]) {
        i -= 4;
        continue;
      } else if (
        currentTileList[i - 4] &&
        currentTileList[i - 4].value === currentTile.value &&
        column.includes(i - 4)
      ) {
        const { x, y } = get2DCoordinate(i - 4);
        currentTile.value += currentTileList[i - 4].value;
        currentTileList[i - 4] = currentTile;
        currentTileList[i - 4].cell = i - 4;
        currentTileList[i - 4].x = x;
        currentTileList[i - 4].y = y;
        this.updateScores(currentTile.value);
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
        this.moveCurrentTileUp(
          currentTile,
          currentTileList,
          index,
          0,
          firstColumn,
        );
      } else if (secondColumn.includes(index)) {
        // Move tiles on the second column to the top
        this.moveCurrentTileUp(
          currentTile,
          currentTileList,
          index,
          1,
          secondColumn,
        );
      } else if (thirdColumn.includes(index)) {
        // Move tiles on the third column to the top
        this.moveCurrentTileUp(
          currentTile,
          currentTileList,
          index,
          2,
          thirdColumn,
        );
      } else if (fourthColumn.includes(index)) {
        // Move tiles on the fourth column to the top
        this.moveCurrentTileUp(
          currentTile,
          currentTileList,
          index,
          3,
          fourthColumn,
        );
      }
    }

    this.updateTiles(currentTileList);
  }

  moveCurrentTileDown(currentTile, currentTileList, index, cell, column) {
    let i = index;
    currentTileList[index] = undefined;

    while (i <= cell) {
      if (i < cell && !currentTileList[i + 4]) {
        i += 4;
        continue;
      } else if (
        currentTileList[i + 4] &&
        currentTileList[i + 4].value === currentTile.value &&
        column.includes(i + 4)
      ) {
        const { x, y } = get2DCoordinate(i + 4);
        currentTile.value += currentTileList[i + 4].value;
        currentTileList[i + 4] = currentTile;
        currentTileList[i + 4].cell = i + 4;
        currentTileList[i + 4].x = x;
        currentTileList[i + 4].y = y;
        this.updateScores(currentTile.value);
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
        this.moveCurrentTileDown(
          currentTile,
          currentTileList,
          i,
          12,
          firstColumn,
        );
      } else if (secondColumn.includes(i)) {
        // Move tiles on the second column to the bottom
        this.moveCurrentTileDown(
          currentTile,
          currentTileList,
          i,
          13,
          secondColumn,
        );
      } else if (thirdColumn.includes(i)) {
        // Move tiles on the third column to the bottom
        this.moveCurrentTileDown(
          currentTile,
          currentTileList,
          i,
          14,
          thirdColumn,
        );
      } else if (fourthColumn.includes(i)) {
        // Move tiles on the fourth column to the bottom
        this.moveCurrentTileDown(
          currentTile,
          currentTileList,
          i,
          15,
          fourthColumn,
        );
      }
    }

    this.updateTiles(currentTileList);
  }

  render() {
    const { tiles, gameOver, score } = this.state;

    return (
      <div className="container">
        <div className="row">
          <GameInfo score={score} restartGame={() => this.restartGame()} />
        </div>
        <div className="row">
          <Grid
            tiles={tiles}
            gameOver={gameOver}
            restartGame={() => this.restartGame()}
          />
        </div>
      </div>
    );
  }
}

export default Game;
