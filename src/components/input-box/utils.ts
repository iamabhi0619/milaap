/**
 * InputBox Utility Functions
 * 
 * Helper functions for file handling, validation, and formatting
 */

import { Attachment } from './types';

// ============================================================================
// File Type Detection
// ============================================================================

export const getFileType = (file: File): Attachment['type'] => {
  const type = file.type.split('/')[0];
  
  if (type === 'image') return 'image';
  if (type === 'video') return 'video';
  if (type === 'audio') return 'audio';
  return 'document';
};

// ============================================================================
// File Size Formatting
// ============================================================================

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

// ============================================================================
// File Validation
// ============================================================================

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
export const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024; // 20MB

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
];

export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
];

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'application/zip',
];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export const validateFile = (file: File): FileValidationResult => {
  const fileType = getFileType(file);

  // Check file type
  if (fileType === 'image' && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid image type. Allowed: JPEG, PNG, GIF, WebP',
    };
  }

  if (fileType === 'video' && !ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid video type. Allowed: MP4, WebM, OGG',
    };
  }

  if (fileType === 'document') {
    const isAllowed = ALLOWED_DOCUMENT_TYPES.includes(file.type);
    if (!isAllowed) {
      return {
        valid: false,
        error: 'Invalid document type. Allowed: PDF, Word, Excel, Text, ZIP',
      };
    }
  }

  // Check file size
  if (fileType === 'image' && file.size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      error: `Image too large. Maximum size: ${formatFileSize(MAX_IMAGE_SIZE)}`,
    };
  }

  if (fileType === 'video' && file.size > MAX_VIDEO_SIZE) {
    return {
      valid: false,
      error: `Video too large. Maximum size: ${formatFileSize(MAX_VIDEO_SIZE)}`,
    };
  }

  if (fileType === 'document' && file.size > MAX_DOCUMENT_SIZE) {
    return {
      valid: false,
      error: `Document too large. Maximum size: ${formatFileSize(MAX_DOCUMENT_SIZE)}`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${formatFileSize(MAX_FILE_SIZE)}`,
    };
  }

  return { valid: true };
};

// ============================================================================
// Time Formatting
// ============================================================================

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const formatRecordingDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// ============================================================================
// Text Formatting & Validation
// ============================================================================

export const sanitizeText = (text: string): string => {
  return text.trim().replace(/\s+/g, ' ');
};

export const hasOnlyWhitespace = (text: string): boolean => {
  return text.trim().length === 0;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

export const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

// ============================================================================
// File Upload Utilities
// ============================================================================

export const createFilePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const compressImage = async (
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

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
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// ============================================================================
// URL Validation
// ============================================================================

export const isValidUrl = (text: string): boolean => {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
};

export const extractUrls = (text: string): string[] => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
};

// ============================================================================
// Mention Detection
// ============================================================================

export const extractMentions = (text: string): string[] => {
  const mentionRegex = /@(\w+)/g;
  const mentions: string[] = [];
  let match;

  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }

  return mentions;
};

export const hasMentions = (text: string): boolean => {
  return /@\w+/.test(text);
};

// ============================================================================
// Hashtag Detection
// ============================================================================

export const extractHashtags = (text: string): string[] => {
  const hashtagRegex = /#(\w+)/g;
  const hashtags: string[] = [];
  let match;

  while ((match = hashtagRegex.exec(text)) !== null) {
    hashtags.push(match[1]);
  }

  return hashtags;
};

// ============================================================================
// Clipboard Utilities
// ============================================================================

export const pasteImage = async (): Promise<File | null> => {
  try {
    const clipboardItems = await navigator.clipboard.read();
    
    for (const item of clipboardItems) {
      for (const type of item.types) {
        if (type.startsWith('image/')) {
          const blob = await item.getType(type);
          return new File([blob], `pasted-image-${Date.now()}.png`, {
            type: blob.type,
          });
        }
      }
    }
  } catch (error) {
    console.error('Failed to paste image:', error);
  }
  
  return null;
};

// ============================================================================
// Emoji Utilities
// ============================================================================

export const insertEmojiAtCursor = (
  text: string,
  emoji: string,
  cursorPosition: number
): { newText: string; newCursorPosition: number } => {
  const before = text.substring(0, cursorPosition);
  const after = text.substring(cursorPosition);
  
  return {
    newText: before + emoji + after,
    newCursorPosition: cursorPosition + emoji.length,
  };
};

// ============================================================================
// Local Storage Utilities
// ============================================================================

export const saveDraft = (chatId: string, text: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(`chat-draft-${chatId}`, text);
  } catch (error) {
    console.error('Failed to save draft:', error);
  }
};

export const loadDraft = (chatId: string): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(`chat-draft-${chatId}`);
  } catch (error) {
    console.error('Failed to load draft:', error);
    return null;
  }
};

export const clearDraft = (chatId: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(`chat-draft-${chatId}`);
  } catch (error) {
    console.error('Failed to clear draft:', error);
  }
};

// ============================================================================
// Browser Support Detection
// ============================================================================

export const supportsVoiceRecording = (): boolean => {
  return !!(
    navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function' &&
    typeof window.MediaRecorder !== 'undefined'
  );
};

export const supportsFileAPI = (): boolean => {
  return !!(window.File && window.FileReader && window.FileList && window.Blob);
};

export const supportsClipboardAPI = (): boolean => {
  return !!(navigator.clipboard && navigator.clipboard.read);
};

// ============================================================================
// Error Messages
// ============================================================================

export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File is too large',
  INVALID_FILE_TYPE: 'Invalid file type',
  UPLOAD_FAILED: 'Failed to upload file',
  VOICE_RECORDING_FAILED: 'Failed to record voice message',
  MICROPHONE_ACCESS_DENIED: 'Microphone access denied',
  NO_MESSAGE_CONTENT: 'Please enter a message',
  NETWORK_ERROR: 'Network error. Please try again',
  SEND_FAILED: 'Failed to send message',
} as const;
