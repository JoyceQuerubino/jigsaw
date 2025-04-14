import React, { useEffect, useState, useRef } from "react";
import school from "../../assets/images/school.jpg";
import { motion, useMotionValue, PanInfo } from "framer-motion";

interface Piece {
  row: number;
  col: number;
  x: number;
  y: number;
  id: number;
  isPlaced: boolean; // Adicionando a propriedade isPlaced
}

export default function PuzzleGame() {
  const [isPortrait, setIsPortrait] = useState(false);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const SNAP_DISTANCE = 30; // Distância para snap (grudar)

  useEffect(() => {
    const img = new Image();
    img.src = school;
    img.onload = () => {
      setIsPortrait(img.height > img.width);
    };
  }, []);

  // Decide a grade baseado na orientação
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
    <div
      ref={constraintsRef}
      style={{
        position: "relative",
        width: `${cols * PIECE_SIZE}px`,
        height: `${rows * PIECE_SIZE}px`,
        margin: "50px auto",
        border: "2px solid #333",
        overflow: "hidden",
      }}
    >
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          drag={!piece.isPlaced} // Desabilita o drag se a peça estiver posicionada
          dragMomentum={false}
          dragConstraints={constraintsRef}
          onDragEnd={(_, info) => handleDragEnd(piece.id, info)}
          animate={{
            x: piece.x,
            y: piece.y,
            transition: { type: "spring", stiffness: 500, damping: 30 }
          }}
          style={{
            position: "absolute",
            width: `${PIECE_SIZE}px`,
            height: `${PIECE_SIZE}px`,
            backgroundImage: `url(${school})`,
            backgroundSize: `${cols * PIECE_SIZE}px ${rows * PIECE_SIZE}px`,
            backgroundPosition: `-${piece.col * PIECE_SIZE}px -${piece.row * PIECE_SIZE}px`,
            border: "1px solid #999",
            backgroundRepeat: "no-repeat",
            cursor: piece.isPlaced ? "default" : "grab", // Muda o cursor se a peça estiver posicionada
          }}
          whileDrag={{ cursor: "grabbing", zIndex: 10 }}
        />
      ))}
    </div>
  );
}