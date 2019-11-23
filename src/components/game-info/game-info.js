/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import PropTypes from 'prop-types';

import './game-info.scss';

export default function GameInfo(props) {
  return (
    <div className="game-info-container">
      <div className="game-info-1">
        <h1 className="title">2048</h1>
        <div className="game-scores-container">
          <div className="best-score">
            <span>BEST</span>
            <span>{props.highScore}</span>
          </div>
          <div className="score">
            <span>SCORE</span>
            <span>{props.score}</span>
          </div>
        </div>
      </div>
      <div className="game-info-2">
        <div>
          Join the numbers and get to the <strong>2048 tile!</strong>
        </div>
        <button
          type="button"
          className="button"
          onClick={() => props.restartGame()}
        >
          New Game
        </button>
      </div>
    </div>
  );
}

GameInfo.propTypes = {
  score: PropTypes.number.isRequired,
  highScore: PropTypes.number.isRequired,
  restartGame: PropTypes.func.isRequired,
};
