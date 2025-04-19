
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { FileX } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <FileX className="h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8 text-center">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Button asChild size="lg">
          <Link to="/">Return Home</Link>
        </Button>
      </main>
    </div>
  );
};

export default NotFound;
