import "./ModalContent.css";
import { useState } from "react";

import alimentacao from "../../assets/images/alimentacao.jpg";
import higiene from "../../assets/images/higiene.jpg";
import school from "../../assets/images/school.jpg";

import bravo from "../../assets/images/bravo.jpg";
import dente from "../../assets/images/dente.jpg";
import feliz from "../../assets/images/feliz.jpg";
import lavar from "../../assets/images/lavar.jpg";
import melancia from "../../assets/images/melancia.jpg";
import salada from "../../assets/images/salada.jpg";

import { Button } from "../Button/Button";

const images = [
  { src: alimentacao, alt: "Alimentação" },
  { src: higiene, alt: "Higiene" },
  { src: school, alt: "Escola" },
  { src: bravo, alt: "Bravo" },
  { src: dente, alt: "Dente" },
  { src: feliz, alt: "Feliz" },
  { src: lavar, alt: "lavar" },
  { src: melancia, alt: "melancia" },
  { src: salada, alt: "salada" },
];

interface ModalContentProps {
  onImageSelect: (imageSrc: string | null) => void;
  onClose: () => void;
}

export function ModalContent({ onImageSelect, onClose }: ModalContentProps) {
  const [visuallySelectedImage, setVisuallySelectedImage] = useState<string | null>(null);

  const handleImageClick = (imageSrc: string) => {
    if (visuallySelectedImage === imageSrc) {
      setVisuallySelectedImage(null);
    } else {
      setVisuallySelectedImage(imageSrc);
    }
  };

  const handleSelectButtonClick = () => {
    onImageSelect(visuallySelectedImage);
    onClose();
  };

  return (
    <div className="modal-content-container">
      <div className="images-grid">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={image.alt}
            className={`modal-image ${
              visuallySelectedImage === image.src ? "selected" : ""
            }`}
            onClick={() => handleImageClick(image.src)}
          />
        ))}
      </div>

      <div className="modal-conteiner-buttons">
        <div>
          <Button
            text="Cancelar"
            onClick={onClose}
            imageWidth="268px"
            imageHeight="68px"
          />
        </div>
        <div>
          <Button
            text="Selecionar"
            onClick={handleSelectButtonClick}
            imageWidth="268px"
            imageHeight="68px"
          />
        </div>
      </div>
    </div>
  );
}
