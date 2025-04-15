//peças como um estado
import { useEffect, useRef, useState, useMemo } from "react";
import { motion, PanInfo } from "framer-motion";
import school from "../../assets/images/school.jpg";
import guaxinimImage from "../../assets/images/guaxinim.png";
import { useGame } from "../../contexts/GameContext";
import { useTimer } from "../../hooks/useTimer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reactQueryConsts } from "../../hooks/reactQueryConstantes";
import { addUserResult } from "../../services/user-results-service";

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
  const { puzzleImage: contextImage, setIsPuzzleComplete, title, playerName } = useGame();
  const constraintsRef = useRef<HTMLDivElement>(null);
  const SNAP_DISTANCE = 25;

  // Tamanho total fixo do puzzle (igual ao tamanho usado para 24 peças)
  const PUZZLE_WIDTH = 540; // Largura total do puzzle (6 peças * 90px)
  const PUZZLE_HEIGHT = 360; // Altura total do puzzle (4 peças * 90px)

  const queryClient = useQueryClient();
  
  const { mutateAsync: saveResult } = useMutation({
    mutationFn: async () => {
      console.log("OPA", time);

      return addUserResult({
        username: playerName,
        gameTitile: title,
        time: formatTime(time)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [reactQueryConsts.LIST_USER_RESULTS] });
    }
  });

  const isComplete = useMemo(() => {
    const complete = pieces.every(piece => piece.isPlaced);
    setIsPuzzleComplete(complete);
    return complete;
  }, [pieces, setIsPuzzleComplete]);

  const { setIsPaused, setTime, formatTime, time } = useTimer({
    isComplete
  });

  useEffect(() => {
    if (isComplete && pieces.length > 0) {
      alert('Parabéns! Você completou o puzzle!');
      saveResult();
    }
  }, [isComplete, pieces.length, saveResult]);

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
  
  // Calcular o tamanho das peças com base no tamanho total do puzzle
  const PIECE_SIZE = Math.min(
    PUZZLE_WIDTH / cols,
    PUZZLE_HEIGHT / rows
  );

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

  
  useEffect(() => {
    return () => {
      setTime(0);
    };
  }, []);


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
      newX = Math.max(16, Math.min(newX, 770 - PIECE_SIZE - 32));
      newY = Math.max(16, Math.min(newY, (rows * PIECE_SIZE + 300) - PIECE_SIZE - 32));

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
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      width: '100%', 
      position: 'relative',
      padding: '0 20px'
    }}>
      <div ref={constraintsRef} style={{ position: "relative", width: 770, height: rows * PIECE_SIZE + 300 }}>
        <svg width={770} height={rows * PIECE_SIZE + 300} style={{ 
          position: "absolute", 
          top: 0, 
          left: 0, 
          padding: 16, 
          border: "8px solid #007EB8", 
          borderRadius: "24px",
          backgroundColor: '#abd8ed',
          boxShadow: "0 4px 8px rgba(0, 126, 184, 0.5)"
        }}>
          {/* Imagem de fundo com baixa opacidade */}
          <image
            href={contextImage || school}
            width={cols * PIECE_SIZE}
            height={rows * PIECE_SIZE}
            x={16}
            y={16}
            opacity={0.6}
          />
          
          {/* Grade de linhas guia */}
          <g>
            {Array.from({ length: rows }).map((_, row) => (
              Array.from({ length: cols }).map((_, col) => (
                <g key={`guide-${row}-${col}`} transform={`translate(${col * PIECE_SIZE + 16}, ${row * PIECE_SIZE + 16})`}>
                  <path
                    d={getPiecePath(row, col)}
                    fill="rgba(124, 122, 125, 0.3)"
                    stroke="rgba(80, 78, 81, 0.7)"
                    strokeWidth="4"
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
                right: 770 - PIECE_SIZE - 32,
                top: 16,
                bottom: (rows * PIECE_SIZE + 300) - PIECE_SIZE - 32
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
      <img 
        src={guaxinimImage} 
        alt="Guaxinim" 
        style={{
          width: '250px',
          height: 'auto',
          alignSelf: 'flex-end'
        }}
      />
    </div>
  );
}

