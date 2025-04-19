
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Copy,
  File as FileIcon,
  FileText,
  FileImage,
  FileAudio,
  FileVideo,
  FileArchive,
  MoreVertical,
  Trash2,
  Link,
  Download
} from "lucide-react";
import { useFiles } from "@/contexts/FilesContext";
import { File } from "@/types";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";

export function FileList() {
  const { files, deleteFile } = useFiles();
  const [searchTerm, setSearchTerm] = useState("");

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <FileImage className="h-5 w-5" />;
    if (type.startsWith("audio/")) return <FileAudio className="h-5 w-5" />;
    if (type.startsWith("video/")) return <FileVideo className="h-5 w-5" />;
    if (type === "application/pdf") return <FileText className="h-5 w-5" />; 
    if (type.includes("zip") || type.includes("archive") || type.includes("compressed")) 
      return <FileArchive className="h-5 w-5" />;
    if (type.includes("text") || type.includes("document")) 
      return <FileText className="h-5 w-5" />;
    return <FileIcon className="h-5 w-5" />;
  };

  const copyLinkToClipboard = (file: File) => {
    // Create a shareable link to the file page
    const origin = window.location.origin;
    const fileLink = `${origin}/file/${file.id}`;
    
    navigator.clipboard.writeText(fileLink);
    toast.success("Link copied to clipboard");
  };
  
  const handleDownload = (file: File, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      // Create an anchor element and set the download attribute to force download
      const link = document.createElement("a");
      link.href = file.url;
      link.download = file.name; // This attribute forces download instead of navigation
      link.target = "_blank"; // Open in new tab
      link.rel = "noopener noreferrer"; // Security best practice
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Download started");
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Failed to download file");
    }
  };

  const openFile = (file: File) => {
    window.open(`/file/${file.id}`, '_blank');
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Your Files</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search files..."
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {files.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/50">
          <FileIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No files yet</h3>
          <p className="text-muted-foreground mb-4">
            Upload your first file to get started
          </p>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center p-8 border rounded-lg bg-muted/50">
          <p className="text-muted-foreground">
            No files found matching "{searchTerm}"
          </p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map((file) => (
                <TableRow key={file.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openFile(file)}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getFileIcon(file.type)}
                      <span className="font-medium">{file.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(file.uploadedAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell>{formatFileSize(file.size)}</TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyLinkToClipboard(file)}
                        title="Copy share link"
                      >
                        <Link className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => copyLinkToClipboard(file)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy share link
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => handleDownload(file, e)}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => deleteFile(file.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
