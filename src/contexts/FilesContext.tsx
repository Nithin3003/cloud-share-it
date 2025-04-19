
import React, { createContext, useContext } from 'react';
import { FileWithURL, mapSharedFileToFile } from '@/types/supabase';
import { File } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface FilesContextType {
  files: File[];
  isLoading: boolean;
  uploadFile: (file: globalThis.File) => Promise<File>;
  deleteFile: (id: string) => Promise<void>;
  getFileById: (id: string) => File | undefined;
}

const FilesContext = createContext<FilesContextType | undefined>(undefined);

export const FilesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch files query
  const { data: filesWithURL = [], isLoading } = useQuery({
    queryKey: ['files', user?.id],
    queryFn: async (): Promise<FileWithURL[]> => {
      if (!user) throw new Error('No user');

      const { data: files, error } = await supabase
        .from('shared_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get signed URLs for each file
      const filesWithUrls = await Promise.all(
        files.map(async (file) => {
          const { data } = await supabase
            .storage
            .from('shared_files')
            .createSignedUrl(file.storage_path, 60 * 60); // 1 hour expiry

          return {
            ...file,
            url: data?.signedUrl || '',
          };
        })
      );

      return filesWithUrls;
    },
    enabled: !!user,
  });
  
  // Map to the File type expected by components
  const files = filesWithURL.map(mapSharedFileToFile);

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: globalThis.File): Promise<File> => {
      if (!user) throw new Error('Must be logged in to upload');

      // Upload file to storage
      const filename = `${Date.now()}_${file.name}`;
      const path = `${user.id}/${filename}`;

      const { error: uploadError } = await supabase
        .storage
        .from('shared_files')
        .upload(path, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl: shareUrl } } = supabase
        .storage
        .from('shared_files')
        .getPublicUrl(path);

      // Create database entry
      const { data: fileData, error: dbError } = await supabase
        .from('shared_files')
        .insert({
          filename: file.name,
          storage_path: path,
          share_url: shareUrl,
          size: file.size,
          type: file.type,
          user_id: user.id,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Get signed URL for immediate use
      const { data: signedUrlData } = await supabase
        .storage
        .from('shared_files')
        .createSignedUrl(path, 60 * 60);

      const fileWithURL: FileWithURL = {
        ...fileData,
        url: signedUrlData?.signedUrl || '',
      };

      // Convert to the File type
      return mapSharedFileToFile(fileWithURL);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast.success('File uploaded successfully');
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const fileToDelete = files.find(f => f.id === id);
      if (!fileToDelete) throw new Error('File not found');

      // Delete from storage
      const { error: storageError } = await supabase
        .storage
        .from('shared_files')
        .remove([fileToDelete.shareUrl.split('/').pop() || '']);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('shared_files')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast.success('File deleted');
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast.error('Failed to delete file');
    },
  });

  const getFileById = (id: string) => files.find(file => file.id === id);

  return (
    <FilesContext.Provider value={{
      files,
      isLoading,
      uploadFile: uploadMutation.mutateAsync,
      deleteFile: deleteMutation.mutateAsync,
      getFileById
    }}>
      {children}
    </FilesContext.Provider>
  );
};

export const useFiles = () => {
  const context = useContext(FilesContext);
  if (context === undefined) {
    throw new Error('useFiles must be used within a FilesProvider');
  }
  return context;
};
