import "./ModalContent.css";
import { useState, useEffect, useRef, useCallback } from "react";
import Cropper, { type Area } from "react-easy-crop";

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
import { localPhotosService, PhotoMetadata } from "../../services/local-photos-service";

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });
}

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Contexto 2d não disponível");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Falha ao gerar imagem recortada"));
      },
      "image/jpeg",
      0.9
    );
  });
}

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
  const [localPhotos, setLocalPhotos] = useState<{ id: string; dataUrl: string; metadata: PhotoMetadata }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  useEffect(() => {
    loadLocalPhotos();
  }, []);

  const loadLocalPhotos = async () => {
    const metadata = await localPhotosService.getAllPhotosMetadata();
    const photosWithData = await Promise.all(
      metadata.map(async (meta) => {
        const dataUrl = await localPhotosService.getPhotoAsDataURL(meta.id);
        return {
          id: meta.id,
          dataUrl: dataUrl || '',
          metadata: meta
        };
      })
    );
    setLocalPhotos(photosWithData.filter(photo => photo.dataUrl));
  };

  const handleImageClick = (imageSrc: string) => {
    if (visuallySelectedImage === imageSrc) {
      setVisuallySelectedImage(null);
    } else {
      setVisuallySelectedImage(imageSrc);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const onCropAreaChange = useCallback((_: Area, croppedAreaPx: Area) => {
    setCroppedAreaPixels(croppedAreaPx);
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      alert("Por favor, selecione apenas arquivos de imagem.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setImageToCrop(dataUrl);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleConfirmCrop = async () => {
    if (!imageToCrop || !croppedAreaPixels || isCropping) return;
    setIsCropping(true);
    try {
      const blob = await getCroppedImg(imageToCrop, croppedAreaPixels);
      const file = new File([blob], `foto-${Date.now()}.jpg`, { type: "image/jpeg" });
      const photoId = await localPhotosService.savePhoto(file);
      await loadLocalPhotos();
      const dataUrl = await localPhotosService.getPhotoAsDataURL(photoId);
      if (dataUrl) setVisuallySelectedImage(dataUrl);
      setImageToCrop(null);
    } catch (error) {
      console.error("Erro ao recortar imagem:", error);
      alert("Erro ao recortar a imagem. Tente novamente.");
    } finally {
      setIsCropping(false);
    }
  };

  const handleCancelCrop = () => {
    setImageToCrop(null);
    setCroppedAreaPixels(null);
  };

  const handleSelectButtonClick = () => {
    onImageSelect(visuallySelectedImage);
    onClose();
  };

  const handleDeleteButtonClick = async () => {
    if (!visuallySelectedImage) {
      alert('Selecione uma imagem para deletar.');
      return;
    }

    // Verifica se é uma foto local
    const localPhoto = localPhotos.find(photo => photo.dataUrl === visuallySelectedImage);
    if (!localPhoto) {
      return; 
    }

    const confirmDelete = window.confirm(`Tem certeza que deseja deletar a imagem "${localPhoto.metadata.name}"?`);
    if (confirmDelete) {
      try {
        const success = await localPhotosService.deletePhoto(localPhoto.id);
        if (success) {
          await loadLocalPhotos();
          setVisuallySelectedImage(null);
        }
      } catch (error) {
        console.error('Erro ao deletar foto:', error);
        alert('Erro ao deletar a imagem. Tente novamente.');
      }
    }
  };

  const isDeleteButtonDisabled = () => {
    if (!visuallySelectedImage) return true;
    
    // Verifica se é uma imagem padrão
    const isDefaultImage = images.some(img => img.src === visuallySelectedImage);
    if (isDefaultImage) return true;
    
    // Verifica se é uma foto local
    const localPhoto = localPhotos.find(photo => photo.dataUrl === visuallySelectedImage);
    return !localPhoto;
  };

  if (imageToCrop) {
    return (
      <div className="modal-content-container modal-crop-container">
        <p className="modal-crop-title">Recorte e reposicione a imagem</p>
        <div className="crop-wrapper">
          <Cropper
            image={imageToCrop}
            crop={crop}
            zoom={zoom}
            aspect={288 / 160}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropAreaChange={onCropAreaChange}
          />
        </div>
        <div className="modal-conteiner-buttons">
          <Button
            text="Cancelar"
            onClick={handleCancelCrop}
            imageWidth="168px"
            imageHeight="68px"
          />
          <div style={{ display: "flex", gap: "1rem" }}>
            <Button
              text={isCropping ? "Salvando…" : "Confirmar recorte"}
              onClick={handleConfirmCrop}
              imageWidth="268px"
              imageHeight="68px"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-content-container">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      
      <div className="images-grid">
        <div
          className="upload-button"
          onClick={handleUploadClick}
        >
          <div className="upload-icon">+</div>
          <span>Adicionar Foto</span>
        </div>
        
        {localPhotos.map((photo) => (
          <img
            key={photo.id}
            src={photo.dataUrl}
            alt={photo.metadata.name}
            className={`modal-image ${
              visuallySelectedImage === photo.dataUrl ? "selected" : ""
            }`}
            onClick={() => handleImageClick(photo.dataUrl)}
          />
        ))}
        
        {images.map((image, index) => (
          <img
            key={`default-${index}`}
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
        <div style={{ opacity: isDeleteButtonDisabled() ? 0.3 : 1 }}>
          <Button
            variant="red"
            text="Excluir"
            onClick={isDeleteButtonDisabled() ? () => {} : handleDeleteButtonClick}
            imageWidth="168px"
            imageHeight="68px"
          />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button
            text="Cancelar"
            onClick={onClose}
            imageWidth="268px"
            imageHeight="68px"
          />
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
