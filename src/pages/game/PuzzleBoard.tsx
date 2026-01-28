import { useEffect, useRef, useState, forwardRef, useImperativeHandle, useMemo } from "react";
import { motion } from "framer-motion";
import { Stage, Layer, Image as KonvaImage, Path, Group } from 'react-konva';
import useSound from 'use-sound';
import school from "../../assets/images/school.jpg";
import { useGame } from "../../contexts/GameContext";
import { useSoundContext } from "../../contexts/SoundContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reactQueryConsts } from "../../hooks/reactQueryConstantes";
import { addUserResult } from "../../services/user-results-service";
import { Raccoon } from "../../components/animations/Raccoon";
import encaixeSound from "../../assets/sounds/encaixe.wav";

interface Piece {
  row: number;
  col: number;
  x: number;
  y: number;
  id: number;
  isPlaced: boolean;
}

type Difficulty = 'easy' | 'medium' | 'hard';

const WITH_DISTANCE = 900;

interface PuzzleGameProps {
  difficulty: Difficulty;
  setIsModalSucessOpen: (value: boolean) => void;
  onReset?: () => void;
}

export interface PuzzleGameRef {
  resetGame: () => void;
}

const PuzzleGame = forwardRef<PuzzleGameRef, PuzzleGameProps>(({ difficulty, setIsModalSucessOpen, onReset }, ref) => {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [completed, setCompleted] = useState(false);
  const { puzzleImage: contextImage, title, playerName, setIsPaused, formatTime, time, setTime, setPuzzleComplete } = useGame();
  const { isSoundEnabled } = useSoundContext();
  const [playEncaixe] = useSound(encaixeSound);
  const SNAP_DISTANCE = 25;

  const [animationState, setAnimationState] = useState(0);
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const PUZZLE_WIDTH = 580;
  const PUZZLE_HEIGHT = 400;

  const queryClient = useQueryClient();
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);

  const { mutateAsync: saveResult } = useMutation({
    mutationFn: async () => {
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

  useEffect(() => {
    if (completed && pieces.length > 0) {
      saveResult();
      setIsModalSucessOpen(true)
    }
  }, [completed, pieces.length]);

  useEffect(() => {
    const img = new window.Image();
    img.src = contextImage || school;
    img.onload = () => {
      setImageObj(img);
    };
  }, [contextImage]);

  useEffect(() => {
    return () => {
      setTime(0);
      setIsPaused(false);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = () => {
      resetInactivityTimeout();
    };

    resetInactivityTimeout();
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, []);

  useImperativeHandle(ref, () => ({
    resetGame
  }));

  const getPuzzleConfig = () => {
    switch(difficulty) {
      case 'easy': return { cols: 3, rows: 2 };
      case 'medium': return { cols: 4, rows: 3 };
      case 'hard': return { cols: 6, rows: 4 };
      default: return { cols: 3, rows: 2 };
    }
  };

  const { cols, rows } = getPuzzleConfig();

  const resetInactivityTimeout = () => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }
    inactivityTimeoutRef.current = setTimeout(() => {
      setAnimationState(4);
    }, 10000);
  };
  
  const PIECE_SIZE = Math.min(
    PUZZLE_WIDTH / cols,
    PUZZLE_HEIGHT / rows
  );

  const initializePieces = () => {
    const initialPieces: Piece[] = [];
    const areaGuia = (rows * PIECE_SIZE) + 32;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        initialPieces.push({
          row,
          col,
          x: Math.random() * (780 - PIECE_SIZE) + 16,
          y: areaGuia + Math.random() * (200 - PIECE_SIZE),
          id: row * cols + col,
          isPlaced: false,
        });
      }
    }
    setPieces(initialPieces);
  };

  useEffect(() => {
    initializePieces();
  }, [cols, rows, difficulty]);

  const generatePuzzlePath = (top: string, right: string, bottom: string, left: string) => {
    const size = PIECE_SIZE;
    const neck = size * 0.15;
    const tab = size * 0.3;
    const half = size / 2;

    let path = `M 0 0 `;
    if (top === "flat") path += `H ${size} `;
    else path += `H ${half - neck} Q ${half} ${top === "out" ? -tab : tab} ${half + neck} 0 H ${size} `;

    if (right === "flat") path += `V ${size} `;
    else path += `V ${half - neck} Q ${size + (right === "out" ? tab : -tab)} ${half} ${size} ${half + neck} V ${size} `;

    if (bottom === "flat") path += `H 0 `;
    else path += `H ${half + neck} Q ${half} ${size + (bottom === "out" ? tab : -tab)} ${half - neck} ${size} H 0 `;

    if (left === "flat") path += `V 0 `;
    else path += `V ${half + neck} Q ${left === "out" ? -tab : tab} ${half} 0 ${half - neck} V 0 `;

    path += `Z`;
    return path;
  };

  const getPiecePath = useMemo(() => (row: number, col: number) => {
    const right = col < cols - 1 ? "out" : "flat";
    const bottom = row < rows - 1 ? "out" : "flat";
    const left = col > 0 ? "in" : "flat";
    const top = row > 0 ? "in" : "flat";

    return generatePuzzlePath(top, right, bottom, left);
  }, [cols, rows, PIECE_SIZE]);

  const handleDragStart = (e: any) => {
    resetInactivityTimeout();
    const id = e.target.id();
    
    // Altera o cursor para 'grabbing' durante o arrasto
    const stage = e.target.getStage();
    if (stage) {
      const container = stage.container();
      container.style.cursor = 'grabbing';
    }

    // Move a peça para o topo (z-index)
    setPieces(prev => {
      const piece = prev.find(p => p.id === parseInt(id));
      if (!piece) return prev;
      return [...prev.filter(p => p.id !== piece.id), piece];
    });
  };

  const handleDragEnd = (e: any) => {
    resetInactivityTimeout();
    const id = parseInt(e.target.id());
    const newX = e.target.x();
    const newY = e.target.y();

    // Restaura o cursor
    const stage = e.target.getStage();
    if (stage) {
      const container = stage.container();
      container.style.cursor = 'default';
    }

    setPieces(prevPieces => {
      const draggedPiece = prevPieces.find(p => p.id === id);
      if (!draggedPiece) return prevPieces;

      let finalX = newX;
      let finalY = newY;
      let isPlaced = false;

      // Limita o movimento
      finalX = Math.max(16, Math.min(finalX, WITH_DISTANCE - PIECE_SIZE - 32));
      finalY = Math.max(16, Math.min(finalY, (rows * PIECE_SIZE + 260) - PIECE_SIZE - 32));

      const correctX = draggedPiece.col * PIECE_SIZE + 16;
      const correctY = draggedPiece.row * PIECE_SIZE + 16;
      
      if (
        Math.abs(finalX - correctX) < SNAP_DISTANCE &&
        Math.abs(finalY - correctY) < SNAP_DISTANCE
      ) {
        finalX = correctX;
        finalY = correctY;
        isPlaced = true;
        if (isSoundEnabled) playEncaixe();
        setAnimationState(2);
      }

      if (!isPlaced) {
        const placedPieces = prevPieces.filter(p => p.isPlaced);
        for (const placedPiece of placedPieces) {
          const isAdjacent = 
            (Math.abs(placedPiece.row - draggedPiece.row) === 1 && placedPiece.col === draggedPiece.col) ||
            (Math.abs(placedPiece.col - draggedPiece.col) === 1 && placedPiece.row === draggedPiece.row);

          if (isAdjacent) {
            const expectedX = draggedPiece.col * PIECE_SIZE + 16;
            const expectedY = draggedPiece.row * PIECE_SIZE + 16;
            if (Math.abs(finalX - expectedX) < SNAP_DISTANCE && Math.abs(finalY - expectedY) < SNAP_DISTANCE) {
              finalX = expectedX;
              finalY = expectedY;
              isPlaced = true;
              if (isSoundEnabled) playEncaixe();
              break;
            }
          }
        }
        if (!isPlaced) setAnimationState(3);
      }

      const updatedPieces = prevPieces.map(p =>
        p.id === id ? { ...p, x: finalX, y: finalY, isPlaced } : p
      );

      const isComplete = updatedPieces.every(piece => piece.isPlaced);
      if (isComplete) {
        setCompleted(true);
        setPuzzleComplete(true);
      }

      return updatedPieces;
    });
  };

  const resetGame = () => {
    setCompleted(false);
    setPuzzleComplete(false);
    initializePieces();
    if (onReset) onReset();
  };

  const boardHeight = rows * PIECE_SIZE + 260;

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'flex-end', 
      width: '100%', 
      height: '100%',
      padding: '0 20px',
      flex: 1,
      minHeight: 0
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          position: "relative", 
          width: WITH_DISTANCE, 
          height: boardHeight,
          border: "8px solid #007EB8", 
          borderRadius: "24px",
          backgroundColor: '#abd8ed',
          boxShadow: "0 4px 8px rgba(0, 126, 184, 0.5)",
          overflow: 'hidden'
        }}
      >
        <Stage width={WITH_DISTANCE} height={boardHeight}>
          <Layer>
            {/* Imagem de fundo guia */}
            {imageObj && (
              <KonvaImage
                image={imageObj}
                width={cols * PIECE_SIZE}
                height={rows * PIECE_SIZE}
                x={16}
                y={16}
                opacity={0.3}
              />
            )}
            
            {/* Grade de guia */}
            {Array.from({ length: rows }).map((_, row) => (
              Array.from({ length: cols }).map((_, col) => (
                <Path
                  key={`guide-${row}-${col}`}
                  x={col * PIECE_SIZE + 16}
                  y={row * PIECE_SIZE + 16}
                  data={getPiecePath(row, col)}
                  fill="rgba(124, 122, 125, 0.1)"
                  stroke="rgba(80, 78, 81, 0.4)"
                  strokeWidth={2}
                />
              ))
            ))}

            {/* Peças do puzzle */}
            {pieces.map((piece) => (
              <Group
                key={piece.id}
                id={piece.id.toString()}
                x={piece.x}
                y={piece.y}
                draggable={!piece.isPlaced}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onMouseEnter={(e) => {
                  if (!piece.isPlaced) {
                    const stage = e.target.getStage();
                    if (stage) {
                      const container = stage.container();
                      container.style.cursor = 'grab';
                    }
                  }
                }}
                onMouseLeave={(e) => {
                  const stage = e.target.getStage();
                  if (stage) {
                    const container = stage.container();
                    container.style.cursor = 'default';
                  }
                }}
              >
                <Group
                  clipFunc={(ctx) => {
                    const size = PIECE_SIZE;
                    const neck = size * 0.15;
                    const tab = size * 0.3;
                    const half = size / 2;

                    const top = piece.row > 0 ? "in" : "flat";
                    const right = piece.col < cols - 1 ? "out" : "flat";
                    const bottom = piece.row < rows - 1 ? "out" : "flat";
                    const left = piece.col > 0 ? "in" : "flat";

                    ctx.beginPath();
                    ctx.moveTo(0, 0);

                    // Top edge
                    if (top === "flat") ctx.lineTo(size, 0);
                    else {
                      ctx.lineTo(half - neck, 0);
                      ctx.quadraticCurveTo(half, top === "out" ? -tab : tab, half + neck, 0);
                      ctx.lineTo(size, 0);
                    }

                    // Right edge
                    if (right === "flat") ctx.lineTo(size, size);
                    else {
                      ctx.lineTo(size, half - neck);
                      ctx.quadraticCurveTo(size + (right === "out" ? tab : -tab), half, size, half + neck);
                      ctx.lineTo(size, size);
                    }

                    // Bottom edge
                    if (bottom === "flat") ctx.lineTo(0, size);
                    else {
                      ctx.lineTo(half + neck, size);
                      ctx.quadraticCurveTo(half, size + (bottom === "out" ? tab : -tab), half - neck, size);
                      ctx.lineTo(0, size);
                    }

                    // Left edge
                    if (left === "flat") ctx.lineTo(0, 0);
                    else {
                      ctx.lineTo(0, half + neck);
                      ctx.quadraticCurveTo(left === "out" ? -tab : tab, half, 0, half - neck);
                      ctx.lineTo(0, 0);
                    }

                    ctx.closePath();
                  }}
                >
                  {imageObj && (
                    <KonvaImage
                      image={imageObj}
                      width={cols * PIECE_SIZE}
                      height={rows * PIECE_SIZE}
                      x={-piece.col * PIECE_SIZE}
                      y={-piece.row * PIECE_SIZE}
                      listening={false}
                    />
                  )}
                </Group>
                {/* Borda da peça para melhor visualização */}
                <Path
                  data={getPiecePath(piece.row, piece.col)}
                  stroke={piece.isPlaced ? "rgba(0,0,0,0)" : "#555"}
                  strokeWidth={1}
                />
              </Group>
            ))}
          </Layer>
        </Stage>
      </motion.div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        <Raccoon animationState={animationState} setAnimationState={setAnimationState} isPaused={completed}/>
      </div>
    </div>
  );
});

export default PuzzleGame;
