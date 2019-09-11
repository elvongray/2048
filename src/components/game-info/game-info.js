/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';

import './game-info.scss';

export default props => (
  <div className="game-info-container">
    <div className="game-info-1">
      <h1 className="title">2048</h1>
      <div className="game-scores-container">
        <div className="best-score">
          <span>BEST</span>
          <span>1296</span>
        </div>
        <div className="score">
          <span>SCORE</span>
          <span>0</span>
        </div>
      </div>
    </div>
    <div className="game-info-2">
      <div>
        Join the numbers and get to the <strong>2048 tile!</strong>
      </div>
      <button type="button" className="button">
        New Game
      </button>
    </div>
  </div>
);
