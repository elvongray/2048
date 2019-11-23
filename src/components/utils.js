/* eslint-disable import/prefer-default-export */
/* eslint-disable no-mixed-operators */
export const randomTileList = [2, 2, 2, 4, 2, 2, 4, 2, 2, 4];
export const COLOUMNSIZE = 4;
export const NUMOFCELLS = 16;
export const controlKeys = {
  37: 'left',
  39: 'right',
  38: 'up',
  40: 'down',
  65: 'left',
  68: 'right',
  87: 'up',
  83: 'down',
};

export const generateRandomNo = n => Math.ceil(Math.random() * n);

export const get2DCoordinate = n => {
  const x = n % COLOUMNSIZE;
  const y = (n - x) / COLOUMNSIZE;

  return {
    x,
    y,
  };
};

export const get1DCoordinate = ({ x, y }) => x + y * COLOUMNSIZE;

export function saveGameState(state) {
  if (window.localStorage) {
    window.localStorage.setItem('highScore', JSON.stringify(state.highScore));
    window.localStorage.setItem('gameState', JSON.stringify(state));
  }
}

export function getGameState() {
  if (!window.localStorage) {
    return null;
  }

  return {
    gameState: JSON.parse(window.localStorage.getItem('gameState')),
    highScore: JSON.parse(window.localStorage.getItem('highScore')),
  };
}
