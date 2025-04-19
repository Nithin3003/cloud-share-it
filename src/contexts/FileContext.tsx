
import React, { createContext, useContext } from 'react';
import { FileWithURL, mapSharedFileToFile } from '@/types/supabase';
import { File } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface FileContextType {
  getPublicFile: (id: string) => Promise<File>;
  isLoading: boolean;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getPublicFile = async (id: string): Promise<File> => {
    const { data: file, error } = await supabase
      .from('shared_files')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!file) throw new Error('File not found');

    // Get a fresh signed URL
    const { data } = await supabase
      .storage
      .from('shared_files')
      .createSignedUrl(file.storage_path, 60 * 60);

    const fileWithUrl: FileWithURL = {
      ...file,
      url: data?.signedUrl || '',
    };

    // Convert to the File type
    return mapSharedFileToFile(fileWithUrl);
  };

  return (
    <FileContext.Provider value={{
      getPublicFile,
      isLoading: false,
    }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFile = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFile must be used within a FileProvider');
  }
  return context;
};
