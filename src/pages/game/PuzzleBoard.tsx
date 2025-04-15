//peças como um estado
import React, { useEffect, useRef, useState } from "react";
import { motion, PanInfo } from "framer-motion";
import school from "../../assets/images/school.jpg";
import { useGame } from "../../contexts/GameContext";
import { useTimer } from "../../hooks/useTimer";
import { TimerControlButton } from '../../components/TimerControlButton';

interface Piece {
  row: number;
  col: number;
  x: number;
  y: number;
  id: number;
  isPlaced: boolean;
}

type Difficulty = 'easy' | 'medium' | 'hard';

interface PuzzleGameProps {
  difficulty: Difficulty;
}

export default function PuzzleGame({ difficulty }: PuzzleGameProps) {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const { puzzleImage: contextImage } = useGame();
  const constraintsRef = useRef<HTMLDivElement>(null);
  const SNAP_DISTANCE = 25;
  const PIECE_SIZE = 120; // Diminuí o tamanho das peças

  const isPuzzleComplete = () => {
    return pieces.every(piece => piece.isPlaced);
  };

  const { time, isPaused, setIsPaused, formatTime } = useTimer({
    isComplete: isPuzzleComplete()
  });

  useEffect(() => {
    const img = new Image();
    img.src = contextImage || school;
  }, [contextImage]);

  // Configuração de peças baseada na dificuldade
  const getPuzzleConfig = () => {
    switch(difficulty) {
      case 'easy':
        return {
          cols: 3,
          rows: 2
        };
      case 'medium':
        return {
          cols: 4,
          rows: 3
        };
      case 'hard':
        return {
          cols: 6,
          rows: 4
        };
      default:
        return {
          cols: 3,
          rows: 2
        };
    }
  };

  const { cols, rows } = getPuzzleConfig();

  useEffect(() => {
    // Inicializa as peças com posições aleatórias
    const initialPieces: Piece[] = [];
    const areaGuia = (rows * PIECE_SIZE) + 32;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        initialPieces.push({
          row,
          col,
          x: Math.random() * (850 - PIECE_SIZE) + 16,
          y: areaGuia + Math.random() * (200 - PIECE_SIZE),
          id: row * cols + col,
          isPlaced: false,
        });
      }
    }
    setPieces(initialPieces);
  }, [cols, rows, difficulty]);


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

      // Limita o movimento dentro do quadrado azul considerando o padding
      newX = Math.max(16, Math.min(newX, 934 - PIECE_SIZE));
      newY = Math.max(16, Math.min(newY, (rows * PIECE_SIZE + 284) - PIECE_SIZE));

      // Verifica a posição correta primeiro
      const correctX = draggedPiece.col * PIECE_SIZE + 16;
      const correctY = draggedPiece.row * PIECE_SIZE + 16;
      
      if (
        Math.abs(newX - correctX) < SNAP_DISTANCE &&
        Math.abs(newY - correctY) < SNAP_DISTANCE
      ) {
        newX = correctX;
        newY = correctY;
        isPlaced = true;
      }

      // Se não encaixou na posição correta, verifica vizinhos
      if (!isPlaced) {
        const placedPieces = prevPieces.filter(p => p.isPlaced);
        
        for (const placedPiece of placedPieces) {
          const isAdjacent = 
            (Math.abs(placedPiece.row - draggedPiece.row) === 1 && placedPiece.col === draggedPiece.col) ||
            (Math.abs(placedPiece.col - draggedPiece.col) === 1 && placedPiece.row === draggedPiece.row);

          if (isAdjacent) {
            const expectedX = draggedPiece.col * PIECE_SIZE + 16;
            const expectedY = draggedPiece.row * PIECE_SIZE + 16;

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
      }

      const updatedPieces = prevPieces.map(p =>
        p.id === pieceId ? { ...p, x: newX, y: newY, isPlaced } : p
      );

      // Verifica se o puzzle foi completado após a atualização
      const isComplete = updatedPieces.every(piece => piece.isPlaced);
      if (isComplete) {
        setIsPaused(true);
      }

      return updatedPieces;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <div ref={constraintsRef} style={{ position: "relative", width: 950, height: rows * PIECE_SIZE + 300 }}>
        <svg width={950} height={rows * PIECE_SIZE + 300} style={{ position: "absolute", top: 0, left: 0, padding: 16, border: 1, backgroundColor: 'blue' }}>
          {/* Grade de linhas guia */}
          <g>
            {Array.from({ length: rows }).map((_, row) => (
              Array.from({ length: cols }).map((_, col) => (
                <g key={`guide-${row}-${col}`} transform={`translate(${col * PIECE_SIZE + 16}, ${row * PIECE_SIZE + 16})`}>
                  <path
                    d={getPiecePath(row, col)}
                    fill="rgba(0, 255, 0, 0.2)"
                    stroke="rgba(0, 255, 0, 0.5)"
                    strokeWidth="2"
                  />
                </g>
              ))
            ))}
          </g>
          
          {pieces.map((piece, index) => (
            <motion.g
              key={piece.id}
              drag={!piece.isPlaced} 
              dragMomentum={false}
              dragConstraints={{
                left: 16,
                right: 934 - PIECE_SIZE,
                top: 16,
                bottom: (rows * PIECE_SIZE + 284) - PIECE_SIZE
              }}
              dragElastic={0}
              onDragEnd={(_, info) => handleDragEnd(piece.id, info)}
              animate={{
                x: piece.x,
                y: piece.y,
                transition: { type: "spring", stiffness: 500, damping: 30 }
              }}
              style={{ cursor: piece.isPlaced ? "default" : "grab", x: piece.x, y: piece.y }}
            >
              <clipPath id={`clip-${index}`}>
                <path d={getPiecePath(piece.row, piece.col)} />
              </clipPath>
              <image
                href={contextImage || school}
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
    </div>
  );
}

