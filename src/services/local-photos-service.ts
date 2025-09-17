import localforage from 'localforage';

export interface LocalPhoto {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  blob: Blob;
}

export interface PhotoMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  savedAt: number;
}

class LocalPhotosService {
  private readonly PHOTOS_KEY = 'local_photos';
  private readonly METADATA_KEY = 'photos_metadata';

  constructor() {
    localforage.config({
      name: 'JigsawPhotos',
      storeName: 'photos'
    });
  }

  async savePhoto(file: File): Promise<string> {
    const photoId = `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const photoData: LocalPhoto = {
      id: photoId,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      blob: file
    };

    const metadata: PhotoMetadata = {
      id: photoId,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      savedAt: Date.now()
    };

    await localforage.setItem(`${this.PHOTOS_KEY}_${photoId}`, photoData);
    
    const existingMetadata = await this.getAllPhotosMetadata();
    existingMetadata.push(metadata);
    await localforage.setItem(this.METADATA_KEY, existingMetadata);

    return photoId;
  }

  async getPhoto(photoId: string): Promise<LocalPhoto | null> {
    try {
      const photo = await localforage.getItem<LocalPhoto>(`${this.PHOTOS_KEY}_${photoId}`);
      return photo;
    } catch (error) {
      console.error('Erro ao buscar foto:', error);
      return null;
    }
  }

  async getPhotoAsDataURL(photoId: string): Promise<string | null> {
    const photo = await this.getPhoto(photoId);
    if (!photo) return null;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(photo.blob);
    });
  }

  async deletePhoto(photoId: string): Promise<boolean> {
    try {
      await localforage.removeItem(`${this.PHOTOS_KEY}_${photoId}`);
      
      const metadata = await this.getAllPhotosMetadata();
      const updatedMetadata = metadata.filter(photo => photo.id !== photoId);
      await localforage.setItem(this.METADATA_KEY, updatedMetadata);
      
      return true;
    } catch (error) {
      console.error('Erro ao deletar foto:', error);
      return false;
    }
  }

  async getAllPhotosMetadata(): Promise<PhotoMetadata[]> {
    try {
      const metadata = await localforage.getItem<PhotoMetadata[]>(this.METADATA_KEY);
      return metadata || [];
    } catch (error) {
      console.error('Erro ao buscar metadados das fotos:', error);
      return [];
    }
  }

  async clearAllPhotos(): Promise<boolean> {
    try {
      const metadata = await this.getAllPhotosMetadata();
      
      for (const photo of metadata) {
        await localforage.removeItem(`${this.PHOTOS_KEY}_${photo.id}`);
      }
      
      await localforage.removeItem(this.METADATA_KEY);
      return true;
    } catch (error) {
      console.error('Erro ao limpar todas as fotos:', error);
      return false;
    }
  }

  async getStorageSize(): Promise<number> {
    const metadata = await this.getAllPhotosMetadata();
    return metadata.reduce((total, photo) => total + photo.size, 0);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export const localPhotosService = new LocalPhotosService();