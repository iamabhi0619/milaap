/**
 * Utility functions for file handling in text-box components
 */

import { FileType, FILE_TYPE_CATEGORIES, FILE_EXTENSIONS, FileValidationResult } from './types';

/**
 * Detect file type from File object
 */
export function getFileType(file: File): FileType {
  const mimeType = file.type.toLowerCase();
  
  // Check by MIME type
  for (const [type, mimeTypes] of Object.entries(FILE_TYPE_CATEGORIES)) {
    if (mimeTypes.some(mt => mimeType.startsWith(mt.split('/')[0]))) {
      return type as FileType;
    }
  }
  
  // Check by file extension
  const extension = getFileExtension(file.name);
  if (extension) {
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
      return 'image';
    }
    if (['mp4', 'mov', 'avi', 'webm'].includes(extension)) {
      return 'video';
    }
    if (['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'].includes(extension)) {
      return 'audio';
    }
    if (['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension)) {
      return 'document';
    }
  }
  
  return 'other';
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string | null {
  const parts = filename.toLowerCase().split('.');
  return parts.length > 1 ? parts[parts.length - 1] : null;
}

/**
 * Format file size to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/**
 * Convert bytes to megabytes
 */
export function bytesToMB(bytes: number): number {
  return bytes / (1024 * 1024);
}

/**
 * Convert megabytes to bytes
 */
export function mbToBytes(mb: number): number {
  return mb * 1024 * 1024;
}

/**
 * Validate file size
 */
export function isFileSizeValid(file: File, maxSizeMB: number): boolean {
  return bytesToMB(file.size) <= maxSizeMB;
}

/**
 * Validate multiple files
 */
export function validateFiles(
  files: File[],
  options: {
    maxFiles?: number;
    maxFileSize?: number; // in MB
    allowedTypes?: FileType[];
  } = {}
): FileValidationResult {
  const {
    maxFiles = 10,
    maxFileSize = 100,
    allowedTypes,
  } = options;

  const valid: File[] = [];
  const invalid: Array<{ file: File; reason: string }> = [];

  for (const file of files) {
    // Check file count
    if (valid.length >= maxFiles) {
      invalid.push({
        file,
        reason: `Maximum ${maxFiles} files allowed`,
      });
      continue;
    }

    // Check file size
    if (!isFileSizeValid(file, maxFileSize)) {
      invalid.push({
        file,
        reason: `File size exceeds ${maxFileSize}MB limit`,
      });
      continue;
    }

    // Check file type if specified
    if (allowedTypes) {
      const fileType = getFileType(file);
      if (!allowedTypes.includes(fileType)) {
        invalid.push({
          file,
          reason: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`,
        });
        continue;
      }
    }

    valid.push(file);
  }

  return { valid, invalid };
}

/**
 * Create object URL for file preview
 */
export function createFilePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revoke object URL
 */
export function revokeFilePreview(url: string): void {
  URL.revokeObjectURL(url);
}

/**
 * Check if file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/') || 
    ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(
      getFileExtension(file.name) || ''
    );
}

/**
 * Check if file is a video
 */
export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/') ||
    ['mp4', 'mov', 'avi', 'webm'].includes(
      getFileExtension(file.name) || ''
    );
}

/**
 * Check if file is audio
 */
export function isAudioFile(file: File): boolean {
  return file.type.startsWith('audio/') ||
    ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'].includes(
      getFileExtension(file.name) || ''
    );
}

/**
 * Check if file is a document
 */
export function isDocumentFile(file: File): boolean {
  const ext = getFileExtension(file.name);
  return ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext || '');
}

/**
 * Read file as data URL
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Read file as text
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

/**
 * Read file as array buffer
 */
export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Compress image file (basic compression using canvas)
 */
export async function compressImage(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  } = {}
): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
  } = options;

  if (!isImageFile(file)) {
    throw new Error('File is not an image');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          file.type,
          quality
        );
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
}

/**
 * Get video duration
 */
export function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    if (!isVideoFile(file)) {
      reject(new Error('File is not a video'));
      return;
    }

    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    
    video.onerror = () => reject(new Error('Failed to load video'));
    video.src = URL.createObjectURL(file);
  });
}

/**
 * Get image dimensions
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    if (!isImageFile(file)) {
      reject(new Error('File is not an image'));
      return;
    }

    const img = new Image();
    
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve({ width: img.width, height: img.height });
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Generate a unique ID
 */
export function generateFileId(): string {
  return `file_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Truncate filename
 */
export function truncateFilename(filename: string, maxLength: number = 30): string {
  if (filename.length <= maxLength) return filename;
  
  const extension = getFileExtension(filename);
  const nameWithoutExt = filename.substring(0, filename.length - (extension ? extension.length + 1 : 0));
  
  if (extension) {
    const truncatedName = nameWithoutExt.substring(0, maxLength - extension.length - 4);
    return `${truncatedName}...${extension}`;
  }
  
  return `${filename.substring(0, maxLength - 3)}...`;
}
