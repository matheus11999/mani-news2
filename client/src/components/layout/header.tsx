import { Link } from "wouter";
import { Newspaper } from "lucide-react";

export default function Header() {

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm border-b border-gray-100 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center h-14">
          <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Newspaper className="text-white h-4 w-4" />
            </div>
            <span className="text-xl font-bold text-primary">Mani News</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
