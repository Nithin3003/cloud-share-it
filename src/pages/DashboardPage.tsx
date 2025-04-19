
import { NavBar } from "@/components/NavBar";
import { FileUpload } from "@/components/FileUpload";
import { FileList } from "@/components/FileList";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadCloud, FileText } from "lucide-react";

const DashboardPage = () => {
  const { user, loading } = useAuth();

  // If auth is still loading, render nothing yet to avoid flashing content
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 flex justify-center items-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-primary/20 mb-4"></div>
            <div className="h-4 w-48 bg-muted rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Get user display name from email if name not available
  const displayName = user.email ? user.email.split('@')[0] : 'User';

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">Welcome, {displayName}</h1>
        
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <UploadCloud className="h-4 w-4" />
              Upload Files
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Your Files
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="animate-fade-in">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Upload a File</h2>
              <p className="text-muted-foreground">
                Upload your files and share them with anyone through a unique link.
              </p>
              <FileUpload />
            </div>
          </TabsContent>
          
          <TabsContent value="files" className="animate-fade-in">
            <FileList />
          </TabsContent>
        </Tabs>
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

export default DashboardPage;
