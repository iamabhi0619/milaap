export interface InputBoxState {
  text: string;
  attachments: Attachment[];
  voiceRecording: VoiceRecording | null;
  replyTo: ReplyMessage | null;
  isRecording: boolean;
  showEmojiPicker: boolean;
  showAttachmentMenu: boolean;
  isFocused: boolean;
}

export interface Attachment {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video' | 'document' | 'audio';
  name: string;
  size: number;
  uploadProgress?: number;
  cloudinaryUrl?: string;
  uploadStatus?: 'idle' | 'uploading' | 'success' | 'error';
  uploadError?: string;
}

export interface VoiceRecording {
  blob: Blob | null;
  duration: number;
  url: string;
  isPlaying: boolean;
}

export interface ReplyMessage {
  id: string;
  text?: string;
  senderName: string;
  senderAvatar?: string;
  imageUrl?: string;
}

export interface InputBoxActions {
  setText: (text: string) => void;
  addAttachment: (file: File) => void;
  removeAttachment: (id: string) => void;
  startVoiceRecording: () => void;
  stopVoiceRecording: () => void;
  cancelVoiceRecording: () => void;
  setReplyTo: (message: ReplyMessage | null) => void;
  toggleEmojiPicker: () => void;
  toggleAttachmentMenu: () => void;
  setFocus: (focused: boolean) => void;
  clearInput: () => void;
  sendMessage: () => void;
}

export interface InputBoxProps {
  chatId: string | null;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  onSend?: (data: SendMessageData) => void;
}

export interface SendMessageData {
  text?: string;
  attachments?: Attachment[];
  voiceUrl?: string;
  replyTo?: string;
}
