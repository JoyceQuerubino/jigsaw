
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import school from "../../assets/images/school.jpg";

export default function PuzzleGame() {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = school;
    img.onload = () => {
      setIsPortrait(img.height > img.width);
    };
  }, []);

  const cols = isPortrait ? 3 : 4;
  const rows = isPortrait ? 4 : 3;
  const PIECE_SIZE = 100;

  const pieces = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      pieces.push({ row, col });
    }
  }

  const getPiecePath = (row: number, col: number) => {
    const right = col < cols - 1 ? "out" : "flat";
    const bottom = row < rows - 1 ? "out" : "flat";
    const left = col > 0 ? "in" : "flat";
    const top = row > 0 ? "in" : "flat";

    return generatePuzzlePath(top, right, bottom, left);
  };

  const generatePuzzlePath = (top: string, right: string, bottom: string, left: string) => {
    const size = PIECE_SIZE;
    const neck = size * 0.15;
    const tab = size * 0.3;
    const half = size / 2;

    let path = `M 0 0 `;

    // Top edge
    if (top === "flat") path += `H ${size} `;
    else path += `H ${half - neck} Q ${half} ${top === "out" ? -tab : tab} ${half + neck} 0 H ${size} `;

    // Right edge
    if (right === "flat") path += `V ${size} `;
    else path += `V ${half - neck} Q ${size + (right === "out" ? tab : -tab)} ${half} ${size} ${half + neck} V ${size} `;

    // Bottom edge
    if (bottom === "flat") path += `H 0 `;
    else path += `H ${half + neck} Q ${half} ${size + (bottom === "out" ? tab : -tab)} ${half - neck} ${size} H 0 `;

    // Left edge
    if (left === "flat") path += `V 0 `;
    else path += `V ${half + neck} Q ${left === "out" ? -tab : tab} ${half} 0 ${half - neck} V 0 `;

    path += `Z`;
    return path;
  };

  const containerRef = useRef(null);

  const randomX = (index: number) => index * 100 + Math.random() * 50; // 100px de base + até 50px de variação
  const randomY = () => 150 + Math.random() * 50; // entre 200px e 230px

  return (
    <div  ref={containerRef} style={{ position: "relative", width: 900, height: rows * PIECE_SIZE, backgroundColor: 'red' }}>
      <svg width={900} height={rows * PIECE_SIZE} style={{ position: "absolute", top: 0, left: 0 }}>
        {pieces.map((piece, index) => (
        <motion.g
        key={index}
        drag
        dragMomentum={false}
        dragConstraints={{
          left: 0,
          top: 0,
          right: 900 - PIECE_SIZE - 20,
          bottom: rows * PIECE_SIZE - PIECE_SIZE - 20,
        }}
        whileDrag={{ scale: 1.1 }}
        initial={{
          x: randomX(index),
          y: randomY(),
        }}
        style={{ cursor: "grab" }}
      >
            <clipPath id={`clip-${index}`}>
              <path d={getPiecePath(piece.row, piece.col)} />
            </clipPath>
            <image
              href={school}
              width={cols * PIECE_SIZE}
              height={rows * PIECE_SIZE}
              clipPath={`url(#clip-${index})`}
              x={-piece.col * PIECE_SIZE}
              y={-piece.row * PIECE_SIZE}
            />
          </motion.g>
        ))}
      </svg>
    </div>
  );
}


///posicao cereta

{/* <motion.g
key={index}
drag
dragMomentum={false}
whileDrag={{ scale: 1.1 }}
initial={{
  x: piece.col * PIECE_SIZE,
  y: piece.row * PIECE_SIZE,
}}
style={{ cursor: "grab" }}
> */}

//movimentos certos:

  //Para as peças surgirem especificamente neste espaço da tela
//   const randomX = (index: number) => index * 100 + Math.random() * 50; // 100px de base + até 50px de variação
//   const randomY = () => 150 + Math.random() * 30; // entre 200px e 230px

//   initial={{
//     x: randomX(index),
//     y: randomY(),
//   }}