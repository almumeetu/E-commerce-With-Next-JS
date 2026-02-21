import React from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  onClick?: () => void;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  priority = false,
  onClick,
  width,
  height,
  fill = false,
  sizes
}) => {
  // Use fill layout if no dimensions provided
  if (fill || (!width && !height)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        priority={priority}
        onClick={onClick}
        sizes={sizes || '100vw'}
        style={{ objectFit: 'cover' }}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 500}
      height={height || 500}
      className={className}
      priority={priority}
      onClick={onClick}
      sizes={sizes}
    />
  );
};
