import React from 'react';
import PropTypes from 'prop-types';

import './tile.scss';

export default function Tile({ x, y, value }) {
  return (
    <div className={`tile tile-${x}-${y} tile-${value}`}>
      <div className="tile-inner">{value}</div>
    </div>
  );
}

Tile.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
