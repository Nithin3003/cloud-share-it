
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/NavBar";
import { useFile } from "@/contexts/FileContext";
import { File as FileType } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Download, FileIcon, FileText, FileImage, FileAudio, FileVideo, FileArchive, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const FilePage = () => {
  const { id } = useParams<{ id: string }>();
  const { getPublicFile, isLoading } = useFile();
  const [file, setFile] = useState<FileType | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFile = async () => {
      try {
        if (id) {
          const fileData = await getPublicFile(id);
          if (fileData) {
            setFile(fileData);
          } else {
            setError("File not found or has been removed.");
          }
        }
      } catch (err) {
        console.error("Error fetching file:", err);
        setError("An error occurred while trying to fetch the file.");
      }
    };

    fetchFile();
  }, [id, getPublicFile]);

  const handleDownload = () => {
    if (!file) return;
    
    try {
      // Create an anchor element and trigger download
      const link = document.createElement("a");
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Download started");
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Failed to download file");
    }
  };

  const getFileIcon = () => {
    if (!file) return <FileIcon className="h-16 w-16" />;
    
    const { type } = file;
    
    if (type.startsWith("image/")) return <FileImage className="h-16 w-16" />;
    if (type.startsWith("audio/")) return <FileAudio className="h-16 w-16" />;
    if (type.startsWith("video/")) return <FileVideo className="h-16 w-16" />;
    if (type === "application/pdf") return <FileText className="h-16 w-16" />; // Changed from FilePdf to FileText
    if (type.includes("zip") || type.includes("archive") || type.includes("compressed")) 
      return <FileArchive className="h-16 w-16" />;
    if (type.includes("text") || type.includes("document")) 
      return <FileText className="h-16 w-16" />;
    
    return <FileIcon className="h-16 w-16" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 container py-12 flex justify-center items-center">
        {isLoading ? (
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-primary/20 mb-6"></div>
            <div className="h-4 w-60 bg-muted rounded mb-4"></div>
            <div className="h-10 w-40 bg-muted rounded"></div>
          </div>
        ) : error ? (
          <Card className="w-full max-w-md text-center p-6">
            <CardContent className="pt-6 flex flex-col items-center">
              <AlertCircle className="h-16 w-16 text-destructive mb-4" />
              <h2 className="text-2xl font-semibold mb-2">File Not Found</h2>
              <p className="text-muted-foreground">{error}</p>
            </CardContent>
            <CardFooter className="flex justify-center pt-4">
              <Button asChild variant="outline">
                <a href="/">Return to Home</a>
              </Button>
            </CardFooter>
          </Card>
        ) : file ? (
          <Card className="w-full max-w-lg animate-fade-in">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-6 rounded-full mb-6">
                  {getFileIcon()}
                </div>
                <h2 className="text-2xl font-semibold mb-2">{file.name}</h2>
                <p className="text-muted-foreground mb-4">
                  {formatFileSize(file.size)}
                </p>
                <Button 
                  size="lg" 
                  className="w-full max-w-xs mt-4 gap-2"
                  onClick={handleDownload}
                >
                  <Download className="h-5 w-5" />
                  Download File
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t mt-6 pt-4">
              <p className="text-sm text-muted-foreground">
                File shared via CloudShareIt
              </p>
            </CardFooter>
          </Card>
        ) : null}
      </main>
      
      <footer className="border-t py-6 bg-muted/30">
        <div className="container">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} CloudShareIt. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default FilePage;
