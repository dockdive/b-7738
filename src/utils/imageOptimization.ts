
/**
 * Utility for optimizing images
 */

type ImageDimensions = {
  width: number;
  height: number;
};

type ImageFormat = 'webp' | 'jpeg' | 'png' | 'avif';

interface OptimizeImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: ImageFormat;
}

/**
 * Get image dimensions from a File or Blob
 */
export const getImageDimensions = (file: File | Blob): Promise<ImageDimensions> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Optimize an image by resizing and compressing it
 */
export const optimizeImage = async (
  imageFile: File,
  options: OptimizeImageOptions = {}
): Promise<Blob> => {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.8,
    format = 'webp'
  } = options;

  // Create a canvas element
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // Create an image element and load the file
  const img = new Image();
  const imageUrl = URL.createObjectURL(imageFile);
  
  return new Promise((resolve, reject) => {
    img.onload = () => {
      // Calculate dimensions while maintaining aspect ratio
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }
      
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
      
      // Draw image on canvas
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to the specified format
      let mimeType: string;
      switch (format) {
        case 'webp':
          mimeType = 'image/webp';
          break;
        case 'jpeg':
          mimeType = 'image/jpeg';
          break;
        case 'png':
          mimeType = 'image/png';
          break;
        case 'avif':
          mimeType = 'image/avif';
          break;
        default:
          mimeType = 'image/webp';
      }
      
      // Export as blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert canvas to blob'));
          }
          URL.revokeObjectURL(imageUrl);
        },
        mimeType,
        quality
      );
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
      URL.revokeObjectURL(imageUrl);
    };
    
    img.src = imageUrl;
  });
};

/**
 * Generate a responsive image srcset
 */
export const generateImageSrcSet = (baseUrl: string, widths: number[] = [320, 640, 960, 1280]): string => {
  return widths
    .map(width => {
      // Get the file extension
      const lastDotIndex = baseUrl.lastIndexOf('.');
      const extension = lastDotIndex !== -1 ? baseUrl.slice(lastDotIndex) : '';
      const basePath = lastDotIndex !== -1 ? baseUrl.slice(0, lastDotIndex) : baseUrl;
      
      // Add width parameter to the URL
      return `${basePath}-${width}w${extension} ${width}w`;
    })
    .join(', ');
};
