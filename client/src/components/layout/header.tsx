import { Link, useLocation } from "wouter";
import { Newspaper, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [location] = useLocation();
  const isArticlePage = location.startsWith("/article/");

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm border-b border-gray-100 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {isArticlePage && (
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="text-gray-600 hover:text-primary p-2"
              data-testid="button-back-header"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          
          <div className={`flex items-center space-x-2 ${isArticlePage ? '' : 'mx-auto'}`}>
            <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-lg flex items-center justify-center">
                <Newspaper className="text-white h-4 w-4 md:h-5 md:w-5" />
              </div>
              <span className="text-xl md:text-2xl font-bold text-primary">Mani News</span>
            </Link>
          </div>
          
          {isArticlePage && <div className="w-12"></div>}
        </div>
      </div>
    </header>
  );
}
