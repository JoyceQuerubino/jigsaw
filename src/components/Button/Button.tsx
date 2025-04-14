import "./Button.css";
import btnChoiceImage from "../../assets/images/my-games/btn-choice-image.png";

interface ButtonProps {
  text?: string;
  onClick: () => void;
  imageWidth?: string;
  imageHeight?: string;
}

export function Button({ text, onClick, imageWidth = "268px", imageHeight = "68px" }: ButtonProps) {
  return (
    <button
      className="button"
      onClick={onClick}
    >
      <img 
        src={btnChoiceImage} 
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
