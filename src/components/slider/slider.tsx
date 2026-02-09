import "./slider.css";
import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import btnBack from "../../assets/images/slider/btn-back.png";
import btnGo from "../../assets/images/slider/btn-go.png";
import { useNavigate } from "react-router-dom";
import { GameType } from "../../services/types";

interface CardData extends Omit<GameType, 'type'> {
  disabled?: boolean;
  goConfig?: boolean;
}

interface SliderProps {
  cardsData: CardData[];
  goConfig?: boolean;
  onNavigate?: (card: CardData) => void;
  /** Em telas > 1600px, aumenta cards e espaço do carrossel (modelo e tema) */
  largeCardsOnWideScreen?: boolean;
}

function Card({ title, id, disabled, image, goConfig, onNavigate }: CardData & { onNavigate?: (card: CardData) => void }) {
  const navigate = useNavigate();

  function handleNavigate() {
    if (disabled) return;

    if (onNavigate) {
      onNavigate({ title, id, image, disabled, goConfig });
      return;
    }

    if(goConfig) {
      navigate(`/config/${encodeURIComponent(image)}/${encodeURIComponent(title)}`);
      return;
    }

    navigate('/theme');
  }

  return (
    <motion.div className="item" key={id} onClick={handleNavigate} data-disabled={disabled}>
      <div className="image-container">
        <div className="main-image">
          <img 
            src={image} 
            alt="jigsaw game" 
            className="overlay-image"
            style={{ display: 'block' }}
          />
        </div>
      </div>
      <p>{title}</p>
    </motion.div>
  );
}

const CARD_WIDTH_DEFAULT = 400;
const CARD_WIDTH_LARGE = 520;

export function Slider({ cardsData, goConfig, onNavigate, largeCardsOnWideScreen }: SliderProps) {
  const carousel = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);
  const controls = useAnimation();
  const [currentX, setCurrentX] = useState(0);
  const isWideScreen = useMediaQuery("(min-width: 1601px)");
  const useLargeCards = largeCardsOnWideScreen && isWideScreen;
  const cardWidth = useLargeCards ? CARD_WIDTH_LARGE : CARD_WIDTH_DEFAULT;

  useEffect(() => {
    if (carousel.current) {
      const scrollWidth = carousel.current.scrollWidth;
      const offsetWidth = carousel.current.offsetWidth;
      // Ajusta a largura total considerando o último card
      const totalWidth = scrollWidth - offsetWidth + cardWidth;
      setWidth(totalWidth);
    }
  }, [cardWidth]);

  const handleNext = async () => {
    const nextX = Math.max(-width, currentX - cardWidth);
    setCurrentX(nextX);
    await controls.start({
      x: nextX,
      transition: { duration: 0.5 },
    });
  };

  const handlePrev = async () => {
    const nextX = Math.min(0, currentX + cardWidth);
    setCurrentX(nextX);
    await controls.start({
      x: nextX,
      transition: { duration: 0.5 },
    });
  };

  const canGoPrev = width > 0 && currentX < 0;
  const canGoNext = width > 0 && currentX > -width;

  return (
    <div className={`slider-container${useLargeCards ? " slider-large" : ""}`}>
      <button
        className="nav-button prev"
        onClick={handlePrev}
        disabled={!canGoPrev}
        aria-label="Anterior"
      >
        <img src={btnBack} alt="Voltar" />
      </button>

      <motion.div className="carousel">
        <motion.div
          ref={carousel}
          className="inner"
          initial={{ x: 0 }}
          animate={controls}
          transition={{ duration: 0.8 }}
        >
          {cardsData.map((card: CardData) => (
            <Card
              key={card.id}
              title={card.title}
              id={card.id}
              disabled={card.disabled}
              image={card.image}
              goConfig={goConfig}
              onNavigate={onNavigate}
            />
          ))}
        </motion.div>
      </motion.div>

      <button
        className="nav-button next"
        onClick={handleNext}
        disabled={!canGoNext}
        aria-label="Próximo"
      >
        <img src={btnGo} alt="Avançar" />
      </button>
    </div>
  );
}
