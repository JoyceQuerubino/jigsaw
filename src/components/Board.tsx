import React, { useEffect } from 'react';
import './Board.css';

const Board: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/src/components/jigsaw-puzzle/script.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="board">
      <div id="forPuzzle"></div>
      <ul id="menu">
        <li>&#x2630;</li>
        <li>default image</li>
        <li>load image</li>
        <li>shape: <select id="shape">
            <option value="1" selected>classic</option>
          </select></li>
        <li>12 pieces</li>
        <li>25 pieces</li>
        <li>50 pieces</li>
        <li>100 pieces</li>
        <li>200 pieces</li>
      </ul>
    </div>
  );
};

export default Board; 