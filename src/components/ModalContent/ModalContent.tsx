import "./ModalContent.css";
import { useState, useEffect, useRef } from "react";

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

  const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        const { width, height } = img;
        const aspectRatio = width / height;
        
        let newWidth = maxWidth;
        let newHeight = maxHeight;
        
        if (aspectRatio > 1) {
          newHeight = maxWidth / aspectRatio;
        } else {
          newWidth = maxHeight * aspectRatio;
        }
        
        canvas.width = maxWidth;
        canvas.height = maxHeight;
        
        const x = (maxWidth - newWidth) / 2;
        const y = (maxHeight - newHeight) / 2;
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, maxWidth, maxHeight);
        
        ctx.drawImage(img, x, y, newWidth, newHeight);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: file.lastModified,
            });
            resolve(resizedFile);
          }
        }, file.type, 0.9);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }
    
    try {
      const resizedFile = await resizeImage(file, 288, 160);
      const photoId = await localPhotosService.savePhoto(resizedFile);
      await loadLocalPhotos();
      
      const dataUrl = await localPhotosService.getPhotoAsDataURL(photoId);
      if (dataUrl) {
        setVisuallySelectedImage(dataUrl);
      }
    } catch (error) {
      console.error('Erro ao salvar imagem:', error);
      alert('Erro ao salvar a imagem. Tente novamente.');
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
      return; // Não faz nada se não for uma foto local
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
