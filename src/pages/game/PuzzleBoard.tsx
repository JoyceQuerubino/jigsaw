//peças como um estado
import React, { useEffect, useRef, useState } from "react";
import { motion, PanInfo } from "framer-motion";
import school from "../../assets/images/school.jpg";

interface Piece {
  row: number;
  col: number;
  x: number;
  y: number;
  id: number;
  isPlaced: boolean;
}

export default function PuzzleGame() {
  const [isPortrait, setIsPortrait] = useState(false);
  const [pieces, setPieces] = useState([])

  const constraintsRef = useRef<HTMLDivElement>(null);
  const SNAP_DISTANCE = 20; 

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

  useEffect(() => {
    // Inicializa as peças com posições aleatórias
    const initialPieces: Piece[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        initialPieces.push({
          row,
          col,
          x: Math.random() * (cols * PIECE_SIZE - PIECE_SIZE),
          y: Math.random() * (rows * PIECE_SIZE - PIECE_SIZE),
          id: row * cols + col,
          isPlaced: false, // Inicialmente todas as peças não estão posicionadas
        });
      }
    }
    setPieces(initialPieces);
  }, [cols, rows]);


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

  const handleDragEnd = (pieceId: number, info: PanInfo) => {
    setPieces(prevPieces => {
      const draggedPiece = prevPieces.find(p => p.id === pieceId);
      if (!draggedPiece) return prevPieces;

      let newX = draggedPiece.x + info.offset.x;
      let newY = draggedPiece.y + info.offset.y;
      let isPlaced = false;

      // Verifica peças já posicionadas para encontrar vizinhos
      const placedPieces = prevPieces.filter(p => p.isPlaced);
      
      // Verifica cada peça colocada como possível vizinha
      for (const placedPiece of placedPieces) {
        // Verifica se é vizinha na grade original
        const isAdjacent = 
          (Math.abs(placedPiece.row - draggedPiece.row) === 1 && placedPiece.col === draggedPiece.col) ||
          (Math.abs(placedPiece.col - draggedPiece.col) === 1 && placedPiece.row === draggedPiece.row);

        if (isAdjacent) {
          // Calcula a posição esperada baseada na peça vizinha
          const expectedX = placedPiece.x + (draggedPiece.col - placedPiece.col) * PIECE_SIZE;
          const expectedY = placedPiece.y + (draggedPiece.row - placedPiece.row) * PIECE_SIZE;

          // Verifica se está perto da posição esperada
          if (
            Math.abs(newX - expectedX) < SNAP_DISTANCE &&
            Math.abs(newY - expectedY) < SNAP_DISTANCE
          ) {
            newX = expectedX;
            newY = expectedY;
            isPlaced = true;
            break;
          }
        }
      }

      // Se não encontrou vizinhos, verifica a posição absoluta
      if (!isPlaced) {
        const correctX = draggedPiece.col * PIECE_SIZE;
        const correctY = draggedPiece.row * PIECE_SIZE;
        
        if (
          Math.abs(newX - correctX) < SNAP_DISTANCE &&
          Math.abs(newY - correctY) < SNAP_DISTANCE
        ) {
          newX = correctX;
          newY = correctY;
          isPlaced = true;
        }
      }

      return prevPieces.map(p =>
        p.id === pieceId ? { ...p, x: newX, y: newY, isPlaced } : p
      );
    });
  };

  return (
    <div ref={constraintsRef} style={{ position: "relative", width: 900, height: rows * PIECE_SIZE + 200, backgroundColor: 'red' }}>
      <svg width={900} height={rows * PIECE_SIZE + 100} style={{ position: "absolute", top: 0, left: 0, padding: 16, border: 1, backgroundColor: 'blue' }}>
        {pieces.map((piece, index) => (
        <motion.g
        key={piece.id}
        drag={!piece.isPlaced} 
        dragMomentum={false}
        onDragEnd={(_, info) => handleDragEnd(piece.id, info)}
        // dragConstraints={constraintsRef}
        // dragElastic={0}
        animate={{
          x: piece.x,
          y: piece.y,
          transition: { type: "spring", stiffness: 500, damping: 30 }
        }}
        style={{ cursor: "grab",   x: piece.x,
          y: piece.y, }}
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

