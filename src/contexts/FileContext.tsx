
import React, { createContext, useContext, useState } from 'react';
import { File } from '@/types';
import { toast } from 'sonner';

interface FileContextType {
  getPublicFile: (id: string) => Promise<File | null>;
  isLoading: boolean;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const getPublicFile = async (id: string): Promise<File | null> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Check all user files in localStorage
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith('files_')) {
          const userFiles: File[] = JSON.parse(localStorage.getItem(key) || '[]');
          const file = userFiles.find(f => f.id === id);
          if (file) {
            return {
              ...file,
              uploadedAt: new Date(file.uploadedAt)
            };
          }
        }
      }
      
      return null;
    } catch (error) {
      toast.error('Failed to get file');
      console.error('File retrieval error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FileContext.Provider value={{ getPublicFile, isLoading }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFile = () => {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error('useFile must be used within a FileProvider');
  }
  return context;
};
