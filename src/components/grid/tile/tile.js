import React from 'react';

import './tile.scss';

export default ({ x, y, value }) => (
  <div className={`tile tile-${x}-${y} tile-${value}`}>
    <div className="tile-inner">{value}</div>
  </div>
);
