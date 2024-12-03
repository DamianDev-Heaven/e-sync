import { useState, useEffect } from 'react';

interface ImageLoaderProps {
  imageUrl: string;
  altText?: string;
  className?: string;
}

export default function ImageLoader({ imageUrl, altText = 'Imagen', className }: ImageLoaderProps) {
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    console.log('Cargando imagen desde:', imageUrl);
  }, [imageUrl]);

  return (
    <div className={`relative ${className}`}>
      {loading && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="loader">Cargando...</span>
        </div>
      )}
      <img
        src={imageError ? '/default-image.jpg' : imageUrl}
        alt={altText}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
        onLoad={() => {
          setLoading(false);
          console.log('Imagen cargada correctamente:', imageUrl);
        }}
        onError={() => {
          setLoading(false);
          setImageError(true);
          console.error('Error al cargar la imagen, mostrando imagen de respaldo:', imageUrl);
        }}
      />
    </div>
  );
}
