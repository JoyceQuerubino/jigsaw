import "./Button.css";
import btnChoiceImage from "../../assets/images/my-games/btn-choice-image.png";
import btnRed from "../../assets/images/my-games/btn-red.png";

interface ButtonProps {
  text?: string;
  onClick: () => void;
  imageWidth?: string;
  imageHeight?: string;
  variant?: 'default' | 'red';
}

export function Button({ 
  text, 
  onClick, 
  imageWidth = "268px", 
  imageHeight = "68px",
  variant = 'default' 
}: ButtonProps) {
  const buttonImage = variant === 'red' ? btnRed : btnChoiceImage;

  return (
    <button
      className="button"
      onClick={onClick}
    >
      <img 
        src={buttonImage} 
        alt="Botão" 
        style={{ 
          maxWidth: imageWidth,
          height: imageHeight
        }}
      />
      {text && <p>{text}</p>}
    </button>
  );
}
