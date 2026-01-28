import { supabase } from "./supabase";

export interface SupabaseUploadResult {
  url: string;
  path: string;
  bucket: string;
  type?: string;
  id?: string;
}

export interface FileUploadOptions {
  bucket?: string;
  folder?: string;
  onProgress?: (progress: number) => void;
}

/**
 * Upload a file to Supabase Storage.
 * 
 * @param file - The file to upload
 * @param options - Upload options (bucket, folder, progress callback)
 * @returns Promise resolving to the upload result
 */
export const fileUpload = async (
  file: File,
  options: FileUploadOptions = {}
): Promise<SupabaseUploadResult> => {
  const {
    bucket = 'attachment',
    folder = '',
    onProgress
  } = options;

  const ext = file.name.split('.').pop() || 'bin';
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = folder ? `${folder}/${uniqueName}` : uniqueName;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: publicData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  if (onProgress) {
    onProgress(100);
  }

  return {
    url: publicData.publicUrl,
    path: filePath,
    bucket,
    type: file.type,
    id: data?.id
  };
};
