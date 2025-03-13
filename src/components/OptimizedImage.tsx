
import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'auto' | 'sync';
  fetchpriority?: 'high' | 'low' | 'auto';
}

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  style = {},
  loading = 'lazy',
  decoding = 'async',
  fetchpriority = 'auto',
}: OptimizedImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Reset state when src changes
    setLoaded(false);
    setError(false);
  }, [src]);

  return (
    <>
      {!loaded && !error && (
        <div 
          className={`bg-gray-200 animate-pulse ${className}`} 
          style={{ 
            ...style, 
            width: width ? `${width}px` : style.width || '100%',
            height: height ? `${height}px` : style.height || '100%',
          }}
          aria-hidden="true"
        />
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${!loaded ? 'hidden' : ''}`}
        style={style}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchpriority}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
      {error && (
        <div 
          className={`bg-gray-100 flex items-center justify-center ${className}`}
          style={{
            ...style,
            width: width ? `${width}px` : style.width || '100%',
            height: height ? `${height}px` : style.height || '100%',
          }}
        >
          <span className="text-gray-400">Image not available</span>
        </div>
      )}
    </>
  );
};

export default OptimizedImage;
