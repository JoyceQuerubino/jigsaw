import "./slider.css";
import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import btnBack from "../../assets/images/slider/btn-back.png";
import btnGo from "../../assets/images/slider/btn-go.png";
import { useNavigate } from "react-router-dom";

interface CardData {
  title: string;
  id: string;
  image: string;
  disabled?: boolean;
  goConfig?: boolean;
}

interface SliderProps {
  cardsData: CardData[];
  goConfig?: boolean;
}

function Card({ title, id, disabled, image, goConfig}: CardData) {
  const navigate = useNavigate();

  function handleNavigate() {
    if (disabled) return;

    if(goConfig) {
      navigate(`/config/${encodeURIComponent(image)}`);
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

export function Slider({ cardsData, goConfig }: SliderProps) {
  const carousel = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);
  const controls = useAnimation();
  const [currentX, setCurrentX] = useState(0);
  const cardWidth = 400; // largura do card

  useEffect(() => {
    if (carousel.current) {
      const scrollWidth = carousel.current.scrollWidth;
      const offsetWidth = carousel.current.offsetWidth;
      // Ajusta a largura total considerando o último card
      const totalWidth = scrollWidth - offsetWidth + cardWidth;
      setWidth(totalWidth);
    }
  }, []);

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

  return (
    <div className="slider-container">
      <button className="nav-button prev" onClick={handlePrev}>
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
            />
          ))}
        </motion.div>
      </motion.div>

      <button className="nav-button next" onClick={handleNext}>
        <img src={btnGo} alt="Avançar" />
      </button>
    </div>
  );
}
