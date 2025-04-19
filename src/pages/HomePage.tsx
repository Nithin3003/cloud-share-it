
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/NavBar";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UploadCloud, Download, Share2 } from "lucide-react";

const HomePage = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-background to-muted">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1 space-y-6">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                  Share files <span className="text-primary">securely</span> and <span className="text-primary">effortlessly</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Upload your files and share them with anyone instantly. No file size limits, no registration required to download.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  {user ? (
                    <Button asChild size="lg" className="gap-2">
                      <Link to="/dashboard">
                        <UploadCloud className="w-5 h-5" />
                        Go to Dashboard
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild size="lg" className="gap-2">
                      <Link to="/register">
                        <UploadCloud className="w-5 h-5" />
                        Get Started
                      </Link>
                    </Button>
                  )}
                  <Button asChild variant="outline" size="lg">
                    <Link to={user ? "/dashboard" : "/login"}>
                      {user ? "View Your Files" : "Login"}
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="w-full max-w-md bg-card p-8 rounded-xl shadow-lg border">
                  <div className="border-2 border-dashed border-border rounded-lg p-10 flex flex-col items-center justify-center text-muted-foreground">
                    <UploadCloud className="h-16 w-16 mb-4 text-primary" />
                    <p className="text-center">
                      Drag & drop files or click to upload
                    </p>
                    <Button className="mt-4" disabled={!user}>
                      {user ? "Upload Files" : "Sign in to Upload"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-xl border flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <UploadCloud className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload</h3>
                <p className="text-muted-foreground">
                  Sign up and upload your files securely to our platform with just a few clicks.
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl border flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Share2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Share</h3>
                <p className="text-muted-foreground">
                  Share your files with anyone using a unique, secure link that we generate.
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl border flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Download className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Download</h3>
                <p className="text-muted-foreground">
                  Recipients can download your files instantly without creating an account.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-6 bg-muted/30">
        <div className="container flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <UploadCloud className="h-5 w-5 text-primary" />
            <span className="font-semibold">CloudShareIt</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2 sm:mt-0">
            © {new Date().getFullYear()} CloudShareIt. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
