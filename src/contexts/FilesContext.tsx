
import React, { createContext, useContext, useState, useEffect } from 'react';
import { File } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface FilesContextType {
  files: File[];
  isLoading: boolean;
  uploadFile: (file: globalThis.File) => Promise<File>;
  getFileById: (id: string) => File | undefined;
  deleteFile: (id: string) => void;
}

const FilesContext = createContext<FilesContextType | undefined>(undefined);

export const FilesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load files from localStorage when user changes
  useEffect(() => {
    if (user) {
      const storedFiles = localStorage.getItem(`files_${user.id}`);
      if (storedFiles) {
        setFiles(JSON.parse(storedFiles).map((file: any) => ({
          ...file,
          uploadedAt: new Date(file.uploadedAt)
        })));
      }
    } else {
      setFiles([]);
    }
  }, [user]);

  // Save files to localStorage whenever they change
  useEffect(() => {
    if (user && files.length > 0) {
      localStorage.setItem(`files_${user.id}`, JSON.stringify(files));
    }
  }, [files, user]);

  const uploadFile = async (file: globalThis.File): Promise<File> => {
    if (!user) {
      throw new Error('User must be logged in to upload files');
    }

    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Create a fake file URL (in a real app, we would upload to a server)
      const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const fakeUrl = URL.createObjectURL(file);
      
      // In a real app, this would be a URL to your API
      const shareUrl = `${window.location.origin}/file/${fileId}`;
      
      const newFile: File = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        url: fakeUrl,
        shareUrl,
        uploadedAt: new Date(),
        userId: user.id,
      };
      
      setFiles(prevFiles => [newFile, ...prevFiles]);
      toast.success('File uploaded successfully');
      return newFile;
    } catch (error) {
      toast.error('Failed to upload file');
      console.error('Upload error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getFileById = (id: string) => {
    return files.find(file => file.id === id);
  };

  const deleteFile = (id: string) => {
    setFiles(prevFiles => prevFiles.filter(file => file.id !== id));
    toast.success('File deleted');
  };

  return (
    <FilesContext.Provider value={{ files, isLoading, uploadFile, getFileById, deleteFile }}>
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
