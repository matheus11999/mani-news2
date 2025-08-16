import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Newspaper, Home, Grid3X3, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { name: "Início", href: "/", icon: Home },
    { name: "Categorias", href: "/categories", icon: Grid3X3 },
    { name: "Buscar", href: "/search", icon: Search },
    { name: "Perfil", href: "/profile", icon: User },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Newspaper className="text-white h-4 w-4" />
            </div>
            <span className="text-xl font-bold text-primary">Mani News</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "transition-colors pb-1",
                  isActive(item.href)
                    ? "text-primary font-medium border-b-2 border-primary"
                    : "text-gray-600 hover:text-primary"
                )}
                data-testid={`nav-${item.name.toLowerCase()}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center py-2 transition-colors",
                    isActive(item.href)
                      ? "text-primary font-medium"
                      : "text-gray-600"
                  )}
                  data-testid={`mobile-nav-${item.name.toLowerCase()}`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
