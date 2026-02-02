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
  
  const [animationState, setAnimationState] = useState(0);
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);

  // Estados para responsividade
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobileLandscape = useMemo(() => !isPortrait && windowSize.height < 600, [isPortrait, windowSize.height]);

  const isMobile = useMemo(() => {
    // Detecta se é mobile por largura ou se é um dispositivo em landscape com pouca altura
    return windowSize.width < 768 || isMobileLandscape;
  }, [windowSize.width, isMobileLandscape]);

  // Cálculos de escala baseados no tamanho da tela
  const scale = useMemo(() => {
    const baseWidth = 1440; // Largura de referência
    const baseHeight = 900; // Altura de referência
    const currentWidth = windowSize.width;
    const currentHeight = windowSize.height;
    
    // Calcula a escala baseada tanto na largura quanto na altura
    const scaleX = currentWidth / baseWidth;
    const scaleY = currentHeight / baseHeight;
    const baseScale = Math.min(scaleX, scaleY);
    
    if (isMobile) {
      if (isMobileLandscape) {
        // Landscape mobile - escala bem reduzida para as peças caberem na altura
        return Math.max(0.25, Math.min(0.4, baseScale * 1.0));
      }
      // No mobile portrait, escala menor para o guaxinim não ocupar muito espaço
      return Math.max(0.4, Math.min(0.7, baseScale * 1.5));
    }
    return Math.max(0.6, Math.min(1.2, baseScale));
  }, [windowSize.width, windowSize.height, isMobile, isPortrait, isMobileLandscape]);

  const STAGE_WIDTH = useMemo(() => {
    if (isMobile) {
      if (isMobileLandscape) {
        return windowSize.width * 0.8; // Aumentado para 80% conforme solicitado
      }
      return windowSize.width * 0.75; // Ocupa mais espaço no mobile portrait
    }
    return Math.min(windowSize.width * 0.7, 900 * scale);
  }, [windowSize.width, scale, isMobile, isPortrait, isMobileLandscape]);

  const PUZZLE_BASE_WIDTH = 580 * scale;
  const PUZZLE_BASE_HEIGHT = 400 * scale;
  const SNAP_DISTANCE = 25 * scale;
  const PADDING = 16 * scale;

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
    img.onload = () => setImageObj(img);
  }, [contextImage]);

  useEffect(() => {
    return () => {
      setTime(0);
      setIsPaused(false);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = () => resetInactivityTimeout();
    resetInactivityTimeout();
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
    };
  }, []);

  useImperativeHandle(ref, () => ({ resetGame }));

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
    if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
    inactivityTimeoutRef.current = setTimeout(() => setAnimationState(4), 10000);
  };
  
  const PIECE_SIZE = useMemo(() => Math.min(
    PUZZLE_BASE_WIDTH / cols,
    PUZZLE_BASE_HEIGHT / rows
  ), [cols, rows, PUZZLE_BASE_WIDTH, PUZZLE_BASE_HEIGHT]);

  // Altura extra para as peças (o "tabuleiro" de peças soltas)
  const TRAY_HEIGHT = useMemo(() => {
    if (!isPortrait && windowSize.height < 500) {
      return 180 * scale; // Reduz o espaço das peças soltas em landscape mobile
    }
    return 260 * scale;
  }, [scale, isPortrait, windowSize.height]);

  const boardHeight = useMemo(() => {
    if (isMobileLandscape) {
      return windowSize.height * 0.55; // Aproximadamente 50-55% da altura da tela
    }
    const baseBoardHeight = (rows * PIECE_SIZE) + TRAY_HEIGHT;
    // Garante que a altura do tabuleiro nunca ultrapasse a altura da tela menos o padding
    const maxAllowedHeight = windowSize.height - (isMobile ? 40 : 80);
    return Math.min(baseBoardHeight, maxAllowedHeight);
  }, [rows, PIECE_SIZE, TRAY_HEIGHT, windowSize.height, isMobile, isMobileLandscape]);

  const initializePieces = () => {
    const initialPieces: Piece[] = [];
    const areaGuiaY = (rows * PIECE_SIZE) + (PADDING * 2);
    const availableHeight = boardHeight - PIECE_SIZE - PADDING;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        initialPieces.push({
          row,
          col,
          x: Math.random() * (STAGE_WIDTH - PIECE_SIZE - PADDING * 2) + PADDING,
          y: areaGuiaY + Math.random() * (availableHeight - areaGuiaY),
          id: row * cols + col,
          isPlaced: false,
        });
      }
    }
    setPieces(initialPieces);
  };

  useEffect(() => {
    initializePieces();
  }, [cols, rows, difficulty, scale, STAGE_WIDTH, boardHeight]);

  const getPiecePath = useMemo(() => (row: number, col: number) => {
    const size = PIECE_SIZE;
    const neck = size * 0.15;
    const tab = size * 0.3;
    const half = size / 2;

    const top = row > 0 ? "in" : "flat";
    const right = col < cols - 1 ? "out" : "flat";
    const bottom = row < rows - 1 ? "out" : "flat";
    const left = col > 0 ? "in" : "flat";

    let path = `M 0 0 `;
    if (top === "flat") path += `H ${size} `;
    else path += `H ${half - neck} Q ${half} ${top === "in" ? tab : -tab} ${half + neck} 0 H ${size} `;

    if (right === "flat") path += `V ${size} `;
    else path += `V ${half - neck} Q ${size + (right === "out" ? tab : -tab)} ${half} ${size} ${half + neck} V ${size} `;

    if (bottom === "flat") path += `H 0 `;
    else path += `H ${half + neck} Q ${half} ${size + (bottom === "out" ? tab : -tab)} ${half - neck} ${size} H 0 `;

    if (left === "flat") path += `V 0 `;
    else path += `V ${half + neck} Q ${left === "in" ? tab : -tab} ${half} 0 ${half - neck} V 0 `;

    path += `Z`;
    return path;
  }, [cols, rows, PIECE_SIZE]);

  const handleDragStart = (e: any) => {
    resetInactivityTimeout();
    const id = e.target.id();
    const stage = e.target.getStage();
    if (stage) stage.container().style.cursor = 'grabbing';

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
    const stage = e.target.getStage();
    if (stage) stage.container().style.cursor = 'default';

    setPieces(prevPieces => {
      const draggedPiece = prevPieces.find(p => p.id === id);
      if (!draggedPiece) return prevPieces;

      let finalX = newX;
      let finalY = newY;
      let isPlaced = false;

      finalX = Math.max(PADDING, Math.min(finalX, STAGE_WIDTH - PIECE_SIZE - PADDING));
      finalY = Math.max(PADDING, Math.min(finalY, boardHeight - PIECE_SIZE - PADDING));

      const correctX = draggedPiece.col * PIECE_SIZE + PADDING;
      const correctY = draggedPiece.row * PIECE_SIZE + PADDING;
      
      if (Math.abs(finalX - correctX) < SNAP_DISTANCE && Math.abs(finalY - correctY) < SNAP_DISTANCE) {
        finalX = correctX;
        finalY = correctY;
        isPlaced = true;
        if (isSoundEnabled) playEncaixe();
        setAnimationState(2);
      }

      if (!isPlaced) {
        const placedPieces = prevPieces.filter(p => p.isPlaced);
        for (const placedPiece of placedPieces) {
          const isAdjacent = (Math.abs(placedPiece.row - draggedPiece.row) === 1 && placedPiece.col === draggedPiece.col) ||
                            (Math.abs(placedPiece.col - draggedPiece.col) === 1 && placedPiece.row === draggedPiece.row);

          if (isAdjacent) {
            const expectedX = draggedPiece.col * PIECE_SIZE + PADDING;
            const expectedY = draggedPiece.row * PIECE_SIZE + PADDING;
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

      const updatedPieces = prevPieces.map(p => p.id === id ? { ...p, x: finalX, y: finalY, isPlaced } : p);
      if (updatedPieces.every(p => p.isPlaced)) {
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

  if (isPortrait && windowSize.width < 768) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#007EB8',
        color: 'white',
        textAlign: 'center',
        padding: '20px',
        zIndex: 9999
      }}>
        <h2>Por favor, gire o seu celular</h2>
        <p>Este jogo foi feito para ser jogado na horizontal.</p>
        <div style={{ fontSize: '50px', marginTop: '20px' }}>📱🔄</div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      width: '100%', 
      height: '100%',
      padding: isMobile ? `${10 * scale}px` : `${20 * scale}px`,
      gap: isMobile ? `${10 * scale}px` : `${40 * scale}px`,
      flex: 1,
      minHeight: 0,
      overflow: 'hidden',
      paddingBottom: isMobile ? '10px' : '20px'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          position: "relative", 
          width: STAGE_WIDTH, 
          height: boardHeight,
          border: `${8 * scale}px solid #007EB8`, 
          borderRadius: `${24 * scale}px`,
          backgroundColor: '#abd8ed',
          boxShadow: `0 ${4 * scale}px ${8 * scale}px rgba(0, 126, 184, 0.5)`,
          overflow: 'hidden',
          marginBottom: 0
        }}
      >
        <Stage width={STAGE_WIDTH} height={boardHeight}>
          <Layer>
            {imageObj && (
              <KonvaImage
                image={imageObj}
                width={cols * PIECE_SIZE}
                height={rows * PIECE_SIZE}
                x={PADDING}
                y={PADDING}
                opacity={0.3}
              />
            )}
            
            {Array.from({ length: rows }).map((_, row) => (
              Array.from({ length: cols }).map((_, col) => (
                <Path
                  key={`guide-${row}-${col}`}
                  x={col * PIECE_SIZE + PADDING}
                  y={row * PIECE_SIZE + PADDING}
                  data={getPiecePath(row, col)}
                  fill="rgba(124, 122, 125, 0.1)"
                  stroke="rgba(80, 78, 81, 0.4)"
                  strokeWidth={2 * scale}
                />
              ))
            ))}

            {pieces.map((piece) => (
              <Group
                key={piece.id}
                id={piece.id.toString()}
                x={piece.x}
                y={piece.y}
                draggable={!piece.isPlaced}
                dragBoundFunc={(pos) => {
                  // Limita a posição X dentro do quadrado azul
                  const newX = Math.max(PADDING, Math.min(pos.x, STAGE_WIDTH - PIECE_SIZE - PADDING));
                  // Limita a posição Y dentro do quadrado azul
                  const newY = Math.max(PADDING, Math.min(pos.y, boardHeight - PIECE_SIZE - PADDING));
                  
                  return {
                    x: newX,
                    y: newY
                  };
                }}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onMouseEnter={(e) => {
                  if (!piece.isPlaced) {
                    const stage = e.target.getStage();
                    if (stage) stage.container().style.cursor = 'grab';
                  }
                }}
                onMouseLeave={(e) => {
                  const stage = e.target.getStage();
                  if (stage) stage.container().style.cursor = 'default';
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
                    if (top === "flat") ctx.lineTo(size, 0);
                    else { ctx.lineTo(half - neck, 0); ctx.quadraticCurveTo(half, top === "in" ? tab : -tab, half + neck, 0); ctx.lineTo(size, 0); }
                    if (right === "flat") ctx.lineTo(size, size);
                    else { ctx.lineTo(size, half - neck); ctx.quadraticCurveTo(size + (right === "out" ? tab : -tab), half, size, half + neck); ctx.lineTo(size, size); }
                    if (bottom === "flat") ctx.lineTo(0, size);
                    else { ctx.lineTo(half + neck, size); ctx.quadraticCurveTo(half, size + (bottom === "out" ? tab : -tab), half - neck, size); ctx.lineTo(0, size); }
                    if (left === "flat") ctx.lineTo(0, 0);
                    else { ctx.lineTo(0, half + neck); ctx.quadraticCurveTo(left === "in" ? tab : -tab, half, 0, half - neck); ctx.lineTo(0, 0); }
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
                <Path
                  data={getPiecePath(piece.row, piece.col)}
                  stroke={piece.isPlaced ? "rgba(0,0,0,0)" : "#555"}
                  strokeWidth={1 * scale}
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
        transform: isMobile 
          ? (!isPortrait && windowSize.height < 500 ? `scale(${scale * 0.7})` : `scale(${scale * 0.8})`)
          : `scale(${scale * 1.2})`,
        transformOrigin: 'bottom center',
        transition: 'transform 0.3s ease',
        marginBottom: isMobile ? `${10 * scale}px` : `${20 * scale}px`,
        alignSelf: 'flex-end',
        mixBlendMode: 'multiply'
      }}>
        <Raccoon animationState={animationState} setAnimationState={setAnimationState} isPaused={completed}/>
      </div>
    </div>
  );
});

export default PuzzleGame;
