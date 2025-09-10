import React from 'react';
import './styles.css';
import buttonBackImage from '../../assets/images/button-back.webp';

interface ButtonImageProps {
  text: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const ButtonImage: React.FC<ButtonImageProps> = ({ 
  text, 
  onClick, 
  className = '',
  style = {} 
}) => {
  return (
    <button 
      className={`button-image ${className}`}
      onClick={onClick}
      style={{ backgroundImage: `url(${buttonBackImage})`, ...style }}
    >
      <span className="button-text">{text}</span>
    </button>
  );
};

export default ButtonImage;