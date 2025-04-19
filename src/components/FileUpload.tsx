
import React, { useCallback, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileIcon, X, Copy, Link } from "lucide-react";
import { useFiles } from "@/contexts/FilesContext";
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function FileUpload() {
  const { uploadFile, isLoading } = useFiles();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; shareUrl: string } | null>(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  const handleCancelFile = () => {
    setSelectedFile(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      const file = await uploadFile(selectedFile);
      setUploadedFile({
        name: file.name,
        shareUrl: file.shareUrl
      });
      setIsShareDialogOpen(true);
      setSelectedFile(null);
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed. Please try again.');
    }
  };

  const copyToClipboard = () => {
    if (!uploadedFile) return;
    navigator.clipboard.writeText(uploadedFile.shareUrl);
    toast.success('Link copied to clipboard');
  };

  // Create a shareable link that points to our file page
  const getFileLinkForSharing = () => {
    if (!uploadedFile) return '';
    
    // Extract the file ID from the share URL
    const parts = uploadedFile.shareUrl.split('/');
    const fileId = parts[parts.length - 1].split('?')[0]; // Remove any query params
    
    // Construct a link to our FilePage with the ID
    const origin = window.location.origin;
    return `${origin}/file/${fileId}`;
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div
            className={`dropzone flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed rounded-lg p-6 ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'}`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="flex flex-col items-center space-y-4 w-full">
                <div className="flex items-center p-3 bg-muted rounded-lg w-full max-w-md">
                  <FileIcon className="h-8 w-8 text-primary mr-3" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="ml-2" 
                    onClick={handleCancelFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={handleUpload} disabled={isLoading} className="w-full max-w-md">
                  {isLoading ? 'Uploading...' : 'Upload File'}
                </Button>
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload a file</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Drag and drop a file here, or click to select a file
                </p>
                <Button asChild variant="outline">
                  <label className="cursor-pointer">
                    Browse Files
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>File Uploaded Successfully!</DialogTitle>
            <DialogDescription>
              Share this link with anyone to let them download your file.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-4">
            <p className="text-sm font-medium">File: {uploadedFile?.name}</p>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Link className="h-4 w-4" />
                Share Link:
              </label>
              <div className="flex gap-2">
                <Input value={getFileLinkForSharing()} readOnly />
                <Button onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
