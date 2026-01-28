/**
 * Type definitions for text-box components
 */

export interface AttachmentFile {
  id: string;
  file: File;
  preview?: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'other';
  name: string;
  size: number;
  uploadProgress?: number;
  cloudinaryUrl?: string;
  uploadStatus?: 'idle' | 'uploading' | 'success' | 'error';
  uploadError?: string;
}

export interface AttachmentSelectorProps {
  onSelect: (files: File[]) => void;
  disabled?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxFileSize?: number; // in MB
}

export interface AttachmentOption {
  id: string;
  icon: React.ElementType;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  accept: string;
  capture?: boolean;
  multiple?: boolean;
  ref: React.RefObject<HTMLInputElement | null>;
}

export interface FileValidationResult {
  valid: File[];
  invalid: Array<{
    file: File;
    reason: string;
  }>;
}

export interface DragDropState {
  isDragging: boolean;
  isOver: boolean;
}

/**
 * Utility type for file type detection
 */
export type FileType = 'image' | 'video' | 'audio' | 'document' | 'other';

/**
 * File MIME type categories
 */
export const FILE_TYPE_CATEGORIES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  video: ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/aac', 'audio/flac'],
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
  ],
} as const;

/**
 * File extension to MIME type mapping
 */
export const FILE_EXTENSIONS = {
  // Images
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  
  // Videos
  mp4: 'video/mp4',
  mov: 'video/quicktime',
  avi: 'video/x-msvideo',
  webm: 'video/webm',
  
  // Audio
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  m4a: 'audio/mp4',
  aac: 'audio/aac',
  flac: 'audio/flac',
  
  // Documents
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  txt: 'text/plain',
  
  // Archives
  zip: 'application/zip',
  rar: 'application/x-rar-compressed',
  '7z': 'application/x-7z-compressed',
} as const;

/**
 * Maximum file sizes by type (in MB)
 */
export const MAX_FILE_SIZES = {
  image: 10,
  video: 100,
  audio: 50,
  document: 25,
  other: 100,
} as const;

/**
 * Accepted file types for input elements
 */
export const ACCEPT_TYPES = {
  image: 'image/*',
  video: 'video/*',
  audio: 'audio/*,.mp3,.wav,.m4a,.ogg,.aac,.flac',
  document: '.pdf,.doc,.docx,.txt,.xlsx,.xls,.ppt,.pptx',
  archive: '.zip,.rar,.7z',
  all: '*/*',
} as const;
