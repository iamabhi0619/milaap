import { useState, useCallback } from 'react';
import { InputBoxState, Attachment, VoiceRecording, ReplyMessage } from '../types';

export const useInputBoxState = () => {
  const [state, setState] = useState<InputBoxState>({
    text: '',
    attachments: [],
    voiceRecording: null,
    replyTo: null,
    isRecording: false,
    showEmojiPicker: false,
    showAttachmentMenu: false,
    isFocused: false,
  });

  const setText = useCallback((text: string) => {
    setState(prev => ({ ...prev, text }));
  }, []);

  const addAttachment = useCallback((file: File) => {
    const preview = URL.createObjectURL(file);
    const type = getFileType(file);
    
    const attachment: Attachment = {
      id: Math.random().toString(36).substring(7),
      file,
      preview,
      type,
      name: file.name,
      size: file.size,
      uploadProgress: 0,
      uploadStatus: 'idle',
    };

    setState(prev => ({
      ...prev,
      attachments: [...prev.attachments, attachment],
    }));

    return attachment.id; // Return ID for tracking
  }, []);

  const updateAttachmentProgress = useCallback((id: string, progress: number) => {
    setState(prev => ({
      ...prev,
      attachments: prev.attachments.map(a =>
        a.id === id ? { ...a, uploadProgress: progress, uploadStatus: 'uploading' as const } : a
      ),
    }));
  }, []);

  const setAttachmentUploaded = useCallback((id: string, cloudinaryUrl: string) => {
    setState(prev => ({
      ...prev,
      attachments: prev.attachments.map(a =>
        a.id === id
          ? { ...a, cloudinaryUrl, uploadStatus: 'success' as const, uploadProgress: 100 }
          : a
      ),
    }));
  }, []);

  const setAttachmentError = useCallback((id: string, error: string) => {
    setState(prev => ({
      ...prev,
      attachments: prev.attachments.map(a =>
        a.id === id ? { ...a, uploadStatus: 'error' as const, uploadError: error } : a
      ),
    }));
  }, []);

  const removeAttachment = useCallback((id: string) => {
    setState(prev => {
      const attachment = prev.attachments.find(a => a.id === id);
      if (attachment) {
        URL.revokeObjectURL(attachment.preview);
      }
      return {
        ...prev,
        attachments: prev.attachments.filter(a => a.id !== id),
      };
    });
  }, []);

  const setReplyTo = useCallback((message: ReplyMessage | null) => {
    setState(prev => ({ ...prev, replyTo: message }));
  }, []);

  const toggleEmojiPicker = useCallback(() => {
    setState(prev => ({
      ...prev,
      showEmojiPicker: !prev.showEmojiPicker,
      showAttachmentMenu: false,
    }));
  }, []);

  const toggleAttachmentMenu = useCallback(() => {
    setState(prev => ({
      ...prev,
      showAttachmentMenu: !prev.showAttachmentMenu,
      showEmojiPicker: false,
    }));
  }, []);

  const setFocus = useCallback((focused: boolean) => {
    setState(prev => ({ ...prev, isFocused: focused }));
  }, []);

  const setIsRecording = useCallback((isRecording: boolean) => {
    setState(prev => ({ ...prev, isRecording }));
  }, []);

  const setVoiceRecording = useCallback((recording: VoiceRecording | null) => {
    setState(prev => ({ ...prev, voiceRecording: recording }));
  }, []);

  const clearInput = useCallback(() => {
    // Clean up attachment previews
    state.attachments.forEach(attachment => {
      URL.revokeObjectURL(attachment.preview);
    });

    setState({
      text: '',
      attachments: [],
      voiceRecording: null,
      replyTo: null,
      isRecording: false,
      showEmojiPicker: false,
      showAttachmentMenu: false,
      isFocused: false,
    });
  }, [state.attachments]);

  return {
    state,
    actions: {
      setText,
      addAttachment,
      removeAttachment,
      updateAttachmentProgress,
      setAttachmentUploaded,
      setAttachmentError,
      setReplyTo,
      toggleEmojiPicker,
      toggleAttachmentMenu,
      setFocus,
      setIsRecording,
      setVoiceRecording,
      clearInput,
    },
  };
};

function getFileType(file: File): Attachment['type'] {
  const type = file.type.split('/')[0];
  
  if (type === 'image') return 'image';
  if (type === 'video') return 'video';
  if (type === 'audio') return 'audio';
  return 'document';
}
